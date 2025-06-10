import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { cleanAndFormatText } from "@/lib/validation";
import { CustomInput } from "@/components/ui/custom-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect } from "@/components/ui/searchable-select";
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

export default function SimpleForm() {
  const { control, setValue, watch, trigger } = useFormContext();
  
  const selectedState = useWatch({
    control,
    name: "state",
    defaultValue: "",
  });

  const birthDate = useWatch({
    control,
    name: "birthDate",
    defaultValue: "",
  });

  const nationality = useWatch({
    control,
    name: "nationality",
    defaultValue: "",
  });

  const curp = useWatch({
    control,
    name: "curp",
    defaultValue: "",
  });

  const previousJobStartDate = useWatch({
    control,
    name: "previousJobStartDate",
    defaultValue: "",
  });

  const previousJobEndDate = useWatch({
    control,
    name: "previousJobEndDate",
    defaultValue: "",
  });
  
  // Reset municipality when state changes
  useEffect(() => {
    if (selectedState) {
      setValue("municipality", "");
    }
  }, [selectedState, setValue]);

  // Revalidate CURP when birth date or nationality changes
  useEffect(() => {
    if (curp && (birthDate || nationality)) {
      trigger("curp");
    }
  }, [birthDate, nationality, curp, trigger]);

  // Check if CURP field should be enabled
  const isCURPEnabled = () => {
    // Validate birth date format and logical validity
    let birthDateValid = false;
    if (birthDate && /^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      const dateParts = birthDate.split('/');
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10);
      const year = parseInt(dateParts[2], 10);
      
      // Check basic ranges
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1940 && year <= new Date().getFullYear()) {
        // Create date object to validate it's a real date
        const testDate = new Date(year, month - 1, day);
        birthDateValid = testDate.getDate() === day && testDate.getMonth() === month - 1 && testDate.getFullYear() === year;
      }
    }
    
    // Nationality must be selected
    const nationalityValid = nationality && nationality.length > 0;
    
    return birthDateValid && nationalityValid;
  };

  // Clear CURP when prerequisites are not met
  useEffect(() => {
    if (!isCURPEnabled() && curp) {
      setValue("curp", "", { shouldValidate: false });
    }
  }, [birthDate, nationality, curp, setValue]);

  // Check if birth date is valid for work experience dates
  const isBirthDateValidForWork = () => {
    if (!birthDate || !/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return false;
    
    const dateParts = birthDate.split('/');
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[2], 10);
    
    // Check basic ranges
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1940 && year <= new Date().getFullYear()) {
      // Create date object to validate it's a real date
      const testDate = new Date(year, month - 1, day);
      return testDate.getDate() === day && testDate.getMonth() === month - 1 && testDate.getFullYear() === year;
    }
    
    return false;
  };

  // Revalidate work dates when birth date changes
  useEffect(() => {
    if (previousJobStartDate && isBirthDateValidForWork()) {
      trigger("previousJobStartDate");
    }
  }, [birthDate, previousJobStartDate, trigger]);

  useEffect(() => {
    if (previousJobEndDate && (isBirthDateValidForWork() || previousJobStartDate)) {
      trigger("previousJobEndDate");
    }
  }, [birthDate, previousJobStartDate, previousJobEndDate, trigger]);

  // Clear work dates when birth date becomes invalid
  useEffect(() => {
    if (!isBirthDateValidForWork()) {
      if (previousJobStartDate) {
        setValue("previousJobStartDate", "", { shouldValidate: false });
      }
      if (previousJobEndDate) {
        setValue("previousJobEndDate", "", { shouldValidate: false });
      }
    }
  }, [birthDate, previousJobStartDate, previousJobEndDate, setValue]);

  // Función para crear handlers de limpieza de espacios
  const createCleanSpacesHandler = (fieldName: string) => {
    return () => {
      const currentValue = watch(fieldName);
      if (currentValue && typeof currentValue === 'string') {
        const cleanedValue = cleanAndFormatText(currentValue);
        if (cleanedValue !== currentValue) {
          setValue(fieldName, cleanedValue, { 
            shouldValidate: true,
            shouldDirty: true 
          });
        }
      }
    };
  };

  // Función mejorada para formateo de fechas en tiempo real
  const handleDateInput = (fieldOnChange: any, currentValue: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const newValue = input.value;
    const currentVal = currentValue || '';
    
    // Si está borrando (valor nuevo es más corto), permitir borrado libre
    if (newValue.length < currentVal.length) {
      fieldOnChange(newValue);
      return;
    }
    
    // Extraer solo números del input
    const numbers = newValue.replace(/\D/g, '');
    
    // Formatear automáticamente mientras escribe
    let formatted = numbers;
    if (numbers.length >= 3) {
      formatted = numbers.slice(0, 2) + '/' + numbers.slice(2);
    }
    if (numbers.length >= 5) {
      formatted = numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4, 8);
    }
    
    fieldOnChange(formatted);
  };

  // Función simple para formatear al salir (en caso de que quede mal formateado)
  const formatDateOnBlur = (fieldOnChange: any, currentValue: string) => () => {
    if (!currentValue) return;
    
    const numbers = currentValue.replace(/\D/g, '');
    if (numbers.length === 0) {
      fieldOnChange('');
      return;
    }
    
    let formatted = numbers;
    if (numbers.length >= 3) {
      formatted = numbers.slice(0, 2) + '/' + numbers.slice(2);
    }
    if (numbers.length >= 5) {
      formatted = numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4, 8);
    }
    
    fieldOnChange(formatted);
  };
  
  return (
    <section id="simple-form" className="bg-white p-6">
      <h2 className="important section-title">Registro de candidato</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Campo 1 - Fuente */}
          <FormField
            control={control}
            name="source"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Fuente</FormLabel>
                <FormControl>
                  <SearchableSelect
                    options={agencySources}
                    placeholder="Seleccionar"
                    searchPlaceholder="Buscar fuente..."
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    className={`form-control ${fieldState.error ? 'error' : ''}`}
                    tabIndex={1}
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
              <FormItem className="form-item">
                <FormLabel className="body-text required">Puesto</FormLabel>
                <FormControl>
                  <SearchableSelect
                    options={positions.map(position => ({ value: position, label: position }))}
                    placeholder="Seleccionar"
                    searchPlaceholder="Buscar puesto..."
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    className={`form-control ${fieldState.error ? 'error' : ''}`}
                    tabIndex={2}
                  />
                </FormControl>
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
                <FormControl>
                  <SearchableSelect
                    options={locations.map(location => ({ value: location, label: location }))}
                    placeholder="Seleccionar"
                    searchPlaceholder="Buscar ubicación..."
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    className={`form-control ${fieldState.error ? 'error' : ''}`}
                    tabIndex={3}
                  />
                </FormControl>
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
                    onBlur={createCleanSpacesHandler("firstName")}
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
                    onBlur={createCleanSpacesHandler("secondLastName")}
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
                    autoLowercase={true}
                    onBlur={createCleanSpacesHandler("email")}
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
            name="state"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Estado de residencia</FormLabel>
                <FormControl>
                  <SearchableSelect
                    options={mexicanStates.map(state => ({ value: state, label: state }))}
                    placeholder="Seleccionar"
                    searchPlaceholder="Buscar estado..."
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    className={`form-control ${fieldState.error ? 'error' : ''}`}
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
                    autoCleanSpaces={true}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          {/* Campo 17 - Columna izquierda */}
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
                    tabIndex={17}
                    autoCleanSpaces={true}
                  />
                </FormControl>
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
                <FormLabel className="body-text required">Último empleador o compañía en la que trabajó</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder="Compañía donde trabajó anteriormente"
                    className="form-control"
                    tabIndex={21}
                    autoCleanSpaces={true}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          
          {/* Campo - Fecha de inicio de experiencia previa (izquierda) */}
          <FormField
            control={control}
            name="previousJobStartDate"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Fecha de inicio de experiencia previa</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    type="text"
                    placeholder={isBirthDateValidForWork() ? "dd/mm/aaaa" : "Primero ingrese fecha de nacimiento"}
                    className={`form-control ${fieldState.error ? 'error' : ''}`}
                    tabIndex={23}
                    maxLength={10}
                    disabled={!isBirthDateValidForWork()}
                    onChange={handleDateInput(field.onChange, field.value)}
                    onBlur={formatDateOnBlur(field.onChange, field.value)}
                    onKeyDown={(e) => {
                      // Allow: backspace, delete, tab, escape, enter
                      if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
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
                    }}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          {/* Campo - Motivación al elegir trabajo (izquierda) */}
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
          
          {/* Campo - CURP (izquierda) */}
          <FormField
            control={control}
            name="jobsLast24Months"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Cantidad de trabajos en los últimos 24 meses</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={27}>
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

          {/* Campo 3 - Ubicación */}
          <FormField
            control={control}
            name="location"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Ubicación</FormLabel>
                <FormControl>
                  <SearchableSelect
                    options={locations.map(location => ({ value: location, label: location }))}
                    placeholder="Seleccionar"
                    searchPlaceholder="Buscar ubicación..."
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    className={`form-control ${fieldState.error ? 'error' : ''}`}
                    tabIndex={3}
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
              <FormItem className="form-item">
                <FormLabel className="body-text required">PMX</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    autoUppercase={true}
                    placeholder="PMX12345678"
                    className="form-control"
                    tabIndex={4}
                    maxLength={11}
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
                    onBlur={createCleanSpacesHandler("firstLastName")}
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
                    type="text"
                    placeholder="dd/mm/aaaa"
                    className="form-control"
                    tabIndex={8}
                    maxLength={10}
                    onChange={handleDateInput(field.onChange, field.value)}
                    onBlur={formatDateOnBlur(field.onChange, field.value)}
                    onKeyDown={(e) => {
                      // Allow: backspace, delete, tab, escape, enter
                      if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
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
                    }}
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
                    maxLength={10}
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
                <FormControl>
                  <SearchableSelect
                    options={nationalities.map(nationality => ({ value: nationality, label: nationality }))}
                    placeholder="Seleccionar"
                    searchPlaceholder="Buscar nacionalidad..."
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    className={`form-control ${fieldState.error ? 'error' : ''}`}
                    tabIndex={12}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          {/* Campo 14 - Columna derecha */}
          <FormField
            control={control}
            name="municipality"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Municipio</FormLabel>
                <FormControl>
                  <SearchableSelect
                    options={selectedState ? getMunicipalitiesForState(selectedState).map(municipality => ({ value: municipality, label: municipality })) : []}
                    placeholder={selectedState ? "Seleccionar" : "Seleccione primero un estado"}
                    searchPlaceholder="Buscar municipio..."
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    className={`form-control ${fieldState.error ? 'error' : ''}`}
                    tabIndex={14}
                    disabled={!selectedState}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          {/* Campo 16 - Columna derecha */}
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
                    maxLength={5}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          
          {/* Campo 18 - Columna derecha */}
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
                    tabIndex={18}
                    autoCleanSpaces={true}
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
                    autoCleanSpaces={true}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />
          
          {/* Campo - ¿Tiene experiencia en retail? */}
          <FormField
            control={control}
            name="previousJobEndDate"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">Fecha de fin de experiencia previa</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    type="text"
                    placeholder={isBirthDateValidForWork() ? "dd/mm/aaaa" : "Primero ingrese fecha de nacimiento"}
                    className={`form-control ${fieldState.error ? 'error' : ''}`}
                    tabIndex={24}
                    maxLength={10}
                    disabled={!isBirthDateValidForWork()}
                    onChange={handleDateInput(field.onChange, field.value)}
                    onBlur={formatDateOnBlur(field.onChange, field.value)}
                    onKeyDown={(e) => {
                      // Allow: backspace, delete, tab, escape, enter
                      if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
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
                    }}
                  />
                </FormControl>
                <FormMessage className="error-message" />
              </FormItem>
            )}
          />

          {/* Campo - Fecha de fin de experiencia previa */}
          <FormField
            control={control}
            name="retailExperience"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">¿Tiene experiencia en retail?</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className={`form-control ${fieldState.error ? 'error' : ''}`} tabIndex={26}>
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
          
          {/* Campo - CURP */}
          <FormField
            control={control}
            name="curp"
            render={({ field, fieldState }) => (
              <FormItem className="form-item">
                <FormLabel className="body-text required">CURP</FormLabel>
                <FormControl>
                  <CustomInput
                    {...field}
                    placeholder={isCURPEnabled() ? "18 caracteres" : "Complete fecha de nacimiento y nacionalidad primero"}
                    className={`form-control ${fieldState.error ? 'error' : ''}`}
                    autoUppercase={true}
                    tabIndex={28}
                    disabled={!isCURPEnabled()}
                    maxLength={18}
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