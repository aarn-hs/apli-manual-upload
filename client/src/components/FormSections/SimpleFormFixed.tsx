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

export default function SimpleFormFixed() {
  const { control, setValue } = useFormContext();
  
  const selectedState = useWatch({
    control,
    name: "state",
    defaultValue: "",
  });
  
  // Reset municipality when state changes
  useEffect(() => {
    if (selectedState) {
      setValue("municipality", "");
    }
  }, [selectedState, setValue]);

  return (
    <section id="simple-form" className="bg-white p-6">
      <h2 className="important section-title">Registro de candidato</h2>
      
      {/* Grid container que funciona correctamente en móvil */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        
        {/* Campo 1 - Fuente (orden móvil: 1) */}
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

        {/* Campo 2 - Puesto (orden móvil: 2) */}
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

        {/* Campo 3 - PMX (orden móvil: 3) */}
        <FormField
          control={control}
          name="pmx"
          render={({ field }) => (
            <FormItem className="form-item mobile-order-3">
              <FormLabel className="body-text required">PMX</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  placeholder="PMX12345678"
                  className="form-control"
                  tabIndex={3}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 4 - Ubicación (orden móvil: 4) */}
        <FormField
          control={control}
          name="location"
          render={({ field, fieldState }) => (
            <FormItem className="form-item mobile-order-4">
              <FormLabel className="body-text required">Ubicación</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={4}>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 5 - Nombre (orden móvil: 5) */}
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="form-item mobile-order-5">
              <FormLabel className="body-text required">Nombre(s)</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  placeholder="Nombre(s)"
                  className="form-control"
                  tabIndex={5}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 6 - Apellido paterno (orden móvil: 6) */}
        <FormField
          control={control}
          name="firstLastName"
          render={({ field }) => (
            <FormItem className="form-item mobile-order-6">
              <FormLabel className="body-text required">Apellido paterno</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  placeholder="Apellido paterno"
                  className="form-control"
                  tabIndex={6}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 7 - Apellido materno (orden móvil: 7) */}
        <FormField
          control={control}
          name="secondLastName"
          render={({ field }) => (
            <FormItem className="form-item mobile-order-7">
              <FormLabel className="body-text">Apellido materno</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  placeholder="Apellido materno"
                  className="form-control"
                  tabIndex={7}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 8 - Fecha de nacimiento (orden móvil: 8) */}
        <FormField
          control={control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="form-item mobile-order-8">
              <FormLabel className="body-text required">Fecha de nacimiento</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  type="text"
                  placeholder="dd/mm/aaaa"
                  className="form-control"
                  tabIndex={8}
                  maxLength={10}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + '/' + value.slice(2);
                    }
                    if (value.length >= 5) {
                      value = value.slice(0, 5) + '/' + value.slice(5, 9);
                    }
                    field.onChange(value);
                  }}
                  onKeyDown={(e) => {
                    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                        (e.keyCode === 65 && e.ctrlKey === true) ||
                        (e.keyCode === 67 && e.ctrlKey === true) ||
                        (e.keyCode === 86 && e.ctrlKey === true) ||
                        (e.keyCode === 88 && e.ctrlKey === true)) {
                      return;
                    }
                    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                      e.preventDefault();
                    }
                  }}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Continuar con el resto de campos en orden alternado... */}
        {/* Aquí agregaremos los campos restantes manteniendo el orden correcto */}
      </div>
    </section>
  );
}