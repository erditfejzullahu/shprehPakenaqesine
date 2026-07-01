import { Gender } from "@/app/generated/prisma"
import { z } from "zod"
import { blobUrlSchema } from "./blobUrl"

export const adminSchema = z.object({
    username: z.string().min(3, "Duhen te pakten 3 karaktere"),
    email: z.string().email("Duhet nje email i vlefshem"),
    fullName: z.string().min(3, "Duhen te pakten 3 karaktere"),
    gender: z.enum(Gender),
    userProfileImageUrl: blobUrlSchema.optional().nullable(),
    changePassword: z.boolean(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
})
.refine(
    (data) => !data.changePassword || 
              (data.password && data.password.length >= 8),
    {
        message: "Fjalëkalimi duhet të ketë të paktën 8 karaktere",
        path: ["password"]
    }
)
.refine(
    (data) => !data.changePassword || 
              (data.password && /[a-z]/.test(data.password)),
    {
        message: 'Fjalëkalimi duhet të përmbajë të paktën një shkronjë të vogël',
        path: ["password"]
    }
)
.refine(
    (data) => !data.changePassword || 
              (data.password && /[A-Z]/.test(data.password)),
    {
        message: 'Fjalëkalimi duhet të përmbajë të paktën një shkronjë të madhe',
        path: ["password"]
    }
)
.refine(
    (data) => !data.changePassword || 
              (data.password && /[0-9]/.test(data.password)),
    {
        message: 'Fjalëkalimi duhet të përmbajë të paktën një numër',
        path: ["password"]
    }
)
.refine(
    (data) => !data.changePassword || 
              (data.password && /[^A-Za-z0-9]/.test(data.password)),
    {
        message: 'Fjalëkalimi duhet të përmbajë të paktën një simbol',
        path: ["password"]
    }
)
.refine(
    (data) => !data.changePassword || 
              (data.confirmPassword && data.confirmPassword.length >= 8),
    {
        message: "Ju lutem konfirmoni fjalëkalimin",
        path: ["confirmPassword"]
    }
)
.refine(
    (data) => !data.changePassword || 
              (data.password === data.confirmPassword),
    {
        message: "Fjalëkalimet nuk përputhen",
        path: ["confirmPassword"]
    }
);

export const adminFormSchema = adminSchema.omit({ userProfileImageUrl: true });
