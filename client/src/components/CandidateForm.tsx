import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { simplifiedCandidateSchema } from "@/lib/simplified-schema";
import { extractGenderFromCURP } from "@/lib/validation";
import SimpleForm from "@/components/FormSections/SimpleForm";
import LoadingModal, { completeLoadingProgress } from "@/components/ui/loading-modal";

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
  const baseUrl = import.meta.env.VITE_APLI_CANDIDATES_BASE_URL || 'https://demo.apli.app/candidates';
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  
  // Cerrar modal de carga cuando aparezca una notificación
  useEffect(() => {
    if (notificationState?.isVisible) {
      setIsLoadingModalOpen(false);
    }
  }, [notificationState?.isVisible]);
  
  // Determinar si el error es no cerrable
  const isNonClosableError = notificationState?.message && (
    notificationState.message.includes('No autorizado') ||
    notificationState.message.includes('El candidato es un reingreso no viable')
  );
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
      curp: "",
      streetAndNumber: "",
      interiorNumber: "",
      neighborhood: "",
      municipality: "",
      state: "",
      postalCode: "",
      education: "",
      previousCompany: "",
      previousPosition: "",
      retailExperience: "",
      motivation: "",
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
    'birthDate', 'email', 'phone', 'curp',
    'streetAndNumber', 'neighborhood', 'state', 'municipality', 'postalCode',
    'education', 'previousCompany', 'previousPosition', 
    'retailExperience', 'motivation',
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
    // Mostrar modal de carga
    setIsLoadingModalOpen(true);
    
    // Extraer automáticamente el género de la CURP
    const extractedGender = extractGenderFromCURP(data.curp || '');
    
    // Agregar el género extraído a los datos
    const dataWithGender = {
      ...data,
      gender: extractedGender
    };
    
    onSubmit(dataWithGender);
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
      curp: "",
      streetAndNumber: "",
      interiorNumber: "",
      neighborhood: "",
      municipality: "",
      state: "",
      postalCode: "",
      education: "",
      previousCompany: "",
      previousPosition: "",
      retailExperience: "",
      motivation: "",
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
        <SimpleForm control={methods.control} watch={methods.watch} setValue={methods.setValue} />

        {/* PRUEBA TEMPORAL - Mostrar todos los estados inline */}
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-300 rounded-md">
            <h4 className="font-bold text-sm mb-2">TESTING - Modal de Carga:</h4>
            <LoadingModal 
              isVisible={true}
              onComplete={() => {}}
            />
          </div>

          <div className="p-3 bg-green-50 border border-green-300 rounded-md">
            <h4 className="font-bold text-sm mb-2">TESTING - Modal de Éxito:</h4>
            <div className="p-4 rounded-lg border-2 bg-emerald-100 border-emerald-300">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2 text-green-600">
                    Candidato cargado exitosamente
                  </p>
                  
                  <p className="text-xs mb-1">
                    <span className="font-medium">ID de solicitud:</span>{' '}
                    <span className="text-green-600">
                      REQ-1f6673f4-1750146382
                    </span>
                  </p>
                  
                  <p className="text-xs">
                    <span className="font-medium">ID de postulación:</span>{' '}
                    <a
                      href="https://demo.apli.app/candidates/139360"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:no-underline text-blue-600 hover:text-blue-800"
                    >
                      https://demo.apli.app/candidates/139360
                    </a>
                  </p>
                  
                  <div className="mt-3">
                    <p className="text-xs text-gray-500">
                      ¿Algo falló? Puedes escribirnos y compartir el ID de la solicitud para ayudarte más rápido
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-red-50 border border-red-300 rounded-md">
            <h4 className="font-bold text-sm mb-2">TESTING - Modal de Error:</h4>
            <div className="p-4 rounded-lg border-2 bg-red-50 border-red-400">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2 text-red-600">
                    El candidato es un reingreso no viable para este puesto. No puede participar nuevamente.
                  </p>
                  
                  <p className="text-xs mb-1">
                    <span className="font-medium">ID de solicitud:</span>{' '}
                    <span className="text-red-600">
                      REQ-2a8834b2-1750146500
                    </span>
                  </p>
                  
                  <div className="mt-3">
                    <p className="text-xs text-gray-500">
                      ¿Algo falló? Puedes escribirnos y compartir el ID de la solicitud para ayudarte más rápido
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification panel original - Disabled in favor of WebhookResponseModal */}
        {false && notificationState?.isVisible && (
          <div className={`p-4 rounded-lg border-2 ${
            notificationState.isSuccess 
              ? 'bg-green-50 border-green-400' 
              : 'bg-violet-50 border-violet-400'
          }`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className={`text-sm font-medium mb-2 ${
                  notificationState.isSuccess ? 'text-green-600' : 'text-violet-700'
                }`}>
                  {notificationState.message}
                </p>
                
                {notificationState.submissionRequestId && (
                  <p className="text-xs mb-1">
                    <span className="font-medium">ID de solicitud:</span>{' '}
                    <span className={notificationState.isSuccess ? 'text-green-600' : 'text-violet-600'}>
                      {notificationState.submissionRequestId}
                    </span>
                  </p>
                )}
                
                {notificationState.applicationId && (
                  <p className="text-xs">
                    <span className="font-medium">ID de postulación:</span>{' '}
                    <a
                      href={`${baseUrl}/${notificationState.applicationId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`underline hover:no-underline ${
                        notificationState.isSuccess ? 'text-green-600 hover:text-green-800' : 'text-violet-600 hover:text-violet-800'
                      }`}
                    >
                      {`${baseUrl}/${notificationState.applicationId}`}
                    </a>
                  </p>
                )}
                
                {/* Mensaje de soporte */}
                <div className="mt-3">
                  <p className="text-xs text-gray-500">
                    ¿Algo falló? Puedes escribirnos y compartir el ID de la solicitud para ayudarte más rápido
                  </p>
                </div>
              </div>
              
              {!notificationState.isSuccess && !isNonClosableError && (
                <button
                  onClick={onDismissNotification}
                  className={`ml-4 p-1 rounded-full hover:bg-gray-200 transition-colors ${
                    notificationState.isSuccess ? 'text-green-600 hover:text-green-800' : 'text-violet-600 hover:text-violet-800'
                  }`}
                  aria-label="Cerrar notificación"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-start gap-4 pt-6">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isSubmitting || isFormSubmitting || !isFormReadyForSubmission || notificationState?.isVisible || isLoadingModalOpen}
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

        <p className="text-sm text-gray-500">
          Asegúrate de llenar todos los campos obligatorios para poder continuar.
        </p>
      </form>


    </FormProvider>
  );
}