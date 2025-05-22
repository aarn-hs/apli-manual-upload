import { pgTable, text, serial, integer, boolean, date, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define dependent schema
export const dependents = pgTable("dependents", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  relation: text("relation"),
  birthDate: text("birth_date"),
  isBeneficiary: boolean("is_beneficiary").default(false),
  isStudent: boolean("is_student").default(false),
  livesWithAssociate: boolean("lives_with_associate").default(false)
});

// Define candidate schema
export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  
  // Basic Info
  source: text("source").notNull(),
  firstName: text("first_name").notNull(),
  firstLastName: text("first_last_name").notNull(),
  secondLastName: text("second_last_name"),
  birthDate: text("birth_date").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  gender: text("gender").notNull(),
  nationality: text("nationality").notNull(),
  pmx: text("pmx").notNull(),
  
  // Employment Info
  position: text("position").notNull(),
  location: text("location").notNull(),
  education: text("education").notNull(),
  retailExperience: text("retail_experience").notNull(),
  previousCompany: text("previous_company").notNull(),
  previousPosition: text("previous_position").notNull(),
  previousTasks: text("previous_tasks").notNull(),
  motivation: text("motivation").notNull(),
  
  // Personal Info
  streetAndNumber: text("street_and_number").notNull(),
  interiorNumber: text("interior_number"),
  neighborhood: text("neighborhood").notNull(),
  state: text("state").notNull(),
  municipality: text("municipality").notNull(),
  postalCode: text("postal_code").notNull(),
  curp: text("curp").notNull(),
  rfc: text("rfc").notNull(),
  nss: text("nss").notNull(),
  clabe: text("clabe"),
  fiscalPostalCode: text("fiscal_postal_code"),
  maritalStatus: text("marital_status").notNull(),
  hasDisability: text("has_disability").notNull(),
  disabilityType: text("disability_type"),
  disabilityDescription: text("disability_description"),
  
  // Contract Info
  contractStartDate: text("contract_start_date").notNull(),
  contractEndDate: text("contract_end_date"),
  
  // Emergency Contact
  emergencyContactName: text("emergency_contact_name").notNull(),
  emergencyContactRelation: text("emergency_contact_relation").notNull(),
  emergencyContactPhone: text("emergency_contact_phone").notNull(),
  
  // Metadata
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

// Create insert schemas
export const insertDependentSchema = createInsertSchema(dependents).omit({
  id: true,
  candidateId: true
});

export const insertCandidateSchema = createInsertSchema(candidates).omit({
  id: true,
  createdAt: true
});

// Types
export type InsertDependent = z.infer<typeof insertDependentSchema>;
export type Dependent = typeof dependents.$inferSelect;

export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Candidate = typeof candidates.$inferSelect;

// Full candidate type with dependents
export type CandidateWithDependents = Candidate & {
  dependents: Dependent[];
};
