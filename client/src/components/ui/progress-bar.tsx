import React from 'react';

interface ProgressBarProps {
  completedFields: number;
  totalFields: number;
  className?: string;
}

export default function ProgressBar({ completedFields, totalFields, className = "" }: ProgressBarProps) {
  const progressPercentage = Math.round((completedFields / totalFields) * 100);
  
  return (
    <div className={`w-1 bg-gray-200 relative ${className}`}>
      <div 
        className="absolute bottom-0 w-full bg-teal transition-all duration-700 ease-out"
        style={{ height: `${progressPercentage}%` }}
      />
    </div>
  );
}