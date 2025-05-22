import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white p-8 max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="title mb-4">¡Registro exitoso!</DialogTitle>
          <DialogDescription className="body-text mb-6">
            El candidato ha sido registrado correctamente en el sistema.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            className="btn-primary" 
            onClick={onClose}
          >
            Aceptar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
