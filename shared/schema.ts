import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const earlyAccessSignups = pgTable("early_access_signups", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  interests: text("interests").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertEarlyAccessSchema = createInsertSchema(earlyAccessSignups).pick({
  email: true,
  phone: true,
  interests: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertEarlyAccess = z.infer<typeof insertEarlyAccessSchema>;
export type EarlyAccessSignup = typeof earlyAccessSignups.$inferSelect;
