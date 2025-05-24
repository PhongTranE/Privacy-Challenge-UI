import {
  useFetchUsersList,
  useDeleteUser,
} from "@/hooks/api/admin/useUsersManage";
import {
  useChangePasswordModalStore,
  useDeleteUserModalStore,
  useUsersManageStore,
} from "@/stores/admin/usersManageStore";
import {
  Button,
  Group,
  Text,
  TextInput,
  Title,
  Badge,
  Table,
  Stack,
} from "@mantine/core";
import {
  IconUserX,
  IconLock,
  IconX,
  IconChevronUp,
  IconChevronDown,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { ChangePasswordModal } from "@/components/admin/user/ChangePasswordModal";
import { DeleteUserModal } from "@/components/admin/user/DeleteUserModal";
import { useDebounce } from "@/hooks/utils/useDebounce";

export default function UserManage() {
  const [page, setPage] = useState(1);
  const perPage = 5;
  const { search, setSearch } = useUsersManageStore();
  const debouncedSearch = useDebounce(search, 500);
  const { data, isLoading, error } = useFetchUsersList(
    page,
    perPage,
    debouncedSearch
  );
  const { openModal: openChangePwModal } = useChangePasswordModalStore();
  const { mutate: deleteUser, isPending: isDeletingUser } = useDeleteUser();
  const {
    modalOpen: deleteModalOpen,
    userToDelete,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useDeleteUserModalStore();
  const [sortBy, setSortBy] = useState<
    "id" | "username" | "email" | "group" | "status"
  >("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Reset về trang 1 khi search thay đổi
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Sort user
  const sortedUsers = [...(data?.data ?? [])].sort((a, b) => {
    let aValue: any, bValue: any;
    if (sortBy === "group") {
      aValue = a.group?.name?.toLowerCase() ?? "-";
      bValue = b.group?.name?.toLowerCase() ?? "-";
    } else if (sortBy === "status") {
      aValue = a.isActive ? 1 : 0;
      bValue = b.isActive ? 1 : 0;
    } else {
      aValue = a[sortBy];
      bValue = b[sortBy];
    }
    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleChangePassword = (userId: number) => {
    openChangePwModal(userId);
  };

  const handleSort = (
    column: "id" | "username" | "email" | "group" | "status"
  ) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const handleDeleteClick = (user: { id: number; username: string }) => {
    openDeleteModal(user);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    deleteUser(userToDelete.id, {
      onSuccess: () => {
        closeDeleteModal();
      },
    });
  };

  return (
    <Stack gap="md" className="flex flex-col h-full">
      <Title order={2} c="#ff8c00">
        User Management
        {data?.meta && (
          <Badge ml="md" size="lg" variant="light" color="blue">
            Total: {data.meta.totalItems} users
          </Badge>
        )}
        {debouncedSearch && data?.meta && (
          <Text size="sm" c="gray" mt="5px">
            🔎 Found <strong>{data.meta.totalItems}</strong> users matching "
            <strong>{debouncedSearch}</strong>"
          </Text>
        )}
      </Title>
      <TextInput
        placeholder="Search by username, email or group name"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        w={320}
        autoComplete="off"
        rightSection={
          search ? (
            <IconX
              size={16}
              className="cursor-pointer text-gray-400 hover:text-black"
              onClick={() => setSearch("")}
            />
          ) : null
        }
      />
      {isLoading && <Text>Loading...</Text>}
      {error && <Text c="red">{error.message}</Text>}
      <div className="flex flex-col flex-grow justify-between overflow-hidden  rounded-xl bg-black/60 p-4">
        <div className="flex-grow min-h-[60vh] overflow-y-auto">
          <Table withTableBorder horizontalSpacing="sm" verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th
                  className="w-20 text-center cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  ID{" "}
                  {sortBy === "id" &&
                    (sortDirection === "asc" ? (
                      <IconChevronUp size={16} className="inline" />
                    ) : (
                      <IconChevronDown size={16} className="inline" />
                    ))}
                </Table.Th>
                <Table.Th
                  className="text-center cursor-pointer"
                  onClick={() => handleSort("username")}
                >
                  Username{" "}
                  {sortBy === "username" &&
                    (sortDirection === "asc" ? (
                      <IconChevronUp size={16} className="inline" />
                    ) : (
                      <IconChevronDown size={16} className="inline" />
                    ))}
                </Table.Th>
                <Table.Th
                  className="text-center cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Email{" "}
                  {sortBy === "email" &&
                    (sortDirection === "asc" ? (
                      <IconChevronUp size={16} className="inline" />
                    ) : (
                      <IconChevronDown size={16} className="inline" />
                    ))}
                </Table.Th>
                <Table.Th
                  className="text-center cursor-pointer"
                  onClick={() => handleSort("group")}
                >
                  Group{" "}
                  {sortBy === "group" &&
                    (sortDirection === "asc" ? (
                      <IconChevronUp size={16} className="inline" />
                    ) : (
                      <IconChevronDown size={16} className="inline" />
                    ))}
                </Table.Th>
                <Table.Th
                  className="text-center cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status{" "}
                  {sortBy === "status" &&
                    (sortDirection === "asc" ? (
                      <IconChevronUp size={16} className="inline" />
                    ) : (
                      <IconChevronDown size={16} className="inline" />
                    ))}
                </Table.Th>
                <Table.Th className="text-center">Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sortedUsers.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={6} className="text-center">
                    No users found.
                  </Table.Td>
                </Table.Tr>
              ) : (
                sortedUsers.map((user) => (
                  <Table.Tr key={user.id}>
                    <Table.Td className="text-center">{user.id}</Table.Td>
                    <Table.Td className="text-center">
                      <Text fw={700}>{user.username}</Text>
                    </Table.Td>
                    <Table.Td className="text-center">{user.email}</Table.Td>
                    <Table.Td className="text-center">
                      {user.group?.name ?? "-"}
                    </Table.Td>
                    <Table.Td className="text-center">
                      <Badge color={user.isActive ? "green" : "red"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </Table.Td>
                    <Table.Td className="text-center">
                      <Group gap={4} justify="center">
                        <Button
                          variant="light"
                          size="xs"
                          color="blue"
                          leftSection={<IconLock size={16} />}
                          onClick={() => handleChangePassword(user.id)}
                        >
                          Change Password
                        </Button>
                        <Button
                          color="red"
                          leftSection={<IconUserX size={16} />}
                          variant="light"
                          size="xs"
                          onClick={() =>
                            handleDeleteClick({
                              id: user.id,
                              username: user.username,
                            })
                          }
                          loading={
                            isDeletingUser && userToDelete?.id === user.id
                          }
                        >
                          Delete
                        </Button>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </div>
        {/* Pagination */}
        <Group justify="center" mt="4">
          <Button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <Button
            disabled={!data?.meta?.hasNext}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </Group>
      </div>
      <DeleteUserModal
        opened={deleteModalOpen}
        onClose={closeDeleteModal}
        user={userToDelete}
        onConfirm={handleConfirmDelete}
        loading={isDeletingUser}
      />
      <ChangePasswordModal />
    </Stack>
  );
}
