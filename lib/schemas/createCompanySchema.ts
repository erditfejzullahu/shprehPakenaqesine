import { z } from "zod";

const xkPhoneNumberSchema = z.string()
  .refine((val) => {
    // Remove all non-digit characters
    const cleaned = val.replace(/\D/g, '');
    
    // Kosovo phone number validation
    return /^(383|377|386)\d{8}$/.test(cleaned) ||  // International format
           /^0\d{8}$/.test(cleaned);              // Local format
  }, {
    message: 'Numri i telefonit jo valid. Formatet e pranueshme: +383XXXXXXXX, 383XXXXXXXX, 0XXXXXXXX, ose formatet historike +377/+386'
  });

export const createCompanySchema = z.object({
    name: z.string().min(2, "Emri duhet të përmbajë të paktën 2 karaktere"),
    description: z.string().optional(),
    logoAttachment: z.string().regex(/^data:image\/(png|jpeg|jpg|gif);base64,/, {
        message: "Bashkëngjitjet duhet të jenë imazhe në formatin base64 (PNG, JPEG, JPG ose GIF)"
    }),
    address: z.string().min(10, "Adresa duhet të përmbajë të paktën 10 karaktere"),
    website: z.url("URL jo valid").optional().nullable(),
    email: z.email("Email jo valid").optional().nullable(),
    phone: xkPhoneNumberSchema,
    imageAttachments: z.array(z.string().regex(/^data:image\/(png|jpeg|jpg|gif);base64,/, {
        message: "Bashkëngjitjet duhet të jenë imazhe në formatin base64 (PNG, JPEG, JPG ose GIF)"
    })).optional(),
    industry: z.string().min(3, "Industria duhet të përmbajë të paktën 3 karaktere"),
    foundedYear: z.number({ message: "Viti i themelimit duhet të jetë numër" }).int().min(1900).max(new Date().getFullYear()).optional().nullable(),
});