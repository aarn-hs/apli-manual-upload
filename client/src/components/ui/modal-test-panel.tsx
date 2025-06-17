import { useState } from "react";
import { Button } from "@/components/ui/button";
import LoadingModal from "@/components/ui/loading-modal";
import SuccessModal from "@/components/ui/success-modal";
import WebhookResponseModal from "@/components/ui/webhook-response-modal";

interface ModalTestPanelProps {
  showInForm?: boolean;
}

export default function ModalTestPanel({ showInForm = false }: ModalTestPanelProps) {
  const [showTestModals, setShowTestModals] = useState(false);

  const toggleTestMode = () => {
    setShowTestModals(!showTestModals);
  };

  if (showInForm) {
    return (
      <div className="mb-6">
        <Button
          onClick={toggleTestMode}
          variant="outline"
          className="mb-4 bg-purple-600 text-white hover:bg-purple-700 border-purple-600"
        >
          {showTestModals ? "Ocultar Test Modales" : "Mostrar Test Modales"}
        </Button>

        {showTestModals && (
          <div className="space-y-4">
            {/* Modal 1: Loading Modal */}
            <LoadingModal isVisible={true} />
            
            {/* Modal 2: Success Modal - Se usa SuccessModal real pero sin Dialog wrapper */}
            <div className="p-4 rounded-lg border-2 bg-white border-gray-400 mb-6">
              <div className="bg-white p-8 max-w-md w-full">
                <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                  <h2 className="title mb-4">¡Registro exitoso!</h2>
                  <p className="body-text mb-6 text-sm text-muted-foreground">
                    El candidato ha sido registrado correctamente en el sistema.
                  </p>
                </div>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                  <Button
                    variant="default"
                    className="btn-primary"
                  >
                    Aceptar
                  </Button>
                </div>
              </div>
            </div>

            {/* Modal 3: Webhook Response Modal - Se usa WebhookResponseModal real pero sin Dialog wrapper */}
            <div className="p-4 rounded-lg border-2 bg-emerald-100 border-emerald-300 mb-6">
              <div className="sm:max-w-md">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
                      <svg className="h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22,4 12,14.01 9,11.01"/>
                      </svg>
                      Candidato Enviado
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m18 6-12 12"/>
                        <path d="m6 6 12 12"/>
                      </svg>
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4 mt-4">
                  <p className="text-sm text-gray-700">
                    Postulación creada exitosamente
                  </p>
                  
                  <div className="p-3 bg-emerald-200 border border-emerald-400 rounded-md">
                    <p className="text-xs text-emerald-800 mb-1">ID de postulación:</p>
                    <a
                      href="https://demo.apli.app/candidates/test-app-id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                    >
                      https://demo.apli.app/candidates/test-app-id
                    </a>
                    <p className="text-xs text-emerald-700 mt-1">
                      Haz clic para ver en Apli
                    </p>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-xs text-gray-500">
                      ¿Algo falló? Puedes escribirnos y compartir el ID de la solicitud para ayudarte más rápido
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={toggleTestMode}
        variant="outline"
        className="mb-4 bg-purple-600 text-white hover:bg-purple-700 border-purple-600"
      >
        {showTestModals ? "Ocultar Test Modales" : "Mostrar Test Modales"}
      </Button>

      {showTestModals && (
        <>
          {/* Modal real usando los componentes existentes */}
          <LoadingModal isVisible={true} />
          <SuccessModal isOpen={true} onClose={() => {}} />
          <WebhookResponseModal
            isOpen={true}
            onClose={() => {}}
            isSuccess={true}
            message="Postulación creada exitosamente"
            applicationId="test-app-id"
          />
        </>
      )}
    </div>
  );
}