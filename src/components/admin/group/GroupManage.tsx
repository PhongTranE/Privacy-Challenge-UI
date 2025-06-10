import {
  useDeleteGroupModalStore,
  useDetailGroupModalStore,
  useGroupManageStore,
  useToggleBanGroupModalStore,
} from "@/stores/admin/groupManageStore";
import { DeleteGroupModal } from "@/components/admin/group/DeleteGroupModal";
import { GroupDetailModal } from "@/components/admin/group/GroupDetailModal";
import { ChangeGroupNameModal } from "@/components/admin/group/ChangeGroupNameModal";
import {
  Button,
  Group,
  Text,
  TextInput,
  Title,
  Table,
  Stack,
  Badge,
  Flex,
} from "@mantine/core";
import {
  IconChevronDown,
  IconTrash,
  IconX,
  IconChevronUp,
  IconAdjustments,
  IconLockOpen,
  IconLock,
} from "@tabler/icons-react";
import { useState } from "react";
import { fetchGroups } from "@/services/api/admin/groupApi";
import { usePaginatedQuery } from "@/hooks/utils/usePaginatedQuery";
import { useToggleGroupBan } from "@/hooks/api/admin/useGroupManage";
import { ToggleBanGroupModal } from "./ToggleBanGroupModal";
import { DeleteGroupMemberModal } from "./DeleteGroupMemberModal";
export default function GroupManage() {
  const { search, setSearch } = useGroupManageStore();
  const { openModal: openDeleteModal } = useDeleteGroupModalStore();
  const { openModal: openDetailModal } = useDetailGroupModalStore();
  const { openModal: openToggleBanModal } = useToggleBanGroupModalStore();
  const { isPending: isToggling } = useToggleGroupBan();

  const { data, isLoading, error, page, setPage, debouncedSearch } =
    usePaginatedQuery({
      queryKey: ["groups"],
      queryFn: fetchGroups,
      search,
      perPage: 5,
    });

  const [sortBy, setSortBy] = useState<
    | "id"
    | "name"
    | "defenseScore"
    | "attackScore"
    | "totalScore"
    | "memberCount"
  >("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Sort groups
  const sortedGroups = [...(data?.data ?? [])].sort((a, b) => {
    let aValue: any, bValue: any;
    aValue = a[sortBy];
    bValue = b[sortBy];
    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
  const handleDeleteClick = (group: { id: number; name: string }) => {
    openDeleteModal(group);
  };

  const handleDetailClick = (group: { id: number; name: string }) => {
    openDetailModal(group);
  };

  const handleSort = (
    column:
      | "id"
      | "name"
      | "defenseScore"
      | "attackScore"
      | "totalScore"
      | "memberCount"
  ) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  return (
    <Stack gap="md" className="flex flex-col h-full">
      <Title order={2} c="#ff8c00">
        Group Management
        {data?.meta && (
          <Badge ml="md" size="lg" variant="light" color="blue">
            Total: {data.meta.totalItems} groups
          </Badge>
        )}
      </Title>
      <Flex align="center" columnGap={20}>
        <TextInput
          placeholder="Enter groupname or username in the group"
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
        {debouncedSearch && data?.meta && (
          <Text size="sm" c="gray">
            🔎 Found <strong>{data.meta.totalItems}</strong>{" "}
            {data.meta.totalItems < 2 ? "group" : "groups"} matching "
            <strong>{debouncedSearch}</strong>"
          </Text>
        )}
      </Flex>
      {isLoading && <Text>Loading...</Text>}
      {error && <Text c="red">{error.message}</Text>}
      <div className="flex flex-col flex-grow justify-between overflow-y-auto rounded-xl bg-black/60 p-4">
        <div className="flex-grow overflow-y-auto">
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
                  onClick={() => handleSort("name")}
                >
                  Group Name{" "}
                  {sortBy === "name" &&
                    (sortDirection === "asc" ? (
                      <IconChevronUp size={16} className="inline" />
                    ) : (
                      <IconChevronDown size={16} className="inline" />
                    ))}
                </Table.Th>
                <Table.Th
                  className="text-center cursor-pointer"
                  onClick={() => handleSort("memberCount")}
                >
                  Members{" "}
                  {sortBy === "memberCount" &&
                    (sortDirection === "asc" ? (
                      <IconChevronUp size={16} className="inline" />
                    ) : (
                      <IconChevronDown size={16} className="inline" />
                    ))}
                </Table.Th>
                <Table.Th
                  className="text-center cursor-pointer"
                  onClick={() => handleSort("defenseScore")}
                >
                  Defense Score{" "}
                  {sortBy === "defenseScore" &&
                    (sortDirection === "asc" ? (
                      <IconChevronUp size={16} className="inline" />
                    ) : (
                      <IconChevronDown size={16} className="inline" />
                    ))}
                </Table.Th>
                <Table.Th
                  className="text-center cursor-pointer"
                  onClick={() => handleSort("attackScore")}
                >
                  Attack Score{" "}
                  {sortBy === "attackScore" &&
                    (sortDirection === "asc" ? (
                      <IconChevronUp size={16} className="inline" />
                    ) : (
                      <IconChevronDown size={16} className="inline" />
                    ))}
                </Table.Th>
                <Table.Th
                  className="text-center cursor-pointer"
                  onClick={() => handleSort("totalScore")}
                >
                  Total Score{" "}
                  {sortBy === "totalScore" &&
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
              {sortedGroups.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={6} className="text-center">
                    No groups found.
                  </Table.Td>
                </Table.Tr>
              ) : (
                sortedGroups.map((group) => (
                  <Table.Tr key={group.id}>
                    <Table.Td className="text-center">{group.id}</Table.Td>
                    <Table.Td className="text-center">
                      <Text fw={700}>{group.name}</Text>
                    </Table.Td>
                    <Table.Td className="text-center">
                      <Text>{group.memberCount}</Text>
                    </Table.Td>
                    <Table.Td className="text-center">
                      <Text c="blue">{group.defenseScore}</Text>
                    </Table.Td>
                    <Table.Td className="text-center">
                      <Text c="red">{group.attackScore}</Text>
                    </Table.Td>
                    <Table.Td className="text-center">
                      <Text c="green">{group.totalScore}</Text>
                    </Table.Td>
                    <Table.Td className="text-center">
                      <Group gap={4} justify="center">
                        <Button
                          variant="light"
                          size="xs"
                          color="blue"
                          leftSection={<IconAdjustments stroke={1} />}
                          onClick={() =>
                            handleDetailClick({
                              id: group.id,
                              name: group.name,
                            })
                          }
                        >
                          Detail
                        </Button>
                        <Button
                          size="xs"
                          color={group.isBanned ? "green" : "red"}
                          variant="light"
                          leftSection={
                            group.isBanned ? (
                              <IconLockOpen size={16} />
                            ) : (
                              <IconLock size={16} />
                            )
                          }
                          onClick={() =>
                            openToggleBanModal({
                              id: group.id,
                              name: group.name,
                              isBanned: group.isBanned,
                            })
                          }
                          loading={isToggling}
                        >
                          {group.isBanned ? "Unban" : "Ban"}
                        </Button>
                        <Button
                          color="red"
                          leftSection={<IconTrash size={16} />}
                          variant="light"
                          size="xs"
                          onClick={() => handleDeleteClick(group)}
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
      <GroupDetailModal />
      <ToggleBanGroupModal />
      <DeleteGroupModal />
      <ChangeGroupNameModal />
      <DeleteGroupMemberModal />
    </Stack>
  );
}
