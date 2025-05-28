import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Stack,
  Text,
  Badge,
  Table,
  Tabs,
  Card,
  Grid,
  Flex,
  Loader,
  Alert,
  Button,
  ActionIcon,
  Group,
} from "@mantine/core";
import {
  IconUsers,
  IconFiles,
  IconShield,
  IconSwords,
  IconTrophy,
  IconAlertCircle,
  IconEdit,
  IconTrash,
  IconDownload,
} from "@tabler/icons-react";
import {
  useChangeGroupNameModalStore,
  useDetailGroupModalStore,
  useRemoveGroupMemberModalStore,
} from "@/stores/admin/groupManageStore";
import {
  useFetchGroupDetailFull,
  useFetchGroupFiles,
  useDownloadGroupFile,
  useDeleteGroupFile,
} from "@/hooks/api/admin/useGroupManage";
import { GroupFile } from "@/types/common/groupTypes";

export const GroupDetailModal = () => {
  const { modalOpen, groupToDetail, closeModal } = useDetailGroupModalStore();
  const { openModal: openChangeGroupNameModal } =
    useChangeGroupNameModalStore();
  const { openModal: openRemoveMemberModal } = useRemoveGroupMemberModalStore();

  const {
    data: groupDetailFull,
    isLoading: isLoadingDetailFull,
    error: detailErrorFull,
  } = useFetchGroupDetailFull(groupToDetail?.id || 0);

  const [fileTypeFilter, setFileTypeFilter] = useState<
    "all" | "anonymous" | "attack"
  >("all");
  const { data: groupFiles = [], isLoading: isLoadingFiles } =
    useFetchGroupFiles(
      groupToDetail?.id || 0,
      fileTypeFilter === "all" ? undefined : fileTypeFilter
    );
  const filteredFiles = useMemo(() => {
    return groupFiles ?? [];
  }, [groupFiles]);
  const downloadMutation = useDownloadGroupFile();
  const handleDownloadFile = (file: GroupFile) => {
    downloadMutation.mutate({
      groupId: groupDetailFull?.group?.id!,
      fileType: file.fileType,
      fileId: file.id,
    });
  };
  const deleteMutation = useDeleteGroupFile();
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<GroupFile | null>(null);
  const handleDeleteFile = (file: GroupFile) => {
    setFileToDelete(file);
    setConfirmDeleteModalOpen(true);
  };

  const [activeTab, setActiveTab] = useState<string>("overview");
  useEffect(() => {
    if (modalOpen && groupToDetail?.id) {
      setActiveTab("overview");
    }
  }, [modalOpen, groupToDetail?.id]);

  const renderOverviewTab = () => (
    <Stack gap="md">
      {/* Group Info */}
      <Card withBorder className="bg-[#1a1c1f] border-gray-700 text-white">
        <Stack gap="md">
          <Flex align="center" justify="space-between">
            <Text size="lg" fw={700}>
              Group Information
            </Text>
            <Button
              variant="light"
              size="xs"
              leftSection={<IconEdit size={14} />}
              onClick={() => {
                if (
                  groupDetailFull?.group?.id &&
                  groupDetailFull?.group?.name
                ) {
                  openChangeGroupNameModal({
                    id: groupDetailFull.group.id,
                    name: groupDetailFull.group.name,
                  });
                }
              }}
            >
              Change Group Name
            </Button>
          </Flex>

          <Grid>
            <Grid.Col span={6}>
              <Text size="sm" className="text-gray-400">
                Group Name
              </Text>
              <Text fw={600}>{groupDetailFull?.group?.name}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" className="text-gray-400">
                Status
              </Text>
              <Badge
                variant="light"
                color={groupDetailFull?.group?.isBanned ? "red" : "green"}
              >
                {groupDetailFull?.group?.isBanned ? "Banned" : "Active"}
              </Badge>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" className="text-gray-400">
                Members
              </Text>
              <Text fw={600}>{groupDetailFull?.group?.memberCount || 0}</Text>
            </Grid.Col>
          </Grid>
        </Stack>
      </Card>

      {/* Statistics */}
      <Card withBorder className="bg-[#1a1c1f] border-gray-700 text-white">
        <Stack gap="md">
          <Text size="lg" fw={700}>
            Statistics
          </Text>

          <Grid>
            <Grid.Col span={4}>
              <Flex align="center" gap="xs">
                <IconShield size={20} color="blue" />
                <Stack gap={0}>
                  <Text size="sm" className="text-gray-400">
                    Defense Score
                  </Text>
                  <Text fw={700} c="blue">
                    {groupDetailFull?.statistics?.defenseScore?.toFixed(4) ||
                      "0.0000"}
                  </Text>
                </Stack>
              </Flex>
            </Grid.Col>
            <Grid.Col span={4}>
              <Flex align="center" gap="xs">
                <IconSwords size={20} color="red" />
                <Stack gap={0}>
                  <Text size="sm" className="text-gray-400">
                    Attack Score
                  </Text>
                  <Text fw={700} c="red">
                    {groupDetailFull?.statistics?.attackScore?.toFixed(4) ||
                      "0.0000"}
                  </Text>
                </Stack>
              </Flex>
            </Grid.Col>
            <Grid.Col span={4}>
              <Flex align="center" gap="xs">
                <IconTrophy size={20} color="green" />
                <Stack gap={0}>
                  <Text size="sm" className="text-gray-400">
                    Total Score
                  </Text>
                  <Text fw={700} c="green">
                    {groupDetailFull?.statistics?.totalScore?.toFixed(4) ||
                      "0.0000"}
                  </Text>
                </Stack>
              </Flex>
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={4}>
              <Text size="sm" className="text-gray-400">
                Anonymous Files
              </Text>
              <Text fw={600}>
                {groupDetailFull?.statistics?.totalAnonymousFiles || 0}
              </Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Text size="sm" className="text-gray-400">
                Published Files
              </Text>
              <Text fw={600}>
                {groupDetailFull?.statistics?.publishedAnonymousFiles || 0}
              </Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Text size="sm" className="text-gray-400">
                Attack Files
              </Text>
              <Text fw={600}>
                {groupDetailFull?.statistics?.totalAttackFiles || 0}
              </Text>
            </Grid.Col>
          </Grid>
        </Stack>
      </Card>

      {/* Recent Files */}
      <Card withBorder className="bg-[#1a1c1f] border-gray-700 text-white">
        <Stack gap="md">
          <Text size="lg" fw={700}>
            Recent Files
          </Text>
          {groupDetailFull?.recentFiles &&
          groupDetailFull.recentFiles.length > 0 ? (
            <Table className="text-white [&_thead_th]:text-gray-300 [&_tbody_td]:text-white border border-[#2a2d32]">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Score</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {groupDetailFull.recentFiles
                  .slice(0, 5)
                  .map((file: GroupFile) => (
                    <Table.Tr key={`${file.fileType}-${file.id}`}>
                      <Table.Td>{file.name}</Table.Td>
                      <Table.Td>
                        <Badge
                          variant="light"
                          color={file.fileType === "anonymous" ? "blue" : "red"}
                        >
                          {file.fileType}
                        </Badge>
                      </Table.Td>
                      <Table.Td>{file.score.toFixed(4)}</Table.Td>
                      <Table.Td>
                        <Badge
                          variant="light"
                          color={file.isPublished ? "green" : "yellow"}
                        >
                          {file.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  ))}
              </Table.Tbody>
            </Table>
          ) : (
            <Text className="text-gray-400">No files found</Text>
          )}
        </Stack>
      </Card>
    </Stack>
  );

  const renderMembersTab = () => (
    <Stack gap="md">
      <Text size="lg" fw={700}>
        Group Members ({groupDetailFull?.group?.memberCount || 0})
      </Text>

      {groupDetailFull?.members && groupDetailFull.members.length > 0 ? (
        <Table className="text-white [&_thead_th]:text-gray-300 [&_tbody_td]:text-white border border-[#2a2d32]">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Username</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {groupDetailFull.members.map((member) => (
              <Table.Tr key={member.id}>
                <Table.Td>{member.id}</Table.Td>
                <Table.Td>{member.username}</Table.Td>
                <Table.Td>{member.email}</Table.Td>
                <Table.Td>
                  <Badge
                    variant="light"
                    color={member.isActive ? "green" : "gray"}
                  >
                    {member.isActive ? "Active" : "Inactive"}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    color="red"
                    variant="light"
                    size="sm"
                    onClick={() =>
                      openRemoveMemberModal({
                        id: member.id,
                        username: member.username,
                      })
                    }
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <Text className="text-gray-400">No members found</Text>
      )}
    </Stack>
  );

  const renderFilesTab = () => (
    <Stack gap="md">
      <Flex align="center" justify="space-between">
        <Text size="lg" fw={700}>
          Files Management
        </Text>
        <Group>
          <Button.Group>
            <Button
              variant={fileTypeFilter === "all" ? "filled" : "light"}
              size="xs"
              onClick={() => setFileTypeFilter("all")}
            >
              All
            </Button>
            <Button
              variant={fileTypeFilter === "anonymous" ? "filled" : "light"}
              size="xs"
              onClick={() => setFileTypeFilter("anonymous")}
            >
              Anonymous
            </Button>
            <Button
              variant={fileTypeFilter === "attack" ? "filled" : "light"}
              size="xs"
              onClick={() => setFileTypeFilter("attack")}
            >
              Attack
            </Button>
          </Button.Group>
        </Group>
      </Flex>

      {isLoadingFiles ? (
        <Flex justify="center" p="md">
          <Loader />
        </Flex>
      ) : filteredFiles.length > 0 ? (
        <Table
          className="text-white [&_thead_th]:text-gray-300 [&_tbody_td]:text-white border border-[#2a2d32]"
          horizontalSpacing="sm"
          verticalSpacing="sm"
          withTableBorder={true}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Score</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredFiles.map((file: GroupFile) => (
              <Table.Tr key={`${file.fileType}-${file.id}`}>
                <Table.Td>{file.id}</Table.Td>
                <Table.Td>{file.name}</Table.Td>
                <Table.Td>
                  <Badge
                    variant="light"
                    color={file.fileType === "anonymous" ? "blue" : "red"}
                  >
                    {file.fileType}
                  </Badge>
                </Table.Td>
                <Table.Td>{file.score.toFixed(4)}</Table.Td>
                <Table.Td>
                  <Badge
                    variant="light"
                    color={file.isPublished ? "green" : "yellow"}
                  >
                    {file.isPublished ? "Published" : "Draft"}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon
                      color="blue"
                      variant="light"
                      size="sm"
                      onClick={() => handleDownloadFile(file)}
                    >
                      <IconDownload size={14} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      variant="light"
                      size="sm"
                      onClick={() => handleDeleteFile(file)}
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : (
        <Text className="text-gray-400 text-center py-4">No files found</Text>
      )}
    </Stack>
    
  );

  return (
    <>
    <Modal
      opened={modalOpen}
      onClose={closeModal}
      title={
        <Text fw={700} size="lg" c="#ff8c00">
          Group Details
        </Text>
      }
      size="xl"
      centered
      className="max-w-[90vw] max-h-[90vh] overflow-hidden"
      classNames={{
        content:
          "bg-[#121417] text-white rounded-lg shadow-lg border border-[#2a2d32]",
        header: "bg-[#1a1c1f] border-b border-[#2a2d32]",
        body: "px-0 py-0",
      }}
    >
      {isLoadingDetailFull ? (
        <Flex justify="center" p="xl">
          <Loader />
        </Flex>
      ) : detailErrorFull ? (
        <Alert icon={<IconAlertCircle size={16} />} color="red">
          Failed to load group details
        </Alert>
      ) : (
        <Tabs
          value={activeTab}
          onChange={(value) => setActiveTab(value || "overview")}
          classNames={{
            root: "h-[540px] flex flex-col",
            list: "bg-[#1a1c1f] border-b border-[#2a2d32] px-4",
            tab: "text-gray-400 hover:text-black data-[active]:bg-white data-[active]:text-black data-[active]:border-b-2 data-[active]:border-cyan-400 transition-all",
            panel: "h-full overflow-y-auto px-6 py-4 bg-[#121417]",
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<IconTrophy size={14} />}>
              Overview
            </Tabs.Tab>
            <Tabs.Tab value="members" leftSection={<IconUsers size={14} />}>
              Members
            </Tabs.Tab>
            <Tabs.Tab value="files" leftSection={<IconFiles size={14} />}>
              Files
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview" pt="md">
            {renderOverviewTab()}
          </Tabs.Panel>

          <Tabs.Panel value="members" pt="md">
            {renderMembersTab()}
          </Tabs.Panel>

          <Tabs.Panel value="files" pt="md">
            {renderFilesTab()}
          </Tabs.Panel>
        </Tabs>
      )}
    </Modal>

    <Modal
  opened={confirmDeleteModalOpen}
  onClose={() => setConfirmDeleteModalOpen(false)}
  title="Confirm Delete"
  centered
>
  <Text>
    Are you sure you want to delete <strong>{fileToDelete?.name}</strong>?
  </Text>
  <Group mt="md">
    <Button variant="outline" onClick={() => setConfirmDeleteModalOpen(false)}>
      Cancel
    </Button>
    <Button
      color="red"
      onClick={() => {
        if (fileToDelete) {
          deleteMutation.mutate({
            groupId: groupDetailFull?.group?.id!,
            fileType: fileToDelete.fileType,
            fileId: fileToDelete.id,
          });
        }
        setConfirmDeleteModalOpen(false);
      }}
    >
      Delete
    </Button>
  </Group>
</Modal>

    </>
  );
};
