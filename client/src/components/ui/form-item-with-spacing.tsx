import React from "react";
import { FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface FormItemWithSpacingProps extends React.ComponentPropsWithoutRef<typeof FormItem> {
  className?: string;
  children: React.ReactNode;
}

export function FormItemWithSpacing({ 
  className, 
  children, 
  ...props 
}: FormItemWithSpacingProps) {
  return (
    <div className="flex flex-col min-h-[105px]">
      <FormItem className={cn(className)} {...props}>
        {children}
      </FormItem>
    </div>
  );
}