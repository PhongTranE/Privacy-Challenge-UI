import {
  useCreateInviteKey,
  useDeleteAllExpiredInviteKeys,
  useDeleteInviteKey,
  useFetchInviteKeys,
} from "@/hooks/api/admin/useInviteKeys";
import { useNotify } from "@/hooks/useNotify";
import { exportInviteKeys } from "@/services/api/admin/inviteKeyApi";
import { useInviteKeyStore } from "@/stores/admin/inviteKeyStore";
import { InviteKey } from "@/types/api/responses/admin/inviteKeyResponses";
import {
  Badge,
  Button,
  Group,
  Loader,
  Modal,
  Pagination,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconAlertTriangle, IconCheck, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const InviteKeyList = () => {
  const [inviteKeys, setInviteKeys] = useState<InviteKey[]>([]);
  const { currentPage, setCurrentPage, isDeletingExpired, isDeletingKey } =
    useInviteKeyStore();
  const { data, isLoading, isError, error, refetch } = useFetchInviteKeys(
    currentPage,
    5
  );
  const { success,error: showError } = useNotify();
  const { mutate: deleteSingleKey } = useDeleteInviteKey();
  const { mutateAsync: createKey } = useCreateInviteKey();
  const [deleteExpiredModalOpened, setDeleteExpiredModalOpened] =
    useState(false);
  const { mutateAsync: deleteAllExpiredInviteKeys } =
    useDeleteAllExpiredInviteKeys();

  useEffect(() => {
    if (data) {
      const sortedKeys = [...(data.data ?? [])].sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
      );
      setInviteKeys(sortedKeys);
    }
  }, [data]);

  const handleDelete = (key: string) => {
    deleteSingleKey(key, {
      onSuccess: async () => {
        if (currentPage > 1 && inviteKeys.length === 1) {
          setCurrentPage(currentPage - 1);
        } else {
          await refetch();
        }
      },
    });
  };

  // Khi click nút xóa all expired
  const handleOpenDeleteExpiredModal = () => {
    const expiredCount = inviteKeys.filter((k) => k.isExpired).length;
    if (expiredCount === 0) {
      showError("Error", "No expired invite keys to delete!");
      return;
    }
    setDeleteExpiredModalOpened(true);
  };

  // Khi xác nhận xóa
  const handleDeleteAllExpired = async () => {
    try {
      await deleteAllExpiredInviteKeys();
      await refetch();
      setDeleteExpiredModalOpened(false);
    } catch (err: any) {
      showError(err.message || "Failed to delete expired invite keys");
    }
  };

  const handleCreate = async () => {
    await createKey();
    const newTotalItems = (data?.meta?.totalItems || 0) + 1;
    const newPage = Math.ceil(newTotalItems / (data?.meta?.perPage || 5));
    if (inviteKeys.length >= (data?.meta?.perPage || 5)) {
      setCurrentPage(newPage);
    } else {
      await refetch();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate sequence number based on current page
  const getSequenceNumber = (index: number) => {
    const perPage = data?.meta?.perPage || 5;
    return (currentPage - 1) * perPage + index + 1;
  };

  return (
    <Stack gap="md" className="flex flex-col h-full">
      {isLoading && <Loader />}
      {isError && (
        <Text c="red">{error?.message || "Failed to load invite keys"}</Text>
      )}

      <Group>
        <Title size="xl" fw={500} c="#ff8c00">
          Invite Keys
        </Title>
        <Button color="green" onClick={handleCreate} loading={isLoading}>
          Generate Invite Key
        </Button>
        <Button
          color="red"
          onClick={handleOpenDeleteExpiredModal}
          disabled={isDeletingExpired}
        >
          Delete All Expired
        </Button>
        <Button
          disabled={inviteKeys.length === 0}
          color="blue"
          onClick={async () => {
            try {
              await exportInviteKeys();
              success("Success", "Export successful!");
            } catch (e: any) {
              showError(e.message || "Failed to export CSV");
            }
            }}
        >
          Export CSV
        </Button>
      </Group>

      <div className="flex flex-col flex-grow overflow-hidden mt-4">
        <div className="flex-grow overflow-y-auto">
          <Table horizontalSpacing="xl" verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: "80px", textAlign: "center" }}>
                  STT
                </Table.Th>
                <Table.Th style={{ textAlign: "center" }}>Invite Key</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>Created</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>Status</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {inviteKeys?.map((key, index) => (
                <Table.Tr key={key.key}>
                  <Table.Td style={{ textAlign: "center" }}>
                    {getSequenceNumber(index)}
                  </Table.Td>
                  <Table.Td style={{ textAlign: "center" }}>{key.key}</Table.Td>
                  <Table.Td style={{ textAlign: "center" }}>
                    {new Date(key.created).toLocaleString()}
                  </Table.Td>
                  <Table.Td style={{ textAlign: "center" }}>
                    {key.isExpired ? (
                      <Badge
                        color="red"
                        leftSection={<IconAlertTriangle size={12} />}
                      >
                        Expired
                      </Badge>
                    ) : (
                      <Badge
                        color="green"
                        leftSection={<IconCheck size={12} />}
                      >
                        Active
                      </Badge>
                    )}
                  </Table.Td>
                  <Table.Td style={{ textAlign: "center" }}>
                    <Button
                      color="red"
                      variant="light"
                      size="xs"
                      onClick={() => handleDelete(key.key)}
                      loading={isDeletingKey === key.key}
                    >
                      <IconTrash size={18} />
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>

        {data?.meta && (
          <Group justify="center" mt="4">
            <Pagination
              total={Math.max(1, data.meta.totalPages)}
              value={data.meta.currentPage}
              onChange={handlePageChange}
              size="md"
              radius="md"
              withEdges
              siblings={1}
              boundaries={1}
            />
          </Group>
        )}
      </div>

      <Modal
        opened={deleteExpiredModalOpened}
        onClose={() => setDeleteExpiredModalOpened(false)}
        title="Delete all expired invite keys?"
        centered
      >
        <Text mb="md">
          Are you sure you want to delete <b>all expired invite keys</b>? This
          action cannot be undone.
        </Text>
        <Button
          color="red"
          loading={isDeletingExpired}
          onClick={handleDeleteAllExpired}
          fullWidth
        >
          Confirm Delete
        </Button>
      </Modal>
    </Stack>
  );
};

export default InviteKeyList;
