import { z } from "zod";
import { validatePMX, validateName, validatePhone, validatePostalCode, validateAddress, validateBirthDate, validateCURPWithBirthDate, validateCURPComplete, validateCURPWithDetails, validatePastDate, validateDateWithDetails, validateBirthDateWithDetails, validateStreetColonyWithDetails, validateEmployerPositionWithDetails, validateNameWithDetails, validateEmailWithDetails, validateTextNotOnlySpaces, cleanAndFormatText, validateWorkStartDate, validateWorkEndDate } from "./validation";

// Esquema simplificado del candidato según los campos obligatorios
export const simplifiedCandidateSchema = z.object({
  // Fuente (Obligatorio)
  source: z.string({ required_error: "Debes seleccionar una opción" }),
  
  // Puesto (Obligatorio)
  position: z.string({ required_error: "Debes seleccionar una opción" }),
  
  // Ubicación (Obligatorio)
  location: z.string({ required_error: "Debes seleccionar una opción" }),
  
  // PMX (Obligatorio)
  pmx: z.string({ required_error: "Ingrese el PMX" })
    .refine(validatePMX, "Formato inválido. Debe ser PMX seguido de 8 dígitos"),
  
  // Información personal (Obligatorio)
  firstName: z.string({ required_error: "Ingrese el nombre" })
    .transform(cleanAndFormatText)
    .refine((name) => {
      const validation = validateEmployerPositionWithDetails(name);
      return validation.isValid;
    }, (name) => {
      const validation = validateEmployerPositionWithDetails(name);
      return { message: validation.error || "Nombre inválido" };
    }),
  
  firstLastName: z.string({ required_error: "Ingrese el apellido paterno" })
    .transform(cleanAndFormatText)
    .refine((name) => {
      const validation = validateEmployerPositionWithDetails(name);
      return validation.isValid;
    }, (name) => {
      const validation = validateEmployerPositionWithDetails(name);
      return { message: validation.error || "Apellido inválido" };
    }),
  
  secondLastName: z.string().optional()
    .transform((val) => val ? cleanAndFormatText(val) : val)
    .refine((val) => {
      if (!val || val.trim() === "") return true; // Es opcional, pero si se llena no puede ser solo espacios
      const validation = validateEmployerPositionWithDetails(val);
      return validation.isValid;
    }, (val) => {
      if (!val) return { message: "Apellido inválido" };
      const validation = validateEmployerPositionWithDetails(val);
      return { message: validation.error || "Apellido inválido" };
    }),
  
  birthDate: z.string({ required_error: "Ingrese la fecha de nacimiento" })
    .refine((date) => {
      const validation = validateBirthDateWithDetails(date);
      return validation.isValid;
    }, (date) => {
      const validation = validateBirthDateWithDetails(date);
      return { message: validation.error || "Fecha de nacimiento inválida" };
    }),
  
  email: z.string({ required_error: "Ingrese el correo electrónico" })
    .transform(cleanAndFormatText)
    .refine((email) => {
      const validation = validateEmailWithDetails(email);
      return validation.isValid;
    }, (email) => {
      const validation = validateEmailWithDetails(email);
      return { message: validation.error || "Email inválido" };
    }),
  
  phone: z.string({ required_error: "Ingrese el número de teléfono" })
    .refine(validatePhone, "El número debe tener exactamente 10 dígitos"),
  
  gender: z.string({ required_error: "Debes seleccionar una opción" }),
  
  nationality: z.string({ required_error: "Debes seleccionar una opción" }),
  
  // Información de dirección (Obligatorio)
  streetAndNumber: z.string({ required_error: "Ingrese la calle y número" })
    .refine((text) => {
      const validation = validateStreetColonyWithDetails(text);
      return validation.isValid;
    }, (text) => {
      const validation = validateStreetColonyWithDetails(text);
      return { message: validation.error || "Dirección inválida" };
    }),
  
  interiorNumber: z.string().optional()
    .transform((val) => val ? cleanAndFormatText(val) : val)
    .refine((val) => {
      if (!val) return true;
      const validation = validateTextNotOnlySpaces(val);
      return validation.isValid;
    }, (val) => {
      if (!val) return { message: "Número interior inválido" };
      const validation = validateTextNotOnlySpaces(val);
      return { message: validation.error || "Número interior inválido" };
    }),
  
  neighborhood: z.string({ required_error: "Ingrese la colonia" })
    .refine((text) => {
      const validation = validateStreetColonyWithDetails(text);
      return validation.isValid;
    }, (text) => {
      const validation = validateStreetColonyWithDetails(text);
      return { message: validation.error || "Colonia inválida" };
    }),
  
  state: z.string({ required_error: "Debes seleccionar una opción" }),
  
  municipality: z.string({ required_error: "Debes seleccionar una opción" }),
  
  postalCode: z.string({ required_error: "Ingrese el código postal" })
    .refine(validatePostalCode, "El código postal debe tener exactamente 5 dígitos"),
  
  // Información laboral y educativa (Obligatorio)
  education: z.string({ required_error: "Debes seleccionar una opción" }),
  
  maritalStatus: z.string({ required_error: "Debes seleccionar una opción" }),
  
  previousCompany: z.string({ required_error: "Ingrese la compañía de experiencia previa" })
    .refine((text) => {
      const validation = validateEmployerPositionWithDetails(text);
      return validation.isValid;
    }, (text) => {
      const validation = validateEmployerPositionWithDetails(text);
      return { message: validation.error || "Compañía inválida" };
    }),
  
  previousPosition: z.string({ required_error: "Ingrese el puesto de experiencia previa" })
    .refine((text) => {
      const validation = validateEmployerPositionWithDetails(text);
      return validation.isValid;
    }, (text) => {
      const validation = validateEmployerPositionWithDetails(text);
      return { message: validation.error || "Puesto inválido" };
    }),
  

  
  retailExperience: z.string({ required_error: "Debes seleccionar una opción" }),
  
  motivation: z.string({ required_error: "Debes seleccionar una opción" }),
  
  // Información legal (Obligatorio)
  curp: z.string({ required_error: "Ingrese el CURP" })
    .refine((curp) => {
      const validation = validateCURPWithDetails(curp);
      return validation.isValid;
    }, (curp) => {
      const validation = validateCURPWithDetails(curp);
      return { message: validation.error || "CURP inválido" };
    }),
  
  // Información laboral adicional (Obligatorio)
  jobsLast24Months: z.string({ required_error: "Debes seleccionar una opción" }),
  previousJobStartDate: z.string({ required_error: "Ingrese la fecha de inicio" }),
  previousJobEndDate: z.string({ required_error: "Ingrese la fecha de fin" }),
  

}).refine(
  (data) => {
    const validation = validateCURPWithDetails(data.curp, data.birthDate, data.nationality);
    return validation.isValid;
  },
  (data) => {
    const validation = validateCURPWithDetails(data.curp, data.birthDate, data.nationality);
    return {
      message: validation.error || "El CURP no es válido",
      path: ["curp"]
    };
  }
).refine(
  (data) => {
    const validation = validateWorkStartDate(data.previousJobStartDate, data.birthDate);
    return validation.isValid;
  },
  (data) => {
    const validation = validateWorkStartDate(data.previousJobStartDate, data.birthDate);
    return {
      message: validation.error || "Fecha de inicio de trabajo inválida",
      path: ["previousJobStartDate"]
    };
  }
).refine(
  (data) => {
    const validation = validateWorkEndDate(data.previousJobEndDate, data.previousJobStartDate, data.birthDate);
    return validation.isValid;
  },
  (data) => {
    const validation = validateWorkEndDate(data.previousJobEndDate, data.previousJobStartDate, data.birthDate);
    return {
      message: validation.error || "Fecha de fin de trabajo inválida",
      path: ["previousJobEndDate"]
    };
  }
);