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
import { APP_NAME } from "../../meta";

export default function GroupNotification({
  name,
  groupName,
  groupUrl,
}: {
  name: string;
  groupName: string;
  groupUrl: string;
}) {
  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </Head>
      <Tailwind config={{}}>
        <Body className="bg-[#f5f5f5] p-4">
          <Preview>View your recipient</Preview>
          <Container className="rounded-xl bg-white px-4">
            <Section>
              <Text>Hi {name},</Text>
              <Text>
                Your recipient for <strong>{groupName}</strong> has been chosen!
              </Text>
              <Button
                className="rounded-lg bg-black px-4 py-3 font-semibold text-white"
                href={groupUrl}
              >
                View My Recipient
              </Button>
              <Text>
                If the button above doesn't work, sign into {APP_NAME} to view your recipient.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
