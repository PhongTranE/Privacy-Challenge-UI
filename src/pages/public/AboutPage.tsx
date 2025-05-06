import "@/styles/Pages/Public/AboutPage.scss";
import { Divider, Text } from "@mantine/core";

const AboutPage: React.FC = () => {
  return (
    <>
      <main className="flex h-screen flex-col items-center justify-center">
        <section className="about-section">
          <div className="about-content">
            <Text fw={700} size="xl" c="#ff8c00">
              Privacy Challenge Platform
            </Text>
            <Divider my="lg" />
            <Text size="lg">
              This challenge is to be the support of a competition for the
              anonymization of tabular data, geolocation and timestamping.
            </Text>
            <br />
            <Text size="lg">It takes place in two phases:</Text>
            <Text size="lg">
              - In the first phase, the different teams will try to anonymise
              the data provided as best they can.
              <br />- During the second phase, the teams will try to
              re-identify as much data as possible anonymized by the other teams
              during the first phase.
            </Text>
            <br />
            <Text size="lg">
              Each team will thus obtain an attack score following the
              re-identification and a specific defense score will be deducted
              from the attack scores of the different teams for each anonymized
              dataset; This will allow us to establish a ranking.
            </Text>
            <br />
            <Text size="lg" c="#ff8c00bf">
              Contact our support team if you require assistance or have any
              inquiries.
            </Text>
          </div>
        </section>
      </main>
    </>
  );
};

export default AboutPage;
