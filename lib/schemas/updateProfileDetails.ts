import {z} from "zod"
import { blobUrlSchema } from "./blobUrl"

export const updateProfileSchema = z.object({
        fullName: z.string().min(3, "Emri i plotë duhet të përmbajë të paktën 3 karaktere"),
        email: z.string().email("Ju lutem shkruani një email valid"),
        username: z.string().min(3, "Emri i përdoruesit duhet të përmbajë të paktën 3 karaktere"),
        gender: z.enum(["MASHKULL", "FEMER", "TJETER", "PA_GJINI"]),
        changePassword: z.boolean(),
        password: z.string().optional().nullable(),
        userProfileImageUrl: blobUrlSchema.optional().nullable(),
        confirmPassword: z.string().optional().nullable(),
    })
    .refine((data) => {
        if (!data.changePassword) return true;
        return data.password && data.password.length >= 8;
    }, {
        message: 'Fjalëkalimi duhet të ketë të paktën 8 karaktere',
        path: ['password']
    })
    .refine((data) => {
        if (!data.changePassword) return true;
        return /[a-z]/.test(data.password || '');
    }, {
        message: 'Fjalëkalimi duhet të përmbajë të paktën një shkronjë të vogël',
        path: ['password']
    })
    .refine((data) => {
        if (!data.changePassword) return true;
        return /[A-Z]/.test(data.password || '');
    }, {
        message: 'Fjalëkalimi duhet të përmbajë të paktën një shkronjë të madhe',
        path: ['password']
    })
    .refine((data) => {
        if (!data.changePassword) return true;
        return /[0-9]/.test(data.password || '');
    }, {
        message: 'Fjalëkalimi duhet të përmbajë të paktën një numër',
        path: ['password']
    })
    .refine((data) => {
        if (!data.changePassword) return true;
        return /[^A-Za-z0-9]/.test(data.password || '');
    }, {
        message: 'Fjalëkalimi duhet të përmbajë të paktën një simbol',
        path: ['password']
    })
    .refine((data) => {
        if (!data.changePassword) return true;
        return data.password === data.confirmPassword;
    }, {
        message: "Fjalëkalimet nuk përputhen",
        path: ["confirmPassword"],
})

export const updateProfileFormSchema = updateProfileSchema.omit({ userProfileImageUrl: true });
