import { Table, Badge, Paper, Anchor, Container, Loader, Alert, Title } from "@mantine/core";
import { usePublicRanking } from "@/hooks/api/useRanking";
import { IconChevronUp, IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";

interface RankingOverallProps {
  filteredTeams?: string[];
}

function RankingOverall({ filteredTeams }: RankingOverallProps) {
  const { data, isLoading, error } = usePublicRanking();

  // Sort state
  const [sortBy, setSortBy] = useState<
    "teamId" | "teamName" | "defenseScore" | "attackScore" | "totalScore"
  >("totalScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  let displayData = data?.data;
  if (filteredTeams && filteredTeams.length > 0) {
    displayData = displayData?.filter((team: any) => filteredTeams.includes(team.teamName));
  }

  // Sort logic
  const sortedData = [...(displayData ?? [])]
    .filter((team: any) => !!team.teamName)
    .sort((a: any, b: any) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  // Tìm điểm defense và attack cao nhất
  const maxDefense = Math.max(...sortedData.map((team: any) => team.defenseScore ?? 0));
  const maxAttack = Math.max(...sortedData.map((team: any) => team.attackScore ?? 0));

  if (isLoading) return <Loader />;
  if (error) return <Alert color="red">Error loading ranking</Alert>;

  return (
    <Container size="lg" py="md">
      <Paper
        withBorder
        p="md"
        radius="lg"
        style={{ borderColor: "#e08b3d94", background: "#18181b", marginBottom: "80px", boxShadow: "0 4px 32px #0008" }}
      >
        <Title order={2} className="text-orange-400 mb-6 text-center tracking-wide drop-shadow-lg">
          Overall Results
        </Title>
        <div className="overflow-x-auto">
          <Table
            highlightOnHover
            withColumnBorders
            className="w-full bg-zinc-900 rounded-xl overflow-hidden shadow-lg text-white"
            verticalSpacing="md"
            horizontalSpacing="md"
            fs="md"
          >
            <Table.Thead>
              <Table.Tr className="bg-gradient-to-r from-zinc-800 to-zinc-700">
                <Table.Th className="p-3 font-bold text-[15px] text-center text-orange-400 border-none cursor-pointer" onClick={() => handleSort("teamId")}>ID {sortBy === "teamId" && (sortDirection === "asc" ? <IconChevronUp size={16} className="inline" /> : <IconChevronDown size={16} className="inline" />)}</Table.Th>
                <Table.Th className="p-3 font-bold text-[15px] text-center text-orange-400 border-none cursor-pointer" onClick={() => handleSort("teamName")}>Team Name {sortBy === "teamName" && (sortDirection === "asc" ? <IconChevronUp size={16} className="inline" /> : <IconChevronDown size={16} className="inline" />)}</Table.Th>
                <Table.Th className="p-3 font-bold text-[15px] text-center text-orange-400 border-none cursor-pointer" onClick={() => handleSort("defenseScore")}>Defense Score {sortBy === "defenseScore" && (sortDirection === "asc" ? <IconChevronUp size={16} className="inline" /> : <IconChevronDown size={16} className="inline" />)}</Table.Th>
                <Table.Th className="p-3 font-bold text-[15px] text-center text-orange-400 border-none cursor-pointer" onClick={() => handleSort("attackScore")}>Attack Score {sortBy === "attackScore" && (sortDirection === "asc" ? <IconChevronUp size={16} className="inline" /> : <IconChevronDown size={16} className="inline" />)}</Table.Th>
                <Table.Th className="p-3 font-bold text-[15px] text-center text-orange-400 border-none cursor-pointer" onClick={() => handleSort("totalScore")}>Total Score {sortBy === "totalScore" && (sortDirection === "asc" ? <IconChevronUp size={16} className="inline" /> : <IconChevronDown size={16} className="inline" />)}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sortedData.map((team: any, idx: number) => (
                <Table.Tr key={team.teamId} className="border-b border-zinc-800 hover:bg-zinc-800 transition-all">
                  <Table.Td className="p-3 border-none text-center font-medium text-white">
                    {team.teamId}
                  </Table.Td>
                  <Table.Td className="p-3 border-none text-center font-medium">
                    <Anchor
                      href={`#${team.teamName?.toLowerCase() || ""}`}
                      c="blue.3"
                      underline="always"
                      className="hover:text-orange-400 transition-colors"
                    >
                      {team.teamName}
                    </Anchor>
                  </Table.Td>
                  <Table.Td className="p-3 border-none text-center font-medium text-cyan-300">
                    {team.defenseScore}
                    {team.defenseScore === maxDefense && team.defenseScore !== 0 && (
                      <Badge color="yellow" size="xs" variant="filled" ml={6} style={{ verticalAlign: 'middle' }}>1</Badge>
                    )}
                  </Table.Td>
                  <Table.Td className="p-3 border-none text-center font-medium text-pink-300">
                    {team.attackScore}
                    {team.attackScore === maxAttack && team.attackScore !== 0 && (
                      <Badge color="yellow" size="xs" variant="filled" ml={6} style={{ verticalAlign: 'middle' }}>1</Badge>
                    )}
                  </Table.Td>
                  <Table.Td className="p-3 border-none text-center">
                    <Badge color={idx === 0 ? "orange" : "gray"} size="md" variant="filled" radius="sm" style={{ fontWeight: 700, fontSize: 16 }}>
                      {team.totalScore}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </Paper>
    </Container>
  );
}

export default RankingOverall;
