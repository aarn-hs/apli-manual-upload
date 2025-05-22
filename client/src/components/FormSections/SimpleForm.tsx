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
  motivations
} from "@/lib/data";

export default function SimpleForm() {
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
    <section id="simple-form" className="bg-white p-6 shadow-md">
      <h2 className="important section-title">Registro de candidato</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Campo 1 - Columna izquierda */}
          <FormField
            control={control}
            name="source"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
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
          
          {/* Campo 3 - Columna izquierda */}
          <FormField
            control={control}
            name="location"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Ubicación</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={3}>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          {/* Campo 5 - Columna izquierda */}
          <FormField
            control={control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="form-item">
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
          
          {/* Campo 7 - Columna izquierda */}
          <FormField
            control={control}
            name="secondLastName"
            render={({ field }) => (
              <FormItem className="form-item">
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
          
          {/* Campo 9 - Columna izquierda */}
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Correo electrónico</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    type="email"
                    placeholder="ejemplo@dominio.com"
                    className="form-control"
                    tabIndex={9}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          {/* Campo 11 - Columna izquierda */}
          <FormField
            control={control}
            name="gender"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Género</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={11}>
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
          
          {/* Campo 13 - Columna izquierda */}
          <FormField
            control={control}
            name="streetAndNumber"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Calle y número de la vivienda</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Calle y número"
                    className="form-control"
                    tabIndex={13}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          {/* Campo 15 - Columna izquierda */}
          <FormField
            control={control}
            name="neighborhood"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Colonia</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Colonia"
                    className="form-control"
                    tabIndex={15}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          {/* Campo 17 - Columna izquierda */}
          <FormField
            control={control}
            name="state"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Estado</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={17}>
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
          
          {/* Campo 19 - Columna izquierda */}
          <FormField
            control={control}
            name="education"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Escolaridad</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={19}>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {educationLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          {/* Campo 21 - Columna izquierda */}
          <FormField
            control={control}
            name="previousCompany"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">¿Última compañía en la que trabajó?</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Compañía donde trabajó anteriormente"
                    className="form-control"
                    tabIndex={21}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          {/* Campo 23 - Columna izquierda */}
          <FormField
            control={control}
            name="previousTasks"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">¿Qué tareas tenía en ese puesto?</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describa sus responsabilidades anteriores"
                    className="form-control"
                    rows={3}
                    tabIndex={23}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          {/* Campo 25 - Columna izquierda */}
          <FormField
            control={control}
            name="motivation"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Motivación al elegir trabajo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={25}>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {motivations.map((motivation) => (
                      <SelectItem key={motivation} value={motivation}>
                        {motivation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          {/* Campo 27 - Columna izquierda */}
          <FormField
            control={control}
            name="hasDisability"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Requiere algun ajuste durante el proceso debido a una discapacidad?</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={27}>
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
        </div>
        
        <div className="space-y-4">
          {/* Campo 2 - Columna derecha */}
          <FormField
            control={control}
            name="position"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Puesto</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={2}>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          {/* Campo 4 - Columna derecha */}
          <FormField
            control={control}
            name="pmx"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">PMX</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="PMX12345678"
                    className="form-control"
                    tabIndex={4}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          {/* Campo 6 - Columna derecha */}
          <FormField
            control={control}
            name="firstLastName"
            render={({ field }) => (
              <FormItem className="form-item">
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
          
          {/* Campo 8 - Columna derecha */}
          <FormField
            control={control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Fecha de nacimiento</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    type="date"
                    className="form-control"
                    tabIndex={8}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          {/* Campo 10 - Columna derecha */}
          <FormField
            control={control}
            name="phone"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Número de teléfono</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="10 dígitos"
                    className="form-control"
                    tabIndex={10}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          {/* Campo 12 - Columna derecha */}
          <FormField
            control={control}
            name="nationality"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Nacionalidad</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={12}>
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
          
          {/* Campo 14 - Columna derecha */}
          <FormField
            control={control}
            name="interiorNumber"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text">Número interior</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Número interior (opcional)"
                    className="form-control"
                    tabIndex={14}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          {/* Campo 16 - Columna derecha */}
          <FormField
            control={control}
            name="municipality"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Municipio</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""} disabled={!selectedState}>
                  <FormControl>
                    <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={16}>
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
          
          {/* Campo 18 - Columna derecha */}
          <FormField
            control={control}
            name="postalCode"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Código postal</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="5 dígitos"
                    className="form-control"
                    tabIndex={18}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          {/* Campo 20 - Columna derecha */}
          <FormField
            control={control}
            name="maritalStatus"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Estado civil</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={20}>
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
          
          {/* Campo 22 - Columna derecha */}
          <FormField
            control={control}
            name="previousPosition"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">¿Cuál era su puesto?</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Puesto que ocupó anteriormente"
                    className="form-control"
                    tabIndex={22}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          {/* Campo 24 - Columna derecha */}
          <FormField
            control={control}
            name="retailExperience"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Experiencia en retail</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={24}>
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
          
          {/* Campo 26 - Columna derecha */}
          <FormField
            control={control}
            name="curp"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">CURP</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="18 caracteres"
                    className="form-control"
                    autoUppercase={true}
                    tabIndex={26}
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