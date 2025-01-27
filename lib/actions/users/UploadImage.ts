"use server";

import { users } from "@/src/db/schema";
import cloudinary from "@/utils/cloudinary";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { z } from "zod";

const db = drizzle(process.env.DATABASE_URL!);

const fileUploadSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
  fileData: z.string(),
})

type fileUploadSchemaType = z.infer<typeof fileUploadSchema>


const UplaodImage = async (file: fileUploadSchemaType, userId: number) => {
  const { success, data } = fileUploadSchema.safeParse(file);
  if (!success) {
    console.log("invlaid type file");
    return 401;
  }

  try {
    const base64Data = data.fileData;
    const buffer = Buffer.from(base64Data, "base64");

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
    await db.update(users).set({ avatar: result.secure_url as string }).where(eq(users.id, userId))

    return result.secure_url as string;
  } catch (e) {
    console.log(e);
    return 400;
  }
}

export default UplaodImage; 
