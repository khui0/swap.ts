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

import { APP_NAME } from "../../meta";

export default function VerifyEmail({ name, url }: { name: string; url: string }) {
  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </Head>
      <Tailwind config={{}}>
        <Body className="bg-[#f5f5f5] p-4">
          <Preview>Confirm account deletion</Preview>
          <Container className="rounded-xl bg-white px-4">
            <Section>
              <Text>Hi {name},</Text>
              <Text>
                Someone has requested to delete your {APP_NAME} account. If this was you, click the
                button below to delete your account:
              </Text>
              <Button className="rounded-lg bg-black px-4 py-3 font-semibold text-white" href={url}>
                Delete Account
              </Button>
              <Text>
                If the button above doesn't work, copy and paste this link into your browser:
              </Text>
              <Link href={url}>{url}</Link>
              <Text>
                If you didn't request to delete your account, sign in and change your password immediately.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
