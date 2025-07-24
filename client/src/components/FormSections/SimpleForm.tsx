import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CustomInput } from "@/components/ui/custom-input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { simplifiedCandidateSchema } from "@/lib/simplified-schema";
import { agencySources, positions, locations, genders, mexicanStates, getMunicipalitiesForState, educationLevels, motivations, yesNoOptions, jobsLast24MonthsOptions } from "@/lib/data";
import { useIsMobile } from "@/hooks/use-mobile";

interface SimpleFormProps {
  control: any;
  watch: any;
  setValue: any;
}

export default function SimpleForm({ control, watch, setValue }: SimpleFormProps) {
  const isMobile = useIsMobile();

  // Watch para detectar cambios en fecha de nacimiento
  const birthDate = watch('birthDate');
  const curp = watch('curp');
  const previousJobStartDate = watch('previousJobStartDate');
  const previousJobEndDate = watch('previousJobEndDate');

  // Referencias para detectar cambios previos
  const prevBirthDate = useRef(birthDate);
  const prevPreviousJobStartDate = useRef(previousJobStartDate);
  const isInitialLoad = useRef(true);

  // Efecto para revalidar CURP cuando cambia fecha de nacimiento
  useEffect(() => {
    // No ejecutar en la carga inicial
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      prevBirthDate.current = birthDate;
      prevPreviousJobStartDate.current = previousJobStartDate;
      return;
    }

    // Solo revalidar si CURP tiene valor y alguno de los campos dependientes cambió
    const birthDateChanged = prevBirthDate.current !== birthDate;
    const previousJobStartDateChanged = prevPreviousJobStartDate.current !== previousJobStartDate;
    
    if (curp && birthDateChanged) {
      // Forzar revalidación del campo CURP
      setValue('curp', curp, { shouldValidate: true, shouldTouch: true });
    }

    // Revalidar fechas de experiencia previa si cambia fecha de nacimiento
    if (birthDateChanged) {
      if (previousJobStartDate) {
        setValue('previousJobStartDate', previousJobStartDate, { shouldValidate: true, shouldTouch: true });
      }
      if (previousJobEndDate) {
        setValue('previousJobEndDate', previousJobEndDate, { shouldValidate: true, shouldTouch: true });
      }
    }

    // Revalidar fecha de fin de experiencia previa si cambia fecha de inicio
    if (previousJobStartDateChanged && previousJobEndDate) {
      setValue('previousJobEndDate', previousJobEndDate, { shouldValidate: true, shouldTouch: true });
    }

    // Actualizar referencias
    prevBirthDate.current = birthDate;
    prevPreviousJobStartDate.current = previousJobStartDate;
  }, [birthDate, curp, previousJobStartDate, previousJobEndDate, setValue]);

  // Helper functions for field dependencies
  const isCURPEnabled = () => {
    return birthDate;
  };

  const isBirthDateValidForWork = () => {
    const birthDate = watch('birthDate');
    if (!birthDate) return false;
    const today = new Date();
    const birth = new Date(birthDate.split('/').reverse().join('-'));
    const age = today.getFullYear() - birth.getFullYear();
    return age >= 15;
  };

  // Date input handlers
  const handleDateInput = (fieldOnChange: any, currentValue: string) => (e: any) => {
    const inputValue = e.target.value;
    const previousValue = currentValue || '';
    
    // Si está borrando (nuevo valor es más corto), permitir borrado libre
    if (inputValue.length < previousValue.length) {
      fieldOnChange(inputValue);
      return;
    }
    
    // Solo extraer números para formateo
    let value = inputValue.replace(/[^0-9]/g, '');
    
    // Aplicar formato automáticamente mientras escribe
    if (value.length >= 2 && value.length <= 4) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    } else if (value.length > 4) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
    }
    
    fieldOnChange(value);
  };

  const formatDateOnBlur = (fieldOnChange: any, currentValue: string) => () => {
    if (currentValue && currentValue.length === 8 && !currentValue.includes('/')) {
      const formatted = currentValue.slice(0, 2) + '/' + currentValue.slice(2, 4) + '/' + currentValue.slice(4, 8);
      fieldOnChange(formatted);
    }
  };

  // Función para obtener tabindex y clase order
  const getTabIndex = (order: number) => {
    return order;
  };

  const getOrderClass = (order: number) => {
    return isMobile ? `order-[${order}]` : '';
  };

  // Helper function for numeric/date fields key handling
  const handleNumericKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, arrow keys
    if ([8, 9, 27, 13, 46, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true)) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  // Helper function for phone number paste handling
  const handlePhonePaste = (fieldOnChange: any) => (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    
    // Extraer solo números del texto pegado
    const numbersOnly = pastedText.replace(/\D/g, '');
    
    // Limitar a 10 dígitos máximo
    const limitedNumbers = numbersOnly.slice(0, 10);
    
    // Usar el onChange del field para mantener la sincronización con react-hook-form
    fieldOnChange(limitedNumbers);
  };

  return (
    <section id="simple-form" className="bg-white p-6">
      <h2 className="important section-title">Registro de candidato</h2>
      
      {/* Sistema Grid 2×n con orden según especificación */}
      <div className={`grid grid-cols-1 gap-x-8 gap-y-1 ${isMobile ? '' : 'md:grid-cols-2'} md:gap-x-10 md:gap-y-2`}>
        {/* Campo 1 - Fuente */}
        <FormField
          control={control}
          name="source"
          render={({ field, fieldState }) => (
            <FormItem className={`form-item ${getOrderClass(1)}`}>
              <FormLabel className="body-text required">Fuente</FormLabel>
              <FormControl>
                <SearchableSelect
                  options={agencySources}
                  placeholder="Seleccionar fuente"
                  searchPlaceholder="Buscar fuente..."
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  className={`form-control ${fieldState.error ? 'error' : ''}`}
                  tabIndex={getTabIndex(1)}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 2 - Puesto */}
        <FormField
          control={control}
          name="position"
          render={({ field, fieldState }) => (
            <FormItem className={`form-item ${getOrderClass(2)}`}>
              <FormLabel className="body-text required">Puesto</FormLabel>
              <FormControl>
                <SearchableSelect
                  options={positions.map(position => ({ value: position, label: position }))}
                  placeholder="Seleccionar puesto"
                  searchPlaceholder="Buscar puesto..."
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  className={`form-control ${fieldState.error ? 'error' : ''}`}
                  tabIndex={getTabIndex(2)}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 3 - Ubicación */}
        <FormField
          control={control}
          name="location"
          render={({ field, fieldState }) => (
            <FormItem className={`form-item ${getOrderClass(3)}`}>
              <FormLabel className="body-text required">Ubicación</FormLabel>
              <FormControl>
                <SearchableSelect
                  options={locations.map(location => ({ value: location, label: location }))}
                  placeholder="Seleccionar ubicación"
                  searchPlaceholder="Buscar ubicación..."
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  className={`form-control ${fieldState.error ? 'error' : ''}`}
                  tabIndex={getTabIndex(3)}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 4 - PMX */}
        <FormField
          control={control}
          name="pmx"
          render={({ field }) => (
            <FormItem className={`form-item ${getOrderClass(4)}`}>
              <FormLabel className="body-text">PMX</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  autoUppercase={true}
                  placeholder="PMX + 8 dígitos (opcional)"
                  className="form-control"
                  tabIndex={getTabIndex(4)}
                  maxLength={11}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 5 - Nombre(s) */}
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => (
            <FormItem className={`form-item ${getOrderClass(5)}`}>
              <FormLabel className="body-text required">Nombre(s)</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  placeholder="Nombre(s)"
                  className="form-control"
                  tabIndex={getTabIndex(5)}
                  autoCleanSpaces={true}
                  maxLength={41}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 6 - Apellido paterno */}
        <FormField
          control={control}
          name="firstLastName"
          render={({ field }) => (
            <FormItem className={`form-item ${getOrderClass(6)}`}>
              <FormLabel className="body-text required">Apellido paterno</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  placeholder="Apellido paterno"
                  className="form-control"
                  tabIndex={getTabIndex(6)}
                  autoCleanSpaces={true}
                  maxLength={41}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 7 - Apellido materno */}
        <FormField
          control={control}
          name="secondLastName"
          render={({ field, fieldState }) => (
            <FormItem className={`form-item ${getOrderClass(7)}`}>
              <FormLabel className="body-text">Apellido materno</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  placeholder="Apellido materno (opcional)"
                  className={`form-control ${fieldState.error ? 'error' : ''}`}
                  tabIndex={getTabIndex(7)}
                  autoCleanSpaces={true}
                  maxLength={41}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 8 - Fecha de nacimiento */}
        <FormField
          control={control}
          name="birthDate"
          render={({ field, fieldState }) => (
            <FormItem className={`form-item ${getOrderClass(8)}`}>
              <FormLabel className="body-text required">Fecha de nacimiento</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  type="text"
                  placeholder="dd/mm/aaaa"
                  className={`form-control ${fieldState.error ? 'error' : ''}`}
                  tabIndex={getTabIndex(8)}
                  maxLength={10}
                  onChange={handleDateInput(field.onChange, field.value)}
                  onBlur={formatDateOnBlur(field.onChange, field.value)}
                  onKeyDown={handleNumericKeyDown}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 9 - Correo electrónico */}
        <FormField
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem className={`form-item ${getOrderClass(9)}`}>
              <FormLabel className="body-text required">Correo electrónico</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className={`form-control ${fieldState.error ? 'error' : ''}`}
                  tabIndex={getTabIndex(9)}
                  noSpaces={true}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 10 - Número de teléfono */}
        <FormField
          control={control}
          name="phone"
          render={({ field, fieldState }) => (
            <FormItem className={`form-item ${getOrderClass(10)}`}>
              <FormLabel className="body-text required">Número de teléfono</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  placeholder="10 dígitos sin espacios"
                  className={`form-control ${fieldState.error ? 'error' : ''}`}
                  tabIndex={getTabIndex(10)}
                  maxLength={10}
                  onKeyDown={handleNumericKeyDown}
                  onPaste={handlePhonePaste(field.onChange)}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 11 - CURP */}
        <FormField
          control={control}
          name="curp"
          render={({ field, fieldState }) => (
            <FormItem className={`form-item ${getOrderClass(11)}`}>
              <FormLabel className="body-text required">CURP</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  placeholder={isCURPEnabled() ? "18 caracteres" : "Primero ingresa una fecha de nacimiento válida"}
                  className={`form-control ${fieldState.error ? 'error' : ''}`}
                  autoUppercase={true}
                  tabIndex={getTabIndex(11)}
                  disabled={!isCURPEnabled()}
                  maxLength={18}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 12 - Escolaridad */}
        <FormField
          control={control}
          name="education"
          render={({ field, fieldState }) => (
            <FormItem className={`form-item ${getOrderClass(12)}`}>
              <FormLabel className="body-text required">Escolaridad</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={getTabIndex(12)}>
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

        {/* Campo 13 - Estado de residencia */}
        <FormField
          control={control}
          name="state"
          render={({ field, fieldState }) => (
            <FormItem className={`form-item ${getOrderClass(13)}`}>
              <FormLabel className="body-text required">Estado de residencia</FormLabel>
              <FormControl>
                <SearchableSelect
                  options={mexicanStates.map(state => ({ value: state, label: state }))}
                  placeholder="Seleccionar estado"
                  searchPlaceholder="Buscar estado..."
                  value={field.value || ""}
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Reset municipality when state changes
                    setValue('municipality', '');
                  }}
                  className={`form-control ${fieldState.error ? 'error' : ''}`}
                  tabIndex={getTabIndex(13)}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 14 - Municipio */}
        <FormField
          control={control}
          name="municipality"
          render={({ field, fieldState }) => (
            <FormItem className={`form-item ${getOrderClass(14)}`}>
              <FormLabel className="body-text required">Municipio</FormLabel>
              <FormControl>
                <SearchableSelect
                  options={getMunicipalitiesForState(watch('state') || '').map(mun => ({ value: mun, label: mun }))}
                  placeholder={watch('state') ? "Seleccionar municipio" : "Primero selecciona un estado"}
                  searchPlaceholder="Buscar municipio..."
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  className={`form-control ${fieldState.error ? 'error' : ''}`}
                  tabIndex={getTabIndex(14)}
                  disabled={!watch('state')}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 15 - Colonia */}
        <FormField
          control={control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem className={`form-item ${getOrderClass(15)}`}>
              <FormLabel className="body-text required">Colonia</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  placeholder="Colonia"
                  className="form-control"
                  tabIndex={getTabIndex(15)}
                  autoCleanSpaces={true}
                  maxLength={41}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 16 - Código postal */}
        <FormField
          control={control}
          name="postalCode"
          render={({ field, fieldState }) => (
            <FormItem className={`form-item ${getOrderClass(16)}`}>
              <FormLabel className="body-text required">Código postal</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  placeholder="5 dígitos"
                  className={`form-control ${fieldState.error ? 'error' : ''}`}
                  tabIndex={getTabIndex(16)}
                  maxLength={5}
                  onKeyDown={handleNumericKeyDown}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 17 - Calle y número de la vivienda */}
        <FormField
          control={control}
          name="streetAndNumber"
          render={({ field }) => (
            <FormItem className={`form-item ${getOrderClass(17)}`}>
              <FormLabel className="body-text required">Calle y número de la vivienda</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  placeholder="Calle y número"
                  className="form-control"
                  tabIndex={getTabIndex(17)}
                  autoCleanSpaces={true}
                  maxLength={41}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 18 - Número interior */}
        <FormField
          control={control}
          name="interiorNumber"
          render={({ field }) => (
            <FormItem className={`form-item ${getOrderClass(18)}`}>
              <FormLabel className="body-text">Número interior</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  placeholder="Número interior (opcional)"
                  className="form-control"
                  tabIndex={getTabIndex(18)}
                  autoCleanSpaces={true}
                  maxLength={6}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 19 - Último empleador o compañía en la que trabajó */}
        <FormField
          control={control}
          name="previousCompany"
          render={({ field }) => (
            <FormItem className={`form-item ${getOrderClass(19)}`}>
              <FormLabel className="body-text required">Último empleador o compañía en la que trabajó</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  placeholder="Compañía donde trabajó anteriormente"
                  className="form-control"
                  tabIndex={getTabIndex(19)}
                  autoCleanSpaces={true}
                  maxLength={41}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 20 - ¿Cuál era su puesto? */}
        <FormField
          control={control}
          name="previousPosition"
          render={({ field }) => (
            <FormItem className={`form-item ${getOrderClass(20)}`}>
              <FormLabel className="body-text required">¿Cuál era su puesto?</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  placeholder="Puesto que ocupó anteriormente"
                  className="form-control"
                  tabIndex={getTabIndex(20)}
                  autoCleanSpaces={true}
                  maxLength={41}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 21 - Fecha de inicio de experiencia previa */}
        <FormField
          control={control}
          name="previousJobStartDate"
          render={({ field, fieldState }) => (
            <FormItem className={`form-item ${getOrderClass(21)}`}>
              <FormLabel className="body-text required">Fecha de inicio de experiencia previa</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  type="text"
                  placeholder={isBirthDateValidForWork() ? "dd/mm/aaaa" : "Primero ingresa una fecha de nacimiento válida"}
                  className={`form-control ${fieldState.error ? 'error' : ''}`}
                  tabIndex={getTabIndex(21)}
                  maxLength={10}
                  disabled={!isBirthDateValidForWork()}
                  onChange={handleDateInput(field.onChange, field.value)}
                  onBlur={formatDateOnBlur(field.onChange, field.value)}
                  onKeyDown={handleNumericKeyDown}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 22 - Fecha de fin de experiencia previa */}
        <FormField
          control={control}
          name="previousJobEndDate"
          render={({ field, fieldState }) => (
            <FormItem className={`form-item ${getOrderClass(22)}`}>
              <FormLabel className="body-text required">Fecha de fin de experiencia previa</FormLabel>
              <FormControl>
                <CustomInput
                  {...field}
                  type="text"
                  placeholder={isBirthDateValidForWork() ? "dd/mm/aaaa" : "Primero ingresa una fecha de nacimiento válida"}
                  className={`form-control ${fieldState.error ? 'error' : ''}`}
                  tabIndex={getTabIndex(22)}
                  maxLength={10}
                  disabled={!isBirthDateValidForWork()}
                  onChange={handleDateInput(field.onChange, field.value)}
                  onBlur={formatDateOnBlur(field.onChange, field.value)}
                  onKeyDown={handleNumericKeyDown}
                />
              </FormControl>
              <FormMessage className="error-message" />
            </FormItem>
          )}
        />

        {/* Campo 23 - Motivación al elegir trabajo */}
        <FormField
          control={control}
          name="motivation"
          render={({ field, fieldState }) => (
            <FormItem className={`form-item ${getOrderClass(23)}`}>
              <FormLabel className="body-text required">Motivación al elegir trabajo</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={getTabIndex(23)}>
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

        {/* Campo 24 - ¿Tiene experiencia en retail? */}
        <FormField
          control={control}
          name="retailExperience"
          render={({ field, fieldState }) => (
            <FormItem className={`form-item ${getOrderClass(24)}`}>
              <FormLabel className="body-text required">¿Tiene experiencia en retail?</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={getTabIndex(24)}>
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

        {/* Campo 25 - Cantidad de trabajos en los últimos 24 meses */}
        <FormField
          control={control}
          name="jobsLast24Months"
          render={({ field, fieldState }) => (
            <FormItem className={`form-item ${getOrderClass(25)}`}>
              <FormLabel className="body-text required">Cantidad de trabajos en los últimos 24 meses</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={getTabIndex(25)}>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {jobsLast24MonthsOptions.map((option) => (
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
    </section>
  );
}