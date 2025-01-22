"use server";

import { verifySession } from "@/lib/session";
import { users } from "@/src/db/schema";
import cloudinary from "@/utils/cloudinary";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { NextResponse } from "next/server";

const db = drizzle(process.env.DATABASE_URL!);

const UplaodImage = async (file: File,) => {

  const session = await verifySession();
  if (!session?.userId) {
    return NextResponse.redirect("/login");
  }
  const { userId } = session;
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((res, rej) => {

      cloudinary.uploader.upload_stream(
        { folder: "level-up-tracks" },
        (error, result) => {
          if (error) rej(error);
          res(result);
        }
      ).end(buffer);
    })
    if (!result || typeof result !== 'object' || !('secure_url' in result)) {
      return { error: "Upload failed" };
    }
    await db.update(users).set({ avatar: result.secure_url as string }).where(eq(users.id, userId as number))
    console.log(result.secure_url);

    return result.secure_url as string;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export default UplaodImage; 
