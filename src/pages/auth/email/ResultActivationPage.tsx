import { Button, Stack, Text, Title, Loader } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LINKS } from '@/constants/links';
import { useEffect } from 'react';
import { useActivateAccount } from '@/hooks/api/useActivateAccount';
import { useState } from 'react'


export default function ResultActivationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  
  const { mutate: activate, isPending } = useActivateAccount({
    onSuccess: () => setStatus("success"),
    onError: () => setStatus("error"),
  });

  useEffect(() => {
    if (token) {
      activate(token);
    }
  }, [token]);

  const handleLogout = () => {
    navigate(LINKS.LOGIN);
  };

  return (
    <Stack align="center" gap="xs" maw={400} px="md">
    <Title order={3}>
        {isPending
        ? "Activating your account..."
        : status === "success"
        ? "Account activated!"
        : status === "error"
        ? "Activation failed"
        : "Waiting..."}
    </Title>

    {isPending ? (
        <Loader color="blue" />
    ) : (
        <>
        <Text ta="center" size="sm" c="dimmed">
            {status === "success"
            ? "Your account has been successfully activated. You may now log in."
            : status === "error"
            ? "The activation link is invalid or has expired."
            : "Awaiting activation..."}
        </Text>

        <Button
            variant="subtle"
            leftSection={<IconLogout size={16} />}
            onClick={handleLogout}
            mt="xs"
            size="sm"
            color="gray"
            fullWidth
        >
            Return to login
        </Button>
        </>
    )}
    </Stack>
  );
}