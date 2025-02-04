"use server";
import { verifySession } from "@/lib/session";
import { skills, subSkills, tracks, users_skills, users_tracks } from "@/src/db/schema";
import { difficulty, QueryResult, Track } from "@/types/Tracks";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { complex } from "motion/react";
import { NextResponse } from "next/server";

const db = drizzle(process.env.DATABASE_URL!);



export const getUserTracksData = async (): Promise<Track[]> => {
  const session = await verifySession();
  if (session == null) {
    NextResponse.redirect("/login");
    throw new Error("token not avaliable")
  }

  const userId: number = session?.userId as number;
  const results: QueryResult[] = await db
    .select({
      trackId: tracks.id,
      trackName: tracks.trackName,
      difficulty: tracks.difficulty,
      visibility: tracks.visibility,
      dueDate: users_tracks.dueDate,
      createdBy: tracks.createdBy,
      skillId: skills.id,
      skillName: skills.skillName,
      completed: users_tracks.completed,
      skillDifficulty: skills.difficulty,
      subSkillName: subSkills.subSkillName,
      SkillCompleted: users_skills.completed
    })
    .from(users_tracks)
    .leftJoin(tracks, eq(users_tracks.trackId, tracks.id))
    .leftJoin(skills, eq(skills.trackId, users_tracks.trackId))
    .leftJoin(subSkills, eq(subSkills.parentSkill, skills.id))
    .leftJoin(users_skills, and(eq(users_skills.userId, userId), eq(users_skills.skillsId, skills.id)))
    .where(eq(users_tracks.userId, userId))
    .orderBy(users_tracks.dueDate) as QueryResult[];

  const formattedResults = results.reduce<Track[]>((acc, row) => {
    let track = acc.find(t => t.trackId === row.trackId);

    if (!track) {
      track = {
        trackId: row.trackId,
        trackName: row.trackName,
        difficulty: row.difficulty,
        visibility: row.visibility,
        completed: row.completed,
        dueDate: row.dueDate,
        createdBy: row.createdBy,
        skills: []
      };
      acc.push(track);
    }

    let skill = track.skills.find(s => s.skillId === row.skillId);

    if (!skill) {
      skill = {
        skillId: row.skillId as number,
        completed: row.SkillCompleted as boolean,
        skillName: row.skillName as string,
        difficulty: row.skillDifficulty as difficulty,
        subSkills: []
      };
      track.skills.push(skill);
    }

    if (row.subSkillName && row.subSkillName != null) {
      skill.subSkills.push(row.subSkillName);
    }

    return acc;
  }, []);

  return formattedResults;
};
