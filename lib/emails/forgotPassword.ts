import { SendMailOptions } from "nodemailer";
import { forgotPasswordTemplate } from "./emailTemplates.ts/forgotPasswordTemplate"
import { transporter } from "./transporter";
import prisma from "../prisma";


export const sendPasswordResetEmail = async (userId: string, email: string, resetUrl: string) => {
    
    const mailOptions: SendMailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Kërkesë për rivendosje fjalëkalimi | ShfaqPakënaqësinë",
        html: forgotPasswordTemplate(resetUrl)
    };

    (async () => {
    const info = await transporter.sendMail(mailOptions);
    await prisma.activityLog.create({
        data: {
            userId: userId,
            entityId: userId,
            entityType: "Other",
            action: "SEND_EMAIL_FORGOT_PASSWORD",
        }
    })
    console.log("Email for password forgot sent:", info.messageId);
    })();
    // await transporter.sendMail(mailOptions)
}