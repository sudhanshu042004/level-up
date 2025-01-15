import { DateRange } from "react-day-picker"
import { number, string, z } from "zod"

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
  skillName: string,
  difficulty: difficulty,
  subSkills: string[],
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
  skills: SkillType[],
}
export const trackzod = z.object({
  trackName: z.string(),
  visibility: z.boolean(),
  duedate: z.date().optional(),
})
