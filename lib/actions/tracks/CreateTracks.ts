"use server";

import { verifySession } from "@/lib/session";
import { skills, subSkills, tracks, users_skills, users_tracks } from "@/src/db/schema";
import { difficulty, SkillType, skillZod, TrackHead, trackzod } from "@/types/Tracks";
import { drizzle } from "drizzle-orm/postgres-js";
import { NextResponse } from "next/server";

const db = drizzle(process.env.DATABASE_URL!);

const validateSkills = (skills: SkillType[]) => {
  const { success, data } = skillZod.safeParse(skills);
  if (!success) {
    throw new Error("Skill Required");
  }
  return data;
}


const difficultyMap: { [key in difficulty]: number } = {
  [difficulty.Easy]: 1,
  [difficulty.Medium]: 2,
  [difficulty.Hard]: 3,
};

//calculate date and timeline
function dateCalculations(trackData: TrackHead) {
  const date: number | null =
    trackData.dueDate &&
      trackData.dueDate.from instanceof Date &&
      trackData.dueDate.to instanceof Date
      ? trackData.dueDate.to.getTime() - trackData.dueDate.from.getTime()
      : null;

  let dueDate;
  if (date !== null) {
    const referenceDate = new Date();
    dueDate = (new Date(referenceDate.getTime() + date)).toISOString().replace('T', ' ').split('.')[0];
  } else {
    dueDate = null;
  }

  return {
    date: date,
    dueDate: dueDate
  }
}

export const createTrack = async (trackData: TrackHead) => {
  const session = await verifySession();

  if (!session?.userId) {
    NextResponse.redirect('/login')
    throw new Error("session not avalaible");
  }
  const userId: number = session.userId as number;

  const skillsData = validateSkills(trackData.skills);

  const { success, data } = trackzod.safeParse(trackData);
  if (!success) {
    throw new Error("Invalid input")
  }

  const totalDiff = skillsData.reduce((sum, skill) => sum + difficultyMap[skill.difficulty], 0);
  const avgDiff = Math.round(totalDiff / skillsData.length);

  const avgLevel: difficulty = Object.keys(difficultyMap).find(
    (key) => difficultyMap[key as difficulty] === avgDiff
  ) as difficulty;


  try {
    const { date, dueDate } = dateCalculations(trackData);

    await db.transaction(async (tx) => {

      const newTrack: typeof tracks.$inferInsert = {
        trackName: data.trackName,
        visibility: data.visibility,
        dueDate: date,
        difficulty: avgLevel,
        createdBy: userId
      }

      const result = await tx.insert(tracks).values(newTrack).returning({ id: tracks.id })
      const trackId: number = result[0].id as number

      for (const skill of skillsData) {

        const newSkill: typeof skills.$inferInsert = {
          skillName: skill.skillName,
          difficulty: skill.difficulty,
          trackId: trackId,
        }
        const result = await tx.insert(skills).values(newSkill).returning({ id: skills.id });
        const skillId: number = result[0].id as number;

        for (const subSkill of skill.subSkills) {

          const newSubSkill: typeof subSkills.$inferInsert = {
            subSkillName: subSkill,
            parentSkill: skillId,
          }
          await tx.insert(subSkills).values(newSubSkill);
        }

        const newUserSkills: typeof users_skills.$inferInsert = {
          skillsId: skillId,
          userId: userId,
          completed: false,
        }
        await tx.insert(users_skills).values(newUserSkills);
      }

      const newUserTrack: typeof users_tracks.$inferInsert = {
        userId: userId,
        trackId: trackId,
        completed: false,
        dueDate: dueDate,
      }
      await tx.insert(users_tracks).values(newUserTrack);

    })

    console.log("track created")
    return "Track Successfully created"
  } catch (e) {
    console.log(e);
    throw new Error("Something went Wrong");
  }

}
