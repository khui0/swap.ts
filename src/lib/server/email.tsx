import { env } from "$env/dynamic/private";
import ResetPassword from "$lib/email//templates/reset-password";
import ChangeEmail from "$lib/email/templates/change-email";
import DeleteAccount from "$lib/email/templates/delete-account";
import GroupNotification from "$lib/email/templates/group-notification";
import VerifyEmail from "$lib/email/templates/verify-email";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import pLimit from "p-limit";

if (!env.SMTP_HOST) throw new Error("SMTP_HOST is not set");
if (!env.SMTP_FROM) throw new Error("SMTP_FROM is not set");
if (!env.SMTP_USER) throw new Error("SMTP_USER is not set");
if (!env.SMTP_PASSWORD) throw new Error("SMTP_PASSWORD is not set");

export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

export async function sendVerifyEmail(to: string, name: string, url: string) {
  if (!env.SMTP_FROM) {
    console.error("SMTP_FROM is not set");
    return;
  }

  const html = await render(<VerifyEmail name={name} url={url} />);

  transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: "Verify your email address",
    html,
  });
}

export async function sendResetPassword(to: string, name: string, url: string) {
  if (!env.SMTP_FROM) {
    console.error("SMTP_FROM is not set");
    return;
  }

  const html = await render(<ResetPassword name={name} url={url} />);

  transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: "Reset your password",
    html,
  });
}

export async function sendChangeEmail(to: string, name: string, newEmail: string, url: string) {
  if (!env.SMTP_FROM) {
    console.error("SMTP_FROM is not set");
    return;
  }

  const html = await render(<ChangeEmail name={name} newEmail={newEmail} url={url} />);

  transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: "Approve email address change",
    html,
  });
}

export async function sendDeleteAccount(to: string, name: string, url: string) {
  if (!env.SMTP_FROM) {
    console.error("SMTP_FROM is not set");
    return;
  }

  const html = await render(<DeleteAccount name={name} url={url} />);

  transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: "Confirm account deletion",
    html,
  });
}

export async function sendGroupNotification(
  recipients: { name: string; email: string }[],
  groupName: string,
  groupUrl: string,
) {
  if (!env.SMTP_FROM) {
    console.error("SMTP_FROM is not set");
    return;
  }

  const limit = pLimit(5);

  await Promise.all(
    recipients.map(async (user) => {
      const html = await render(
        <GroupNotification name={user.name} groupName={groupName} groupUrl={groupUrl} />,
      );

      return limit(() =>
        transporter.sendMail({
          from: env.SMTP_FROM,
          to: user.email,
          subject: "Your recipient has been chosen!",
          html,
        }),
      );
    }),
  );
}
