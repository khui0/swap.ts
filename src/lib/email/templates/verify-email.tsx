import { APP_NAME } from "$lib/meta";
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
              <Text>
                Thank you for signing up for {APP_NAME}. Click the button below to verify your email
                address:
              </Text>
              <Button className="rounded-lg bg-black px-4 py-3 font-semibold text-white" href={url}>
                Verify Email
              </Button>
              <Text>
                If the button above doesn't work, copy and paste this link into your browser:
              </Text>
              <Link href={url}>{url}</Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
