import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { CustomInput } from "@/components/ui/custom-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  agencySources,
  positions,
  locations,
  genders,
  nationalities,
  mexicanStates,
  getMunicipalitiesForState,
  maritalStatuses,
  educationLevels,
  yesNoOptions,
  motivations,
  jobsLast24MonthsOptions
} from "@/lib/data";

export default function SimpleFormMobile() {
  const { control, setValue } = useFormContext();
  
  const selectedState = useWatch({
    control,
    name: "state",
    defaultValue: "",
  });
  
  useEffect(() => {
    if (selectedState) {
      setValue("municipality", "");
    }
  }, [selectedState, setValue]);

  return (
    <section id="simple-form" className="bg-white p-6">
      <h2 className="important section-title">Registro de candidato</h2>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        
        {/* Campo 1 - Fuente (móvil: 1, desktop: izquierda) */}
        <FormField
          control={control}
          name="source"
          render={({ field, fieldState }) => (
            <FormItem className="form-item mobile-order-1">
              <FormLabel className="body-text required">Fuente</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={1}>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {agencySources.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 2 - Puesto (móvil: 2, desktop: derecha) */}
        <FormField
          control={control}
          name="position"
          render={({ field, fieldState }) => (
            <FormItem className="form-item mobile-order-2">
              <FormLabel className="body-text required">Puesto</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={2}>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position.value} value={position.value}>
                      {position.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

      </div>
    </section>
  );
}