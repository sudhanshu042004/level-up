"use server";

import { verifySession } from "@/lib/session";
import { users } from "@/src/db/schema";
import cloudinary from "@/utils/cloudinary";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { NextResponse } from "next/server";

const db = drizzle(process.env.DATABASE_URL!);

const UplaodImage = async (file: File, fileUrl: string) => {

  const session = await verifySession();
  if (!session?.userId) {
    return NextResponse.redirect("/login");
  }
  const { userId } = session;
  try {
    const result = await cloudinary.uploader.upload(fileUrl, {
      folder: 'level-up-track'
    })

    await db.update(users).set({ avatar: result.secure_url }).where(eq(users.id, userId as number))

    return result.secure_url
  } catch (e) {
    console.log(e);
    return null;
  }
}

export default UplaodImage; 
