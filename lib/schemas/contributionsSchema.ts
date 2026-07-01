import {z} from "zod"
import { blobUrlArraySchema } from "./blobUrl"

export const contributionsSchema = z.object({
  attachments: blobUrlArraySchema.optional(),
  audiosAttached: blobUrlArraySchema.optional(),
  videosAttached: blobUrlArraySchema.optional(),
})

export const contributionFormSchema = contributionsSchema;
