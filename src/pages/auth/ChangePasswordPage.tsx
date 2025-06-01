import {
  Paper,
  Group,
  Stack,
  Text,
  PasswordInput,
  Button,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { LINKS } from "@/constants/links";
import { useForm } from "react-hook-form";
import {
  ChangePasswordInput,
  changePasswordSchema,
} from "@/utils/validations/authValidations";
import { useChangePassword } from "@/hooks/api/auth/useChangePassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onTouched",
  });

  const { mutate: changePassword, isPending: isChangingPassword, isSuccess} =
    useChangePassword();

    const onSubmit = (data: ChangePasswordInput) => {
      changePassword(data);
    };

    useEffect(() => {
      if (isSuccess) {
        navigate(LINKS.PROFILE, { replace: true });
      }
    }, [isSuccess, navigate]);

  return (
    <Paper
      radius="md"
      p="xl"
      className="authen-form authen-form__change-password"
    >
      <Text size="lg" fw={500} ta="center">
        Change Password
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <PasswordInput
            required
            {...register("old_password", {
              required: "Old password is required",
            })}
            label="Old Password"
            placeholder="•••••••••••••••••••••"
            radius="md"
          />
          {errors.old_password && (
            <span className="text-red-500 text-sm">
              {errors.old_password.message}
            </span>
          )}
          <PasswordInput
            required
            {...register("new_password", {
              required: "New password is required",
            })}
            label="New Password"
            placeholder="•••••••••••••••••••••"
            radius="md"
          />
          {errors.new_password && (
            <span className="text-red-500 text-sm">
              {errors.new_password.message}
            </span>
          )}
          <PasswordInput
            required
            {...register("confirm_password", {
              required: "Confirm new password is required",
            })}
            label="Confirm New Password"
            placeholder="•••••••••••••••••••••"
            radius="md"
          />
          {errors.confirm_password && (
            <span className="text-red-500 text-sm">
              {errors.confirm_password.message}
            </span>
          )}
        </Stack>

        <Group justify="space-between" mt="xl">
          <Button
            type="submit"
            radius="xl"
            disabled={!isValid || isSubmitting || isChangingPassword}
          >
            {isSubmitting || isChangingPassword ? (
              <span className="loading loading-spinner" />
            ) : (
              "Change Password"
            )}
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export default ChangePasswordPage;
