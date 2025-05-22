import React from 'react';

interface ProgressBarProps {
  completedFields: number;
  totalFields: number;
  className?: string;
}

export default function ProgressBar({ completedFields, totalFields, className = "" }: ProgressBarProps) {
  const progressPercentage = Math.round((completedFields / totalFields) * 100);
  
  // Debug temporal
  console.log('Progress Bar Debug:', { completedFields, totalFields, progressPercentage });
  
  return (
    <div className={`w-2 h-full bg-gray-200 rounded-full overflow-hidden relative ${className}`}>
      <div 
        className="absolute bottom-0 w-full bg-gradient-to-t from-teal to-azure rounded-full transition-all duration-500 ease-out"
        style={{ height: `${progressPercentage}%` }}
      />
    </div>
  );
}