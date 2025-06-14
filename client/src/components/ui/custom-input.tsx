import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { cleanAndFormatText } from "@/lib/validation";

export interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  errorSpacing?: boolean;
  autoUppercase?: boolean;
  autoLowercase?: boolean;
  autoCleanSpaces?: boolean;
  noSpaces?: boolean;
  fieldName?: string;
  maxLength?: number;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, type, value, autoUppercase, autoLowercase, autoCleanSpaces, noSpaces, onChange, ...props }, ref) => {
    // Ensure value is never undefined to avoid controlled/uncontrolled warning
    const safeValue = value === undefined ? "" : value;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      
      if (noSpaces) {
        // Remover todos los espacios para campos como email
        newValue = newValue.replace(/\s/g, '');
      }
      
      if (autoUppercase) {
        newValue = newValue.toUpperCase();
      }
      
      if (autoLowercase) {
        newValue = newValue.toLowerCase();
      }
      
      if (autoCleanSpaces && !noSpaces) {
        // Solo limpiar espacios múltiples, pero permitir espacios al inicio para que el usuario pueda escribir
        newValue = newValue.replace(/\s{2,}/g, ' ');
      }
      
      e.target.value = newValue;
      
      if (onChange) {
        onChange(e);
      }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (noSpaces && e.key === ' ') {
        e.preventDefault();
        return;
      }
      
      if (props.onKeyDown) {
        props.onKeyDown(e);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (autoCleanSpaces) {
        // Al perder el foco, hacer limpieza completa incluyendo trim
        const originalValue = e.target.value;
        const cleanedValue = cleanAndFormatText(originalValue);
        
        if (cleanedValue !== originalValue) {
          // Actualizar el valor del input directamente
          e.target.value = cleanedValue;
          
          // Crear un nuevo evento de cambio con el valor limpio
          const changeEvent = {
            target: {
              value: cleanedValue,
              name: e.target.name
            }
          } as React.ChangeEvent<HTMLInputElement>;
          
          if (onChange) {
            onChange(changeEvent);
          }
        }
      }
      
      if (props.onBlur) {
        props.onBlur(e);
      }
    };
    
    return (
      <input
        type={type}
        className={cn(
          "form-control",
          className
        )}
        ref={ref}
        value={safeValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        {...props}
      />
    );
  }
);

CustomInput.displayName = "CustomInput";
