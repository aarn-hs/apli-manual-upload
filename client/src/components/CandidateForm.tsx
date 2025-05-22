import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { simplifiedCandidateSchema } from "@/lib/simplified-schema";
import SimpleForm from "@/components/FormSections/SimpleForm";
import ProgressBar from "@/components/ui/progress-bar";

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

  // Check if all required fields are completed
  const requiredFields = [
    'source', 'position', 'location', 'pmx', 'firstName', 'firstLastName', 
    'secondLastName', 'birthDate', 'email', 'phone', 'gender', 'nationality',
    'streetAndNumber', 'neighborhood', 'state', 'municipality', 'postalCode',
    'education', 'maritalStatus', 'previousCompany', 'previousPosition', 
    'previousTasks', 'retailExperience', 'motivation', 'curp', 'hasDisability'
  ];
  
  const areAllRequiredFieldsCompleted = requiredFields.every(field => {
    const value = (watchedValues as any)[field];
    if (field === 'birthDate' && value) {
      const dateValue = value.toString().trim();
      return dateValue !== "" && dateValue !== "Invalid Date";
    }
    return value !== "" && value !== null && value !== undefined;
  });

  // Count completed fields for progress bar
  const completedFieldsCount = requiredFields.filter(field => {
    const value = (watchedValues as any)[field];
    if (field === 'birthDate' && value) {
      const dateValue = value.toString().trim();
      return dateValue !== "" && dateValue !== "Invalid Date";
    }
    return value !== "" && value !== null && value !== undefined;
  }).length;
  

  
  const handleFormSubmit = (data: any) => {
    onSubmit(data);
  };
  
  const handleClearForm = () => {
    reset({
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
    });
  };
  
  return (
    <FormProvider {...methods}>
      <div className="flex gap-3">
        {/* Progress Bar - pegada al formulario */}
        <div className="w-2 flex-shrink-0">
          <div className="sticky top-6 h-screen max-h-[600px]">
            <ProgressBar 
              completedFields={completedFieldsCount}
              totalFields={requiredFields.length}
            />
          </div>
        </div>
        
        {/* Main Form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            <SimpleForm />
            
            <div className="flex justify-start gap-4 pt-6">
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isSubmitting || !areAllRequiredFieldsCompleted}
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
        </div>
      </div>
    </FormProvider>
  );
}
