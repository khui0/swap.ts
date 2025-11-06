import { Html } from "@react-email/html";

export default function VerifyEmail({ url }: { url: string }) {
  return (
    <Html>
      <h1>Verify your email</h1>
      <p>Click below:</p>
      <a href={url}>Verify Email</a>
    </Html>
  );
}
