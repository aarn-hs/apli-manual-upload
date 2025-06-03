import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { simplifiedCandidateSchema } from "@/lib/simplified-schema";
import SimpleForm from "@/components/FormSections/SimpleForm";

interface CandidateFormProps {
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

export default function CandidateForm({ onSubmit, isSubmitting = false }: CandidateFormProps) {
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
      retailExperience: "",
      motivation: "",
      curp: "",
      jobsLast24Months: "",
      previousJobStartDate: "",
      previousJobEndDate: ""
    }
  });

  const { handleSubmit, formState: { isSubmitting: isFormSubmitting, errors, isValid }, reset, watch } = methods;

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

  // Check if all required fields are completed AND valid
  const requiredFields = [
    'source', 'position', 'location', 'pmx', 'firstName', 'firstLastName', 
    'birthDate', 'email', 'phone', 'gender', 'nationality',
    'streetAndNumber', 'neighborhood', 'state', 'municipality', 'postalCode',
    'education', 'maritalStatus', 'previousCompany', 'previousPosition', 
    'retailExperience', 'motivation', 'curp',
    'jobsLast24Months', 'previousJobStartDate', 'previousJobEndDate'
  ];

  // Check if all required fields have values
  const areAllRequiredFieldsCompleted = requiredFields.every(field => {
    const value = (watchedValues as any)[field];
    if (field === 'birthDate' && value) {
      const dateValue = value.toString().trim();
      return dateValue !== "" && dateValue !== "Invalid Date";
    }
    return value !== "" && value !== null && value !== undefined;
  });

  // Check if all required fields are valid (no errors)
  const areAllRequiredFieldsValid = requiredFields.every(field => {
    return !errors[field as keyof typeof errors];
  });

  // Form is ready for submission if all fields are completed AND valid
  const isFormReadyForSubmission = areAllRequiredFieldsCompleted && areAllRequiredFieldsValid;



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
      retailExperience: "",
      motivation: "",
      curp: "",
      jobsLast24Months: "",
      previousJobStartDate: "",
      previousJobEndDate: ""
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        <SimpleForm />

        <div className="flex justify-start gap-4 pt-6">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isSubmitting || isFormSubmitting || !isFormReadyForSubmission}
          >
            {(isSubmitting || isFormSubmitting) ? "Cargando..." : "Cargar candidato"}
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
        <p className="text-sm text-gray-500">
          Asegúrate de llenar todos los campos obligatorios para poder continuar.
        </p>
      </form>
    </FormProvider>
  );
}