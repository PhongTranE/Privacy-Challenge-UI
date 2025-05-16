import { useFetchInviteKeys } from "@/hooks/api/admin/useInviteKeys";
import { useNotify } from "@/hooks/useNotify";
import {
  createInviteKey,
  deleteInviteKey,
} from "@/services/api/admin/inviteKeyApi";
import { useInviteKeyStore } from "@/stores/admin/inviteKeyStore";
import {
  Button,
  Loader,
  Pagination,
  Table,
  Text,
  Group,
  Stack,
  Title,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const InviteKeyList = () => {
  const { inviteKeys, currentPage, setInviteKeys, setCurrentPage } =
    useInviteKeyStore();
  const { data, isLoading, isError, error, refetch } = useFetchInviteKeys(
    currentPage,
    5
  );
  const [deletingKeys, setDeletingKeys] = useState<Record<string, boolean>>({});

  const { success, error: showError } = useNotify();

  useEffect(() => {
    if (data) {
      // Sort invite keys by creation date in descending order
      const sortedKeys = [...(data.data ?? [])].sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
      );
      setInviteKeys(sortedKeys);
    }
  }, [data, setInviteKeys]);

  const handleDelete = async (key: string) => {
    try {
      setDeletingKeys((prev) => ({ ...prev, [key]: true }));
      await deleteInviteKey(key);
      // If we're on page > 1 and this is the last item on the page, go back to previous page
      if (currentPage > 1 && inviteKeys.length === 1) {
        setCurrentPage(currentPage - 1);
      } else {
        await refetch();
      }
      success("Success", "Invite key deleted successfully");
    } catch (err: any) {
      showError(err.message || "Failed to delete invite key");
    } finally {
      setDeletingKeys((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleCreate = async () => {
    try {
      await createInviteKey();
      // Tính toán trang mới dựa trên tổng số items sau khi tạo
      const newTotalItems = (data?.meta?.totalItems || 0) + 1;
      const newPage = Math.ceil(newTotalItems / (data?.meta?.perPage || 5));

      // Nếu trang hiện tại đã đầy (5 items), chuyển đến trang chứa key mới
      if (inviteKeys.length >= (data?.meta?.perPage || 5)) {
        setCurrentPage(newPage);
      } else {
        await refetch();
      }
      success("Success", "New key generated!");
    } catch (err: any) {
      showError(err.message || "Failed to create invite key");
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
                    <Button
                      color="red"
                      variant="light"
                      size="xs"
                      onClick={() => handleDelete(key.key)}
                      loading={deletingKeys[key.key]}
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
    </Stack>
  );
};

export default InviteKeyList;
