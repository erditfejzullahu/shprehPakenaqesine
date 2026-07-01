import {z} from "zod"
import { blobUrlArraySchema } from "./blobUrl"

export const contactFormSchema = z.object({
    email: z.email("Email jo valid"),
    fullName: z.string().min(4, "Emri duhet të ketë të paktën 4 shkronja"),
    subject: z.string().max(100, "Titulli nuk duhet të kalojë 100 karaktere"),
    description: z.string().min(10, "Përshkrimi duhet të ketë të paktën 10 karaktere"),
    reason: z.enum([
        "NDIHMË",
        "ANKESË",
        "FSHIRJE",
        "KËRKESË_E_RE",
        "TJERA"
    ]),
    attachments: blobUrlArraySchema.optional(),
})

export const contactFormFieldsSchema = contactFormSchema.omit({ attachments: true });
