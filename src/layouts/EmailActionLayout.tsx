import { Center, Paper } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { IconMail } from '@tabler/icons-react';
export default function EmailActionLayout() {
  return (
    <Center h="100vh">
      <Paper radius="md" shadow="sm" p="xl" withBorder w="100%" maw={400}>
        <Center mb="md">
          <IconMail size={64} color="blue" stroke={1.5} />
        </Center>
        <Outlet />
      </Paper>
    </Center>
  );
}