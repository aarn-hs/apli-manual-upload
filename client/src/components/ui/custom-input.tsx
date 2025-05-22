import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  errorSpacing?: boolean;
  autoUppercase?: boolean;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, type, value, autoUppercase, onChange, ...props }, ref) => {
    // Ensure value is never undefined to avoid controlled/uncontrolled warning
    const safeValue = value === undefined ? "" : value;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (autoUppercase) {
        e.target.value = e.target.value.toUpperCase();
      }
      if (onChange) {
        onChange(e);
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
        {...props}
      />
    );
  }
);

CustomInput.displayName = "CustomInput";
