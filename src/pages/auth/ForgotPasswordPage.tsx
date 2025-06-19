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
  size="md"
  radius="lg"
  overlayProps={{
    backgroundOpacity: 0.55,
    blur: 3,
  }}
  classNames={{
    content: "!bg-gray-800 !border !border-gray-700 shadow-2xl",
    header: "!bg-gray-800 !border-b !border-gray-700 !pb-4",
    body: "!bg-gray-800 !p-6",
    close: "!text-gray-400 hover:!text-gray-200 hover:!bg-gray-700 !transition-colors",
    title: "!text-gray-100 !font-semibold !text-lg",
  }}
>
  <Stack gap="lg" className="pt-2">
    <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
      <Text size="sm" className="!text-gray-300 leading-relaxed">
        We've sent a password reset link to your email address. Please check
        your inbox or spam folder.
      </Text>
    </div>

    {resendCount >= MAX_RESEND_ATTEMPTS && (
      <Alert 
        color="yellow" 
        mt="md"
        variant="light"
        className="!bg-yellow-500/10 !border !border-yellow-500/30"
        classNames={{
          message: "!text-yellow-200",
          icon: "!text-yellow-400",
        }}
      >
        <Text size="sm" className="!text-yellow-200">
          You have reached the maximum number of resend attempts. Please try
          again later.
        </Text>
      </Alert>
    )}

    <Group justify="space-between" mt="md" className="pt-2">
      <Button
        variant="light"
        color="blue"
        onClick={handleResend}
        disabled={countdown > 0 || resendCount >= MAX_RESEND_ATTEMPTS}
        className={`
          !transition-all !duration-200
          ${countdown > 0 || resendCount >= MAX_RESEND_ATTEMPTS
            ? "!opacity-50 !cursor-not-allowed" 
            : "hover:!bg-blue-500/20 hover:!scale-105"
          }
        `}
      >
        {countdown > 0 ? `Resend in ${countdown}s` : "Resend Email"}
      </Button>
      
      <Button
        component={Link}
        to={LINKS.LOGIN}
        onClick={() => setShowSuccessModal(false)}
        variant="filled"
        color="blue"
        className="!bg-blue-600 hover:!bg-blue-700 !transition-all !duration-200 hover:!scale-105"
      >
        Return to Login
      </Button>
    </Group>

    <div className="flex items-center justify-center pt-2">
      <Text size="xs" className="!text-gray-500">
        Didn't receive an email? Check your spam folder or try again.
      </Text>
    </div>
  </Stack>
</Modal>
    </>
  );
};

export default ForgotPasswordPage;
