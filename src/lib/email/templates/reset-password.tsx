import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export default function ResetPassword({ name, url }: { name: string; url: string }) {
  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </Head>
      <Tailwind config={{}}>
        <Body className="bg-[#f5f5f5] p-4">
          <Preview>Reset your password</Preview>
          <Container className="rounded-xl bg-white px-4">
            <Section>
              <Text>Hi {name},</Text>
              <Text>
                Someone has requested a password reset for your account. If this was you, click the
                button below to reset your password:
              </Text>
              <Button className="rounded-lg bg-black px-4 py-3 font-semibold text-white" href={url}>
                Reset Password
              </Button>
              <Text>
                If the button above doesn't work, copy and paste this link into your browser:
              </Text>
              <Link href={url}>{url}</Link>
              <Text>
                If you didn't request a password reset, you can safely ignore this message.
              </Text>
              <Text>Do not share this email with anyone to keep your account safe.</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
