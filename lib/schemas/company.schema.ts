import { z } from "zod";

const createCompanySchema = z.object({
  name: z.string().min(3, {
    message: "Emri i kompanisë duhet të përmbajë të paktën 3 karaktere"
  }),
  description: z.string().optional(),
  logoBase64: z.string().refine((val) => {
    return /^data:image\/(png|jpeg|jpg|gif|svg\+xml);base64,[a-zA-Z0-9+/]+={0,2}$/.test(val);
  }, {
    message: "Logo duhet të jetë në formatin e vlefshëm Base64 për imazhe"
  }),
  address: z.string().min(3, {
    message: "Adresa duhet të përmbajë të paktën 3 karaktere"
  }),
  website: z.string().url({
    message: "URL e faqes në internet duhet të jetë e vlefshme"
  }).optional(),
  email: z.string().email({
    message: "Email-i duhet të jetë i vlefshëm"
  }).optional(),
  phone: z.string().refine((val) => {
    // Kosovo phone numbers: 
    // +383 followed by 8 digits OR
    // 0 followed by 8 digits (local format)
    return /^(\+383\d{8}|0\d{8})$/.test(val.replace(/\s/g, ''));
  }, {
    message: "Numri i telefonit duhet të jetë në formatin kosovar (+383XXXXXXXX ose 0XXXXXXXX)"
  }),
  imagesBase64: z.array(
    z.string().refine((val) => {
      return /^data:image\/(png|jpeg|jpg|gif|svg\+xml);base64,[a-zA-Z0-9+/]+={0,2}$/.test(val);
    }, {
      message: "Imazhet duhet të jenë në formatin e vlefshëm Base64"
    })
  ).optional(),
  industry: z.string().min(3, {
    message: "Industria duhet të përmbajë të paktën 3 karaktere"
  }),
  foundedYear: z.number().min(1000, {
    message: "Viti i themelimit duhet të jetë një vit i vlefshëm"
  }).max(new Date().getFullYear(), {
    message: "Viti i themelimit nuk mund të jetë në të ardhmen"
  }).optional()
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;