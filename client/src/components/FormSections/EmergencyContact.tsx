import { useFormContext } from "react-hook-form";
import { CustomInput } from "@/components/ui/custom-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { emergencyContactRelations } from "@/lib/data";

export default function EmergencyContact() {
  const { control } = useFormContext();
  
  return (
    <section id="emergency-contact" className="bg-white p-6 shadow-md">
      <h2 className="important section-title">Contacto de emergencia</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="emergencyContactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="body-text required">Nombre de contacto de emergencia</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  placeholder="Nombre completo"
                  className="form-control"
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="emergencyContactRelation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="body-text required">Relación con contacto de emergencia</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                <FormControl>
                  <SelectTrigger className="form-control">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {emergencyContactRelations.map((relation) => (
                    <SelectItem key={relation} value={relation}>
                      {relation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="emergencyContactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="body-text required">Teléfono de contacto de emergencia</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  placeholder="10 dígitos"
                  className="form-control"
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
}