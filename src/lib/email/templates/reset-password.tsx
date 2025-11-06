import {
  Body,
  Button,
  Container,
  Head,
  Html,
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
                Someone has requested a password reset for your account. If this was you, you can
                reset your password here:
              </Text>
              <Button
                className="inline-flex h-10 items-center justify-center rounded-lg bg-black px-4 font-semibold text-white"
                href={url}
              >
                Reset Password
              </Button>
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
