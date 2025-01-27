import { z } from "zod"

export const fileUploadSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
  fileData: z.string(),
})

export type fileUploadSchemaType = z.infer<typeof fileUploadSchema>

