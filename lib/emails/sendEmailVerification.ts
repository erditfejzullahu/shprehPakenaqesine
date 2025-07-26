
import { SendMailOptions } from "nodemailer"
import { transporter } from "./transporter";
import prisma from "../prisma";
import { verifyEmailTemplate } from "./emailTemplates.ts/verifyEmailTemplate";
import { cookies } from "next/headers";

export const sendUserVerificationEmail = async (userId: string, email: string, verificationUrl: string) => {
    const mailOptions: SendMailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Verifikoni llogarinë tuaj | ShfaqPakënaqësinë",
        html: verifyEmailTemplate(verificationUrl)
    };

    (async () => {
        const info = await transporter.sendMail(mailOptions);
        await prisma.activityLog.create({
            data: {
                userId: userId,
                entityId: userId,
                entityType: "Other",
                action: "SEND_EMAIL_VERIFICATION"
            }
        })
        console.log("Email for email verification sent: ", info.messageId)
    })()
}

