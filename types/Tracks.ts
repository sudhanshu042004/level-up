import { DateRange } from "react-day-picker"
import { z } from "zod"

export enum difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard"
}

export type TrackType = {
  id: number,
  trackName: string,
  difficulty: difficulty,
  visibility: boolean,
  dueDate: Date,
  createdBy: number
}

export type SkillType = {
  skillId: number,
  skillName: string,
  completed: boolean,
  difficulty: difficulty,
  subSkills: string[],
}

export type CreatingSkill = {
  skillName: string,
  difficulty: difficulty,
  subSkills: string[]
}


export const skillZod = z.object({
  skillName: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  subSkills: z.string().array(),
}).array().nonempty();

export type UncompleteTrack = {
  id: number,
  trackName: string | null,
  difficulty: "easy" | "medium" | "hard" | null,
  visibility: Boolean | null,
  dueDate: string | null,
  createdBy: number | null
}

export type TrackHead = {
  trackName: string,
  visibility: boolean,
  dueDate: DateRange | undefined,
  skills: CreatingSkill[],
}
export const trackzod = z.object({
  trackName: z.string(),
  visibility: z.boolean(),
  duedate: z.date().optional(),
})

export interface QueryResult {
  trackId: number | null;
  trackName: string | null;
  difficulty: difficulty | null;
  visibility: boolean | null;
  dueDate: string | null;
  createdBy: number | null;
  skillId: number | null;
  skillName: string | null;
  skillDifficulty: difficulty | null;
  subSkillName: string | null;
  SkillCompleted: boolean | null
}

export interface Track {
  trackId: number | null;
  trackName: string | null;
  difficulty: difficulty | null;
  visibility: boolean | null;
  dueDate: string | null;
  createdBy: number | null;
  skills: SkillType[];
}
