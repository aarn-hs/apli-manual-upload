import { 
  type Candidate, 
  type InsertCandidate, 
  type Dependent, 
  type InsertDependent, 
  type CandidateWithDependents 
} from "@shared/schema";

// Define the storage interface
export interface IStorage {
  // Candidate methods
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  getCandidate(id: number): Promise<Candidate | undefined>;
  getAllCandidates(): Promise<Candidate[]>;
  getCandidateWithDependents(id: number): Promise<CandidateWithDependents | undefined>;
  
  // Dependent methods
  addDependentToCandidate(candidateId: number, dependent: InsertDependent): Promise<Dependent>;
  getDependentsForCandidate(candidateId: number): Promise<Dependent[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private candidates: Map<number, Candidate>;
  private dependents: Map<number, Dependent>;
  private candidateId: number;
  private dependentId: number;

  constructor() {
    this.candidates = new Map();
    this.dependents = new Map();
    this.candidateId = 1;
    this.dependentId = 1;
  }

  // Candidate methods
  async createCandidate(candidateData: InsertCandidate): Promise<Candidate> {
    const id = this.candidateId++;
    const candidate: Candidate = {
      ...candidateData,
      id,
      createdAt: new Date().toISOString()
    };
    
    this.candidates.set(id, candidate);
    return candidate;
  }

  async getCandidate(id: number): Promise<Candidate | undefined> {
    return this.candidates.get(id);
  }

  async getAllCandidates(): Promise<Candidate[]> {
    return Array.from(this.candidates.values());
  }

  async getCandidateWithDependents(id: number): Promise<CandidateWithDependents | undefined> {
    const candidate = await this.getCandidate(id);
    
    if (!candidate) {
      return undefined;
    }
    
    const dependents = await this.getDependentsForCandidate(id);
    
    return {
      ...candidate,
      dependents
    };
  }

  // Dependent methods
  async addDependentToCandidate(candidateId: number, dependentData: InsertDependent): Promise<Dependent> {
    const candidate = await this.getCandidate(candidateId);
    
    if (!candidate) {
      throw new Error(`Candidate with id ${candidateId} not found`);
    }
    
    const id = this.dependentId++;
    const dependent: Dependent = {
      ...dependentData,
      id,
      candidateId
    };
    
    this.dependents.set(id, dependent);
    return dependent;
  }

  async getDependentsForCandidate(candidateId: number): Promise<Dependent[]> {
    return Array.from(this.dependents.values()).filter(
      (dependent) => dependent.candidateId === candidateId
    );
  }
}

// Export an instance of the storage
export const storage = new MemStorage();
