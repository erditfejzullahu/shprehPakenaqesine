import { Gender } from "@/app/generated/prisma"

import {z} from "zod"
export const userEditSchema = z.object({
  username: z.string().min(3, "Username duhet te jete me te pakted 3 karaktere"),
  email: z.email("Invalid email"),
  fullName: z.string().min(2, "Emri duhet te kete te pakrten 2 karaktere"),
  gender: z.enum(Gender),
  anonimity: z.boolean(),
  userProfileImage: z.string()
    .regex(/^data:image\/(png|jpeg|jpg|gif|webp);base64,/, {
        message: "Bashkëngjitjet duhet të jenë imazhe në formatin base64 (PNG, JPEG, JPG, WEBP ose GIF)"
    }),
  acceptedUser: z.boolean(),
  email_verified: z.boolean()
})