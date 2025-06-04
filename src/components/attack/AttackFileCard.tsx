import React from "react";
import {
  Card,
  Group,
  Text,
  Button,
  FileInput,
  Badge,
  Loader,
  Collapse,
  Stack,
  Alert,
} from "@mantine/core";
import {
  IconDownload,
  IconUpload,
  IconHistory,
} from "@tabler/icons-react";
import { PublishedFile } from '@/types/api/responses/user/attackResponses';

interface AttackFileCardProps {
  file: PublishedFile;
  teamId: number;
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

export const AttackFileCard: React.FC<AttackFileCardProps> = ({
  file,
  teamId,
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
    <Card
      shadow="sm"
      mb="sm"
      withBorder
      style={{ background: "rgba(30, 32, 36, 0.95)", border: "1px solid #fff2" }}
    >
      <Group align="center" justify="space-between">
        <Text fw={600}>{file.name}</Text>
        <Group>
          <Button
            size="xs"
            variant="light"
            color="cyan"
            leftSection={<IconDownload size={16} />}
            onClick={() =>
              window.open(
                `/api/admin/group_user/${teamId}/files/anonymous/${file.id}/download`,
                "_blank"
              )
            }
          >
            Download
          </Button>
          <FileInput
            value={attackFile[file.id] || null}
            onChange={(f) =>
              setAttackFile((prev) => ({ ...prev, [file.id]: f }))
            }
            accept=".json"
            placeholder="Choose attack file"
            leftSection={<IconUpload size={16} />}
            style={{ width: 180 }}
            disabled={isPhaseEnded}
          />
          <Button
            size="xs"
            color="orange"
            loading={uploadingFileId === file.id}
            disabled={!attackFile[file.id] || isPhaseEnded}
            onClick={() => handleUploadAttack(file.id)}
          >
            Send the attack
          </Button>
          <Button
            size="xs"
            variant="subtle"
            color="cyan"
            leftSection={<IconHistory size={16} />}
            onClick={() =>
              setExpandedFileId(expandedFileId === file.id ? null : file.id)
            }
          >
            {expandedFileId === file.id ? "Hide Attacks" : "View Attacks"}
          </Button>
        </Group>
      </Group>
      {isPhaseEnded && (
        <Text size="xs" c="#ff8c00" mt={4}>
          Đã kết thúc phase, không thể upload attack.
        </Text>
      )}
      {/* Attack score */}
      <Group mt="xs" gap="sm">
        {attackScoreLoadingByFile[file.id] ? (
          <Loader size="xs" color="cyan" />
        ) : (
          <Badge color="green" variant="filled">
            My Score: {attackScoreByFile[file.id] ?? 0}
          </Badge>
        )}
        {attackScoreErrorByFile[file.id] && (
          <Text c="red">{attackScoreErrorByFile[file.id]}</Text>
        )}
      </Group>
      {/* Expand: show attack history */}
      <Collapse in={expandedFileId === file.id}>
        <Stack mt="sm" gap="xs">
          {attackHistoryLoadingByFile[file.id] && <Loader size="xs" color="cyan" />}
          {attackHistoryErrorByFile[file.id] && (
            <Alert color="red">{attackHistoryErrorByFile[file.id]}</Alert>
          )}
          {(attackHistoryByFile[file.id] || []).length === 0 && (
            <Text c="dimmed" size="sm">
              No attack history yet.
            </Text>
          )}
          {(attackHistoryByFile[file.id] || []).map((h) => (
            <Group key={h.id} justify="space-between">
              <Text size="sm">Attack ID: {h.id}</Text>
              <Text size="sm">Score: {h.score}</Text>
              <a href={h.file} target="_blank" rel="noopener noreferrer">
                <Button size="xs" variant="light">
                  View File
                </Button>
              </a>
            </Group>
          ))}
        </Stack>
      </Collapse>
    </Card>
  );
}; 