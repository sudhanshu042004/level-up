import { pgTable as table, pgEnum } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const rankEnum = pgEnum("rank", ["Dormant", "Awakened", "Transcendent", "Supreme"])
export const diffEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);

export const users = table("users", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar({ length: 256 }).notNull(),
  email: t.varchar({ length: 256 }).notNull().unique(),
  username: t.varchar({ length: 256 }).notNull().unique(),
  password: t.varchar({ length: 256 }).notNull(),
  rank: rankEnum().default("Dormant"),
  level: t.integer().default(0),
  exp: t.integer().default(0),
  createdAt: t.timestamp().defaultNow().notNull()
});

export const tracks = table("tracks", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  trackName: t.varchar({ length: 256 }).notNull(),
  difficulty: diffEnum().default("medium").notNull(),
  visibility: t.boolean().default(true),
  dueDate: t.date(),
  createdBy: t.integer("users").references(() => users.id).notNull(),
});

export const skills = table("skills", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  skillName: t.varchar({ length: 256 }).notNull(),
  difficulty: diffEnum().default("medium").notNull(),
  parentSkillId: t.integer("skills").references(() => skills.id),
  trackId: t.integer("tracks").references(() => tracks.id).notNull(),
}) as unknown as ReturnType<typeof table>

export const users_tracks = table("users_tracks", {
  userId: t.integer("users").references(() => users.id).notNull(),
  trackId: t.integer("tracks").references(() => tracks.id).notNull(),
  completed: t.boolean().default(false),
})

export const users_skills = table("users_skills", {
  userId: t.integer("users").references(() => users.id).notNull(),
  skillsId: t.integer("skills").references(() => skills.id).notNull(),
  completed: t.boolean().default(false),
})
