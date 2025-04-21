import { Anchor, Button, Stack, Text, Title } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { LINKS } from '@/constants/links';
import { useEffect, useState } from 'react';
import { useResendActivation } from '@/hooks/api/useResendActivation';
import { useEmailPendingStore } from '@/stores/emailStore';
import { Loader } from '@mantine/core';

const COOLDOWN_SECONDS = 120;

export default function ActivationPage() {
  const navigate = useNavigate();
  const [cooldown, setCooldown] = useState(0);
  const { pendingEmail } = useEmailPendingStore()
  const { mutate: resend, isPending} = useResendActivation();

  const handleResend = () => {
    if (!pendingEmail) return;

    resend({ email: pendingEmail });
    setCooldown(COOLDOWN_SECONDS);
  };

  const handleLogout = () => {
    navigate(LINKS.LOGIN);
  };

  useEffect(() => {
    if (cooldown === 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  const formatTime = (s: number) => {
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Stack align="center" gap="xs">
      <Title order={3}>Verify your email address</Title>

      <Text ta="center" size="sm" c="dimmed">
        <strong>Please click on the link</strong> in the email we just sent you
        to confirm your email address.
      </Text>

      {pendingEmail ? (
        isPending ? (
          <Loader color="blue" />
        ) : cooldown > 0 ? (
          <Text size="sm" c="dimmed">Resend in {formatTime(cooldown)}</Text>
        ) : (
          <Anchor onClick={handleResend} c="blue" size="sm">
            Resend Email
          </Anchor>
        )
      ) : (
        <Text size="sm" c="red">
          Can’t resend email – no email address found.
        </Text>
      )}

      <Button
        variant="subtle"
        leftSection={<IconLogout size={16} />}
        onClick={handleLogout}
        mt="xs"
        size="sm"
        color="gray"
      >
        Return to login
      </Button>
    </Stack>
  );
}