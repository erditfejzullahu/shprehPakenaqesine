import { ReportsCategory } from "@/app/generated/prisma"
import {z} from "zod"
import { blobUrlArraySchema } from "./blobUrl"

export const reportsSchema = z.object({
  title: z.string().min(6, "Duhen te pakten 6 karaktere"),
  description: z.string().min(20, "Duhen te pakten 20 karaktere"),
  email: z.email("Duhet nje email i vlefshem"),
  attachments: blobUrlArraySchema.optional(),
  audiosAttached: blobUrlArraySchema.optional(),
  videosAttached: blobUrlArraySchema.optional(),
  category: z.enum(ReportsCategory),
})

export const reportFormSchema = reportsSchema.omit({
  attachments: true,
  audiosAttached: true,
  videosAttached: true,
});
