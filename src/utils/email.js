import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config()
import { Resend } from 'resend'; 

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: { rejectUnauthorized: false }
    });

    const mailOptions = {
        from: `Academia <${process.env.EMAIL_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; border-radius: 12px;">
                <div style="background: #4f46e5; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Academia</h1>
                </div>
                <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px;">
                    <p style="color: #334155; font-size: 16px; line-height: 1.6;">
                        ${options.message.replace(/\n/g, '<br/>')}
                    </p>
                    <hr style="border: 1px solid #e2e8f0; margin: 24px 0;" />
                    <p style="color: #94a3b8; font-size: 12px;">
                        If you didn't request this, please ignore this email. This link expires in 10 minutes.
                    </p>
                </div>
            </div>
        `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent:', info.messageId);
};

export default sendEmail;