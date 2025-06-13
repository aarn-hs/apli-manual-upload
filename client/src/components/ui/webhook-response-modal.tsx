import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, X, WifiOff } from "lucide-react";

interface WebhookResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSuccess: boolean;
  message: string;
  applicationId?: string;
}

export default function WebhookResponseModal({ 
  isOpen, 
  onClose, 
  isSuccess, 
  message, 
  applicationId 
}: WebhookResponseModalProps) {
  const baseUrl = import.meta.env.VITE_APLI_CANDIDATES_BASE_URL || 'https://demo.apli.app/candidates';

  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (applicationId) {
      const url = `${baseUrl}/${applicationId}`;
      window.open(url, '_blank');
    }
  };

  // Determinar si es un error de conexión real (no puede iniciar proceso vs respuesta de error del webhook)
  const isConnectionError = message.includes('No se pudo iniciar el proceso') ||
                           message.includes('tardó más de 90 segundos') ||
                           message.includes('restricciones de red') ||
                           message.includes('servicio no está disponible') ||
                           message.includes('conexión a internet');

  // Determinar si el modal debe ser no cerrable
  const isNonClosableError = message.includes('No autorizado') ||
                            message.includes('El candidato es un reingreso no viable');

  // Función para manejar el cierre del modal
  const handleModalClose = () => {
    if (!isNonClosableError) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {isSuccess ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Candidato Enviado
                </>
              ) : isConnectionError ? (
                <>
                  <WifiOff className="h-5 w-5 text-orange-600" />
                  Error de Conexión
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  {isNonClosableError ? 'Acción Requerida' : 'Error al Enviar'}
                </>
              )}
            </DialogTitle>
            {!isNonClosableError && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            {message}
          </p>
          
          {isNonClosableError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800 font-medium mb-2">
                Debes limpiar el formulario para continuar
              </p>
              <p className="text-xs text-red-600">
                Esta ventana permanecerá abierta hasta que recargues la página o limpies todos los campos del formulario.
              </p>
            </div>
          )}
          
          {applicationId && (
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-600 mb-1">ID de postulación:</p>
              <a
                href={`${baseUrl}/${applicationId}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
              >
                {`${baseUrl}/${applicationId}`}
              </a>
              <p className="text-xs text-gray-500 mt-1">
                Haz clic para ver en Apli
              </p>
            </div>
          )}
          

        </div>
      </DialogContent>
    </Dialog>
  );
}