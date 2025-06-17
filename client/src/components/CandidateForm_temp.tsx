import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { simplifiedCandidateSchema } from "@/lib/simplified-schema";
import SimpleForm from "./FormSections/SimpleForm";
import { Button } from "@/components/ui/button";
import WebhookResponseModal from "@/components/ui/webhook-response-modal";
import { useEffect } from "react";
import { extractGenderFromCURP } from "@/lib/validation";

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
      curp: "",
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
      jobsLast24Months: "",
      previousJobStartDate: "",
      previousJobEndDate: ""
    }
  });

  const { handleSubmit, formState: { isSubmitting: isFormSubmitting, errors, isValid }, reset, watch } = methods;

  // Watch all form values to determine if form is empty
  const watchedValues = watch();
  
  // Check if form is completely empty
  const isFormEmpty = Object.values(watchedValues).every(value => !value);

  const onSubmitHandler = (data: any) => {
    console.log("Form data before submission:", data);
    
    // Extract gender from CURP and add to submission data
    const gender = extractGenderFromCURP(data.curp);
    const submissionData = {
      ...data,
      gender: gender
    };
    
    console.log("Final submission data with gender:", submissionData);
    onSubmit(submissionData);
  };

  // Auto-clear form when notification is successful and modal is closed
  useEffect(() => {
    if (notificationState?.isSuccess && !notificationState?.isVisible) {
      reset();
    }
  }, [notificationState?.isSuccess, notificationState?.isVisible, reset]);

  const onError = (errors: any) => {
    console.log("Validation errors:", errors);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitHandler, onError)}>
        <SimpleForm 
          control={methods.control} 
          watch={methods.watch}
          setValue={methods.setValue}
        />
        
        <div className="flex items-center justify-between mt-8 px-4 md:px-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={isSubmitting || isFormSubmitting || isFormEmpty}
            className="text-sm px-6 py-2"
          >
            Limpiar formulario
          </Button>
          
          <Button
            type="submit"
            disabled={isSubmitting || isFormSubmitting || !isValid}
            className="text-sm px-6 py-2"
          >
            {(isSubmitting || isFormSubmitting) ? "Enviando..." : "Enviar solicitud"}
          </Button>
        </div>
      </form>

      {/* Reset form button in reset section */}
      <div className="mt-4 px-4 md:px-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => reset({
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
            maritalStatus: "",
            previousCompany: "",
            previousPosition: "",
            retailExperience: "",
            motivation: "",
            jobsLast24Months: "",
            previousJobStartDate: "",
            previousJobEndDate: ""
          })}
          disabled={isSubmitting || isFormSubmitting || isFormEmpty}
          className="w-full text-sm"
        >
          Restablecer formulario
        </Button>
      </div>

      {/* Webhook Response Modal */}
      {notificationState && (
        <WebhookResponseModal
          isOpen={notificationState.isVisible}
          onClose={onDismissNotification || (() => {})}
          isSuccess={notificationState.isSuccess}
          message={notificationState.message}
          applicationId={notificationState.applicationId}
        />
      )}
    </FormProvider>
  );
}