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
  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (applicationId) {
      window.open(`https://demo.apli.app/candidates/${applicationId}`, '_blank');
    }
  };

  // Determinar si es un error de conexión/webhook inactivo
  const isConnectionError = message.includes('webhook') || 
                           message.includes('conectar') || 
                           message.includes('conexión') ||
                           message.includes('disponible') ||
                           message.includes('activo');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                  Error al Enviar
                </>
              )}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            {message}
          </p>
          
          {applicationId && (
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-600 mb-1">ID de Aplicación:</p>
              <a
                href={`https://demo.apli.app/candidates/${applicationId}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
              >
                {applicationId}
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