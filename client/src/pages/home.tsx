import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CandidateForm from "@/components/CandidateForm";
import SuccessModal from "@/components/ui/success-modal";

export default function Home() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const handleFormSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        setShowSuccessModal(true);
      } else {
        throw new Error('Error al enviar el formulario');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-8">
          <h1 className="title mb-2">Registro de Candidato</h1>
          <p className="subtitle text-dark-grey">Complete el formulario con la información del candidato</p>
        </div>
        
        <CandidateForm onSubmit={handleFormSubmit} />
      </main>
      
      <Footer />
      
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />
    </div>
  );
}
