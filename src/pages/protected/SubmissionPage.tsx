import React, { useState, useEffect } from "react";
import {
  Container,
  Title,
  Card,
  Text,
  Badge,
  Stack,
  Group,
  Button,
  Alert,
  Loader,
  Table,
  Modal,
  FileInput,
  ActionIcon,
} from "@mantine/core";
import {
  IconUpload,
  IconAlertCircle,
  IconAdjustmentsPlus,
} from "@tabler/icons-react";
import {
  useSubmissionList,
  useUploadSubmission,
  useTogglePublish,
} from "@/hooks/api/user/useSubmission";
import { useNotify } from "@/hooks/useNotify";
import { StatusBadge } from "@/components/StatusBadge";

const SubmissionPage: React.FC = () => {
  const { data: submissions, isLoading, error, refetch } = useSubmissionList();
  const { mutate: uploadSubmission, isPending: isUploading } =
    useUploadSubmission();
  const { mutate: togglePublish } = useTogglePublish();
  const { success, error: notifyError } = useNotify();

  const [file, setFile] = useState<File | null>(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [pendingActionId, setPendingActionId] = useState<number | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<any>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    refetch();
  }, []);

  const handleFileUpload = () => {
    if (!file) return;

    uploadSubmission(file, {
      onSuccess: () => {
        refetch();
        setFile(null);
      },
      onError: (err: any) => {
        notifyError(
          "Error uploading file",
          err?.response?.data?.message || "Please try again."
        );
      },
    });
  };

  const handleTogglePublish = (id: number) => {
    setLoadingId(id);
    togglePublish(id, {
      onSuccess: () => {
        success("Publish status updated!");
        setLoadingId(null);
        refetch();
      },
      onError: (err: any) => {
        notifyError(
          "Error",
          err?.response?.data?.message || "Failed to toggle publish status."
        );
        setLoadingId(null);
      },
    });
  };

  const handleFileClick = (id: number) => {
    const file = submissions?.data?.find((submission) => submission.id === id);
    if (file) {
      setCurrentFile(file);
      setDetailsModalOpen(true);
    }
  };

  const getFileCount = (published: boolean) => {
    return (
      submissions?.data?.filter(
        (submission) => submission.isPublished === published
      ).length || 0
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Container size="lg" pt={100}>
          <Loader size="lg" color="cyan" />
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Container size="lg" pt={100}>
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Error"
            color="red"
          >
            {error.message}
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <Container size="lg" pt={100}>
        <Stack gap="xl">
          {/* Header */}
          <Group justify="space-between" align="flex-end">
            <Title order={2} fw={700} c="#ff8c00">
              Submission Management
            </Title>
          </Group>

          {/* Upload Section */}
          <Card
            shadow="xl"
            padding="xl"
            radius="lg"
            style={{
              background: "rgba(0, 0, 0, 0.9)",
              border: "1px solid #fff5",
            }}
          >
            <Stack gap="lg">
              <Title order={4} c="#ff8c00">
                Upload Submission
              </Title>
              <Text size="sm" c="dimmed">
                You have uploaded {getFileCount(true) + getFileCount(false)} /
                20 files. You have published {getFileCount(true)} / 3 files.
              </Text>
              <Group justify="space-between">
                <FileInput
                  clearable
                  label="Select your anonymized file"
                  accept=".zip"
                  value={file}
                  c="#fff"
                  onChange={setFile}
                  placeholder="Choose a ZIP file"
                  leftSection={<IconUpload size={16} />}
                  required
                  disabled={getFileCount(false) + getFileCount(true) >= 20}
                />
                <Button
                  color="cyan"
                  onClick={handleFileUpload}
                  loading={isUploading}
                  disabled={!file || isUploading}
                >
                  Upload
                </Button>
              </Group>
            </Stack>
          </Card>

          {/* Submission List Section */}
          <Card
            shadow="xl"
            padding="xl"
            radius="lg"
            style={{
              background: "rgba(0, 0, 0, 0.9)",
              border: "1px solid #fff5",
            }}
          >
            <Stack gap="lg">
              <Title order={4} c="#ff8c00">
                Submissions List
              </Title>
              {/* Display number of uploaded and published files */}
              <Group justify="space-between">
                <Badge color="cyan" variant="filled" size="lg">
                  Uploaded: {getFileCount(false) + getFileCount(true)}
                </Badge>
                <Badge color="green" variant="filled" size="lg">
                  Published: {getFileCount(true)}
                </Badge>
              </Group>
              <Table verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="text-[#ff8c00] font-bold text-center">
                      ID
                    </Table.Th>
                    <Table.Th className="text-[#ff8c00] font-bold text-center">
                      Name
                    </Table.Th>
                    <Table.Th className="text-[#ff8c00] font-bold text-center max-w-2xs">
                      Status
                    </Table.Th>
                    <Table.Th className="text-[#ff8c00] font-bold text-center">
                      Utility
                    </Table.Th>
                    <Table.Th className="text-[#ff8c00] font-bold text-center">
                      Naive Attack
                    </Table.Th>
                    <Table.Th className="text-[#ff8c00] font-bold text-center">
                      Published
                    </Table.Th>
                    <Table.Th className="text-[#ff8c00] font-bold text-center">
                      Actions
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {(submissions?.data?.length as number) > 0 ? (
                    submissions?.data?.map((submission) => (
                      <Table.Tr key={submission.id}>
                        <Table.Td className="text-center text-white">
                          {submission.id}
                        </Table.Td>
                        <Table.Td className="text-center text-white">
                          {submission.name}
                        </Table.Td>
                        <Table.Td className="text-center text-white max-w-2xs">
                          <StatusBadge status={submission.status} />
                        </Table.Td>
                        <Table.Td className="text-center text-white">
                          {submission.utility}
                        </Table.Td>
                        <Table.Td className="text-center text-white">
                          {submission.naiveAttack}
                        </Table.Td>
                        <Table.Td className="text-center">
                          <Badge
                            variant="outline"
                            color={submission.isPublished ? "green" : "red"}
                          >
                            {submission.isPublished
                              ? "Published"
                              : "Unpublished"}
                          </Badge>
                        </Table.Td>
                        <Table.Td className="text-center">
                          <Group gap="xs">
                            <Button
                              size="xs"
                              color="green"
                              onClick={() => {
                                setPendingActionId(submission.id);
                                setConfirmationModalOpen(true);
                              }}
                              loading={loadingId === submission.id}
                            >
                              {submission.isPublished ? "Unpublish" : "Publish"}
                            </Button>
                            <ActionIcon
                              size="md"
                              color="cyan"
                              onClick={() => handleFileClick(submission.id)}
                            >
                              <IconAdjustmentsPlus size={18} />
                            </ActionIcon>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={8} className="text-center text-white">
                        No submissions found
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Stack>
          </Card>
        </Stack>
      </Container>

      {/* Confirmation Modal */}
      <Modal
        opened={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        title={`Confirm Publish Action`}
        centered
      >
        <Text size="sm">
          {pendingActionId
            ? "Are you sure you want to toggle the publish status of this file?"
            : ""}
        </Text>
        <Group mt="md" justify="flex-end">
          <Button
            variant="default"
            onClick={() => setConfirmationModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            color="cyan"
            onClick={() => {
              if (pendingActionId !== null) {
                handleTogglePublish(pendingActionId);
                setConfirmationModalOpen(false);
                setPendingActionId(null);
              }
            }}
          >
            Confirm
          </Button>
        </Group>
      </Modal>

      {/* File Details Modal */}
      <Modal
        opened={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title="File Details"
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 5,
        }}
        radius="lg"
        styles={{
          content: {
            background: "rgba(30, 30, 30, 0.95)",
            color: "#f1f1f1",
            borderRadius: "12px",
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
          header: {
            borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#ffffff",
            backgroundColor: "rgba(40, 40, 40, 0.95)",
          },
          title: {
            color: "#ffffff",
            fontWeight: 600,
          },
          close: {
            color: "#ccc",
            "&:hover": {
              color: "#fff",
            },
          },
        }}
      >
        <Text mt={10} size="md" c="gray.0">
          <span className="text-[#ff8c00]">File Name:</span> {currentFile?.name}
        </Text>
        <Text mt={10} size="md" c="gray.0">
          <span className="text-[#ff8c00]">Status:</span> {currentFile?.status}
        </Text>
        <Text mt={10} size="md" c="gray.0">
          <span className="text-[#ff8c00]">Utility Score:</span>{" "}
          {currentFile?.utility}
        </Text>
        <Text mt={10} size="md" c="gray.0">
          <span className="text-[#ff8c00]">Naive Attack Score:</span>{" "}
          {currentFile?.naiveAttack}
        </Text>
        <Text mt={10} size="md" c="gray.0">
          <span className="text-[#ff8c00]">Published:</span>{" "}
          {currentFile?.isPublished ? "Yes" : "No"}
        </Text>
        <Text mt={10} size="md" c="gray.0">
          <span className="text-[#ff8c00]">Created At:</span>{" "}
          {currentFile?.createdAt}
        </Text>
      </Modal>
    </div>
  );
};

export default SubmissionPage;
