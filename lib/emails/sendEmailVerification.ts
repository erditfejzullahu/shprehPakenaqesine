
import { SendMailOptions } from "nodemailer"
import { transporter } from "./transporter";
import prisma from "../prisma";
import { verifyEmailTemplate } from "./emailTemplates.ts/verifyEmailTemplate";
import { cookies } from "next/headers";
import crypto from "crypto"

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

const secret = process.env.COOKIE_SECRET!;

export const signCookieValue = (value: string) => {
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(value);
    const signature = hmac.digest("hex")
    return `${value}.${signature}`;
}

export const verifyCookieValue = (signedValue: string): string | null => {
    const [value, signature] = signedValue.split('.')
    if(!value || !signature) return null;

    const expectedSig = crypto.createHmac('sha256', secret).update(value).digest("hex");
    return expectedSig === signature ? value : null
}