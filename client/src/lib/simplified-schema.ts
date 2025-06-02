import { z } from "zod";
import { validatePMX, validateName, validatePhone, validatePostalCode, validateAddress, validateBirthDate, validateCURPWithBirthDate, validatePastDate, validateDateWithDetails, validateBirthDateWithDetails } from "./validation";

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
    .min(2, "Nombre demasiado corto")
    .refine(validateName, "No se permiten caracteres especiales"),
  
  firstLastName: z.string({ required_error: "Ingrese el apellido paterno" })
    .min(2, "Apellido demasiado corto")
    .refine(validateName, "No se permiten caracteres especiales"),
  
  secondLastName: z.string().optional()
    .refine(val => !val || validateName(val), "No se permiten caracteres especiales"),
  
  birthDate: z.string({ required_error: "Ingrese la fecha de nacimiento" })
    .refine((date) => {
      const validation = validateBirthDateWithDetails(date);
      return validation.isValid;
    }, (date) => {
      const validation = validateBirthDateWithDetails(date);
      return { message: validation.error || "Fecha de nacimiento inválida" };
    }),
  
  email: z.string({ required_error: "Ingrese el correo electrónico" })
    .email("Formato de correo electrónico inválido"),
  
  phone: z.string({ required_error: "Ingrese el número de teléfono" })
    .refine(validatePhone, "El número debe tener exactamente 10 dígitos"),
  
  gender: z.string({ required_error: "Debes seleccionar una opción" }),
  
  nationality: z.string({ required_error: "Debes seleccionar una opción" }),
  
  // Información de dirección (Obligatorio)
  streetAndNumber: z.string({ required_error: "Ingrese la calle y número" })
    .refine(validateAddress, "La dirección debe tener al menos 2 caracteres"),
  
  interiorNumber: z.string().optional(),
  
  neighborhood: z.string({ required_error: "Ingrese la colonia" })
    .refine(validateAddress, "La colonia debe tener al menos 2 caracteres"),
  
  state: z.string({ required_error: "Debes seleccionar una opción" }),
  
  municipality: z.string({ required_error: "Debes seleccionar una opción" }),
  
  postalCode: z.string({ required_error: "Ingrese el código postal" })
    .refine(validatePostalCode, "El código postal debe tener exactamente 5 dígitos"),
  
  // Información laboral y educativa (Obligatorio)
  education: z.string({ required_error: "Debes seleccionar una opción" }),
  
  maritalStatus: z.string({ required_error: "Debes seleccionar una opción" }),
  
  previousCompany: z.string({ required_error: "Ingrese la compañía de experiencia previa" }),
  
  previousPosition: z.string({ required_error: "Ingrese el puesto de experiencia previa" }),
  

  
  retailExperience: z.string({ required_error: "Debes seleccionar una opción" }),
  
  motivation: z.string({ required_error: "Debes seleccionar una opción" }),
  
  // Información legal (Obligatorio)
  curp: z.string({ required_error: "Ingrese el CURP" }),
  
  // Información laboral adicional (Obligatorio)
  jobsLast24Months: z.string({ required_error: "Debes seleccionar una opción" }),
  previousJobStartDate: z.string({ required_error: "Ingrese la fecha de inicio" })
    .refine((date) => {
      const validation = validateDateWithDetails(date);
      return validation.isValid;
    }, (date) => {
      const validation = validateDateWithDetails(date);
      return { message: validation.error || "Fecha de inicio inválida" };
    }),
  previousJobEndDate: z.string({ required_error: "Ingrese la fecha de fin" })
    .refine((date) => {
      const validation = validateDateWithDetails(date);
      return validation.isValid;
    }, (date) => {
      const validation = validateDateWithDetails(date);
      return { message: validation.error || "Fecha de fin inválida" };
    }),
  

}).refine(
  (data) => validateCURPWithBirthDate(data.curp, data.birthDate),
  {
    message: "La fecha en el CURP no coincide con la fecha de nacimiento",
    path: ["curp"]
  }
);