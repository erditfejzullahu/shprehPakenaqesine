// lib/schemas/auth.ts
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "Emri i përdoruesit duhet të përmbajë të paktën 3 karaktere"),
  password: z.string().min(6, "Fjalëkalimi duhet të përmbajë të paktën 6 karaktere")
});

export const registerSchema = z.object({
  fullName: z.string().min(3, "Emri i plotë duhet të përmbajë të paktën 3 karaktere"),
  email: z.email("Ju lutem shkruani një email valid"),
  username: z.string().min(3, "Emri i përdoruesit duhet të përmbajë të paktën 3 karaktere"),
  gender: z.enum(["MASHKULL", "FEMER", "TJETER", "PA_GJINI"]),
  password: z.string()
  .min(8, { message: 'Fjalëkalimi duhet të ketë të paktën 8 karaktere' })
  .refine(
    (val) => /[a-z]/.test(val),
    { message: 'Fjalëkalimi duhet të përmbajë të paktën një shkronjë të vogël' }
  )
  .refine(
    (val) => /[A-Z]/.test(val),
    { message: 'Fjalëkalimi duhet të përmbajë të paktën një shkronjë të madhe' }
  )
  .refine(
    (val) => /[0-9]/.test(val),
    { message: 'Fjalëkalimi duhet të përmbajë të paktën një numër' }
  )
  .refine(
    (val) => /[^A-Za-z0-9]/.test(val),
    { message: 'Fjalëkalimi duhet të përmbajë të paktën një simbol' }
  ),
  confirmPassword: z.string().min(8, "Ju lutem konfirmoni fjalëkalimin"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Fjalëkalimet nuk përputhen",
  path: ["confirmPassword"], // 👈 this attaches the error to the confirmPassword field
});

export const backendCreateUserSchema = z.object({
    fullName: z.string().min(3, "Emri i plotë duhet të përmbajë të paktën 3 karaktere"),
  email: z.email("Ju lutem shkruani një email valid"),
  username: z.string().min(3, "Emri i përdoruesit duhet të përmbajë të paktën 3 karaktere"),
  gender: z.enum(["MASHKULL", "FEMER", "TJETER", "PA_GJINI"]),
  password: z.string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .refine(
    (val) => /[a-z]/.test(val),
    { message: 'Password must contain at least one lowercase letter' }
  )
  .refine(
    (val) => /[A-Z]/.test(val),
    { message: 'Password must contain at least one uppercase letter' }
  )
  .refine(
    (val) => /[0-9]/.test(val),
    { message: 'Password must contain at least one number' }
  )
  .refine(
    (val) => /[^A-Za-z0-9]/.test(val),
    { message: 'Password must contain at least one symbol' }
  ),
  confirmPassword: z.string()
})