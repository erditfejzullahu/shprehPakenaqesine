import { Category, ComplaintStatus, Municipality } from "@/app/generated/prisma"
import {z} from "zod"
import { blobUrlArraySchema } from "./blobUrl"

export const createComplaintsSchema = z.object({
    companyId: z.uuid("ID e kompanisë duhet të jetë një UUID valid").optional().nullable(),
    municipality: z.enum(Municipality),
    title: z.string().min(8, {
        message: "Titulli duhet të përmbajë të paktën 8 karaktere"
    }),
    description: z.string().min(26, {
        message: "Përshkrimi duhet të përmbajë të paktën 26 karaktere"
    }),
    category: z.enum(Category),
    attachments: blobUrlArraySchema.optional(),
    audiosAttached: blobUrlArraySchema.optional(),
    videosAttached: blobUrlArraySchema.optional(),
});

export const createComplaintFormSchema = createComplaintsSchema.omit({
    attachments: true,
    audiosAttached: true,
    videosAttached: true,
});
