import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { cleanAndFormatText } from "@/lib/validation";

export interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  errorSpacing?: boolean;
  autoUppercase?: boolean;
  autoCleanSpaces?: boolean;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, type, value, autoUppercase, autoCleanSpaces, onChange, ...props }, ref) => {
    // Ensure value is never undefined to avoid controlled/uncontrolled warning
    const safeValue = value === undefined ? "" : value;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      
      if (autoUppercase) {
        newValue = newValue.toUpperCase();
      }
      
      if (autoCleanSpaces) {
        // Solo limpiar espacios múltiples, pero permitir espacios al inicio para que el usuario pueda escribir
        newValue = newValue.replace(/\s{2,}/g, ' ');
      }
      
      e.target.value = newValue;
      
      if (onChange) {
        onChange(e);
      }
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (autoCleanSpaces) {
        // Al perder el foco, hacer limpieza completa incluyendo trim
        const cleanedValue = cleanAndFormatText(e.target.value);
        if (cleanedValue !== e.target.value) {
          e.target.value = cleanedValue;
          if (onChange) {
            const syntheticEvent = {
              ...e,
              target: { ...e.target, value: cleanedValue }
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
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
        onBlur={handleBlur}
        {...props}
      />
    );
  }
);

CustomInput.displayName = "CustomInput";
