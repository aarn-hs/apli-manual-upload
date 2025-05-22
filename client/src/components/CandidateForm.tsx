import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { simplifiedCandidateSchema } from "@/lib/simplified-schema";
import SimpleForm from "@/components/FormSections/SimpleForm";

interface CandidateFormProps {
  onSubmit: (data: any) => void;
}

export default function CandidateForm({ onSubmit }: CandidateFormProps) {
  const methods = useForm({
    resolver: zodResolver(simplifiedCandidateSchema),
    mode: "onChange",
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
      hasDisability: ""
    }
  });
  
  const { handleSubmit, formState: { isSubmitting }, reset, watch } = methods;
  
  // Watch all form values to determine if form is empty
  const watchedValues = watch();
  const isFormEmpty = Object.entries(watchedValues).every(([key, value]) => {
    // Special handling for date fields that might have default values
    if (key === 'birthDate' && value) {
      // Check if it's a valid date string and not just empty
      const dateValue = value.toString().trim();
      return dateValue === "" || dateValue === "Invalid Date";
    }
    return value === "" || value === null || value === undefined;
  });
  
  // Debug log to see what's happening
  console.log('Form values debug:', { watchedValues, isFormEmpty });
  
  const handleFormSubmit = (data: any) => {
    onSubmit(data);
  };
  
  const handleClearForm = () => {
    reset();
  };
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        <SimpleForm />
        
        <div className="flex justify-start gap-4 pt-6">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isSubmitting || isFormEmpty}
          >
            Enviar candidato
          </button>
          
          <button 
            type="button" 
            className="btn-secondary"
            onClick={handleClearForm}
            disabled={isFormEmpty}
          >
            Limpiar formulario
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
