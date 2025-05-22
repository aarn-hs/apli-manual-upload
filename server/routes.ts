import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCandidateSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.post("/api/candidates", async (req, res) => {
    try {
      // Validate request body
      const validatedData = await insertCandidateSchema
        .extend({
          dependents: z.array(
            z.object({
              firstName: z.string().optional(),
              lastName: z.string().optional(),
              relation: z.string().optional(),
              birthDate: z.string().optional(),
              isBeneficiary: z.boolean().default(false),
              isStudent: z.boolean().default(false),
              livesWithAssociate: z.boolean().default(false)
            })
          ).optional()
        })
        .parseAsync(req.body);
      
      // Extract dependents from validated data
      const { dependents, ...candidateData } = validatedData;
      
      // Store candidate
      const candidate = await storage.createCandidate(candidateData);
      
      // Store dependents if any
      if (dependents && dependents.length > 0) {
        for (const dependent of dependents) {
          if (dependent.firstName || dependent.lastName) {
            await storage.addDependentToCandidate(candidate.id, dependent);
          }
        }
      }
      
      // Get candidate with dependents
      const candidateWithDependents = await storage.getCandidateWithDependents(candidate.id);
      
      res.status(201).json({
        message: "Candidato registrado correctamente",
        data: candidateWithDependents
      });
    } catch (error) {
      console.error("Error creating candidate:", error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Error de validación",
          errors: error.errors
        });
      } else {
        res.status(500).json({
          message: "Error al registrar el candidato"
        });
      }
    }
  });
  
  app.get("/api/candidates", async (req, res) => {
    try {
      const candidates = await storage.getAllCandidates();
      res.json(candidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      res.status(500).json({
        message: "Error al obtener los candidatos"
      });
    }
  });
  
  app.get("/api/candidates/:id", async (req, res) => {
    try {
      const candidateId = parseInt(req.params.id);
      const candidate = await storage.getCandidateWithDependents(candidateId);
      
      if (!candidate) {
        return res.status(404).json({
          message: "Candidato no encontrado"
        });
      }
      
      res.json(candidate);
    } catch (error) {
      console.error("Error fetching candidate:", error);
      res.status(500).json({
        message: "Error al obtener el candidato"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
