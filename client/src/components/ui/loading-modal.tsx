import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";

interface LoadingModalProps {
  isOpen: boolean;
  onComplete?: () => void;
}

export default function LoadingModal({ isOpen, onComplete }: LoadingModalProps) {
  const [progress, setProgress] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setIsCompleting(false);
      return;
    }

    let interval: NodeJS.Timeout;
    
    // Función para actualizar el progreso gradualmente hasta 90% en 3 minutos
    const updateProgress = () => {
      interval = setInterval(() => {
        setProgress(current => {
          // 90% en 180 segundos = 0.5% por segundo
          const increment = 0.5;
          const newProgress = Math.min(current + increment, 90);
          return newProgress;
        });
      }, 1000); // Actualizar cada segundo
    };

    updateProgress();

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isOpen]);

  // Función pública para completar el progreso cuando se reciba respuesta
  const completeProgress = () => {
    setIsCompleting(true);
    setProgress(100);
    
    // Esperar un momento para mostrar el 100% y luego cerrar
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 1000);
  };

  // Exponer la función completeProgress al componente padre
  useEffect(() => {
    if (isOpen && (window as any).completeLoadingProgress) {
      // Si ya existe una función global, reemplazarla
    }
    (window as any).completeLoadingProgress = completeProgress;
    
    return () => {
      if ((window as any).completeLoadingProgress === completeProgress) {
        delete (window as any).completeLoadingProgress;
      }
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen}>
      <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
      <DialogContent className="max-w-md mx-auto bg-gray-800 border-gray-700 text-white p-8">
        <div className="space-y-6">
          {/* Título y porcentaje */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">
              Cargando candidato en Apli
            </h2>
            <span className="text-2xl font-bold text-white">
              {Math.round(progress)}%
            </span>
          </div>
          
          {/* Barra de progreso */}
          <div className="w-full bg-gray-600 rounded-full h-3">
            <div 
              className="bg-violet-600 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Función helper para completar el progreso desde cualquier lugar
export const completeLoadingProgress = () => {
  if ((window as any).completeLoadingProgress) {
    (window as any).completeLoadingProgress();
  }
};