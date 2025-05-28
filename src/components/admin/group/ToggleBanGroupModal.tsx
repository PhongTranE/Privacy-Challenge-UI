import React from "react";
import {
  Modal,
  Button,
  Group,
  Text,
  Badge,
} from "@mantine/core";
import { IconShieldX, IconShieldCheck } from "@tabler/icons-react";
import { useToggleBanGroupModalStore } from "@/stores/admin/groupManageStore";
import { useToggleGroupBan } from "@/hooks/api/admin/useGroupManage";

export const ToggleBanGroupModal: React.FC = () => {
  const { modalOpen, groupToToggle, closeModal } = useToggleBanGroupModalStore();
  const { mutate: toggleGroupBan, isPending } = useToggleGroupBan();

  if (!groupToToggle) return null;

  const isBanned = groupToToggle.isBanned;
  const action = isBanned ? "unban" : "ban";

  return (
    <Modal
      opened={modalOpen}
      onClose={closeModal}
      centered
      radius="md"
      overlayProps={{ backgroundOpacity: 0.6, blur: 4 }}
      classNames={{ content: 'ban-unban-modal' }}
      title={
        <Group align="center" gap="xs">
          {isBanned ? (
            <IconShieldCheck className="text-green-400" />
          ) : (
            <IconShieldX className="text-red-500" />
          )}
          <Text fw={700} fz="lg" c={isBanned ? "green.4" : "red.4"}>
            {isBanned ? "Unban Group" : "Ban Group"}
          </Text>
        </Group>
      }
    >
      <Text mb="sm" component="div">
        You are about to <strong className={isBanned ? "text-green-500" : "text-red-500"}>{action}</strong> the group:
        <Badge variant="filled" color="gray" mx={8}>{groupToToggle.name}</Badge>
      </Text>

      <Text size="sm" c="gray.4">
        {isBanned
          ? "This group will regain full access and continue participating."
          : "This group will be restricted from any activities until further notice."}
      </Text>

      <Group justify="flex-end" mt="xl">
        <Button variant="outline" color="gray" onClick={closeModal} radius="md">
          Cancel
        </Button>
        <Button
          color={isBanned ? "green" : "red"}
          radius="md"
          onClick={() => {
            toggleGroupBan(groupToToggle.id);
            closeModal();
          }}
          loading={isPending}
        >
          Confirm {isBanned ? "Unban" : "Ban"}
        </Button>
      </Group>
    </Modal>
  );
};
