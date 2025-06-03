import React, { useEffect, useState } from "react";
import { Container, Title, Stack, Group } from "@mantine/core";
import { useAttackPhaseStore } from "@/stores/user/attackStore";
import { AttackTeamTable } from "@/components/attack/AttackTeamTable";
import { useCompetitionStatus } from "@/hooks/api/admin/useCompetition";

const AttackPage: React.FC = () => {
  const {
    teams,
    expandedTeamId,
    filesByTeam,
    filesLoadingByTeam,
    filesErrorByTeam,
    expandedFileId,
    attackScoreByFile,
    attackScoreLoadingByFile,
    attackScoreErrorByFile,
    attackHistoryByFile,
    attackHistoryLoadingByFile,
    attackHistoryErrorByFile,
    setExpandedTeamId,
    setExpandedFileId,
    fetchTeams,
    fetchFilesByTeam,
    fetchAttackScoreByFile,
    fetchAttackHistoryByFile,
  } = useAttackPhaseStore();

  const { data: competitionStatus } = useCompetitionStatus();
  const phase = competitionStatus?.data?.phase;
  const isPhaseEnded = phase === "finished_submission" || phase === "attack" || phase === "finished";

  // File upload state
  const [uploadingFileId, setUploadingFileId] = useState<number | null>(null);
  const [attackFile, setAttackFile] = useState<Record<number, File | null>>({});

  // Fetch teams on mount
  useEffect(() => {
    fetchTeams();
  }, []);

  // Fetch files when expand team
  useEffect(() => {
    if (expandedTeamId) fetchFilesByTeam(expandedTeamId);
  }, [expandedTeamId]);

  // Fetch attack score/history when expand file
  useEffect(() => {
    if (expandedFileId) {
      fetchAttackScoreByFile(expandedFileId);
      fetchAttackHistoryByFile(expandedFileId);
    }
  }, [expandedFileId]);

  // Handle upload attack file (dummy, bạn cần gọi API upload thực tế)
  const handleUploadAttack = (fileId: number) => {
    setUploadingFileId(fileId);
    setTimeout(() => {
      setUploadingFileId(null);
      // Sau khi upload thành công, refetch score/history
      fetchAttackScoreByFile(fileId);
      fetchAttackHistoryByFile(fileId);
    }, 1000);
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
            {isPhaseEnded && (
              <span style={{ color: '#ff8c00', fontWeight: 600, fontSize: 18 }}>
                Đã kết thúc phase
              </span>
            )}
          </Group>
          {/* Teams Table Section */}
          <AttackTeamTable
            teams={teams}
            expandedTeamId={expandedTeamId}
            setExpandedTeamId={setExpandedTeamId}
            filesByTeam={filesByTeam}
            filesLoadingByTeam={filesLoadingByTeam}
            filesErrorByTeam={filesErrorByTeam}
            expandedFileId={expandedFileId}
            setExpandedFileId={setExpandedFileId}
            attackFile={attackFile}
            setAttackFile={setAttackFile}
            uploadingFileId={uploadingFileId}
            handleUploadAttack={handleUploadAttack}
            attackScoreByFile={attackScoreByFile}
            attackScoreLoadingByFile={attackScoreLoadingByFile}
            attackScoreErrorByFile={attackScoreErrorByFile}
            attackHistoryByFile={attackHistoryByFile}
            attackHistoryLoadingByFile={attackHistoryLoadingByFile}
            attackHistoryErrorByFile={attackHistoryErrorByFile}
            isPhaseEnded={isPhaseEnded}
          />
        </Stack>
      </Container>
    </div>
  );
};

export default AttackPage;
