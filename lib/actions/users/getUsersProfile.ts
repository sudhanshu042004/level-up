"use server";

import { verifySession } from "@/lib/session";
import { users } from "@/src/db/schema";
import { User, UserHead } from "@/types/userstype";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { NextResponse } from "next/server";

const db = drizzle(process.env.DATABASE_URL!);

export async function getUserHeadData() {
  const userSession = await verifySession();
  if (userSession?.userId === null) { NextResponse.redirect('/login'); return; }
  const userId = parseInt(userSession?.userId as string);

  const result: UserHead[] = await db
    .select({ username: users.username, rank: users.rank, level: users.level, exp: users.exp, avatar: users.avatar })
    .from(users)
    .where(eq(users.id, userId));
  const user: UserHead = result[0];

  return user;
}
