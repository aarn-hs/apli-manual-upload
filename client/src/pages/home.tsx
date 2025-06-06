import { useState, useEffect } from "react";
import CandidateForm from "@/components/CandidateForm";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationState, setNotificationState] = useState<{
    isVisible: boolean;
    isSuccess: boolean;
    message: string;
    submissionRequestId?: string;
    applicationId?: string;
  } | undefined>();
  const { toast } = useToast();

  // Función para obtener parámetros de URL
  const getUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Por ahora usar datos de prueba, después se utilizarán los parámetros reales
    return {
      name: urlParams.get('name') || 'Aarón',
      lastName: urlParams.get('lastName') || 'Hernández', 
      email: urlParams.get('email') || 'aaron.hernandez@apli.jobs'
    };
  };

  // Función para comunicar con el iframe padre (ajustar altura)
  const notifyParentOfHeightChange = () => {
    if (window.parent !== window) {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage({
        type: 'iframe-height-change',
        height: height
      }, '*');
    }
  };

  // Notificar cambios de altura al iframe padre
  useEffect(() => {
    notifyParentOfHeightChange();
    
    // Observer para detectar cambios en el contenido
    const observer = new ResizeObserver(() => {
      notifyParentOfHeightChange();
    });
    
    observer.observe(document.body);
    
    return () => observer.disconnect();
  }, [notificationState?.isVisible]);

  // Función para generar UUID personalizado
  const generateCustomUUID = (prefix: string): string => {
    // Generar UUID v4 estándar
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    
    // Obtener timestamp actual
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Para submission_request_id: REQ-c5d69fb5-1748308098
    if (prefix === 'REQ') {
      const shortUuid = uuid.split('-')[0]; // Primeros 8 caracteres
      return `REQ-${shortUuid}-${timestamp}`;
    }
    
    // Para candidate_submission_id: CAN-451a3cf4-8e1
    if (prefix === 'CAN') {
      const shortUuid = uuid.split('-')[0]; // Primeros 8 caracteres
      const shortTimestamp = timestamp.toString().slice(-3); // Últimos 3 dígitos del timestamp
      return `CAN-${shortUuid}-${shortTimestamp}`;
    }
    
    return uuid;
  };

  // Función para transformar la fecha de dd/mm/aaaa a aaaa-mm-dd
  const transformDate = (dateStr: string): string => {
    if (!dateStr) return "";
    
    // Si ya está en formato aaaa-mm-dd, devolverla tal como está
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateStr;
    }
    
    // Si está en formato dd/mm/aaaa, transformarla
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    return dateStr;
  };

  // Función para transformar los datos del formulario al formato del webhook
  const transformFormDataToWebhook = (formData: any) => {
    // Generar los UUIDs únicos para esta solicitud
    const submissionRequestId = generateCustomUUID('REQ');
    const candidateSubmissionId = generateCustomUUID('CAN');
    
    // Obtener información del usuario solicitante
    const userParams = getUrlParams();
    
    return {
      "submission_request_id": submissionRequestId,
      "candidate_submission_id": candidateSubmissionId,
      "requesting_user_name": userParams.name,
      "requesting_user_lastname": userParams.lastName,
      "requesting_user_email": userParams.email,
      "Fuente": formData.source || "",
      "Puesto": formData.position || "",
      "Ubicación": formData.location || "",
      "PMX": formData.pmx || "",
      "Nombre(s)": formData.firstName || "",
      "Apellido paterno": formData.firstLastName || "",
      "Apellido materno": formData.secondLastName || "",
      "Fecha de nacimiento": transformDate(formData.birthDate),
      "Correo electrónico": formData.email || "",
      "Número de teléfono": formData.phone || "",
      "Género": formData.gender || "",
      "Nacionalidad": formData.nationality || "",
      "Calle y número de la vivienda": formData.streetAndNumber || "",
      "Número interior": formData.interiorNumber || "",
      "Colonia": formData.neighborhood || "",
      "Municipio": formData.municipality || "",
      "Estado": formData.state || "",
      "Código postal": formData.postalCode || "",
      "Escolaridad": formData.education || "",
      "Estado civil": formData.maritalStatus || "",
      "Compañía Experiencia Previa": formData.previousCompany || "",
      "Puesto Experiencia Previa": formData.previousPosition || "",

      "Fecha de inicio de experiencia previa": transformDate(formData.previousJobStartDate),
      "Fecha de fin de experiencia previa": transformDate(formData.previousJobEndDate),
      "Cantidad de trabajos en los últimos 24 meses": formData.jobsLast24Months || "",
      "Experiencia en retail": formData.retailExperience || "",
      "Motivación al elegir trabajo": formData.motivation || "",
      "CURP": formData.curp || ""
    };
  };

  // Función para verificar el estado del procesamiento (polling)
  const checkProcessingStatus = async (processingId: string): Promise<any> => {
    try {
      const response = await fetch(`/api/check-status/${processingId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error verificando estado:', error);
      return { status: 'error', result: { error: 'Error de conexión al verificar estado' } };
    }
  };

  // Función para hacer polling hasta obtener resultado
  const pollForResult = async (processingId: string, submissionRequestId: string) => {
    const startTime = Date.now();
    const maxWaitTime = 10 * 60 * 1000; // 10 minutos máximo
    const pollInterval = 3000; // 3 segundos

    const poll = async (): Promise<void> => {
      const elapsed = Date.now() - startTime;
      
      if (elapsed > maxWaitTime) {
        setNotificationState({
          isVisible: true,
          isSuccess: false,
          message: "El proceso tardó más de 10 minutos",
          submissionRequestId: submissionRequestId,
          applicationId: undefined
        });
        setIsSubmitting(false);
        return;
      }

      const statusData = await checkProcessingStatus(processingId);
      
      if (statusData.status === 'completed') {
        // Procesamiento completado exitosamente
        const result = statusData.result;
        const applicationId = result?.content?.application_id;
        let message = 'Postulación creada exitosamente';
        
        if (typeof result?.message === 'string') {
          message = result.message;
        }
        
        setNotificationState({
          isVisible: true,
          isSuccess: true,
          message,
          submissionRequestId: submissionRequestId,
          applicationId
        });
        setIsSubmitting(false);
        
      } else if (statusData.status === 'error') {
        // Error en el procesamiento
        const error = statusData.result;
        let message = 'Error durante el procesamiento';
        
        if (typeof error?.message === 'string') {
          message = error.message;
        } else if (typeof error?.error === 'string') {
          message = error.error;
        } else if (typeof error === 'string') {
          message = error;
        }
        
        setNotificationState({
          isVisible: true,
          isSuccess: false,
          message,
          submissionRequestId: submissionRequestId,
          applicationId: undefined
        });
        setIsSubmitting(false);
        
      } else if (statusData.status === 'processing') {
        // Sigue procesando, continuar polling
        setTimeout(poll, pollInterval);
        
      } else {
        // Estado desconocido o no encontrado
        setNotificationState({
          isVisible: true,
          isSuccess: false,
          message: "Proceso no encontrado o expirado",
          submissionRequestId: submissionRequestId,
          applicationId: undefined
        });
        setIsSubmitting(false);
      }
    };

    // Iniciar polling
    setTimeout(poll, pollInterval);
  };

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    let webhookData: any = null;
    
    try {
      // Transformar los datos al formato del webhook
      webhookData = transformFormDataToWebhook(data);
      const submissionRequestId = webhookData.submission_request_id;
      
      console.log('Enviando datos al webhook asíncrono:', webhookData);

      // Enviar datos al webhook asíncrono
      const response = await fetch("/api/webhook", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Respuesta inicial del webhook:', responseData);

      if (responseData.processing_id && responseData.status === 'processing') {
        // Iniciar polling para obtener el resultado
        console.log(`Iniciando polling para ID: ${responseData.processing_id}`);
        pollForResult(responseData.processing_id, submissionRequestId);
        
      } else {
        // Respuesta inesperada
        setNotificationState({
          isVisible: true,
          isSuccess: false,
          message: 'Respuesta inesperada del servidor',
          submissionRequestId: submissionRequestId,
          applicationId: undefined
        });
        setIsSubmitting(false);
      }

    } catch (error) {
      console.error('Error al enviar datos al webhook:', error);
      
      let errorMessage = "No se pudo iniciar el proceso de carga. Por favor intenta nuevamente.";
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
        } else if (error.message.includes('Error del servidor')) {
          errorMessage = "Error del servidor. Por favor intenta nuevamente.";
        }
      }
      
      setNotificationState({
        isVisible: true,
        isSuccess: false,
        message: errorMessage,
        submissionRequestId: webhookData?.submission_request_id || undefined,
        applicationId: undefined
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-white">
      <main className="w-full px-4 py-6 flex-grow">
        <div className="mb-6">
          <h1 className="title mb-2">Carga manual de candidato</h1>
          <p className="subtitle text-dark-grey">Completa el formulario con los datos del candidato que deseas cargar. Todos los campos marcados con <span className="text-red">*</span> son obligatorios. Una vez completado, haz clic en "Enviar Candidato" para mandar la información.</p>
        </div>

        <CandidateForm 
          onSubmit={handleFormSubmit} 
          isSubmitting={isSubmitting}
          notificationState={notificationState}
          onDismissNotification={() => setNotificationState(undefined)}
        />
      </main>
    </div>
  );
}