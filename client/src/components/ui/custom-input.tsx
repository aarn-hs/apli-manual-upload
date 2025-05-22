import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, type, value, ...props }, ref) => {
    // Ensure value is never undefined to avoid controlled/uncontrolled warning
    const safeValue = value === undefined ? "" : value;
    
    return (
      <input
        type={type}
        className={cn(
          "form-control",
          className
        )}
        ref={ref}
        value={safeValue}
        {...props}
      />
    );
  }
);

CustomInput.displayName = "CustomInput";
