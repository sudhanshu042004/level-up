"use server";
import { verifySession } from "@/lib/session";
import { users } from "@/src/db/schema";
import { fileUploadSchemaType } from "@/types/FileType";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { NextResponse } from "next/server";
import { z } from "zod"
import UplaodImage from "@/lib/actions/users/UploadImage"

const UserUpdateZod = z.object({
  username: z.string(),
  name: z.string(),
})
type UserUpdateType = z.infer<typeof UserUpdateZod>

const db = drizzle(process.env.DATABASE_URL!);

const UpdateUserProfile = async (userData: UserUpdateType, file: fileUploadSchemaType | undefined) => {
  const session = await verifySession();
  if (!session?.userId) {
    NextResponse.redirect("/login");
    return 401;
  }
  const userId: number = session.userId as number;

  try {
    const { success, data } = UserUpdateZod.safeParse(userData)
    if (!success) {
      throw new Error("Invalid user data")
    }
    await db.update(users)
      .set({ name: data.name, username: data.username })
      .where(eq(users.id, userId))

    if (file !== undefined) {
      const url = await UplaodImage(file, userId);
      return url
    }
  } catch (e) {
    console.error(e);
    return 400;
  }

}

export default UpdateUserProfile
