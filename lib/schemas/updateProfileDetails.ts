import {z} from "zod"

export const updateProfileSchema = z.object({
    fullName: z.string().min(3, "Emri i plotë duhet të përmbajë të paktën 3 karaktere"),
    email: z.email("Ju lutem shkruani një email valid"),
    username: z.string().min(3, "Emri i përdoruesit duhet të përmbajë të paktën 3 karaktere"),
    gender: z.enum(["MASHKULL", "FEMER", "TJETER", "PA_GJINI"]),
    password: z.string()
        .min(8, { message: 'Fjalëkalimi duhet të ketë të paktën 8 karaktere' })
        .refine(val => /[a-z]/.test(val), { 
            message: 'Fjalëkalimi duhet të përmbajë të paktën një shkronjë të vogël' 
        })
        .refine(val => /[A-Z]/.test(val), { 
            message: 'Fjalëkalimi duhet të përmbajë të paktën një shkronjë të madhe' 
        })
        .refine(val => /[0-9]/.test(val), { 
            message: 'Fjalëkalimi duhet të përmbajë të paktën një numër' 
        })
        .refine(val => /[^A-Za-z0-9]/.test(val), { 
            message: 'Fjalëkalimi duhet të përmbajë të paktën një simbol' 
        })
        .optional()
        .refine(val => !val || val.length === 0 || val.length >= 8, {
            message: 'Fjalëkalimi duhet të ketë të paktën 8 karaktere',
            path: ['password'] // Optional: specify the path for the error
    }),
    userProfileImage: z.string().regex(/^data:image\/(png|jpeg|jpg|gif);base64,/, {
        message: "Bashkëngjitjet duhet të jenë imazhe në formatin base64 (PNG, JPEG, JPG ose GIF)"
    }).optional(),
    confirmPassword: z.string().min(8, "Ju lutem konfirmoni fjalëkalimin"),
    }).refine((data) => data.password === data.confirmPassword, {
    message: "Fjalëkalimet nuk përputhen",
    path: ["confirmPassword"], // 👈 this attaches the error to the confirmPassword field
});