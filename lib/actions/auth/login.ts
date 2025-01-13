"use server";

import { createSession } from "@/lib/session";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { loginSchema } from "@/types/userstype";

const db = drizzle(process.env.DATABASE_URL!);


export async function authenticateAccount(loginData: unknown) {

  const parsed = loginSchema.safeParse(loginData);
  if (!parsed.success) {
    throw new Error("Invalid input");
  }
  const { identifier, password, rememberMe } = parsed.data;
  const isEmail = z.string().email().safeParse(identifier);
  const queryField = isEmail.success ? users.email : users.username;

  const existingUser = await db.select().from(users).where(eq(queryField, identifier));

  if (existingUser.length === 0) {
    throw new Error("email or username doesn't exist");
  }

  const user = existingUser[0];

  const isPasswordCorrect = bcrypt.compareSync(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error("Invalid password");
  }
  if (rememberMe)
    await createSession(user.id);

  return "Successfully logged in";
}
