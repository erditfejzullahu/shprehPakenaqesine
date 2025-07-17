import { Category, ComplaintStatus } from "@/app/generated/prisma"
import {z} from "zod"

export const createComplaintsSchema = z.object({
    companyId: z.uuid("ID e kompanisë duhet të jetë një UUID valid").optional().nullable(),
    title: z.string().min(8, {
        message: "Titulli duhet të përmbajë të paktën 8 karaktere"
    }),
    description: z.string().min(26, {
        message: "Përshkrimi duhet të përmbajë të paktën 26 karaktere"
    }),
    category: z.enum(Category),
    attachments: z.array(
        z.string().regex(
          /^data:(image\/(png|jpeg|jpg|gif)|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|vnd\.ms-excel|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|vnd\.ms-powerpoint|vnd\.openxmlformats-officedocument\.presentationml\.presentation));base64,/,
          {
            message: "Bashkëngjitjet duhet të jenë në formatin base64 dhe të jenë: imazhe (PNG, JPEG, JPG, GIF), PDF, DOC, DOCX, XLS, XLSX, PPT ose PPTX"
          }
        )
      ).optional(),
    audiosAttached: z.array(z.string().regex(/^data:audio\/(mp3|wav|ogg);base64,/, {
        message: "Audiot e bashkëngjitura duhet të jenë në formatin base64 (MP3, WAV ose OGG)"
    })).optional(),
    videosAttached: z.array(z.string().regex(/^data:video\/(mp4|webm|ogg);base64,/, {
        message: "Videot e bashkëngjitura duhet të jenë në formatin base64 (MP4, WebM ose OGG)"
    })).optional(),
});