import { users, earlyAccessSignups, type User, type InsertUser, type EarlyAccessSignup, type InsertEarlyAccess } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createEarlyAccessSignup(signup: InsertEarlyAccess): Promise<EarlyAccessSignup>;
  getEarlyAccessSignupByEmail(email: string): Promise<EarlyAccessSignup | undefined>;
  getAllEarlyAccessSignups(): Promise<EarlyAccessSignup[]>;
  getEarlyAccessStats(): Promise<{ totalSignups: number; recentSignups: number }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private earlyAccessSignups: Map<number, EarlyAccessSignup>;
  private emailIndex: Map<string, number>;
  currentUserId: number;
  currentSignupId: number;

  constructor() {
    this.users = new Map();
    this.earlyAccessSignups = new Map();
    this.emailIndex = new Map();
    this.currentUserId = 1;
    this.currentSignupId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createEarlyAccessSignup(insertSignup: InsertEarlyAccess): Promise<EarlyAccessSignup> {
    // Check for existing email
    if (this.emailIndex.has(insertSignup.email)) {
      throw new Error("Email already registered");
    }

    const id = this.currentSignupId++;
    const signup: EarlyAccessSignup = {
      ...insertSignup,
      id,
      createdAt: new Date(),
    };
    
    this.earlyAccessSignups.set(id, signup);
    this.emailIndex.set(insertSignup.email, id);
    return signup;
  }

  async getEarlyAccessSignupByEmail(email: string): Promise<EarlyAccessSignup | undefined> {
    const id = this.emailIndex.get(email);
    if (!id) return undefined;
    return this.earlyAccessSignups.get(id);
  }

  async getAllEarlyAccessSignups(): Promise<EarlyAccessSignup[]> {
    return Array.from(this.earlyAccessSignups.values());
  }

  async getEarlyAccessStats(): Promise<{ totalSignups: number; recentSignups: number }> {
    const allSignups = Array.from(this.earlyAccessSignups.values());
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentSignups = allSignups.filter(signup => 
      signup.createdAt >= oneDayAgo
    ).length;

    return {
      totalSignups: allSignups.length,
      recentSignups,
    };
  }
}

export const storage = new MemStorage();
