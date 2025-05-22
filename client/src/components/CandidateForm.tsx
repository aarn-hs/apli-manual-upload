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
  
  const { handleSubmit, formState: { isSubmitting }, reset } = methods;
  
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
            disabled={isSubmitting}
          >
            Enviar candidato
          </button>
          
          <button 
            type="button" 
            className="btn-secondary"
            onClick={handleClearForm}
          >
            Limpiar formulario
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
