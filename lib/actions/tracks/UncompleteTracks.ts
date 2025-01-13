"use server";
import { verifySession } from "@/lib/session";
import { tracks, users, users_tracks } from "@/src/db/schema";
import { TrackType } from "@/types/Tracks";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { NextResponse } from "next/server";

const db = drizzle(process.env.DATABASE_URL!);


export const getUncompleteTracks = async () => {
  const session = await verifySession();
  if (session == null) NextResponse.redirect("/login");

  const results = await db
    .select({ id: users_tracks.trackId, trackName: tracks.trackName, difficulty: tracks.difficulty, visibility: tracks.visibility, dueDate: tracks.dueDate, createdBy: tracks.createdBy })
    .from(users_tracks)
    .leftJoin(tracks, eq(users_tracks.trackId, tracks.id))
    .leftJoin(users, eq(users_tracks.userId, users.id))
    .where(and(eq(users_tracks.completed, false), eq(users_tracks.userId, session?.userId as number)))
    .orderBy(tracks.dueDate);
  // .where(eq(users_tracks.completed, false))
  // .all();

  console.log(results);
  return results;
}
