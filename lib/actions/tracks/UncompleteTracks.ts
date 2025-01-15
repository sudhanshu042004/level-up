"use server";
import { verifySession } from "@/lib/session";
import { tracks, users_tracks } from "@/src/db/schema";
import { UncompleteTrack } from "@/types/Tracks";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { NextResponse } from "next/server";

const db = drizzle(process.env.DATABASE_URL!);


export const getUncompleteTracks = async () => {
  const session = await verifySession();
  if (session == null) {
    NextResponse.redirect("/login")
  };
  const userId: number = session?.userId as number;

  const results: UncompleteTrack[] = await db
    .select({ id: users_tracks.trackId, trackName: tracks.trackName, difficulty: tracks.difficulty, visibility: tracks.visibility, dueDate: users_tracks.dueDate, createdBy: tracks.createdBy })
    .from(users_tracks)
    .leftJoin(tracks, eq(users_tracks.trackId, tracks.id))
    .where(and(eq(users_tracks.completed, false), eq(users_tracks.userId, userId)))
    .orderBy(users_tracks.dueDate);

  return results;
}

