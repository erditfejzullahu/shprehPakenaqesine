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
  password: z.string().min(6, "Fjalëkalimi duhet të përmbajë të paktën 6 karaktere")
});