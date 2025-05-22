import { useFormContext } from "react-hook-form";
import { CustomInput } from "@/components/ui/custom-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { agencySources, genders, nationalities } from "@/lib/data";

export default function BasicInfo() {
  const { control } = useFormContext();
  
  return (
    <section id="basic-info" className="bg-white p-6 shadow-md">
      <h2 className="important section-title">Información Básica</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            control={control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">Fuente</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="form-control">
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
          
          <FormField
            control={control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">Nombre(s)</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Nombre(s)"
                    className="form-control"
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="firstLastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">Apellido paterno</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Apellido paterno"
                    className="form-control"
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="secondLastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text">Apellido materno</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Apellido materno"
                    className="form-control"
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">Fecha de nacimiento</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    type="date"
                    className="form-control"
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">Correo electrónico</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    type="email"
                    placeholder="ejemplo@dominio.com"
                    className="form-control"
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">Número de teléfono</FormLabel>
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
          
          <FormField
            control={control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">Género</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="form-control">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {genders.map((gender) => (
                      <SelectItem key={gender.value} value={gender.value}>
                        {gender.label}
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
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">Nacionalidad</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="form-control">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {nationalities.map((nationality) => (
                      <SelectItem key={nationality} value={nationality}>
                        {nationality}
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
            name="pmx"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">PMX</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="PMX12345678"
                    className="form-control"
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>
      </div>
    </section>
  );
}
