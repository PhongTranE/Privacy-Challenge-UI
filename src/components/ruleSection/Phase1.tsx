import {
  List,
  Space,
  Stack,
  Table,
  TableTbody,
  TableThead,
  Text,
  Title,
} from "@mantine/core";
import ExampleData from "./ExampleData";

const Phase1: React.FC = () => {
  return (
    <Stack gap="md" c="white">
      <Title order={2} c="#ff8c00">
        Phase 1 – Anonymization
      </Title>
      <Text>
        During this first phase, the different teams will have to download the
        biometric data provided and then anonymize it as best they can. Example: The data
        burned correspond to the GPS positions of a hundred people over a period
        of 3 months.
      </Text>

      <Text>One line of the data provided follows the pattern:</Text>

      <Table withTableBorder withColumnBorders>
        <TableThead>
          <Table.Tr>
            <Table.Th>[ID]</Table.Th>
            <Table.Th>[Date]</Table.Th>
            <Table.Th>[Latitude]</Table.Th>
            <Table.Th>[Longitude]</Table.Th>
          </Table.Tr>
        </TableThead>
        <TableTbody>
          <Table.Tr key="1">
            <Table.Td>1</Table.Td>
            <Table.Td>2020-01-01 00:00:00.000</Table.Td>
            <Table.Td>48.0</Table.Td>
            <Table.Td>-1.5</Table.Td>
          </Table.Tr>
        </TableTbody>
      </Table>
      <Space h="xs" />

      <Title order={3}>
        Anonymisation must comply with{" "}
        <Text span c="#ff8c00" inherit>
          certain rules:
        </Text>
      </Title>

      <List spacing="md" withPadding listStyleType="disc" className="max-w-5xl">
        <List.Item>
          We work per user per week. A week is the week number on the calendar.
          The ID must be changed in such a way that for a specific user and
          week, <strong>the ID does not change</strong>.
          <br />
          <div className="mt-2">
            <Text size="sm">
              Example of a match for an identifier and a week number.
            </Text>
            <ExampleData />
          </div>
        </List.Item>

        <List.Item>
          It is not allowed to change the number of rows or the order of the
          rows. The order of the rows is automatically changed by the platform
          after publication.
        </List.Item>

        <List.Item>
          The date can be changed but{" "}
          <strong>must remain in the same week number</strong>.
        </List.Item>

        <List.Item>GPS coordinates can be changed completely.</List.Item>
      </List>

      <Text>
        Each team will be able to publish a{" "}
        <strong>maximum of 3 anonymization submissions</strong>.
      </Text>

      <Text>
        When sending the submission on the platform, several calculations are
        performed. Utility points are calculated based on the metrics and
        aggregation choices of the administrators, and will be communicated to
        you before the start of the competition.
      </Text>

      <Text>
        An easy to de-anonymize submission will give more points to opponents. A
        naive attack score is made available for each anonymization attempt to
        allow teams an initial assessment of their attempt. The naive attack
        works like this:
      </Text>

      <List listStyleType="number" withPadding spacing="md">
        <List.Item>
          For each identifier of each week number, a sum of GPS coordinates is
          performed.
        </List.Item>
        <List.Item>
          The same calculation is performed on the original file.
        </List.Item>
        <List.Item>
          The re-identification between the original identifier and the
          anonymized identifiers is carried out by taking the sum of the closest
          coordinates.
        </List.Item>
      </List>

      <Text>
        The naive attack score is calculated like the other attack scores (see
        end of Phase 2: anonymized data attack)
      </Text>

      <Text>
        Once the team is satisfied with their work, the submission{" "}
        <strong>must be published</strong> in order to validate it.
      </Text>
    </Stack>
  );
};

export default Phase1;
