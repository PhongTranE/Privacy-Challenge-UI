import { Badge, Group, Text, Loader } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const renderContent = () => {
    if (status === "processing") {
      return (
        <Group gap={6}>
          <Loader size="xs" color="blue" />
          <Text size="sm" c="blue">Processing</Text>
        </Group>
      );
    }

    if (status === "completed") {
      return (
        <Group gap={6}>
          <IconCheck size={16} color="green" />
          <Text size="sm" c="green">Completed</Text>
        </Group>
      );
    }

    // Trường hợp còn lại là lỗi
    return (
      <Group gap={6}>
        <IconX size={16} color="red" />
        <Text size="sm" c="red">Fail</Text>
      </Group>
    );
  };

  return <Badge variant="light">{renderContent()}</Badge>;
}
