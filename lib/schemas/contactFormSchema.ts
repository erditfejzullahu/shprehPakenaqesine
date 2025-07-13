import {z} from "zod"

export const contactFormSchema = z.object({
    email: z.email("Email jo valid"),
    fullName: z.string().min(4, "Emri duhet të ketë të paktën 4 shkronja"),
    subject: z.string().max(100, "Titulli nuk duhet të kalojë 100 karaktere"),
    description: z.string().min(10, "Përshkrimi duhet të ketë të paktën 10 karaktere"),
    reason: z.enum([
        "NDIHMË",          // Pyetje të përgjithshme
        "ANKESË",          // Parashtrim ankese
        "FSHIRJE",         // Kërkesë për fshirje të përmbajtjes
        "KËRKESË_E_RE",    // Kërkesë për shtim kategori/veçorie të re
        "TJERA"            // Arsye tjera
    ]),
    attachments: z.array(
        z.string().regex(/^data:image\/(png|jpeg|jpg|gif);base64,/, {
            message: "Formati i imazhit duhet të jetë PNG, JPEG, JPG, ose GIF në Base64"
        })
    ).optional()
})