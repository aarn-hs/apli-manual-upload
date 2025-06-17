import { useEffect, useState } from "react";

interface LoadingModalProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export default function LoadingModal({ isVisible, onComplete }: LoadingModalProps) {
  const [progress, setProgress] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (!isVisible) {
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
  }, [isVisible]);

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
    if (isVisible && (window as any).completeLoadingProgress) {
      // Si ya existe una función global, reemplazarla
    }
    (window as any).completeLoadingProgress = completeProgress;
    
    return () => {
      if ((window as any).completeLoadingProgress === completeProgress) {
        delete (window as any).completeLoadingProgress;
      }
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="p-4 rounded-lg border-2 bg-gray-900 border-gray-700 mb-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm font-medium mb-4 text-white">
            Cargando candidato en Apli
          </p>
          
          {/* Barra de progreso */}
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div 
              className="bg-violet-600 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="ml-4 flex items-center">
          <span className="text-lg font-bold text-white">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
}

// Función helper para completar el progreso desde cualquier lugar
export const completeLoadingProgress = () => {
  if ((window as any).completeLoadingProgress) {
    (window as any).completeLoadingProgress();
  }
};