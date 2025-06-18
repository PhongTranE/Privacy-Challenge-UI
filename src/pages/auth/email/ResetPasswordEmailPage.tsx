import { LINKS } from "@/constants/links";
import { useResetPassword } from "@/hooks/api/auth/useResetPassword";
import {
  ResetPasswordInput,
  resetPasswordSchema,
} from "@/utils/validations/authValidations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Paper, PasswordInput, Stack, Text } from "@mantine/core";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const ResetPasswordEmailPage: React.FC = () => {
  const { resetToken } = useParams<{ resetToken: string }>();
  const navigate = useNavigate();
  const { mutate: resetPassword, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
  });

  const onSubmit = (data: { new_password: string }) => {
    if (!resetToken) {
      console.error("No reset token found!");
      return;
    }

    resetPassword(
      { token: resetToken, body: { new_password: data.new_password } },
      {
        onSuccess: () => {
          navigate(LINKS.LOGIN);
        },
        onError: (error) => {
          console.error("Reset password failed:", error);
        },
      }
    );
  };

  return (
    <>
      <Paper radius="md" p="xl" className="authen-form">
        <Text size="lg" fw={500} ta="center">
          Reset your password
        </Text>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack mt="md">
            <PasswordInput
              label="New Password"
              placeholder="•••••••••••••••"
              {...register("new_password", {
                required: "New Password is required",
              })}
              error={errors.new_password?.message}
            />
            <PasswordInput
              label="Confirm New Password"
              placeholder="•••••••••••••••"
              {...register("confirm_new_password", {
                required: "Confirm new password is required",
              })}
              error={errors.confirm_new_password?.message}
            />
            <Button
              type="submit"
              radius="xl"
              loading={isSubmitting || isPending}
              disabled={!isValid}
            >
              Reset Password
            </Button>
          </Stack>
        </form>
      </Paper>
    </>
  );
};

export default ResetPasswordEmailPage;
