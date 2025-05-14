import Introduction from "@/components/ruleSection/Introduction";
import Phase1 from "@/components/ruleSection/Phase1";
import Phase2 from "@/components/ruleSection/Phase2";
import RankingAndScore from "@/components/ruleSection/RankingAndScore";
import { Button, Container, Group, Paper, ScrollArea } from "@mantine/core";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";
import { useState } from "react";

const RulesPage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrevious = () => {
    setActiveIndex((current) => (current > 1 ? current - 1 : 0));
  };

  const handleNext = () => {
    setActiveIndex((current) => (current < 4 ? current + 1 : 4));
  };

  const ruleTitles = [
    "Introduction",
    "Phase 1: Anonymization",
    "Phase 2: Attack on anonymized data",
    "Ranking and Score",
  ];
  const ruleComponents = [
    <Introduction />,
    <Phase1 />,
    <Phase2 />,
    <RankingAndScore />,
  ];

  return (
    <>
      <Container size="lg" pt="xl">
        <Group className="pt-20" gap="xs" wrap="wrap">
          {ruleTitles.map((title, index) => (
            <Button
              key={index}
              variant={activeIndex === index ? "filled" : "outline"}
              color="#ff8c00"
              size="xs"
              onClick={() => setActiveIndex(index)}
            >
              {title}
            </Button>
          ))}
        </Group>
        <Paper bg="#060606e6" shadow="xs" p="md" radius="md">
          <ScrollArea h={500}>{ruleComponents[activeIndex]}</ScrollArea>
        </Paper>

        <Group justify="space-between">
          <Button
            size="xs"
            leftSection={<IconArrowNarrowLeft stroke={1} />}
            color="#ff8c00"
            onClick={handlePrevious}
            disabled={activeIndex === 0}
          >
            Previous
          </Button>
          <Button
            size="xs"
            rightSection={<IconArrowNarrowRight stroke={1} />}
            color="#ff8c00"
            onClick={handleNext}
            disabled={activeIndex === 3}
          >
            Next
          </Button>
        </Group>
      </Container>
    </>
  );
};

export default RulesPage;
