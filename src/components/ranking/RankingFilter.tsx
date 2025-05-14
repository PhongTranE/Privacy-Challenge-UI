import { useState } from "react";
import { MultiSelect, Button, Flex, Text, Box, Container } from "@mantine/core";

const RankingFilter = () => {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  const teamOptions = [
    "Pig",
    "APL",
    "ABC",
    "XYZ",
    "123",
    "456",
    "343",
    "789",
    "DEF",
    "GHI",
  ].map((team) => ({ value: team, label: team }));

  const handleFilter = () => {
    console.log("Filtered teams:", selectedTeams);
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
              // maxDropdownHeight={180}
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
