"use server";

import { verifySession } from "@/lib/session";
import { skills, subSkills, tracks, users } from "@/src/db/schema";
import { difficulty } from "@/types/Tracks";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { NextResponse } from "next/server";

const db = drizzle(process.env.DATABASE_URL!);

interface QueryResult {
  userId: number,
  username: string,
  level: number | null,
  exp: number | null,
  avatar: string,
  trackId: number,
  trackName: string,
  difficulty: difficulty,
  dueDate: number | null,
  skillId: number,
  skillName: string,
  skillDifficulty: difficulty,
  subSkillName: string,
}

interface PublicTrack {
  userId: number,
  username: string,
  avatar: string,
  level: number | null,
  exp: number | null,
  track: {
    trackId: number,
    trackName: string,
    difficulty: difficulty,
    dueDate: number | null,
    skills: {
      skillId: number,
      skillName: string,
      skillDifficulty: difficulty,
      subSkillName: string[],
    }[]
  }

}

const PublicTrack = async () => {
  const session = await verifySession();
  if (!session?.userId) {
    return NextResponse.redirect("/login");
  }

  const result: QueryResult[] = await db.select({
    userId: users.id,
    username: users.username,
    level: users.level,
    avatar: users.avatar,
    exp: users.exp,
    trackId: tracks.id,
    trackName: tracks.trackName,
    difficulty: tracks.difficulty,
    dueDate: tracks.dueDate,
    skillId: skills.id,
    skillName: skills.skillName,
    skillDifficulty: skills.difficulty,
    subSkillName: subSkills.subSkillName
  })
    .from(tracks)
    .leftJoin(users, eq(users.id, tracks.createdBy))
    .leftJoin(skills, eq(skills.trackId, tracks.id))
    .leftJoin(subSkills, eq(subSkills.parentSkill, skills.id))
    .where(eq(tracks.visibility, true)) as QueryResult[]

  const formattedResults = result.reduce<PublicTrack[]>((acc, row) => {
    let track = acc.find(t => t.track.trackId === row.trackId);

    if (!track) {
      track = {
        userId: row.userId,
        username: row.username,
        avatar: row.avatar,
        level: row.level,
        exp: row.exp,
        track: {
          trackId: row.trackId,
          trackName: row.trackName,
          difficulty: row.difficulty,
          dueDate: row.dueDate,
          skills: []
        }
      };
      acc.push(track);
    }
    let skill = track.track.skills.find((s) => s.skillId === row.skillId);

    if (!skill) {
      skill = {
        skillId: row.skillId,
        skillName: row.skillName,
        skillDifficulty: row.skillDifficulty,
        subSkillName: [],
      };
      track.track.skills.push(skill);
    }
    if (!skill.subSkillName.includes(row.subSkillName) && row.subSkillName !== null) {
      skill.subSkillName.push(row.subSkillName);
    }

    return acc;
  }, []);


  return formattedResults;
}

export default PublicTrack;
