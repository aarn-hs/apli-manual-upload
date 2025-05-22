import { z } from "zod";
import { validatePMX, validateCURP, validateRFC, validateNSS, validateCLABE, isWorkingDay } from "./validation";

export const dependentSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  relation: z.string().optional(),
  birthDate: z.string().optional(),
  isBeneficiary: z.boolean().default(false),
  isStudent: z.boolean().default(false),
  livesWithAssociate: z.boolean().default(false)
});

export const candidateSchema = z.object({
  // Basic Info
  source: z.string({ required_error: "Seleccione una fuente" }),
  firstName: z.string({ required_error: "Ingrese el nombre" })
    .min(2, "Nombre demasiado corto")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/, "No se permiten caracteres especiales"),
  firstLastName: z.string({ required_error: "Ingrese el apellido paterno" })
    .min(2, "Apellido demasiado corto")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/, "No se permiten caracteres especiales"),
  secondLastName: z.string().optional()
    .refine(val => !val || /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(val), "No se permiten caracteres especiales"),
  birthDate: z.string({ required_error: "Ingrese la fecha de nacimiento" })
    .refine(val => {
      const date = new Date(val);
      const now = new Date();
      const age = now.getFullYear() - date.getFullYear();
      return age >= 18 && date.getFullYear() >= 1945;
    }, "El candidato debe ser mayor de edad y haber nacido después de 1945"),
  email: z.string({ required_error: "Ingrese el correo electrónico" })
    .email("Formato de correo electrónico inválido"),
  phone: z.string({ required_error: "Ingrese el número de teléfono" })
    .regex(/^\d{10}$/, "El número debe tener exactamente 10 dígitos"),
  gender: z.string({ required_error: "Seleccione el género" }),
  nationality: z.string({ required_error: "Seleccione la nacionalidad" }),
  pmx: z.string({ required_error: "Ingrese el PMX" })
    .refine(validatePMX, "Formato inválido. Debe ser PMX seguido de 8 dígitos"),
  
  // Employment Info
  position: z.string({ required_error: "Seleccione el puesto" }),
  location: z.string({ required_error: "Seleccione la ubicación" }),
  education: z.string({ required_error: "Seleccione el nivel de escolaridad" }),
  retailExperience: z.string({ required_error: "Indique si tiene experiencia en retail" }),
  previousCompany: z.string({ required_error: "Ingrese la compañía de experiencia previa" }),
  previousPosition: z.string({ required_error: "Ingrese el puesto de experiencia previa" }),
  previousTasks: z.string({ required_error: "Describa las tareas de experiencia previa" }),
  motivation: z.string({ required_error: "Seleccione la motivación" }),
  
  // Personal Info
  streetAndNumber: z.string({ required_error: "Ingrese la calle y número" })
    .min(5, "La dirección debe tener al menos 5 caracteres"),
  interiorNumber: z.string().optional(),
  neighborhood: z.string({ required_error: "Ingrese la colonia" })
    .min(3, "La colonia debe tener al menos 3 caracteres"),
  state: z.string({ required_error: "Seleccione el estado" }),
  municipality: z.string({ required_error: "Seleccione el municipio" }),
  postalCode: z.string({ required_error: "Ingrese el código postal" })
    .regex(/^\d{5}$/, "El código postal debe tener exactamente 5 dígitos"),
  curp: z.string({ required_error: "Ingrese el CURP" })
    .refine(validateCURP, "CURP inválido, debe tener 18 caracteres en formato válido"),
  rfc: z.string({ required_error: "Ingrese el RFC" })
    .refine(validateRFC, "RFC inválido, debe tener 13 caracteres en formato válido"),
  nss: z.string({ required_error: "Ingrese el NSS" })
    .refine(validateNSS, "NSS inválido, debe tener 10-11 dígitos"),
  clabe: z.string().optional()
    .refine(val => !val || validateCLABE(val), "CLABE inválida, debe tener 18 dígitos"),
  fiscalPostalCode: z.string().optional()
    .refine(val => !val || /^\d{5}$/.test(val), "El código postal debe tener exactamente 5 dígitos"),
  maritalStatus: z.string({ required_error: "Seleccione el estado civil" }),
  hasDisability: z.string({ required_error: "Indique si tiene alguna discapacidad" }),
  disabilityType: z.string().optional()
    .refine((val, ctx) => {
      // Safely check parent context exists and hasDisability is "Sí"
      if (ctx && ctx.parent && ctx.parent.hasDisability === "Sí" && !val) {
        return false;
      }
      return true;
    }, "Seleccione el tipo de discapacidad"),
  disabilityDescription: z.string().optional()
    .refine((val, ctx) => {
      // Safely check parent context exists and hasDisability is "Sí"
      if (ctx && ctx.parent && ctx.parent.hasDisability === "Sí" && !val) {
        return false;
      }
      return true;
    }, "Ingrese una descripción de la discapacidad"),
  
  // Contract Info
  contractStartDate: z.string({ required_error: "Ingrese la fecha de inicio de contrato" })
    .refine(isWorkingDay, "La fecha debe ser un día hábil (no fin de semana ni festivo)"),
  contractEndDate: z.string().optional()
    .refine((val, ctx) => {
      if (!val) return true;
      return new Date(val) > new Date(ctx.parent.contractStartDate);
    }, "La fecha de fin debe ser posterior a la fecha de inicio"),
  
  // Emergency Contact
  emergencyContactName: z.string({ required_error: "Ingrese el nombre del contacto de emergencia" })
    .min(5, "El nombre debe tener al menos 5 caracteres"),
  emergencyContactRelation: z.string({ required_error: "Seleccione la relación con el contacto de emergencia" }),
  emergencyContactPhone: z.string({ required_error: "Ingrese el teléfono del contacto de emergencia" })
    .regex(/^\d{10}$/, "El número debe tener exactamente 10 dígitos"),
  
  // Dependents (optional)
  dependents: z.array(dependentSchema)
});
