import { pgTable as table, pgEnum } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const rankEnum = pgEnum("rank", ["Dormant", "Awakened", "Ascended", "Transcendent"])
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
  avatar: t.varchar({ length: 1000 }).notNull().default("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe0VDY4CWWO8S2h_WPo2EfRNUu8xPs9HD_-g&s"),
  createdAt: t.timestamp().defaultNow().notNull()
});

export const tracks = table("tracks", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  trackName: t.varchar({ length: 256 }).notNull(),
  difficulty: diffEnum().default("medium").notNull(),
  visibility: t.boolean().default(true),
  dueDate: t.bigint({ mode: "number" }),
  createdBy: t.integer("users").references(() => users.id).notNull(),
});

export const skills = table("skills", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  skillName: t.varchar({ length: 256 }).notNull(),
  difficulty: diffEnum().default("medium").notNull(),
  trackId: t.integer("tracks").references(() => tracks.id),
})

export const subSkills = table("subSkills", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  subSkillName: t.varchar({ length: 256 }).notNull(),
  parentSkill: t.integer("skills").references(() => skills.id).notNull(),
})

export const users_tracks = table("users_tracks", {
  userId: t.integer("users").references(() => users.id).notNull(),
  trackId: t.integer("tracks").references(() => tracks.id).notNull(),
  completed: t.boolean().default(false),
  dueDate: t.date()
}, (table) => {
  return [{
    pk: t.primaryKey({ columns: [table.trackId, table.userId] }),
  }]
})

export const users_skills = table("users_skills", {
  userId: t.integer("users").references(() => users.id).notNull(),
  skillsId: t.integer("skills").references(() => skills.id).notNull(),
  completed: t.boolean().default(false),
})
