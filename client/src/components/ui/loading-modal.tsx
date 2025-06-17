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
    
    // Función para actualizar el progreso gradualmente hasta 90% en 2 minutos
    const updateProgress = () => {
      interval = setInterval(() => {
        setProgress(current => {
          // 90% en 120 segundos = 0.75% por segundo
          const increment = 0.75;
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
  const completeProgress = (shouldReach100: boolean = false) => {
    setIsCompleting(true);
    
    if (shouldReach100) {
      setProgress(100);
      // Esperar un momento para mostrar el 100% y luego cerrar
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 1000);
    } else {
      // No llegar al 100%, mantener el progreso actual y cerrar inmediatamente
      if (onComplete) {
        onComplete();
      }
    }
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
    <div className="loading-modal-container p-4 rounded-lg border-2 bg-white border-gray-400 mb-6">
      <div className="flex justify-between items-center mb-4">
        <p style={{ color: 'rgb(55, 65, 81)', fontSize: '0.875rem', fontWeight: '500' }}>
          Procesando datos, por favor espera
        </p>
        <span style={{ color: 'rgb(55, 65, 81)', fontSize: '0.875rem', fontWeight: '700' }}>
          {Math.round(progress)}%
        </span>
      </div>
      
      {/* Barra de progreso */}
      <div className="w-full bg-gray-300 h-2 mb-2">
        <div 
          className="bg-violet-600 h-2 transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// Función helper para completar el progreso desde cualquier lugar
export const completeLoadingProgress = (shouldReach100: boolean = false) => {
  if ((window as any).completeLoadingProgress) {
    (window as any).completeLoadingProgress(shouldReach100);
  }
};