import { useState, useEffect } from "react";
import CandidateForm from "@/components/CandidateForm";
import SuccessModal from "@/components/ui/success-modal";
import WebhookResponseModal from "@/components/ui/webhook-response-modal";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState<{
    isSuccess: boolean;
    message: string;
    applicationId?: string;
  } | null>(null);
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
  }, [showSuccessModal]);

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

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Transformar los datos al formato del webhook
      const webhookData = transformFormDataToWebhook(data);
      
      // Obtener la URL del webhook de las variables de entorno
      const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;
      
      if (!webhookUrl) {
        toast({
          title: "Error de configuración",
          description: "La URL del webhook no está configurada. Por favor contacta al administrador.",
          variant: "destructive",
        });
        return;
      }

      // Log de los datos que se envían
      console.log('Enviando datos al webhook:', webhookData);
      console.log('URL del webhook:', webhookUrl);

      // Enviar datos al webhook con timeout personalizado
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 90000); // 90 segundos timeout

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
        signal: controller.signal
      }).catch((fetchError) => {
        clearTimeout(timeoutId);
        console.error('Error inmediato al hacer fetch:', fetchError);
        
        if (fetchError.name === 'AbortError') {
          throw new Error('TIMEOUT: El webhook tardó más de 90 segundos en responder.');
        }
        
        // Error inmediato - probablemente bloqueo de red o CORS
        throw new Error('NETWORK_ERROR: No se pudo establecer conexión con el webhook. Esto puede deberse a restricciones de red del entorno de desarrollo.');
      });

      clearTimeout(timeoutId);

      console.log('Respuesta del webhook:', response.status, response.statusText);

      // Obtener los datos de respuesta
      const responseData = await response.json().catch(() => null);
      console.log('Datos de respuesta del webhook:', responseData);

      if (responseData && responseData.status === 'success') {
        // Caso de éxito
        const applicationId = responseData.content?.application_id;
        const message = responseData.message || 'Postulación creada exitosamente';
        
        setWebhookResponse({
          isSuccess: true,
          message,
          applicationId
        });
        setShowWebhookModal(true);
      } else {
        // Caso de error
        const message = responseData?.message || 'Error desconocido';
        const applicationId = responseData?.content?.application_id;
        
        setWebhookResponse({
          isSuccess: false,
          message,
          applicationId
        });
        setShowWebhookModal(true);
      }

    } catch (error) {
      console.error('Error al enviar datos al webhook:', error);
      
      let errorMessage = "Hubo un problema al procesar la información. Por favor intenta nuevamente.";
      let isWebhookError = false;
      
      if (error instanceof Error) {
        if (error.message.startsWith('TIMEOUT:')) {
          errorMessage = error.message.replace('TIMEOUT: ', '');
          isWebhookError = true;
        } else if (error.message.startsWith('NETWORK_ERROR:')) {
          errorMessage = error.message.replace('NETWORK_ERROR: ', '');
          isWebhookError = true;
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = "No se pudo conectar con el webhook. Verifica que el webhook esté activo y configurado correctamente.";
          isWebhookError = true;
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
          errorMessage = "Error de conexión: El webhook no está disponible o no responde. Verifica la configuración del webhook.";
          isWebhookError = true;
        } else {
          errorMessage = error.message;
          isWebhookError = true;
        }
      } else {
        errorMessage = "Error desconocido al conectar con el webhook. Verifica que esté activo y configurado correctamente.";
        isWebhookError = true;
      }
      
      // Mostrar error en el modal de webhook si es un error relacionado con el webhook
      if (isWebhookError) {
        setWebhookResponse({
          isSuccess: false,
          message: errorMessage,
          applicationId: undefined
        });
        setShowWebhookModal(true);
      } else {
        // Para otros errores, usar toast
        toast({
          title: "Error al enviar candidato",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
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

        <CandidateForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
      </main>

      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />
      
      <WebhookResponseModal
        isOpen={showWebhookModal}
        onClose={() => setShowWebhookModal(false)}
        isSuccess={webhookResponse?.isSuccess || false}
        message={webhookResponse?.message || ''}
        applicationId={webhookResponse?.applicationId}
      />
    </div>
  );
}