import { z } from "zod"

export const userSignupZod = z.object({
  name: z.string(),
  password: z.string().min(8),
  username: z.string(),
  email: z.string().email(),
})

export type userSignup = z.infer<typeof userSignupZod>

export const loginSchema = z.object({
  identifier: z.string(),
  password: z.string().min(8),
  rememberMe: z.boolean().optional(),
});

type Identifier = {
  email?: string,
  username?: string,
}
export type userLogin = z.infer<typeof loginSchema>

// export type rank = "Dormant" | "Awakened" | "Ascended" | "Transcendent"

export enum rank {
  Dormant = "Dormant",
  Awakened = "Awakened",
  Ascended = "Ascended",
  Transcendent = "Transcendent"

}

export type User = {
  id: number,
  name: string,
  username: string,
  rank: rank | null,
  level: number | null,
  exp: number | null,
  password: string,
  email: string,
  createdAt: Date
}

export type UserHead = {
  username: string,
  rank: rank | null,
  level: number | null,
  exp: number | null,
  avatar: string,
  name: string,
  email: string,
}
