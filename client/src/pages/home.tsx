import { useState } from "react";
import CandidateForm from "@/components/CandidateForm";
import SuccessModal from "@/components/ui/success-modal";

export default function Home() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleFormSubmit = async (data: any) => {
    // Simplemente mostrar el modal de éxito sin enviar datos
    setShowSuccessModal(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="mb-6">
          <h1 className="title mb-2">Carga manual de candidato</h1>
          <p className="subtitle text-dark-grey">Completa el formulario con los datos del candidato que deseas cargar. Todos los campos marcados con <span className="text-red">*</span> son obligatorios. Una vez completado, haz clic en "Enviar Candidato" para mandar la información.</p>
        </div>

        <CandidateForm onSubmit={handleFormSubmit} />
      </main>

      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />
    </div>
  );
}