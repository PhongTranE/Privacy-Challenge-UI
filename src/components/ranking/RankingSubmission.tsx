import { Container, Table, Anchor, Loader, Alert, ActionIcon, Tooltip, Paper, Title, Badge } from "@mantine/core";
import { IconPlus, IconMinus } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { usePublicRanking, useGroupSubmissionFiles } from "@/hooks/api/useRanking";
import { useAuthStore } from "@/stores/authStore";
import { useCompetitionStatusStore } from "@/stores/user/competitionStatusStore";
import { useCompetitionStatusUser } from "@/hooks/api/user/useCompetitionStatus";
import React from "react";

function canExpand(user: any, isAuthenticated: boolean, phase: string | undefined) {
  if (!isAuthenticated) return false;
  if (user?.roles?.some((r: any) => r.name?.toLowerCase() === "administrator")) return true;
  if (phase === "finished") return true;
  return false;
}

function RankingSubmission({ filteredTeams }: { filteredTeams?: string[] }) {
  const { data, isLoading, error } = usePublicRanking();
  const { user, isAuthenticated } = useAuthStore();
  const phase = useCompetitionStatusStore().status?.phase;
  const setStatus = useCompetitionStatusStore((s) => s.setStatus);
  const { data: statusData } = useCompetitionStatusUser();
  const [expanded, setExpanded] = useState<number | null>(null);

  // Call the hook ONCE for the expanded team
  const { data: files, loading: filesLoading } = useGroupSubmissionFiles(expanded ?? undefined);

  useEffect(() => {
    if (statusData) setStatus(statusData.data);
  }, [statusData, setStatus]);

  let displayData = data?.data;
  if (filteredTeams && filteredTeams.length > 0) {
    displayData = displayData?.filter((team: any) => filteredTeams.includes(team.teamName));
  }

  const allowExpand = canExpand(user, isAuthenticated, phase);

  if (isLoading) return <Loader />;
  if (error) return <Alert color="red">Error loading defense ranking</Alert>;

  // Find max values for highlighting
  let maxUsefulness = -Infinity, maxDefense = -Infinity, maxBestOffense = -Infinity;
  let bestOffenseScore = -Infinity;
  if (displayData) {
    for (const team of displayData) {
      if (team.defenseScore > maxDefense) maxDefense = team.defenseScore;
    }
  }
  // For expanded files, find max usefulness and best offense
  let maxFileUsefulness = -Infinity, maxFileBestOffense = -Infinity;
  if (expanded && files) {
    for (const file of files) {
      if (typeof file.usefulness === 'number' && file.usefulness > maxFileUsefulness) maxFileUsefulness = file.usefulness;
      if (file.bestOffense && typeof file.bestOffense.score === 'number' && file.bestOffense.score > maxFileBestOffense) maxFileBestOffense = file.bestOffense.score;
    }
  }

  return (
    <Container size="lg" py="md">
      <Paper
        withBorder
        p="md"
        radius="lg"
        style={{ borderColor: "#e08b3d94", background: "#18181b", marginBottom: "80px", boxShadow: "0 4px 32px #0008" }}
      >
        <Title order={2} className="text-orange-400 mb-6 text-center tracking-wide drop-shadow-lg">
          Submission Ranking
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
                <Table.Th className="p-3 font-bold text-[15px] text-center text-orange-400 border-none">ID</Table.Th>
                <Table.Th className="p-3 font-bold text-[15px] text-center text-orange-400 border-none">Team Name</Table.Th>
                <Table.Th className="p-3 font-bold text-[15px] text-center text-orange-400 border-none">Submission</Table.Th>
                <Table.Th className="p-3 font-bold text-[15px] text-center text-orange-400 border-none">Usefulness</Table.Th>
                <Table.Th className="p-3 font-bold text-[15px] text-center text-orange-400 border-none">Best Offense</Table.Th>
                <Table.Th className="p-3 font-bold text-[15px] text-center text-orange-400 border-none">Defense Score</Table.Th>
                <Table.Th className="p-3 font-bold text-[15px] text-center text-orange-400 border-none">Action Detail</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {displayData?.sort((a: any, b: any) => b.defenseScore - a.defenseScore).map((team: any, idx: number) => {
                const isExpanded = expanded === team.teamId;
                return (
                  <React.Fragment key={team.teamId}>
                    <Table.Tr className="border-b border-zinc-800 hover:bg-zinc-800 transition-all">
                      <Table.Td className="p-3 border-none text-center font-medium text-white">{team.teamId}</Table.Td>
                      <Table.Td className="p-3 border-none text-center font-medium">
                        <Anchor href={`#${team.teamName || ""}`} c="blue.3" underline="always" className="hover:text-orange-400 transition-colors">
                          {team.teamName}
                        </Anchor>
                      </Table.Td>
                      <Table.Td className="p-3 border-none text-center"></Table.Td>
                      <Table.Td className="p-3 border-none text-center"></Table.Td>
                      <Table.Td className="p-3 border-none text-center"></Table.Td>
                      <Table.Td className="p-3 border-none text-center text-cyan-300 font-medium">
                        {team.defenseScore}
                        {team.defenseScore === maxDefense && team.defenseScore !== 0 && (
                          <Badge color="yellow" size="xs" variant="filled" ml={6} style={{ verticalAlign: 'middle' }}>1</Badge>
                        )}
                      </Table.Td>
                      <Table.Td className="p-3 border-none text-center">
                        {allowExpand ? (
                          <Tooltip label={isExpanded ? "Collapse" : "View submission details"}>
                            <ActionIcon variant="light" color="orange" onClick={() => setExpanded(isExpanded ? null : team.teamId)}>
                              {isExpanded ? <IconMinus size={18} /> : <IconPlus size={18} />}
                            </ActionIcon>
                          </Tooltip>
                        ) : (
                          <Tooltip label={!isAuthenticated ? "Login to view details" : "Only visible when competition is finished"}>
                            <ActionIcon variant="light" color="gray" disabled>
                              <IconPlus size={18} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </Table.Td>
                    </Table.Tr>
                    {isExpanded && (
                      filesLoading ? (
                        <Table.Tr key={`loading-${team.teamId}`} className="bg-orange-900/20 border-b border-orange-400 transition-all duration-300">
                          <Table.Td colSpan={7} className="text-center"><Loader size="sm" /></Table.Td>
                        </Table.Tr>
                      ) : files && files.length > 0 ? (
                        files.map((file: any) => (
                          <Table.Tr key={file.id} className="bg-orange-900/20 border-b border-orange-400 transition-all duration-300">
                            <Table.Td className="border-none"></Table.Td>
                            <Table.Td className="border-none"></Table.Td>
                            <Table.Td className="p-3 border-none text-center font-medium">
                              <span className="font-bold">{file.id}</span> <span className="ml-2">{file.name}</span>
                            </Table.Td>
                            <Table.Td className="p-3 border-none text-center font-medium text-cyan-300">
                              {file.usefulness ?? '-'}
                              {file.usefulness === maxFileUsefulness && file.usefulness !== 0 && (
                                <Badge color="yellow" size="xs" variant="filled" ml={6} style={{ verticalAlign: 'middle' }}>1</Badge>
                              )}
                            </Table.Td>
                            <Table.Td className="p-3 border-none text-center font-medium text-pink-300">
                              {file.bestOffense ? `${file.bestOffense.score} by ${file.bestOffense.attackName}` : '-'}
                              {file.bestOffense && file.bestOffense.score === maxFileBestOffense && file.bestOffense.score !== 0 && (
                                <Badge color="yellow" size="xs" variant="filled" ml={6} style={{ verticalAlign: 'middle' }}>1</Badge>
                              )}
                            </Table.Td>
                            <Table.Td className="p-3 border-none text-center font-medium">
                              {file.defenseScore ?? '-'}
                            </Table.Td>
                            <Table.Td className="border-none"></Table.Td>
                          </Table.Tr>
                        ))
                      ) : (
                        <Table.Tr key={`no-files-${team.teamId}`} className="bg-orange-900/20 border-b border-orange-400 transition-all duration-300"> 
                          <Table.Td colSpan={7} className="text-center text-zinc-400">No submission files for this team.</Table.Td>
                        </Table.Tr>
                      )
                    )}
                  </React.Fragment>
                );
              })}
            </Table.Tbody>
          </Table>
        </div>
      </Paper>
    </Container>
  );
}

export default RankingSubmission;