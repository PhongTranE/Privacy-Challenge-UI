import React from "react";
import { Modal, Button, Group, Text } from "@mantine/core";
import { useDeleteGroupModalStore } from "@/stores/admin/groupManageStore";
import { useDeleteGroup } from "@/hooks/api/admin/useGroupManage";
import { IconAlertTriangle } from "@tabler/icons-react";

export const DeleteGroupModal: React.FC = () => {
  const { modalOpen, groupToDelete, closeModal } = useDeleteGroupModalStore();
  const { mutate: deleteGroup, isPending } = useDeleteGroup();

  return (
    <Modal
  opened={modalOpen}
  onClose={closeModal}
  centered
  radius="lg"
  size="lg"
  overlayProps={{
    blur: 8,
    backgroundOpacity: 0.55,
  }}
  classNames={{
    content: "bg-[#2b0d0d] text-white border border-red-700 shadow-xl",
    header: "bg-[#2b0d0d] border-b border-red-700 pb-2 mb-2",
    body: "space-y-3",
  }}
  title={
    <Group align="center" gap="xs">
      <IconAlertTriangle size={22} className="text-red-400" />
      <Text fw={700} size="lg" className="text-red-400">
        This action is irreversible
      </Text>
    </Group>
  }
>
  <Text size="sm" className="text-gray-200">
    You're about to <strong className="text-red-500">permanently delete</strong> the group{" "}
    <strong className="text-red-400">{groupToDelete?.name}</strong> along with:
  </Text>

  <ul className="list-disc list-inside text-sm text-gray-300 pl-1 space-y-1">
    <li>All users in this group</li>
    <li>All uploaded files by those users</li>
    <li>All attack logs, anonym records, and permissions</li>
  </ul>

  <Text size="sm" c="red.5" fw={600}>
    This data <u>cannot be restored</u>. Please proceed only if you are absolutely sure.
  </Text>

  <Group justify="flex-end" mt="md" pt="sm" className="border-t border-red-700">
    <Button variant="subtle" color="gray" onClick={closeModal}>
      Cancel
    </Button>
    <Button
      color="red"
      variant="filled"
      onClick={() => {
        if (!groupToDelete) return;
        deleteGroup(groupToDelete.id, {
          onSuccess: closeModal,
        });
      }}
      loading={isPending}
    >
      Yes, delete everything
    </Button>
  </Group>
</Modal>

  );
}; 