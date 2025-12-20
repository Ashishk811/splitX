import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      }
});

export const sendMail = async ({ to, subject, text }) => {
  await transporter.sendMail({
    from: process.env.USER,
    to,
    subject,
    text
  });
};
