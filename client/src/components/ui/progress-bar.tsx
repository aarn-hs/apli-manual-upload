import React from 'react';

interface ProgressBarProps {
  completedFields: number;
  totalFields: number;
  className?: string;
}

export default function ProgressBar({ completedFields, totalFields, className = "" }: ProgressBarProps) {
  const progressPercentage = Math.round((completedFields / totalFields) * 100);
  
  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Progress Label */}
      <div className="text-center">
        <h3 className="text-sm font-medium text-gray-700 mb-1">Progreso del formulario</h3>
        <p className="text-xs text-gray-500">{completedFields} de {totalFields} campos completados</p>
      </div>
      
      {/* Vertical Progress Bar */}
      <div className="relative w-4 h-64 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute bottom-0 w-full bg-gradient-to-t from-teal to-azure rounded-full transition-all duration-500 ease-out"
          style={{ height: `${progressPercentage}%` }}
        />
        
        {/* Progress Markers */}
        <div className="absolute inset-0 flex flex-col justify-between py-1">
          {[25, 50, 75, 100].map((marker) => (
            <div
              key={marker}
              className={`w-full h-px ${
                progressPercentage >= marker ? 'bg-white/30' : 'bg-gray-400/30'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Percentage Display */}
      <div className="text-center">
        <div className="text-2xl font-bold text-teal">{progressPercentage}%</div>
        <div className="text-xs text-gray-500">Completado</div>
      </div>
      
      {/* Progress Message */}
      <div className="text-center max-w-32">
        {progressPercentage === 0 && (
          <p className="text-xs text-gray-500">¡Comienza llenando el formulario!</p>
        )}
        {progressPercentage > 0 && progressPercentage < 50 && (
          <p className="text-xs text-teal">¡Buen comienzo! Sigue adelante</p>
        )}
        {progressPercentage >= 50 && progressPercentage < 90 && (
          <p className="text-xs text-teal">¡Vas muy bien! Ya casi terminas</p>
        )}
        {progressPercentage >= 90 && progressPercentage < 100 && (
          <p className="text-xs text-teal">¡Casi listo! Solo faltan unos campos</p>
        )}
        {progressPercentage === 100 && (
          <p className="text-xs text-green-600 font-medium">¡Formulario completo! ✓</p>
        )}
      </div>
    </div>
  );
}