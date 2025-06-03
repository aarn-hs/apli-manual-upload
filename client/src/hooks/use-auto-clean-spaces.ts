import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { cleanAndFormatText } from '@/lib/validation';

export function useAutoCleanSpaces(fieldName: string) {
  const { setValue, watch } = useFormContext();
  const currentValue = watch(fieldName);

  const handleBlur = useCallback(() => {
    if (currentValue && typeof currentValue === 'string') {
      const cleanedValue = cleanAndFormatText(currentValue);
      if (cleanedValue !== currentValue) {
        setValue(fieldName, cleanedValue, { 
          shouldValidate: true,
          shouldDirty: true 
        });
      }
    }
  }, [currentValue, fieldName, setValue]);

  return { handleBlur };
}