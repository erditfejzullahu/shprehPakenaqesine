import * as nodemailer from "nodemailer"
import { forgotPasswordTemplate } from "./emailTemplates.ts/forgotPasswordTemplate"

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_LOGIN,
        pass: process.env.SMTP_PASSWORD
    }
})

export const sendPasswordResetEmail = async (email: string, resetUrl: string) => {
    const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Kërkesë për rivendosje fjalëkalimi",
        html: forgotPasswordTemplate(resetUrl)
    }

    await transporter.sendMail(mailOptions)
}