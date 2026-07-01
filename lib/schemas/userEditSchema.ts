import { Gender } from "@/app/generated/prisma"
import {z} from "zod"
import { blobUrlSchema } from "./blobUrl"

export const userEditSchema = z.object({
  username: z.string().min(3, "Username duhet te jete me te pakted 3 karaktere"),
  email: z.email("Invalid email"),
  fullName: z.string().min(2, "Emri duhet te kete te pakrten 2 karaktere"),
  gender: z.enum(Gender),
  anonimity: z.boolean(),
  userProfileImageUrl: blobUrlSchema.optional().nullable(),
  acceptedUser: z.boolean(),
  email_verified: z.boolean()
})

export const userEditFormSchema = userEditSchema.omit({ userProfileImageUrl: true });
