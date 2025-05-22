import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { CustomInput } from "@/components/ui/custom-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { yesNoOptions, disabilityTypes } from "@/lib/data";

export default function HiringInfo() {
  const { control } = useFormContext();
  
  const hasDisability = useWatch({
    control,
    name: "hasDisability",
    defaultValue: "",
  });
  
  return (
    <section id="hiring-info" className="bg-white p-6 shadow-md">
      <h2 className="important section-title">Información de contratación</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            control={control}
            name="curp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">CURP</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="18 caracteres"
                    className="form-control"
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="rfc"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">RFC</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="13 caracteres"
                    className="form-control"
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="nss"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">NSS</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="10-11 dígitos"
                    className="form-control"
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="clabe"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text">CLABE</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="18 dígitos"
                    className="form-control"
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="fiscalPostalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text">Código postal fiscal</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="5 dígitos"
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
            name="contractStartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">Fecha de inicio de contrato</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    type="date"
                    className="form-control"
                  />
                </FormControl>
                <FormMessage className="error-message" />
                <p className="small-text text-dark-grey">No se permiten fines de semana, ni días festivos. Máximo 5 días hábiles en el futuro.</p>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="contractEndDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text">Fecha de fin de contrato (Solo eventual o maternidad)</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    type="date"
                    className="form-control"
                  />
                </FormControl>
                <FormMessage className="error-message" />
                <p className="small-text text-dark-grey">Debe ser posterior a la fecha de inicio.</p>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="hasDisability"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">Discapacidad</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="form-control">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {yesNoOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          {hasDisability === "Sí" && (
            <>
              <FormField
                control={control}
                name="disabilityType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="body-text required">Tipo de discapacidad</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="form-control">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {disabilityTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
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
                name="disabilityDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="body-text required">Descripción de discapacidad</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describa la discapacidad"
                        className="form-control"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage className="error-message" />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}