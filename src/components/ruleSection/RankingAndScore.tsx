import { Code, Divider, List, Space, Stack, Text, Title } from "@mantine/core";

const RankingAndScore: React.FC = () => {
  return (
    <>
      <Stack gap="md" c="white">
        <Title order={2} c="#ff8c00">
          Ranking And Score
        </Title>

        <Text>
          Each team will thus obtain a general attack score (total of the
          attacks of all submissions) following the re-identification and a
          defense score specific to each anonymized dataset will be deducted
          from the attack scores of the different teams and the naive attack
          score; These defense scores will then be added together to give the
          overall defense score. This will allow us to establish a ranking for
          attack and defense.
        </Text>
        <Text fs="italic" td="underline">
          Clarification on the calculation of the scores:
        </Text>
        <Text>
          Let S be the 3 (or fewer) anonymized data submissions that each group
          was able to publish.
        </Text>
        <Text>
          Each team can submit multiple attacks on each S submission of the
          other groups.
        </Text>
        <Space h="md" />
        <Text>The score of each S submission is calculated by:</Text>

        <Text size="lg" ta="center" fw={700}>
          ScoreD(S) = Utility * (1-MAXgrp(attack score))
        </Text>

        <Text fs="italic">with:</Text>

        <Text>
          <span className="italic">Utility:</span> The utility score assigned to
          S based on the metrics and aggregation choices of administrators.
        </Text>
        <Text>
          <span className="italic">MAXgrp(attack score):</span> The maximum
          attack score on S obtained by all the other groups
        </Text>
        <Divider my="md" />
        <Space h="md" />
        <Text>
          A group's defense score is the highest score of its "S" submission:
        </Text>
        <Text size="lg" ta="center">
          <strong>ScoreG = MAXS(ScoreD(S))</strong> (i.e. a value between 0 and
          1)
        </Text>
        <Text className="pb-10">
          A <strong>team's final attack score</strong> is the{" "}
          <strong>sum of its worst attacks on each of the other groups</strong>{" "}
          (i.e. a value between 0 and N-1 (with N the total number of teams in
          the competition)).
        </Text>
        <Divider my="md" />
      </Stack>
    </>
  );
};

export default RankingAndScore;
