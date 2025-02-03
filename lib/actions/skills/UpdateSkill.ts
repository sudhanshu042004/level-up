"use server";

import { verifySession } from "@/lib/session";
import { skills, users, users_skills, users_tracks } from "@/src/db/schema";
import { difficulty } from "@/types/Tracks";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import UpdateRank from "../users/UpdateRank";
import { rank } from "@/types/userstype";

const db = drizzle(process.env.DATABASE_URL!);

const skillExpCalculate = (difficulty: difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 100;
    case 'medium': return 200;
    case 'hard': return 300;
  }
}

const increasedStats = (
  maxExp: number,
  acquiredExp: number,
  level: number,
  exp: number,
  dueDateStr: null | string
) => {
  let finalExp = acquiredExp + exp;
  let finalLevel = level;

  if (dueDateStr !== null) {
    const dueDate = new Date(dueDateStr);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const decreaseNum = Math.abs(diffDays) * 100;
      finalExp -= decreaseNum;

      if (finalExp < 0) {
        finalExp = 0;
        finalLevel--;
      }
    }
  }

  while (finalExp >= maxExp) {
    finalExp -= maxExp;
    finalLevel++;
  }

  return {
    level: finalLevel,
    exp: finalExp
  };
};

const expRequired = (level: number) => {
  const exp: number = level * 200;
  return exp;
}

export const UpdateSkill = async (SkillId: number, skillDifficulty: difficulty, trackId: number, dueDate: null | string) => {
  const session = await verifySession()
  const userId: number = session?.userId as number;

  try {
    await db.update(users_skills)
      .set({ completed: true })
      .where(and(eq(users_skills.userId, userId), eq(users_skills.skillsId, SkillId)));

    const user = await db.select({ level: users.level, exp: users.exp }).from(users).where(eq(users.id, userId))
    const currentLevel = user[0].level as number;
    const currentExp = user[0].exp as number;
    const { level, exp } = increasedStats(expRequired(currentLevel), skillExpCalculate(skillDifficulty) as number, currentLevel, currentExp, dueDate);
    console.log(level)
    console.log(exp)

    await db.update(users).set({ level: level, exp: exp }).where(eq(users.id, userId))


    const leftSkill = await db.select()
      .from(users_skills)
      .innerJoin(skills, eq(skills.id, users_skills.skillsId))
      .where(and(eq(users_skills.userId, userId), eq(skills.trackId, trackId), eq(users_skills.completed, false)))

    if (leftSkill.length > 0) {
      return {
        level: level,
        exp: exp,
        trackId: null
      }
    }
    await db.update(users_tracks)
      .set({ completed: true })
      .where(and(eq(users_tracks.userId, userId), eq(users_tracks.trackId, trackId)))

    const rank: rank | null = await UpdateRank() as rank | null;

    return {
      level: level,
      exp: exp,
      trackId: trackId,
      rank: rank
    }

  } catch (e) {
    console.log(e);
    throw new Error("Something went wrong!!")
  }
}

