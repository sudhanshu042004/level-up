"use server";

import { skills } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";

const db = drizzle(process.env.DATABASE_URL!);

export const getSkill = async (trackId: number) => {

  console.log("coming wait");
  const Result = await db.select().from(skills).where(eq(skills.id, trackId))

  console.log(Result);


}

