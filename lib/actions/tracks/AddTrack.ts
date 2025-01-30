"use server";

import { verifySession } from "@/lib/session";
import { tracks, users_tracks } from "@/src/db/schema";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { NextResponse } from "next/server";

const db = drizzle(process.env.DATABASE_URL!);
const AddTrack = async (trackId: number) => {
  console.log("hello this is AddTrack")
  const session = await verifySession();
  if (!session?.userId) {
    NextResponse.json("/login");
    return false;
  }
  const userId: number = session.userId as number;
  const existingTrack = await db.select().from(users_tracks).where(and(eq(users_tracks.userId, userId), eq(users_tracks.trackId, trackId)));
  if (existingTrack.length != 0) {
    console.log("already have track")
    return false;
  }

  const trackData = await db.select().from(tracks).where(eq(tracks.id, trackId));
  const timeline = trackData[0].dueDate

  let dueDate = null;
  if (timeline !== null) {
    let today = new Date()
    dueDate = new Date(today.getTime() + timeline).toISOString().replace('T', ' ').split('.')[0];
  }

  const newUser_track: typeof users_tracks.$inferInsert = {
    userId: userId,
    trackId: trackId,
    completed: false,
    dueDate: dueDate
  }
  console.log(newUser_track);
  await db.insert(users_tracks).values(newUser_track).returning()
  console.log("updated users_tracks")
  return true

}
export default AddTrack;
