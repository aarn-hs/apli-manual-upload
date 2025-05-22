import React from 'react';

interface ProgressBarProps {
  completedFields: number;
  totalFields: number;
  className?: string;
}

export default function ProgressBar({ completedFields, totalFields, className = "" }: ProgressBarProps) {
  const progressPercentage = Math.round((completedFields / totalFields) * 100);
  
  return (
    <div className={`w-4 bg-gray-300 relative ${className}`} style={{ minHeight: '600px' }}>
      <div 
        className="absolute bottom-0 w-full bg-teal transition-all duration-700 ease-out"
        style={{ height: `${progressPercentage}%` }}
      />
      {/* Debug visual temporal */}
      <div className="absolute top-2 left-1 text-xs text-gray-600 transform -rotate-90 whitespace-nowrap">
        {progressPercentage}%
      </div>
    </div>
  );
}