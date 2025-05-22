import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { candidateSchema } from "@/lib/schemas";
import ProgressSteps from "@/components/ui/progress-steps";
import JobInfo from "@/components/FormSections/JobInfo";
import PersonalDetails from "@/components/FormSections/PersonalDetails";
import AddressInfo from "@/components/FormSections/AddressInfo";
import EmploymentHistory from "@/components/FormSections/EmploymentHistory";
import LegalInfo from "@/components/FormSections/LegalInfo";
import ContractDetails from "@/components/FormSections/ContractDetails";
import EmergencyInfo from "@/components/FormSections/EmergencyInfo";
import Dependents from "@/components/FormSections/Dependents";

interface CandidateFormProps {
  onSubmit: (data: any) => void;
}

export default function CandidateForm({ onSubmit }: CandidateFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  
  const methods = useForm({
    resolver: zodResolver(candidateSchema),
    mode: "onBlur",
    defaultValues: {
      source: "",
      position: "",
      location: "",
      pmx: "",
      firstName: "",
      firstLastName: "",
      secondLastName: "",
      birthDate: "",
      email: "",
      phone: "",
      gender: "",
      nationality: "",
      streetAndNumber: "",
      interiorNumber: "",
      neighborhood: "",
      municipality: "",
      state: "",
      postalCode: "",
      education: "",
      maritalStatus: "",
      previousCompany: "",
      previousPosition: "",
      previousTasks: "",
      retailExperience: "",
      motivation: "",
      curp: "",
      rfc: "",
      nss: "",
      clabe: "",
      fiscalPostalCode: "",
      contractStartDate: "",
      contractEndDate: "",
      hasDisability: "",
      disabilityType: "",
      disabilityDescription: "",
      emergencyContactName: "",
      emergencyContactRelation: "",
      emergencyContactPhone: "",
      dependents: [
        {
          firstName: "",
          lastName: "",
          relation: "",
          birthDate: "",
          isBeneficiary: false,
          isStudent: false,
          livesWithAssociate: false
        }
      ]
    }
  });
  
  const { handleSubmit, formState: { errors, isSubmitting } } = methods;

  const steps = [
    { id: 1, name: "Información del Trabajo", component: <JobInfo /> },
    { id: 2, name: "Datos Personales", component: <PersonalDetails /> },
    { id: 3, name: "Dirección y Educación", component: <AddressInfo /> },
    { id: 4, name: "Experiencia Laboral", component: <EmploymentHistory /> },
    { id: 5, name: "Información Legal", component: <LegalInfo /> },
    { id: 6, name: "Detalles de Contrato", component: <ContractDetails /> },
    { id: 7, name: "Contacto de Emergencia", component: <EmergencyInfo /> },
    { id: 8, name: "Dependientes", component: <Dependents /> }
  ];
  
  const goToNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleFormSubmit = (data: any) => {
    onSubmit(data);
  };
  
  const handleSaveDraft = () => {
    // Implementation for saving as draft
    console.log("Draft saved:", methods.getValues());
  };
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        <ProgressSteps 
          steps={steps.slice(0, 4).map(step => step.name)} 
          currentStep={currentStep <= 4 ? currentStep : 4} 
        />
        
        {steps[currentStep - 1].component}
        
        <div className="flex justify-between pt-6">
          <button 
            type="button" 
            className="btn-tertiary"
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
          >
            {currentStep === 1 ? "Cancelar" : "Anterior"}
          </button>
          
          <div className="space-x-4">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={handleSaveDraft}
            >
              Guardar borrador
            </button>
            
            {currentStep < steps.length ? (
              <button 
                type="button" 
                className="btn-primary"
                onClick={goToNextStep}
              >
                Siguiente
              </button>
            ) : (
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isSubmitting}
              >
                Registrar candidato
              </button>
            )}
          </div>
        </div>
        

      </form>
    </FormProvider>
  );
}
