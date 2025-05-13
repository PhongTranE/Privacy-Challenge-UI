import { Code, List, Stack, Text, Title } from "@mantine/core";
import ExampleData from "./ExampleData";

const Phase2: React.FC = () => {
  return (
    <>
      <Stack gap="md" c="white">
        <Title order={2} c="#ff8c00">
          Phase 2 – Attack
        </Title>

        <Text>
          During this second phase, the teams must download the data anonymized
          by the other teams during phase 1 and try to re-identify as much data
          as possible. The attack file takes the form of a JSON file. The JSON
          file is composed of the IDs of the original file, a year and a week
          number corresponding to the{" "}
          <span className="underline">ISO calendar</span> and finally one or
          more proposals for anonymized identifiers.
        </Text>

        <Text>Example:</Text>
        <ExampleData />

        <Code block c="white" bg="black">
          {`
            {
              "17850":{
                "2015-0":[
                  "AAAAA1",
                  "AAAAA2",
                  "AAAAA3"
                ],
                "2015-1":[
                  "AAAAA1"
                ],
                "2015-2":[
                  "AAAAA1"
                ],
                "2015-3":[
                  "AAAAA2"
                ]
              },
              "12583":{
                "2015-1":[
                  "CCCCC1",
                  "AAAAA2",
                  "AAAAA3"
                ],
                "2015-2":[],
                "2015-3":[
                  "CCCCC2"
                ],
                "2015-4":[
                  "CCCCC3"
                ]
              }
            }
          `}
        </Code>

        <Text>
          Each team can propose several answers for each week number, but in
          this case, if a correct answer is among the proposals, the point will
          be divided by the number of proposals.
        </Text>

        <List
          className="max-w-5xl"
          listStyleType="disc"
          withPadding
          spacing="sm"
        >
          <List.Item>
            For each identifier of each week: a correct answer is worth 1 point
          </List.Item>
          <List.Item>
            One answer among N propositions is worth 1/N points
          </List.Item>
          <List.Item>No correct answer is worth 0 points</List.Item>
          <List.Item>
            Finally:{" "}
            <strong>
              attack score = number of points/number of possible correct answers
            </strong>
          </List.Item>
          <List.Item>
            Once as much data as possible has been de-anonymized, the attack
            must be sent. And this for each file anonymized by the other teams.
            A <strong>maximum of 10 attacks per submission</strong> is allowed.
            The different teams thus obtain an attack score corresponding to the
            percentage of de-anonymized identification for each submission. If
            several attacks are made on the same submission, the best one is
            retained.
          </List.Item>
        </List>
      </Stack>
    </>
  );
};

export default Phase2;
