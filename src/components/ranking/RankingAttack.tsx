import { Container, Table, Badge, Anchor, Loader, Alert, Paper, Title, ActionIcon, Tooltip } from "@mantine/core";
import { IconPlus, IconMinus } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { usePublicRanking, useAttackListByGroup, useAttackedFiles } from "@/hooks/api/useRanking";
import React from "react";
import { useAuthStore } from "@/stores/authStore";
import { useCompetitionStatusStore } from "@/stores/user/competitionStatusStore";
import { useCompetitionStatusUser } from "@/hooks/api/user/useCompetitionStatus";

interface RankingAttackProps {
  filteredTeams?: string[];
}

function canExpand(user: any, isAuthenticated: boolean, phase: string | undefined) {
  if (!isAuthenticated) return false;
  if (user?.roles?.some((r: any) => r.name?.toLowerCase() === "administrator")) return true;
  if (phase === "finished") return true;
  return false;
}

export default function RankingAttack({ filteredTeams }: RankingAttackProps) {
  const { data, isLoading, error } = usePublicRanking();
  const { user, isAuthenticated } = useAuthStore();
  const phase = useCompetitionStatusStore().status?.phase;
  const setStatus = useCompetitionStatusStore((s) => s.setStatus);
  const { data: statusData } = useCompetitionStatusUser();
  const [expanded, setExpanded] = useState<number | null>(null); // team expand
  const [attackExpanded, setAttackExpanded] = useState<string | null>(null); // attack row expand (key: `${groupIdAttack}-${groupIdDefense}`)

  // Lấy tổng số group thực sự tham gia cuộc thi (từ API public ranking, chưa lọc)
  const totalGroupCount = data?.data?.length || 0;

  let displayData = data?.data;
  if (filteredTeams && filteredTeams.length > 0) {
    displayData = displayData?.filter((team: any) => filteredTeams.includes(team.teamName));
  }

  // Tìm điểm attack cao nhất
  const maxAttack = displayData ? Math.max(...displayData.map((team: any) => team.attackScore ?? 0)) : -Infinity;

  // Lấy danh sách các team bị attack khi expand
  const { data: attackList, loading: attackListLoading, error: attackListError } = useAttackListByGroup(expanded ?? undefined);

  // Lấy danh sách file bị attack khi expand dòng attack
  let groupIdAttack: number | undefined = undefined;
  let groupIdDefense: number | undefined = undefined;
  if (attackExpanded) {
    const [atk, def] = attackExpanded.split("-").map(Number);
    groupIdAttack = atk;
    groupIdDefense = def;
  }
  const { data: attackedFiles, loading: attackedFilesLoading, error: attackedFilesError } = useAttackedFiles(groupIdAttack, groupIdDefense);

  const allowExpand = canExpand(user, isAuthenticated, phase);

  useEffect(() => {
    if (statusData) setStatus(statusData.data);
  }, [statusData, setStatus]);

  if (isLoading) return <Loader />;
  if (error) return <Alert color="red">Error loading attack ranking</Alert>;

  return (
    <Container size="lg" py="md">
      <Paper
        withBorder
        p="md"
        radius="lg"
        style={{ borderColor: "#e08b3d94", background: "#18181b", marginBottom: "80px", boxShadow: "0 4px 32px #0008" }}
      >
        <Title order={2} className="text-orange-400 mb-6 text-center tracking-wide drop-shadow-lg">
          Attack Ranking
        </Title>
        <div className="overflow-x-auto">
          <Table
            highlightOnHover
            withColumnBorders
            className="w-full bg-zinc-900 rounded-xl overflow-hidden shadow-lg text-white"
            verticalSpacing="md"
            horizontalSpacing="md"
            fs="md"
            style={{ tableLayout: 'fixed', width: '100%' }}
          >
            <Table.Thead>
              <Table.Tr className="bg-gradient-to-r from-zinc-800 to-zinc-700">
                <Table.Th style={{ width: 60 }} className="p-3 font-bold text-[15px] text-center text-orange-400 border-none">ID</Table.Th>
                <Table.Th style={{ width: 180 }} className="p-3 font-bold text-[15px] text-center text-orange-400 border-none">Team Name</Table.Th>
                <Table.Th style={{ width: 180 }} className="p-3 font-bold text-[15px] text-center text-orange-400 border-none">Minimal Attack</Table.Th>
                <Table.Th style={{ width: 180 }} className="p-3 font-bold text-[15px] text-center text-orange-400 border-none">Attacked</Table.Th>
                <Table.Th style={{ width: 160 }} className="p-3 font-bold text-[15px] text-center text-orange-400 border-none">Attack Rating</Table.Th>
                <Table.Th style={{ width: 100 }} className="p-3 font-bold text-[15px] text-center text-orange-400 border-none">Details:</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {displayData?.sort((a: any, b: any) => b.attackScore - a.attackScore).map((team: any, idx: number) => {
                const isExpanded = expanded === team.teamId;
                return (
                  <React.Fragment key={team.teamId}>
                    <Table.Tr className="border-b border-zinc-800 hover:bg-zinc-800 transition-all">
                      <Table.Td className="p-3 border-none text-center font-medium text-white">
                        {team.teamId}
                      </Table.Td>
                      <Table.Td className="p-3 border-none text-center font-medium">
                        <Anchor href={`#${team.teamName || ""}`} c="blue.3" underline="always" className="hover:text-orange-400 transition-colors">
                          {team.teamName}
                        </Anchor>
                      </Table.Td>
                      <Table.Td className="p-3 border-none text-center font-medium text-cyan-300"></Table.Td>
                      <Table.Td className="p-3 border-none text-center font-medium"></Table.Td>
                      <Table.Td className="p-3 border-none text-center font-medium text-pink-300">
                        {team.attackScore}{"/"}{totalGroupCount}
                        {team.attackScore === maxAttack && team.attackScore !== 0 && (
                          <Badge color="yellow" size="xs" variant="filled" ml={6} style={{ verticalAlign: 'middle' }}>1</Badge>
                        )}
                      </Table.Td>
                      <Table.Td className="p-3 border-none text-center">
                        {allowExpand ? (
                          <Tooltip label={isExpanded ? "Collapse" : "View attack details"}>
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
                      attackListLoading ? (
                        <Table.Tr className="bg-orange-900/20 border-b border-orange-400">
                          <Table.Td colSpan={6}><div className="text-center py-4"><Loader size="sm" /></div></Table.Td>
                        </Table.Tr>
                      ) : attackListError ? (
                        <Table.Tr className="bg-orange-900/20 border-b border-orange-400">
                          <Table.Td colSpan={6}><div className="text-center text-red-400 py-4">{attackListError}</div></Table.Td>
                        </Table.Tr>
                      ) : attackList && attackList.length > 0 ? (
                        attackList.map((attack: any) => {
                          const attackKey = `${team.teamId}-${attack.attackedGroupId}`;
                          const isAttackExpanded = attackExpanded === attackKey;
                          return (
                            <React.Fragment key={attackKey}>
                              <Table.Tr className="bg-orange-900/20 border-b border-orange-400">
                                <Table.Td className="p-3 border-none text-center font-medium text-white"><span style={{ opacity: 0 }}>0</span></Table.Td>
                                <Table.Td className="p-3 border-none text-center font-medium text-white"><span style={{ opacity: 0 }}>000</span></Table.Td>
                                <Table.Td className="p-3 border-none text-center font-medium text-cyan-300">
                                  {attack.attackScore?.toFixed(4)} {attack.minimalAttackFile ? (
                                    <span>of <Anchor href={`#${attack.minimalAttackFile.id}`} className="font-bold">#{attack.minimalAttackFile.id} {attack.minimalAttackFile.name}</Anchor></span>
                                  ) : null}
                                </Table.Td>
                                <Table.Td className="p-3 border-none text-center font-medium text-white">
                                  <Anchor href={`#${attack.attackedGroupName || ""}`}>{attack.attackedGroupName}</Anchor>
                                </Table.Td>
                                <Table.Td className="p-3 border-none text-center">
                                  <Tooltip label={isAttackExpanded ? "Collapse" : "View attacked files"}>
                                    <ActionIcon variant="light" color="orange" onClick={() => setAttackExpanded(isAttackExpanded ? null : attackKey)}>
                                      {isAttackExpanded ? <IconMinus size={18} /> : <IconPlus size={18} />}
                                    </ActionIcon>
                                  </Tooltip>
                                </Table.Td>
                                <Table.Td className="p-3 border-none text-center font-medium text-white"><span style={{ opacity: 0 }}>000</span></Table.Td>
                              </Table.Tr>
                              {isAttackExpanded && (
                                attackedFilesLoading ? (
                                  <Table.Tr className="bg-yellow-900/10 border-b border-yellow-400">
                                    <Table.Td colSpan={6}><div className="text-center py-2"><Loader size="xs" /></div></Table.Td>
                                  </Table.Tr>
                                ) : attackedFilesError ? (
                                  <Table.Tr className="bg-yellow-900/10 border-b border-yellow-400">
                                    <Table.Td colSpan={6}><div className="text-center text-red-400 py-2">{attackedFilesError}</div></Table.Td>
                                  </Table.Tr>
                                ) : attackedFiles && attackedFiles.length > 0 ? (
                                  attackedFiles.map((file: any) => (
                                    <Table.Tr key={file.fileId} className="bg-yellow-900/10 border-b border-yellow-400">
                                      <Table.Td className="p-3 border-none text-center font-medium text-white"><span style={{ opacity: 0 }}>000</span></Table.Td>
                                      <Table.Td className="p-3 border-none text-center font-medium text-white"><span style={{ opacity: 0 }}>000</span></Table.Td>
                                      <Table.Td className="p-3 border-none text-center font-medium text-zinc-300">
                                        <span className="font-bold">{file.fileId}</span> <span className="ml-2">{file.fileName}</span>
                                      </Table.Td>
                                      <Table.Td className="p-3 border-none text-center font-medium text-white"><span style={{ opacity: 0 }}>000</span></Table.Td>
                                      <Table.Td className="p-3 border-none text-center font-medium text-pink-400">{file.maxAttackScore}</Table.Td>
                                      <Table.Td className="p-3 border-none text-center font-medium text-white"><span style={{ opacity: 0 }}>000</span></Table.Td>
                                    </Table.Tr>
                                  ))
                                ) : (
                                  <Table.Tr className="bg-yellow-900/10 border-b border-yellow-400">
                                    <Table.Td colSpan={6}><div className="text-center py-2">No attacked files</div></Table.Td>
                                  </Table.Tr>
                                )
                              )}
                            </React.Fragment>
                          );
                        })
                      ) : (
                        <Table.Tr className="bg-orange-900/20 border-b border-orange-400">
                          <Table.Td colSpan={6}><div className="text-center text-zinc-400 py-4">No attack data</div></Table.Td>
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