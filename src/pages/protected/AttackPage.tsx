import React, { useEffect, useState } from "react";
import {
  Container,
  Title,
  Stack,
  Group,
  Modal,
  Card,
  Text,
  Loader,
  Alert,
  Button,
  FileInput,
  Table,
  Tooltip,
} from "@mantine/core";
import { useAttackPhaseStore } from "@/stores/user/attackStore";
import { useCompetitionStatusUser } from "@/hooks/api/user/useCompetitionStatus";
import { downloadPublishedFile } from "@/services/api/user/attackApi";
import { useNotify } from "@/hooks/useNotify";
import { useAuthStore } from "@/stores/authStore";

const AttackPage: React.FC = () => {
  const {
    teams,
    expandedTeamId,
    filesByTeam,
    filesLoadingByTeam,
    filesErrorByTeam,
    attackScoreByFile,
    attackScoreLoadingByFile,
    attackScoreErrorByFile,
    attackHistoryByFile,
    attackHistoryLoadingByFile,
    attackHistoryErrorByFile,
    setExpandedTeamId,
    fetchTeams,
    fetchFilesByTeam,
    fetchAttackScoreByFile,
    fetchAttackHistoryByFile,
    uploadLoading,
    doUploadAttackFile,
    setUploadResult,
    fileUpload,
    setFileUpload,
  } = useAttackPhaseStore();

  const {
    data: competitionStatus,
    isLoading: isStatusLoading,
    error: statusError,
  } = useCompetitionStatusUser();
  const phase = competitionStatus?.data?.phase;
  const isPaused = competitionStatus?.data?.isPaused;
  const isPhaseEnded = phase === "finished";
  const isPhaseNotStarted =
    phase === "setup" ||
    phase === "submission" ||
    phase === "finished_submission" ||
    isPaused;

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  // New modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailFileId, setDetailFileId] = useState<number | null>(null);
  const [detailFileName, setDetailFileName] = useState<string>("");

  const { error: notifyError } = useNotify();

  const user = useAuthStore((state) => state.user);
  const isGroupBanned = user?.group?.isBanned;

  // Fetch teams on mount
  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // Fetch files when expand team
  useEffect(() => {
    if (expandedTeamId) {
      fetchFilesByTeam(expandedTeamId);
      fetchAttackScoreByFile(expandedTeamId);
      fetchAttackHistoryByFile(expandedTeamId);
    }
  }, [
    expandedTeamId,
    fetchFilesByTeam,
    fetchAttackScoreByFile,
    fetchAttackHistoryByFile,
  ]);

  // Fetch score/history when modal mở
  useEffect(() => {
    if (modalOpen && selectedFileId) {
      fetchAttackScoreByFile(selectedFileId);
      fetchAttackHistoryByFile(selectedFileId);
    }
  }, [
    modalOpen,
    selectedFileId,
    fetchAttackScoreByFile,
    fetchAttackHistoryByFile,
  ]);

  // Reset modal khi đóng
  useEffect(() => {
    if (!modalOpen) {
      setFileToUpload(null);
      setSelectedFileId(null);
      setSelectedFileName("");
      setUploadResult(null);
    }
  }, [modalOpen, setUploadResult]);

  const handleDownload = async (anonymId: number, fileName: string) => {
    if (isPhaseEnded || isPhaseNotStarted) return;
    try {
      const blob = await downloadPublishedFile(anonymId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      if (e?.response?.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = function () {
          try {
            const json = JSON.parse(reader.result as string);
            notifyError(
              json.message || e,
              "Failed to download file. Your group may be banned, please contact admin."
            );
          } catch {
            notifyError(
              e,
              "Failed to download file. Your group may be banned, please contact admin."
            );
          }
        };
        reader.readAsText(e.response.data);
      } else {
        notifyError(
          e,
          "Failed to download file. Your group may be banned, please contact admin."
        );
      }
    }
  };

  return (
    <div className="min-h-screen text-white">
      <Container size="lg" pt={100}>
        <Stack gap="xl">
          {/* Header */}
          <Group justify="space-between" align="flex-end">
            <Title order={2} fw={700} c="#ff8c00">
              Attack Phase
            </Title>
            {isPhaseNotStarted && (
              <span style={{ color: "#ff8c00", fontWeight: 600, fontSize: 18 }}>
                {isPaused ? "Phase Paused" : "Phase Not Started"}
              </span>
            )}
            {isPhaseEnded && (
              <span style={{ color: "#ff8c00", fontWeight: 600, fontSize: 18 }}>
                Phase Ended
              </span>
            )}
          </Group>
          {/* Teams & Files */}
          <Stack gap="md">
            <Title order={4} c="#ff8c00">
              Teams with Published Files
            </Title>
            {teams.length === 0 ||
            teams.every((team) => team.numPublished === 0) ? (
              <Alert color="yellow" variant="filled" fw={600}>
                No team has published any files yet.
              </Alert>
            ) : (
              <Group>
                {teams.map((team) => (
                  <Card
                    key={team.id}
                    shadow={expandedTeamId === team.id ? "xl" : "sm"}
                    onClick={() =>
                      setExpandedTeamId(
                        expandedTeamId === team.id ? null : team.id
                      )
                    }
                    style={{
                      cursor: "pointer",
                      border:
                        expandedTeamId === team.id
                          ? "2px solid rgb(213, 173, 79)"
                          : undefined,
                      background: 
                        expandedTeamId === team.id
                          ? "#ff8c00" 
                          : undefined,
                      transition: "all 0.2s"
                    }}
                  >
                    <Text fw={600}>{team.name}</Text>
                    <Text size="sm">Files published: {team.numPublished}</Text>
                  </Card>
                ))}
              </Group>
            )}
            {expandedTeamId && (
              <Stack>
                <Text fw={600}>
                  Published files of team: {teams.find((t) => t.id === expandedTeamId)?.name}
                </Text>
                {filesLoadingByTeam[expandedTeamId] && <Loader />}
                {filesErrorByTeam[expandedTeamId] && (
                  <Alert color="red">{filesErrorByTeam[expandedTeamId]}</Alert>
                )}
                <div style={{ overflowX: "auto" }}>
                  <Table
                    withColumnBorders
                    highlightOnHover
                    className="w-full bg-zinc-900 rounded-xl overflow-hidden shadow-lg text-white"
                  >
                    <Table.Thead>
                      <Table.Tr className="bg-gradient-to-r from-zinc-800 to-zinc-700">
                        <Table.Th className="p-3 font-bold text-[15px] text-center text-orange-500 border-none">
                          ID
                        </Table.Th>
                        <Table.Th className="p-3 font-bold text-[15px] text-center text-orange-500 border-none">
                          File Name
                        </Table.Th>
                        <Table.Th className="p-3 font-bold text-[15px] text-center text-orange-500 border-none">
                          Score
                        </Table.Th>
                        <Table.Th className="p-3 font-bold text-[15px] text-center text-orange-500 border-none">
                          Download
                        </Table.Th>
                        <Table.Th className="p-3 font-bold text-[15px] text-center text-orange-500 border-none">
                          Upload
                        </Table.Th>
                        <Table.Th className="p-3 font-bold text-[15px] text-center text-orange-500 border-none">
                          Detail
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {(filesByTeam[expandedTeamId] || []).map((file) => (
                        <Table.Tr
                          key={file.id}
                          className="border-b border-zinc-800 hover:bg-zinc-800 transition-all"
                        >
                          <Table.Td className="p-3 border-none text-center font-medium">
                            {file.id}
                          </Table.Td>
                          <Table.Td className="p-3 border-none text-center font-medium">
                            {file.name}
                          </Table.Td>
                          <Table.Td className="p-3 border-none text-center">
                            {attackScoreLoadingByFile[file.id] ? (
                              <Loader size="xs" color="cyan" />
                            ) : (
                              attackScoreByFile[file.id] ?? "-"
                            )}
                            {attackScoreErrorByFile[file.id] && (
                              <Text c="red" size="xs">
                                {attackScoreErrorByFile[file.id]}
                              </Text>
                            )}
                          </Table.Td>
                          <Table.Td className="p-3 border-none text-center">
                            <Tooltip
                              label={
                                isGroupBanned
                                  ? "Your group has been banned by admin, please contact admin."
                                  : ""
                              }
                              disabled={!isGroupBanned}
                              withArrow
                              color="red"
                            >
                              <Button
                                size="xs"
                                variant="light"
                                color="cyan"
                                component="span"
                                onClick={() =>
                                  handleDownload(file.id, file.name)
                                }
                                disabled={
                                  isPhaseEnded ||
                                  isPhaseNotStarted ||
                                  isGroupBanned
                                }
                              >
                                Download
                              </Button>
                            </Tooltip>
                          </Table.Td>
                          <Table.Td className="p-3 border-none text-center">
                            <Group gap={4} justify="center">
                              <Tooltip
                                label={
                                  isGroupBanned
                                    ? "Your group has been banned by admin, please contact admin."
                                    : ""
                                }
                                disabled={!isGroupBanned}
                                withArrow
                                color="red"
                              >
                                <FileInput
                                  value={fileUpload[file.id] || null}
                                  onChange={(f) => setFileUpload(file.id, f)}
                                  disabled={uploadLoading || isGroupBanned}
                                  style={{ width: 140 }}
                                  accept=".json"
                                  clearable
                                  placeholder="Choose file"
                                  classNames={{
                                    input: "rounded-lg bg-zinc-900 text-white border border-zinc-700 focus:border-orange-500 transition-all px-3 py-2",
                                    root: "w-44",
                                  }}
                                  styles={{
                                    input: { minWidth: 0 },
                                  }}
                                />
                              </Tooltip>
                              <Tooltip
                                label={
                                  isGroupBanned
                                    ? "Your group has been banned by admin, please contact admin."
                                    : ""
                                }
                                disabled={!isGroupBanned}
                                withArrow
                                color="red"
                              >
                                <Button
                                  size="xs"
                                  loading={
                                    uploadLoading && selectedFileId === file.id
                                  }
                                  disabled={
                                    !fileUpload[file.id] ||
                                    uploadLoading ||
                                    isPhaseEnded ||
                                    isPhaseNotStarted ||
                                    isGroupBanned
                                  }
                                  className="font-semibold shadow-md transition-all bg-orange-600 hover:bg-orange-700 rounded-md"
                                  style={{ minWidth: 80 }}
                                  onClick={async () => {
                                    setSelectedFileId(file.id);
                                    setSelectedFileName(file.name);
                                    if (fileUpload[file.id]) {
                                      try {
                                        await doUploadAttackFile(
                                          file.id,
                                          fileUpload[file.id]!
                                        );
                                        fetchAttackScoreByFile(file.id);
                                        fetchAttackHistoryByFile(file.id);
                                        setFileUpload(file.id, null);
                                      } catch (err) {
                                        notifyError(
                                          err,
                                          "Failed to upload attack file"
                                        );
                                      }
                                    }
                                  }}
                                >
                                  Upload
                                </Button>
                              </Tooltip>
                            </Group>
                          </Table.Td>
                          <Table.Td className="p-3 border-none text-center">
                            {Array.isArray(attackHistoryByFile[file.id]) &&
                              attackHistoryByFile[file.id].length > 0 && (
                                <Button
                                  size="xs"
                                  variant="subtle"
                                  color="cyan"
                                  onClick={() => {
                                    setDetailFileId(file.id);
                                    setDetailFileName(file.name);
                                    setDetailModalOpen(true);
                                  }}
                                >
                                  Detail
                                </Button>
                              )}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </div>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Container>
      {/* Modal hiển thị lịch sử attack */}
      <Modal
        opened={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={
          <Text fw={700} c="#ff8c00">
            Attack History: {detailFileName}
          </Text>
        }
        centered
        size="md"
        styles={{
          title: {
            color: "#ff8c00",
          },
        }}
      >
        {detailFileId && (
          <>
            {attackHistoryLoadingByFile[detailFileId] && (
              <Loader size="xs" color="cyan" />
            )}
            {attackHistoryErrorByFile[detailFileId] && (
              <Alert color="red">
                {attackHistoryErrorByFile[detailFileId]}
              </Alert>
            )}
            <Table
              withColumnBorders
              highlightOnHover
              className="w-full bg-zinc-900 rounded-lg overflow-hidden shadow text-white"
            >
              <Table.Thead>
                <Table.Tr className="bg-gradient-to-r from-zinc-800 to-zinc-700">
                  <Table.Th className="text-center p-3 font-bold text-[15px] text-orange-500 border-none">
                    Attack ID
                  </Table.Th>
                  <Table.Th className="text-center p-3 font-bold text-[15px] text-orange-500 border-none">
                    Score
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {(attackHistoryByFile[detailFileId] || []).map((h: any) => (
                  <Table.Tr
                    key={h.id}
                    className="border-b border-zinc-800 hover:bg-zinc-800 transition-all"
                  >
                    <Table.Td className="p-3 border-none text-center font-medium">
                      {h.id}
                    </Table.Td>
                    <Table.Td className="p-3 border-none text-center font-medium">
                      {h.score}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
            {(attackHistoryByFile[detailFileId] || []).length === 0 && (
              <Text c="dimmed" size="sm">
                No attack history yet.
              </Text>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default AttackPage;
