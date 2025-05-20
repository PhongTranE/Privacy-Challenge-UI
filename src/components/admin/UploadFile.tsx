import { useUploadFile } from "@/hooks/api/admin/useUploadFile";
import { useFileListStore } from "@/stores/admin/fileListStore";
import {
  Box,
  Button,
  FileButton,
  Group,
  Text,
  Paper,
  Title,
  Table,
  ActionIcon,
  Badge,
  Modal,
} from "@mantine/core";
import { IconUpload, IconTrash, IconBolt } from "@tabler/icons-react";
import { FileResponse } from "@/types/api/responses/admin/fileResponses";
import { useEffect, useState } from "react";
import { MAX_FILE_SIZE } from "@/utils/validations/fileValidation";


export const UploadFile = () => {
  const { handleUpload, isUploading } = useUploadFile();
  const {
    files,
    error,
    fetchFiles,
    deleteFile,
    activateFile,
    activatingFileId,
    deletingFileId,
  } = useFileListStore();
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [duplicateFile, setDuplicateFile] = useState<File | null>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateFilename, setDuplicateFilename] = useState<string | null>(null);
  const [isResolvingDuplicate, setIsResolvingDuplicate] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleFileChange = async (file: File | null) => {
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFileInputKey(Date.now());
        return;
      }
      try {
        await handleUpload(file);
        fetchFiles();
      } catch (error: any) {
        console.log("Upload error:", error);
        if (error?.duplicate) {
          setDuplicateFile(file);
          setDuplicateFilename(error.filename || file.name);
          setShowDuplicateModal(true);
          return;
        }
      } finally {
        setFileInputKey(Date.now());
      }
    } else {
      setFileInputKey(Date.now());
    }
  };

  const handleOverwrite = async () => {
    if (!duplicateFile) return;
    setIsResolvingDuplicate(true);
    try {
      await handleUpload(duplicateFile, { overwrite: true });
      setShowDuplicateModal(false);
      fetchFiles();
    } catch (err) {
    } finally {
      setIsResolvingDuplicate(false);
      setDuplicateFile(null);
      setDuplicateFilename(null);
    }
  };

  const handleAutoRename = async () => {
    if (!duplicateFile) return;
    setIsResolvingDuplicate(true);
    try {
      await handleUpload(duplicateFile, { auto_rename: true });
      setShowDuplicateModal(false);
      fetchFiles();
    } catch (err) {
    } finally {
      setIsResolvingDuplicate(false);
      setDuplicateFile(null);
      setDuplicateFilename(null);
    }
  };

  const handleDelete = async (fileId: number) => {
    try {
      await deleteFile(fileId);
    } catch (error) {
      // Notify đã xử lý ở store
    }
  };

  const handleActivate = async (fileId: number) => {
    try {
      await activateFile(fileId);
    } catch (error) {
      // Notify đã xử lý ở store
    }
  };

  return (
    <Paper shadow="sm" p="md" bg="#060606e6">
      <Title mb="md" size="xl" fw={500} c="#ff8c00">
        Deposit of data to be anonymized:
      </Title>
      <Box className="flex flex-col gap-4">
        <Group>
          <FileButton
            key={fileInputKey}
            onChange={handleFileChange}
            accept=".zip,application/zip"
            disabled={isUploading}
          >
            {(props) => (
              <Button
                {...props}
                leftSection={<IconUpload size={16} />}
                loading={isUploading}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload ZIP File"}
              </Button>
            )}
          </FileButton>
          <Text size="sm" c="dimmed">
            Only ZIP files up to 50MB are allowed
          </Text>
        </Group>
        {error && (
          <Text size="sm" c="red">
            Error: {error}
          </Text>
        )}
        <Table mt="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="text-center">Filename</Table.Th>
              <Table.Th className="text-center">Uploaded At</Table.Th>
              <Table.Th className="text-center">Status</Table.Th>
              <Table.Th className="text-center">Creator ID</Table.Th>
              <Table.Th className="text-center">Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {files.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5} className="text-center">
                  No files uploaded yet.
                </Table.Td>
              </Table.Tr>
            ) : (
              files.map((file: FileResponse) => (
                <Table.Tr key={file.id}>
                  <Table.Td className="text-center">{file.filename}</Table.Td>
                  <Table.Td className="text-center">{new Date(file.uploadedAt).toLocaleString()}</Table.Td>
                  <Table.Td className="text-center">
                    <Badge color={file.isActive ? "green" : "gray"}>
                      {file.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </Table.Td>
                  <Table.Td className="text-center">{file.creatorId}</Table.Td>
                  <Table.Td className="text-center">
                    <ActionIcon
                      color={file.isActive ? "yellow" : "gray"}
                      variant="subtle"
                      onClick={() => handleActivate(file.id)}
                      title={file.isActive ? "Deactivate" : "Activate"}
                      loading={activatingFileId === file.id}
                      disabled={isUploading || deletingFileId === file.id}
                    >
                      <IconBolt size={16} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => handleDelete(file.id)}
                      loading={deletingFileId === file.id}
                      disabled={isUploading || activatingFileId === file.id}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Box>
      <Modal opened={showDuplicateModal} onClose={() => setShowDuplicateModal(false)} title="File trùng tên" centered>
        <Text>
          File <b>{duplicateFilename}</b> đã tồn tại. Bạn muốn thay thế file cũ hay tự động đổi tên file mới?
        </Text>
        <Group mt="md">
          <Button color="red" onClick={handleOverwrite} loading={isResolvingDuplicate} disabled={isResolvingDuplicate}>
            Thay thế
          </Button>
          <Button onClick={handleAutoRename} loading={isResolvingDuplicate} disabled={isResolvingDuplicate}>
            Tự động đổi tên
          </Button>
          <Button variant="default" onClick={() => setShowDuplicateModal(false)} disabled={isResolvingDuplicate}>
            Hủy
          </Button>
        </Group>
      </Modal>
    </Paper>
  );
};
