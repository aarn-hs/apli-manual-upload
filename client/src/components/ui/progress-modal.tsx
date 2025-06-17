import { useEffect, useState } from "react";

interface ProgressModalProps {
  isVisible: boolean;
  progress: number;
  message?: string;
}

export default function ProgressModal({ isVisible, progress, message = "Procesando datos, por favor espera" }: ProgressModalProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="progress-modal-container">
        <div className="progress-modal-content">
          <div className="progress-modal-header">
            <p className="progress-modal-text">{message}</p>
            <span className="progress-modal-percentage">{Math.round(progress)}%</span>
          </div>
          
          <div className="progress-modal-bar-container">
            <div 
              className="progress-modal-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}