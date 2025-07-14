import {z} from "zod"
export const subscriberSchema = z.object({
    email: z.email("Ju lutem shkruani nje email valid.")
})