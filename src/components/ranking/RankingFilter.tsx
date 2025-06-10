import { useState } from "react";
import { MultiSelect, Button, Flex, Text, Box, Container } from "@mantine/core";
import { usePublicRanking } from "@/hooks/api/useRanking";

const RankingFilter = ({ onFilter }: { onFilter?: (teams: string[]) => void }) => {
  const { data } = usePublicRanking();
  const teamOptions = (data?.data || [])
    .filter((team: any) => !!team?.teamName)
    .map((team: any) => ({ value: team.teamName, label: team.teamName }));
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  const handleFilter = () => {
    if (onFilter) onFilter(selectedTeams);
  };

  return (
    <Container size="lg" py="md">
      <Box
        bg="rgba(6, 6, 6, 0.9)"
        p="md"
        style={{ borderRadius: "8px", border: "1px solid #e08b3d94" }}
        mt={20}
        mb={80}
      >
        <Flex justify="space-between" align="center" wrap="wrap" gap="sm">
          <Text c="white" size="xl" fw={500}>
            Team rankings:
          </Text>

          <Flex gap="sm" align="center">
            <MultiSelect
              className="custom-values-scroll"
              data={teamOptions}
              placeholder="Select teams"
              value={selectedTeams}
              onChange={setSelectedTeams}
              searchable
              clearable
              hidePickedOptions
              nothingFoundMessage="No teams found"
              styles={{ dropdown: { maxHeight: 180, overflowY: "auto" } }}
              w={500}
            />
            <Button onClick={handleFilter}>Filter</Button>
          </Flex>
        </Flex>
      </Box>
    </Container>
  );
};

export default RankingFilter;
