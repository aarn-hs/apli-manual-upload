import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { simplifiedCandidateSchema } from "@/lib/simplified-schema";
import SimpleForm from "@/components/FormSections/SimpleForm";

interface CandidateFormProps {
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  notificationState?: {
    isVisible: boolean;
    isSuccess: boolean;
    message: string;
    submissionRequestId?: string;
    applicationId?: string;
  };
  onDismissNotification?: () => void;
}

export default function CandidateForm({ onSubmit, isSubmitting = false, notificationState, onDismissNotification }: CandidateFormProps) {
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
    // Dismiss notification when clearing form
    if (onDismissNotification) {
      onDismissNotification();
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        <SimpleForm />

        <div className="flex justify-start gap-4 pt-6">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isSubmitting || isFormSubmitting || !isFormReadyForSubmission || notificationState?.isVisible}
          >
            {(isSubmitting || isFormSubmitting) ? "Cargando..." : "Cargar candidato"}
          </button>

          <button 
            type="button" 
            className="btn-secondary"
            onClick={handleClearForm}
            disabled={isFormEmpty || isSubmitting}
          >
            Limpiar formulario
          </button>
        </div>

        {/* Notification panel */}
        {notificationState?.isVisible && (
          <div className={`mt-4 p-4 rounded-lg border-2 ${
            notificationState.isSuccess 
              ? 'bg-cyan-50 border-cyan-400 text-cyan-800' 
              : 'bg-purple-50 border-purple-400 text-purple-800'
          }`}>
            <div>
              <p className="text-sm font-medium mb-2">
                {notificationState.message}
              </p>
              
              {notificationState.submissionRequestId && (
                <p className="text-xs mb-1">
                  <span className="font-medium">ID de solicitud:</span>{' '}
                  <span className={notificationState.isSuccess ? 'text-cyan-600' : 'text-purple-600'}>
                    {notificationState.submissionRequestId}
                  </span>
                </p>
              )}
              
              {notificationState.applicationId && (
                <p className="text-xs">
                  <span className="font-medium">ID de postulación:</span>{' '}
                  <a
                    href={`https://demo.apli.app/candidates/${notificationState.applicationId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`underline hover:no-underline ${
                      notificationState.isSuccess ? 'text-cyan-600 hover:text-cyan-800' : 'text-purple-600 hover:text-purple-800'
                    }`}
                  >
                    {notificationState.applicationId}
                  </a>
                </p>
              )}
            </div>
          </div>
        )}

        <p className="text-sm text-gray-500">
          Asegúrate de llenar todos los campos obligatorios para poder continuar.
        </p>
      </form>
    </FormProvider>
  );
}