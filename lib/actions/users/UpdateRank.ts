"use server";

import { tracks, users, users_tracks } from "@/src/db/schema";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";

const db = drizzle(process.env.DATABASE_URL!);

export const UpdateRank = async (trackId: number, userId: number) => {

  const userRankData = await db.select()
    .from(users_tracks)
    .innerJoin(users, eq(users_tracks.userId, users.id))
    .innerJoin(tracks, eq(users_tracks.trackId, tracks.id))
    .where(and(eq(users_tracks.userId, userId), eq(users_tracks.completed, true), eq(tracks.difficulty, "hard")))

  console.log(userRankData);

  return;
}
