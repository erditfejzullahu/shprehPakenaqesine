import { z } from "zod";
import { blobUrlArraySchema, blobUrlSchema } from "./blobUrl";

const xkPhoneNumberSchema = z.string()
  .refine((val) => {
    const cleaned = val.replace(/\D/g, '');
    return /^(383|377|386)\d{8}$/.test(cleaned) ||
           /^0\d{8}$/.test(cleaned);
  }, {
    message: 'Numri i telefonit jo valid. Formatet e pranueshme: +383XXXXXXXX, 383XXXXXXXX, 0XXXXXXXX, ose formatet historike +377/+386'
  });

export const createCompanySchema = z.object({
    name: z.string().min(2, "Emri duhet të përmbajë të paktën 2 karaktere"),
    description: z.string().optional(),
    logoUrl: blobUrlSchema,
    address: z.string().min(10, "Adresa duhet të përmbajë të paktën 10 karaktere"),
    website: z.url("URL jo valid").optional().nullable(),
    email: z.email("Email jo valid").optional().nullable(),
    phone: xkPhoneNumberSchema,
    imageUrls: blobUrlArraySchema.optional(),
    industry: z.string().min(3, "Industria duhet të përmbajë të paktën 3 karaktere"),
    foundedYear: z.number({ message: "Viti i themelimit duhet të jetë numër" }).int().min(1900).max(new Date().getFullYear()).optional().nullable(),
});

/** Client-side form fields before blob upload */
export const createCompanyFormSchema = createCompanySchema.omit({ logoUrl: true, imageUrls: true });
