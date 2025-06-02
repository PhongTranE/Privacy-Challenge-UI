import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  ForgotPasswordInput,
} from "@/utils/validations/authValidations";
import { useForgotPassword } from "@/hooks/api/auth/useForgotPassword";
import {
  Button,
  Paper,
  Stack,
  Text,
  TextInput,
  Anchor,
  Group,
  Modal,
  Alert,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { LINKS } from "@/constants/links";
import { IconMail } from "@tabler/icons-react";

const RESEND_COOLDOWN = 120; // seconds
const MAX_RESEND_ATTEMPTS = 3;

const ForgotPasswordPage: React.FC = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [lastEmail, setLastEmail] = useState<string>("");
  const [resendCount, setResendCount] = useState(0);
  const [expiryTime, setExpiryTime] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    getValues,
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
  });

  const { mutate: forgotPassword, isPending } = useForgotPassword();

  // Calculate remaining time
  const getRemainingTime = () => {
    if (!expiryTime) return 0;
    const remaining = Math.ceil((expiryTime - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  };

  // Countdown timer effect
  useEffect(() => {
    if (expiryTime) {
      const timer = setInterval(() => {
        const remaining = getRemainingTime();
        setCountdown(remaining);
        if (remaining <= 0) {
          clearInterval(timer);
          setExpiryTime(null);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [expiryTime]);

  const onSubmit = (data: ForgotPasswordInput) => {
    setLastEmail(data.email);
    forgotPassword(data, {
      onSuccess: () => {
        setShowSuccessModal(true);
        const expiry = Date.now() + RESEND_COOLDOWN * 1000;
        setExpiryTime(expiry);
        setCountdown(RESEND_COOLDOWN);
        setResendCount(0);
      },
    });
  };

  const handleResend = () => {
    const currentEmail = getValues("email");
    // Only allow resend if email hasn't changed
    if (currentEmail === lastEmail) {
      if (resendCount >= MAX_RESEND_ATTEMPTS) {
        return;
      }
      forgotPassword(
        { email: currentEmail },
        {
          onSuccess: () => {
            const expiry = Date.now() + RESEND_COOLDOWN * 1000;
            setExpiryTime(expiry);
            setCountdown(RESEND_COOLDOWN);
            setResendCount((prev) => prev + 1);
          },
        }
      );
    }
  };

  // Update countdown when modal is opened
  useEffect(() => {
    if (showSuccessModal && expiryTime) {
      setCountdown(getRemainingTime());
    }
  }, [showSuccessModal]);

  const isInCooldown = countdown > 0;

  return (
    <>
      <Paper
        radius="md"
        p="xl"
        className="authen-form authen-form__forgot-password"
      >
        <Text size="lg" fw={500} ta="center" mb="md">
          Forgot your password?
        </Text>

        <Text size="sm" c="dimmed" ta="center" mb="xl">
          Enter your email address and we'll send you a link to reset your
          password.
        </Text>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack mt="md">
            <TextInput
              label="Email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              error={errors.email?.message}
              disabled={isPending || isInCooldown}
              leftSection={<IconMail size="1rem" />}
            />

            <Group justify="space-between" mt="md">
              <Anchor component={Link} to={LINKS.LOGIN} size="sm">
                Back to Login
              </Anchor>
              <Button
                type="submit"
                radius="xl"
                loading={isSubmitting || isPending}
                disabled={!isValid || isPending || isInCooldown}
              >
                {isInCooldown ? `Wait ${countdown}s` : "Send Reset Email"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>

      <Modal
        opened={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Check your email"
        centered
      >
        <Stack>
          <Text size="sm">
            We've sent a password reset link to your email address. Please check
            your inbox or spam folder.
          </Text>

          {resendCount >= MAX_RESEND_ATTEMPTS && (
            <Alert color="yellow" mt="md">
              You have reached the maximum number of resend attempts. Please try
              again later.
            </Alert>
          )}

          <Group justify="space-between" mt="md">
            <Button
              variant="light"
              onClick={handleResend}
              disabled={countdown > 0 || resendCount >= MAX_RESEND_ATTEMPTS}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend Email"}
            </Button>
            <Button
              component={Link}
              to={LINKS.LOGIN}
              onClick={() => setShowSuccessModal(false)}
            >
              Return to Login
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default ForgotPasswordPage;
