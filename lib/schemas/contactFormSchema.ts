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
        z.string().regex(
          /^data:(image\/(png|jpeg|jpg|gif|webp)|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|vnd\.ms-excel|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|vnd\.ms-powerpoint|vnd\.openxmlformats-officedocument\.presentationml\.presentation));base64,/,
          {
            message: "Bashkëngjitjet duhet të jenë në formatin base64 dhe të jenë: imazhe (PNG, JPEG, JPG, GIF, WEBP), PDF, DOC, DOCX, XLS, XLSX, PPT ose PPTX"
          }
        )
      ).optional(),
})