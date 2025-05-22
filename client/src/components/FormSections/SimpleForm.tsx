import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomInput } from "@/components/ui/custom-input";
import { agencySources, positions, locations, genders, nationalities, educationLevels, yesNoOptions, motivations, mexicanStates, getMunicipalitiesForState, maritalStatuses, disabilityTypes } from "@/lib/data";

export default function SimpleForm() {
  const { control, watch } = useFormContext();
  const selectedState = watch("state");

  return (
    <section id="simple-form" className="bg-white p-6 shadow-md">
      <h2 className="important section-title">Registro de candidato</h2>
      
      {/* Grid responsivo: columna única en móvil con orden zigzag, dos columnas en desktop */}
      <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
        
        {/* Campo 1: Fuente - Columna izquierda */}
        <div className="order-1 md:order-1">
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
        </div>

        {/* Campo 2: Puesto - Columna derecha */}
        <div className="order-2 md:order-2">
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
        </div>

        {/* Campo 3: Ubicación - Columna izquierda */}
        <div className="order-3 md:order-3">
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
        </div>

        {/* Campo 4: PMX - Columna derecha */}
        <div className="order-4 md:order-4">
          <FormField
            control={control}
            name="pmx"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">PMX</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="8 dígitos"
                    className="form-control"
                    tabIndex={4}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

        {/* Campo 5: Primer nombre - Columna izquierda */}
        <div className="order-5 md:order-5">
          <FormField
            control={control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Primer nombre</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Primer nombre"
                    className="form-control"
                    tabIndex={5}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

        {/* Campo 6: Apellido paterno - Columna derecha */}
        <div className="order-6 md:order-6">
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
        </div>

        {/* Campo 7: Apellido materno - Columna izquierda */}
        <div className="order-7 md:order-7">
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
        </div>

        {/* Campo 8: Fecha de nacimiento - Columna derecha */}
        <div className="order-8 md:order-8">
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
        </div>

        {/* Campo 9: Correo electrónico - Columna izquierda */}
        <div className="order-9 md:order-9">
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
                    placeholder="correo@ejemplo.com"
                    className="form-control"
                    tabIndex={9}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

        {/* Campo 10: Número de teléfono - Columna derecha */}
        <div className="order-10 md:order-10">
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
        </div>

        {/* Campo 11: Género - Columna izquierda */}
        <div className="order-11 md:order-11">
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
        </div>

        {/* Campo 12: Nacionalidad - Columna derecha */}
        <div className="order-12 md:order-12">
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
        </div>

        {/* Campo 13: Dirección - Columna izquierda */}
        <div className="order-13 md:order-25">
          <FormField
            control={control}
            name="streetAndNumber"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Dirección</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Dirección completa"
                    className="form-control"
                    tabIndex={13}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

        {/* Campo 14: Número interior - Columna derecha */}
        <div className="order-14 md:order-26">
          <FormField
            control={control}
            name="interiorNumber"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text">Número interior</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Número interior"
                    className="form-control"
                    tabIndex={14}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

        {/* Campo 15: Colonia - Columna izquierda */}
        <div className="order-15 md:order-27">
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
        </div>

        {/* Campo 16: Municipio - Columna derecha */}
        <div className="order-16 md:order-28">
          <FormField
            control={control}
            name="municipality"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Ciudad</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={16}>
                      <SelectValue placeholder="Seleccionar" />
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
        </div>

        {/* Campo 17: Estado - Columna izquierda */}
        <div className="order-17 md:order-29">
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
        </div>

        {/* Campo 18: Código postal - Columna derecha */}
        <div className="order-18 md:order-30">
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
        </div>

        {/* Campo 19: Escolaridad - Columna izquierda */}
        <div className="order-19 md:order-19">
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
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

        {/* Campo 20: Estado civil - Columna derecha */}
        <div className="order-20 md:order-20">
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
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

        {/* Campo 21: ¿Última compañía en la que trabajó? - Columna izquierda */}
        <div className="order-21 md:order-21">
          <FormField
            control={control}
            name="previousCompany"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">¿Última compañía en la que trabajó?</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Nombre de la empresa"
                    className="form-control"
                    tabIndex={21}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

        {/* Campo 22: Puesto Experiencia Previa - Columna derecha */}
        <div className="order-22 md:order-22">
          <FormField
            control={control}
            name="previousPosition"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Puesto Experiencia Previa</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Puesto anterior"
                    className="form-control"
                    tabIndex={22}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

        {/* Campo 23: Tareas Experiencia Previa - Columna izquierda */}
        <div className="order-23 md:order-23">
          <FormField
            control={control}
            name="previousTasks"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Tareas Experiencia Previa</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Describa las tareas realizadas"
                    className="form-control"
                    tabIndex={23}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

        {/* Campo 24: ¿Ha trabajado antes? - Columna derecha */}
        <div className="order-24 md:order-24">
          <FormField
            control={control}
            name="retailExperience"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">¿Ha trabajado antes?</FormLabel>
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
        </div>

        {/* Campo 25: ¿Por qué quiere trabajar con nosotros? - Columna izquierda */}
        <div className="order-25 md:order-13">
          <FormField
            control={control}
            name="motivation"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">¿Por qué quiere trabajar con nosotros?</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={25}>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {motivations.map((motivation) => (
                      <SelectItem key={motivation.value} value={motivation.value}>
                        {motivation.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

        {/* Campo 26: CURP - Columna derecha */}
        <div className="order-26 md:order-14">
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

        {/* Campo 27: ¿Requiere algún apoyo a causa de una discapacidad? - Columna izquierda */}
        <div className="order-27 md:order-15">
          <FormField
            control={control}
            name="hasDisability"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">¿Requiere algún apoyo a causa de una discapacidad?</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={27}>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {disabilityTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

      </div>
    </section>
  );
}