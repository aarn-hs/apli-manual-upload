import { z } from "zod";
import { validatePMX, validateName, validatePhone, validatePostalCode, validateAddress, validateBirthDate, validateCURP } from "./validation";

// Esquema simplificado del candidato según los campos obligatorios
export const simplifiedCandidateSchema = z.object({
  // Fuente (Obligatorio)
  source: z.string({ required_error: "Seleccione una fuente" }),
  
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
    .refine(validateBirthDate, "La persona debe ser mayor de edad y haber nacido después de 1945"),
  
  email: z.string({ required_error: "Ingrese el correo electrónico" })
    .email("Formato de correo electrónico inválido"),
  
  phone: z.string({ required_error: "Ingrese el número de teléfono" })
    .refine(validatePhone, "El número debe tener exactamente 10 dígitos"),
  
  gender: z.string({ required_error: "Seleccione el género" }),
  
  nationality: z.string({ required_error: "Seleccione la nacionalidad" }),
  
  // Información de dirección (Obligatorio)
  streetAndNumber: z.string({ required_error: "Ingrese la calle y número" })
    .refine(validateAddress, "La dirección debe tener al menos 2 caracteres"),
  
  interiorNumber: z.string().optional(),
  
  neighborhood: z.string({ required_error: "Ingrese la colonia" })
    .refine(validateAddress, "La colonia debe tener al menos 2 caracteres"),
  
  state: z.string({ required_error: "Seleccione el estado" }),
  
  municipality: z.string({ required_error: "Seleccione el municipio" }),
  
  postalCode: z.string({ required_error: "Ingrese el código postal" })
    .refine(validatePostalCode, "El código postal debe tener exactamente 5 dígitos"),
  
  // Información laboral y educativa (Obligatorio)
  education: z.string({ required_error: "Seleccione el nivel de escolaridad" }),
  
  maritalStatus: z.string({ required_error: "Seleccione el estado civil" }),
  
  previousCompany: z.string({ required_error: "Ingrese la compañía de experiencia previa" }),
  
  previousPosition: z.string({ required_error: "Ingrese el puesto de experiencia previa" }),
  
  previousTasks: z.string({ required_error: "Describa las tareas de experiencia previa" }),
  
  retailExperience: z.string({ required_error: "Indique si tiene experiencia en retail" }),
  
  motivation: z.string({ required_error: "Seleccione la motivación" }),
  
  // Información legal (Obligatorio)
  curp: z.string({ required_error: "Ingrese el CURP" })
    .refine(validateCURP, "CURP inválido, debe tener 18 caracteres en formato válido")
});