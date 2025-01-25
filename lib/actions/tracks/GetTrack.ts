"use server";

import { verifySession } from "@/lib/session";
import { skills, subSkills, tracks, users_skills, users_tracks } from "@/src/db/schema";
import { difficulty, Track } from "@/types/Tracks";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { NextResponse } from "next/server";

const db = drizzle(process.env.DATABASE_URL!);

interface QueryResult {
  trackId: number,
  trackName: string,
  difficulty: difficulty,
  visibility: boolean,
  dueDate: string,
  createdBy: number,
  skillId: number,
  skillName: string,
  skillDifficulty: difficulty,
  subSkillName: string
}

const GetTrack = async (trackId: number) => {
  const session = await verifySession();
  if (!session?.userId) {
    return NextResponse.redirect("/login");
  }

  const userId: number = session.userId as number;

  try {
    const result: QueryResult[] = await db.select({
      trackId: users_tracks.trackId,
      trackName: tracks.trackName,
      difficulty: tracks.difficulty,
      visibility: tracks.visibility,
      dueDate: users_tracks.dueDate,
      createdBy: tracks.createdBy,
      skillId: skills.id,
      skillName: skills.skillName,
      skillDifficulty: skills.difficulty,
      subSkillName: subSkills.subSkillName,
    })
      .from(users_tracks)
      .leftJoin(tracks, eq(tracks.id, users_tracks.trackId))
      .leftJoin(skills, eq(skills.trackId, tracks.id))
      .leftJoin(subSkills, eq(subSkills.parentSkill, skills.id))
      .where(and(eq(users_tracks.trackId, trackId), eq(users_tracks.userId, userId))) as QueryResult[]

    const singleTrack: Track = result.reduce((acc: Track, row) => {
      if (!acc.trackId) {
        acc.trackId = row.trackId;
        acc.trackName = row.trackName;
        acc.visibility = row.visibility;
        acc.createdBy = row.createdBy;
        acc.difficulty = row.difficulty;
        acc.dueDate = row.dueDate;
        acc.skills = [];
      }

      let existingSkill = acc.skills.find(skill => skill.skillId === row.skillId);
      if (!existingSkill) {
        existingSkill = {
          skillId: row.skillId,
          skillName: row.skillName,
          completed: false,
          difficulty: row.skillDifficulty,
          subSkills: [],
        };
        acc.skills.push(existingSkill);
      }

      const existingSubSkill = existingSkill.subSkills.find(subSkill => subSkill === row.subSkillName);
      if (!existingSubSkill) {
        existingSkill.subSkills.push(row.subSkillName);
      }

      return acc;
    }, {} as Track);
    return singleTrack
  } catch (e) {
    console.error(e);
    return null;
  }

}
export default GetTrack;
