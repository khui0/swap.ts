import ResetPassword from "$lib/email//templates/reset-password";
import VerifyEmail from "$lib/email/templates/verify-email";
import ChangeEmail from "$lib/email/templates/change-email";
import DeleteAccount from "$lib/email/templates/delete-account";
import { render } from "@react-email/render";
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

export async function sendVerifyEmail(to: string, name: string, url: string) {
  if (!SMTP_FROM) {
    console.error("SMTP_FROM is undefined");
    return;
  }

  const html = await render(<VerifyEmail name={name} url={url} />);

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

  const html = await render(<ResetPassword name={name} url={url} />);

  transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject: "Reset your password",
    html,
  });
}

export async function sendChangeEmail(to: string, name: string, newEmail: string, url: string) {
  if (!SMTP_FROM) {
    console.error("SMTP_FROM is undefined");
    return;
  }

  const html = await render(<ChangeEmail name={name} newEmail={newEmail} url={url} />);

  transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject: "Approve email address change",
    html,
  });
}

export async function sendDeleteAccount(to: string, name: string, url: string) {
  if (!SMTP_FROM) {
    console.error("SMTP_FROM is undefined");
    return;
  }

  const html = await render(<DeleteAccount name={name} url={url} />);

  transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject: "Confirm account deletion",
    html,
  });
}
