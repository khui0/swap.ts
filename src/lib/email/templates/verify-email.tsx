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

export default function VerifyEmail({ name, url }: { name: string; url: string }) {
  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </Head>
      <Tailwind config={{}}>
        <Body className="bg-[#f5f5f5] p-4">
          <Preview>Verify your email address</Preview>
          <Container className="rounded-xl bg-white px-4">
            <Section>
              <Text>Hi {name},</Text>
              <Text>Thank you for signing up. Please verify your email address below:</Text>
              <Button
                className="inline-flex h-10 items-center justify-center rounded-lg bg-black px-4 font-semibold text-white"
                href={url}
              >
                Verify Email
              </Button>
              <Text>
                If the button above didn't work, copy and paste this link into your browser:
              </Text>
              <Link href={url} />
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
