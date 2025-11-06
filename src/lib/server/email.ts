import { renderResetPassword, renderVerifyEmail } from "$lib/email/render";
import nodemailer from "nodemailer";

import { SMTP_FROM, SMTP_HOST, SMTP_PASSWORD, SMTP_USER } from "$env/static/private";

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

export async function sendVerifyEmail(to: string, url: string) {
  if (!SMTP_FROM) {
    console.error("SMTP_FROM is undefined");
    return;
  }

  const html = await renderVerifyEmail(url);

  transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject: "Verify your email address",
    html,
  });
}

export async function sendResetPassword(to: string, name: string, url: string) {
  if (!SMTP_FROM) {
    console.error("SMTP_FROM is undefined");
    return;
  }

  const html = await renderResetPassword(name, url);

  transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject: "Reset your password",
    html,
  });
}
