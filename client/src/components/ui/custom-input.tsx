import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "form-control",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

CustomInput.displayName = "CustomInput";
