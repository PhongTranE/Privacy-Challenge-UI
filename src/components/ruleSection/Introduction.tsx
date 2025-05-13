import { Stack, Text, Title } from "@mantine/core";

const Introduction: React.FC = () => {
  return (
    <Stack gap="md" c="white">
      <Title order={2} c="#ff8c00">
        Introduction
      </Title>
      <Text>
        Privacy Challenge Platform is a web platform for anonymization
        competition.
      </Text>
      <Text>
        The aim of this competition is to test the skills of the participants in
        terms of anonymisation and then de-anonymization of tabular data,
        geolocation and timestamp, and then to establish a ranking according to
        the results.
      </Text>
      <Text>
        In the next part, we will describe the different phases of competition
        with the rules used and the calculation methods, then detail the use of
        the platform.
      </Text>
    </Stack>
  );
};

export default Introduction;
