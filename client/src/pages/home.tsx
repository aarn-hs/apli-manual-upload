import { useState } from "react";
import CandidateForm from "@/components/CandidateForm";
import SuccessModal from "@/components/ui/success-modal";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
    return {
      "Fuente": "agencia_cygnus", // Valor fijo como en tu ejemplo
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
      "Tareas Experiencia Previa": formData.previousTasks || "",
      "Experiencia en retail": formData.retailExperience || "",
      "Motivación al elegir trabajo": formData.motivation || "",
      "CURP": formData.curp || "",
      "Discapacidad": formData.hasDisability || ""
    };
  };

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Transformar los datos al formato del webhook
      const webhookData = transformFormDataToWebhook(data);
      
      // TODO: Aquí necesitamos la URL del webhook
      const webhookUrl = process.env.VITE_WEBHOOK_URL || 'YOUR_WEBHOOK_URL_HERE';
      
      if (!webhookUrl || webhookUrl === 'YOUR_WEBHOOK_URL_HERE') {
        toast({
          title: "Error de configuración",
          description: "La URL del webhook no está configurada. Por favor contacta al administrador.",
          variant: "destructive",
        });
        return;
      }

      // Enviar datos al webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      // Mostrar modal de éxito
      setShowSuccessModal(true);
      
      toast({
        title: "¡Candidato enviado exitosamente!",
        description: "La información del candidato ha sido procesada correctamente.",
      });

    } catch (error) {
      console.error('Error al enviar datos al webhook:', error);
      toast({
        title: "Error al enviar candidato",
        description: "Hubo un problema al procesar la información. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="container mx-auto px-4 py-6 flex-grow">
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
    </div>
  );
}