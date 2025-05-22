import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { candidateSchema } from "@/lib/schemas";
import SimpleForm from "@/components/FormSections/SimpleForm";

interface CandidateFormProps {
  onSubmit: (data: any) => void;
}

export default function CandidateForm({ onSubmit }: CandidateFormProps) {
  const methods = useForm({
    resolver: zodResolver(candidateSchema),
    mode: "onBlur",
    defaultValues: {
      source: "",
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
      curp: ""
    }
  });
  
  const { handleSubmit, formState: { isSubmitting } } = methods;
  
  const handleFormSubmit = (data: any) => {
    onSubmit(data);
  };
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        <SimpleForm />
        
        <div className="flex justify-end pt-6">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isSubmitting}
          >
            Registrar candidato
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
