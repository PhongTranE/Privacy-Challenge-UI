import React from "react";
import {
  Table,
  Text,
  Badge,
  Button,
  Collapse,
  Stack,
  Loader,
  Alert,
} from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { AttackTeam, PublishedFile } from '@/types/api/responses/user/attackResponses';
import { AttackFileCard } from "@/components/attack/AttackFileCard";

interface AttackTeamTableProps {
  teams: AttackTeam[];
  expandedTeamId: number | null;
  setExpandedTeamId: (id: number | null) => void;
  filesByTeam: Record<number, PublishedFile[]>;
  filesLoadingByTeam: Record<number, boolean>;
  filesErrorByTeam: Record<number, string | null>;
  expandedFileId: number | null;
  setExpandedFileId: (id: number | null) => void;
  attackFile: Record<number, File | null>;
  setAttackFile: React.Dispatch<React.SetStateAction<Record<number, File | null>>>;
  uploadingFileId: number | null;
  handleUploadAttack: (fileId: number) => void;
  attackScoreByFile: Record<number, number>;
  attackScoreLoadingByFile: Record<number, boolean>;
  attackScoreErrorByFile: Record<number, string | null>;
  attackHistoryByFile: Record<number, any[]>;
  attackHistoryLoadingByFile: Record<number, boolean>;
  attackHistoryErrorByFile: Record<number, string | null>;
  isPhaseEnded: boolean;
}

export const AttackTeamTable: React.FC<AttackTeamTableProps> = ({
  teams,
  expandedTeamId,
  setExpandedTeamId,
  filesByTeam,
  filesLoadingByTeam,
  filesErrorByTeam,
  expandedFileId,
  setExpandedFileId,
  attackFile,
  setAttackFile,
  uploadingFileId,
  handleUploadAttack,
  attackScoreByFile,
  attackScoreLoadingByFile,
  attackScoreErrorByFile,
  attackHistoryByFile,
  attackHistoryLoadingByFile,
  attackHistoryErrorByFile,
  isPhaseEnded,
}) => {
  return (
    <Table striped highlightOnHover withColumnBorders className="bg-transparent">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Team</Table.Th>
          <Table.Th>Files Published</Table.Th>
          <Table.Th>Expand</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {teams && teams.length > 0 ? (
          teams.map((team) => (
            <React.Fragment key={team.id}>
              <Table.Tr>
                <Table.Td>
                  <Text fw={700}>{team.name}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge color="cyan" variant="filled">
                    {team.num_published}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Button
                    size="xs"
                    variant="subtle"
                    color="cyan"
                    onClick={() =>
                      setExpandedTeamId(expandedTeamId === team.id ? null : team.id)
                    }
                    leftSection={
                      expandedTeamId === team.id ? (
                        <IconChevronUp size={16} />
                      ) : (
                        <IconChevronDown size={16} />
                      )
                    }
                    disabled={isPhaseEnded}
                  >
                    {expandedTeamId === team.id ? "Hide" : "Show"}
                  </Button>
                </Table.Td>
              </Table.Tr>
              {/* Expand: show files */}
              <Table.Tr>
                <Table.Td colSpan={3} style={{ padding: 0, background: "#181a1b" }}>
                  <Collapse in={expandedTeamId === team.id}>
                    <Stack p="md" gap="sm">
                      {filesLoadingByTeam[team.id] && <Loader color="cyan" />}
                      {filesErrorByTeam[team.id] && (
                        <Alert color="red">{filesErrorByTeam[team.id]}</Alert>
                      )}
                      {(filesByTeam[team.id] || []).map((file) => (
                        <AttackFileCard
                          key={file.id}
                          file={file}
                          teamId={team.id}
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
                      ))}
                    </Stack>
                  </Collapse>
                </Table.Td>
              </Table.Tr>
            </React.Fragment>
          ))
        ) : (
          <Table.Tr>
            <Table.Td colSpan={3}>
              <Text c="dimmed" size="sm">
                No teams found.
              </Text>
            </Table.Td>
          </Table.Tr>
        )}
      </Table.Tbody>
    </Table>
  );
}; 