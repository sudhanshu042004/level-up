"use server";

import { verifySession } from "@/lib/session";
import { skills, subSkills, users_skills } from "@/src/db/schema";
import { difficulty, SkillType } from "@/types/Tracks";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { NextResponse } from "next/server";

const db = drizzle(process.env.DATABASE_URL!);

export const GetSkills = async () => {
  const user = await verifySession();

  if (!user) {
    NextResponse.redirect("/login");
    return;
  }

  const { userId } = user;

  const result = await db.select()
    .from(users_skills)
    .innerJoin(skills, eq(users_skills.skillsId, skills.id))
    .innerJoin(subSkills, eq(subSkills.parentSkill, skills.id))
    .where(and(eq(users_skills.userId, userId as number), eq(users_skills.completed, true)))

  const skillMap = new Map<Number, SkillType>();

  console.log(result);
  result.forEach(row => {
    const {
      users_skills: { skillsId },
      skills: { skillName, difficulty },
      subSkills: { subSkillName: subSkillName }
    } = row;

    if (!skillMap.has(skillsId)) {
      skillMap.set(skillsId, {
        skillId: skillsId,
        skillName: skillName,
        completed: true,
        difficulty: difficulty as difficulty,
        subSkills: [],
      });
    }
    const skill = skillMap.get(skillsId);
    if (skill && subSkillName) {
      skill.subSkills.push(subSkillName);
    }
  });



  return Array.from(skillMap.values());

}
