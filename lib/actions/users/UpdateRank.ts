"use server";

import { verifySession } from "@/lib/session";
import { tracks, users, users_tracks } from "@/src/db/schema";
import { difficulty } from "@/types/Tracks";
import { rank } from "@/types/userstype";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { NextResponse } from "next/server";

const db = drizzle(process.env.DATABASE_URL!);

interface queryResult {
  Rank: rank,
  trackId: number,
  trackName: string,
  difficulty: difficulty,
}

interface Formatted {
  Rank: rank,
  track: {
    trackId: number,
    trackName: string,
    difficulty: difficulty,
  }[]
}

function NextRank(tracksCount: number, currentRank: rank): rank {
  if (tracksCount >= 10 && currentRank == rank.Transcendent) {
    return rank.Transcendent
  }
  if (tracksCount >= 5 && currentRank == rank.Awakened) {
    return rank.Ascended
  }
  if (tracksCount >= 1) {
    return rank.Awakened
  }
  return currentRank
}

const UpdateRank = async () => {
  const session = await verifySession();
  if (!session?.userId) {
    return NextResponse.redirect("/login");
  }
  const userId: number = session.userId as number

  const result: queryResult[] = await db.select({
    Rank: users.rank,
    trackId: tracks.id,
    trackName: tracks.trackName,
    difficulty: tracks.difficulty,
  })
    .from(users_tracks)
    .innerJoin(users, eq(users_tracks.userId, users.id))
    .innerJoin(tracks, eq(users_tracks.trackId, tracks.id))
    .where(and(eq(users_tracks.completed, true), eq(tracks.difficulty, "hard"), eq(users_tracks.userId, userId))) as queryResult[]


  if (!result.length) {
    console.log("No sufficient Hard tracks found");
    return null;
  };

  const formattedResult = result.reduce((acc: Formatted, row) => {

    const existingTrack = acc.track.find(track => track.trackId == row.trackId)
    if (!existingTrack) {
      acc.track.push({
        trackId: row.trackId,
        trackName: row.trackName,
        difficulty: row.difficulty,
      })
    }

    acc.Rank = row.Rank;
    return acc;

  }, {
    Rank: rank.Dormant,
    track: []
  })

  console.log(formattedResult.track.length)
  const newRank: rank = NextRank(formattedResult.track.length, formattedResult.Rank)

  if (newRank === formattedResult.Rank) return null;

  console.log(newRank);

  await db.update(users).set({ rank: newRank }).where(eq(users.id, userId));


  return newRank;
}

export default UpdateRank;
