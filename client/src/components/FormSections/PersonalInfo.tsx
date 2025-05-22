import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { CustomInput } from "@/components/ui/custom-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { mexicanStates, getMunicipalitiesForState, maritalStatuses, yesNoOptions, disabilityTypes } from "@/lib/data";

export default function PersonalInfo() {
  const { control, setValue } = useFormContext();
  
  const selectedState = useWatch({
    control,
    name: "state",
    defaultValue: "",
  });
  
  const hasDisability = useWatch({
    control,
    name: "hasDisability",
    defaultValue: "",
  });
  
  // Reset municipality when state changes
  useEffect(() => {
    if (selectedState) {
      setValue("municipality", "");
    }
  }, [selectedState, setValue]);
  
  return (
    <section id="personal-info" className="bg-white p-6 shadow-md">
      <h2 className="important section-title">Información Personal</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            control={control}
            name="streetAndNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">Calle y número de la vivienda</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Calle y número"
                    className="form-control"
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="interiorNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text">Número interior</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Número interior (opcional)"
                    className="form-control"
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="neighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">Colonia</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Colonia"
                    className="form-control"
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="form-control">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mexicanStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
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
            name="municipality"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">Municipio</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedState}>
                  <FormControl>
                    <SelectTrigger className="form-control">
                      <SelectValue placeholder={selectedState ? "Seleccionar" : "Seleccione primero un estado"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectedState && getMunicipalitiesForState(selectedState).map((municipality) => (
                      <SelectItem key={municipality} value={municipality}>
                        {municipality}
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
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">Código postal</FormLabel>
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
          
          <FormField
            control={control}
            name="maritalStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">Estado civil</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="form-control">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {maritalStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
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
            name="hasDisability"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="body-text required">Discapacidad</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
