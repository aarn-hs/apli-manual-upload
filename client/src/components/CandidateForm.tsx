import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { candidateSchema } from "@/lib/schemas";
import ProgressSteps from "@/components/ui/progress-steps";
import JobPosition from "@/components/FormSections/JobPosition";
import PersonalInfo from "@/components/FormSections/PersonalInfo";
import WorkEducation from "@/components/FormSections/WorkEducation";
import HiringInfo from "@/components/FormSections/HiringInfo";
import EmergencyContact from "@/components/FormSections/EmergencyContact";
import DependentsInfo from "@/components/FormSections/DependentsInfo";

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
    { id: 1, name: "Información del puesto", component: <JobPosition /> },
    { id: 2, name: "Información personal", component: <PersonalInfo /> },
    { id: 3, name: "Información laboral y educativa", component: <WorkEducation /> },
    { id: 4, name: "Información de contratación", component: <HiringInfo /> },
    { id: 5, name: "Contacto de emergencia", component: <EmergencyContact /> },
    { id: 6, name: "Dependientes", component: <DependentsInfo /> }
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
          steps={steps.map(step => step.name)} 
          currentStep={currentStep} 
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
        
        {Object.keys(errors).length > 0 && (
          <div className="bg-red bg-opacity-10 p-4 border border-red">
            <p className="text-red important">Por favor corrija los errores antes de continuar:</p>
            <ul className="list-disc list-inside">
              {Object.entries(errors).map(([key, error]) => (
                <li key={key} className="text-red">
                  {error?.message?.toString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
