"use server";
import { users } from "@/src/db/schema";
import { userSignup, userSignupZod } from "@/types/userstype";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs"
import { drizzle } from "drizzle-orm/postgres-js";
import { createSession } from "@/lib/session";

const db = drizzle(process.env.DATABASE_URL!);

export async function createAccount(signupData: userSignup) {
  const { success, data } = userSignupZod.safeParse(signupData)
  if (!success) {
    throw new Error("Invalid input");
  }
  const existingUser = await db.select().from(users).where(eq(users.email, data.email));
  if (existingUser.length != 0) {
    throw new Error("Email already in use");
  }
  try {
    const hash = bcrypt.hashSync(data.password, 10);

    const newUser: typeof users.$inferInsert = {
      name: data.name,
      username: data.username,
      email: data.email,
      password: hash,
      level: 1,
    }
    const createdUser = await db.insert(users).values(newUser).returning({ userId: users.id });
    await createSession(createdUser[0].userId);
    return "Account successfully created";

  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
}

export async function isUsernameExists(username: string) {
  const user = await db.select().from(users).where(eq(users.username, username));
  console.log(user);
  if (user.length) return true;
  return false;
}
