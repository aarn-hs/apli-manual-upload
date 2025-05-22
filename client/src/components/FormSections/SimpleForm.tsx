import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomInput } from "@/components/ui/custom-input";
import { agencySources, positions, locations, genders, nationalities, educationLevels, yesNoOptions, motivations, mexicanStates, maritalStatuses, disabilityTypes, emergencyContactRelations } from "@/lib/data";

export default function SimpleForm() {
  const { control } = useFormContext();

  return (
    <section id="simple-form" className="bg-white p-6 shadow-md">
      <h2 className="important section-title">Registro de candidato</h2>
      
      {/* Grid responsivo: columna única en móvil con orden zigzag, dos columnas en desktop */}
      <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
        
        {/* 1L - Campo 1: Fuente */}
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

        {/* 1R - Campo 2: Puesto */}
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

        {/* 2L - Campo 3: Ubicación */}
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
        </div>

        {/* 2R - Campo 4: PMX */}
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

        {/* 3L - Campo 5: Primer nombre */}
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

        {/* 3R - Campo 6: Segundo nombre */}
        <div className="order-6 md:order-6">
          <FormField
            control={control}
            name="secondName"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text">Segundo nombre</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Segundo nombre"
                    className="form-control"
                    tabIndex={6}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

        {/* 4L - Campo 7: Apellido paterno */}
        <div className="order-7 md:order-7">
          <FormField
            control={control}
            name="paternalSurname"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Apellido paterno</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Apellido paterno"
                    className="form-control"
                    tabIndex={7}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

        {/* 4R - Campo 8: Apellido materno */}
        <div className="order-8 md:order-8">
          <FormField
            control={control}
            name="maternalSurname"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text">Apellido materno</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Apellido materno"
                    className="form-control"
                    tabIndex={8}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

        {/* 5L - Campo 9: Género */}
        <div className="order-9 md:order-9">
          <FormField
            control={control}
            name="gender"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Género</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={9}>
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

        {/* 5R - Campo 10: Fecha de nacimiento */}
        <div className="order-10 md:order-10">
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
                    tabIndex={10}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

        {/* 6L - Campo 11: Estado civil */}
        <div className="order-11 md:order-11">
          <FormField
            control={control}
            name="maritalStatus"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Estado civil</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={11}>
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

        {/* 6R - Campo 12: Nacionalidad */}
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
                      <SelectItem key={nationality.value} value={nationality.value}>
                        {nationality.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

        {/* 7L - Campo 13: Estado */}
        <div className="order-13 md:order-13">
          <FormField
            control={control}
            name="state"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Estado</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={13}>
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

        {/* 7R - Campo 14: Ciudad */}
        <div className="order-14 md:order-14">
          <FormField
            control={control}
            name="city"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Ciudad</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Ciudad"
                    className="form-control"
                    tabIndex={14}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

        {/* 8L - Campo 15: Dirección */}
        <div className="order-15 md:order-15">
          <FormField
            control={control}
            name="address"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Dirección</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Dirección completa"
                    className="form-control"
                    tabIndex={15}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

        {/* 8R - Campo 16: Código postal */}
        <div className="order-16 md:order-16">
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
                    tabIndex={16}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

        {/* 9L - Campo 17: Teléfono */}
        <div className="order-17 md:order-17">
          <FormField
            control={control}
            name="phone"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Teléfono</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="10 dígitos"
                    className="form-control"
                    tabIndex={17}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

        {/* 9R - Campo 18: Correo electrónico */}
        <div className="order-18 md:order-18">
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
                    tabIndex={18}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

        {/* 10L - Campo 19: Nivel de estudios */}
        <div className="order-19 md:order-19">
          <FormField
            control={control}
            name="educationLevel"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Nivel de estudios</FormLabel>
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

        {/* 10R - Campo 20: ¿Ha trabajado antes? */}
        <div className="order-20 md:order-20">
          <FormField
            control={control}
            name="hasWorkedBefore"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">¿Ha trabajado antes?</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={20}>
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

        {/* 11L - Campo 21: ¿Última compañía en la que trabajó? */}
        <div className="order-21 md:order-21">
          <FormField
            control={control}
            name="lastCompany"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text">¿Última compañía en la que trabajó?</FormLabel>
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

        {/* 11R - Campo 22: ¿Por qué quiere trabajar con nosotros? */}
        <div className="order-22 md:order-22">
          <FormField
            control={control}
            name="motivation"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">¿Por qué quiere trabajar con nosotros?</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={22}>
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

        {/* 12L - Campo 23: Contacto de emergencia */}
        <div className="order-23 md:order-23">
          <FormField
            control={control}
            name="emergencyContactName"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Contacto de emergencia</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Nombre completo"
                    className="form-control"
                    tabIndex={23}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

        {/* 12R - Campo 24: Parentesco */}
        <div className="order-24 md:order-24">
          <FormField
            control={control}
            name="emergencyContactRelation"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Parentesco</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={24}>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {emergencyContactRelations.map((relation) => (
                      <SelectItem key={relation.value} value={relation.value}>
                        {relation.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

        {/* 13L - Campo 25: Teléfono del contacto */}
        <div className="order-25 md:order-25">
          <FormField
            control={control}
            name="emergencyContactPhone"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Teléfono del contacto</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="10 dígitos"
                    className="form-control"
                    tabIndex={25}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
        </div>

        {/* 13R - Campo 26: ¿Tiene alguna discapacidad? */}
        <div className="order-26 md:order-26">
          <FormField
            control={control}
            name="hasDisability"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">¿Tiene alguna discapacidad?</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={26}>
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

        {/* 14L - Campo 27: CURP */}
        <div className="order-27 md:order-27">
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
                    tabIndex={27}
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