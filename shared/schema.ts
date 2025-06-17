import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define candidate schema
export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  
  // Campos del formulario actual
  source: text("source").notNull(),
  position: text("position").notNull(),
  location: text("location").notNull(),
  pmx: text("pmx").notNull(),
  firstName: text("first_name").notNull(),
  firstLastName: text("first_last_name").notNull(),
  secondLastName: text("second_last_name").notNull(),
  birthDate: text("birth_date").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  gender: text("gender").notNull(),

  streetAndNumber: text("street_and_number").notNull(),
  interiorNumber: text("interior_number"),
  neighborhood: text("neighborhood").notNull(),
  state: text("state").notNull(),
  municipality: text("municipality").notNull(),
  postalCode: text("postal_code").notNull(),
  education: text("education").notNull(),

  previousCompany: text("previous_company").notNull(),
  previousPosition: text("previous_position").notNull(),
  previousTasks: text("previous_tasks").notNull(),
  retailExperience: text("retail_experience").notNull(),
  motivation: text("motivation").notNull(),
  curp: text("curp").notNull(),
  hasDisability: text("has_disability").notNull()
});

// Create insert schemas
export const insertCandidateSchema = createInsertSchema(candidates).omit({
  id: true
});

// Types
export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Candidate = typeof candidates.$inferSelect;
