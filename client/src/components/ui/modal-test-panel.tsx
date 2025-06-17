import { useState } from "react";
import { Button } from "@/components/ui/button";
import LoadingModal from "@/components/ui/loading-modal";
import SuccessModal from "@/components/ui/success-modal";
import WebhookResponseModal from "@/components/ui/webhook-response-modal";

export default function ModalTestPanel() {
  const [showTestModals, setShowTestModals] = useState(false);

  const toggleTestMode = () => {
    setShowTestModals(!showTestModals);
  };

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          {/* Container para los 3 modales superpuestos */}
          <div className="relative w-full max-w-lg">
            
            {/* Modal 1: Loading Modal - Más atrás (z-index más bajo) */}
            <div className="absolute inset-0" style={{ zIndex: 41 }}>
              <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg">
                <LoadingModal isVisible={true} />
              </div>
            </div>

            {/* Modal 2: Success Modal - En el medio */}
            <div className="absolute inset-0" style={{ zIndex: 42 }}>
              <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                <div className="bg-white p-8 max-w-md w-full rounded-lg">
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
                {/* Botón de cerrar del DialogContent */}
                <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m18 6-12 12"/>
                    <path d="m6 6 12 12"/>
                  </svg>
                  <span className="sr-only">Close</span>
                </button>
              </div>
            </div>

            {/* Modal 3: Webhook Response Modal - Más adelante (z-index más alto) */}
            <div className="absolute inset-0" style={{ zIndex: 43 }}>
              <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
                <div className="sm:max-w-md !bg-emerald-100 !border-emerald-300 rounded-lg p-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <h2 className="flex items-center gap-2">
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
                  
                  <div className="space-y-4">
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

            {/* Botón para cerrar el modo de prueba */}
            <div className="absolute top-4 right-4" style={{ zIndex: 44 }}>
              <Button
                onClick={toggleTestMode}
                variant="outline"
                size="sm"
                className="bg-red-600 text-white hover:bg-red-700 border-red-600"
              >
                Cerrar Test
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}