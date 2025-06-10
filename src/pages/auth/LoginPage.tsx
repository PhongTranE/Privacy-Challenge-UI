import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { LINKS } from "@/constants/links";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/utils/validations/authValidations";
import { useLogin } from "@/hooks/api/auth/useLogin";
import {
  Anchor,
  Button,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Checkbox,
} from "@mantine/core";
import { GoogleBtn } from "@/components/GoogleBtn";

const LoginPage: React.FC = () => {
  const {
    register,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const { mutate: login, isPending, isSuccess } = useLogin();
  const navigate = useNavigate();
  const onSubmit = (data: LoginInput) => {
    login(data);
  };

  useEffect(() => {
    if (isSuccess) {
      navigate(LINKS.PROFILE, { replace: true });
    }
  }, [isSuccess, navigate]);

  return (
    <Paper radius="md" p="xl" className="authen-form authen-form__login">
      <Text size="lg" fw={500} ta="center">
        Log in to your account
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleBtn radius="xl">Google</GoogleBtn>
        {/* <TwitterButton radius="xl">Twitter</TwitterButton> */}
      </Group>

      <Divider label="Or continue with" labelPosition="center" my="lg" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextInput
            required
            {...register("username", {
              required: "Username is required",
            })}
            //   rightSection={rightSection}
            label="Username"
            placeholder="Your username"
            radius="md"
          />
          {errors.username && (
            <span className="text-red-500 text-sm">
              {errors.username.message}
            </span>
          )}
          <PasswordInput
            required
            {...register("password", {
              required: "Password is required",
            })}
            label="Password"
            placeholder="•••••••••••••••••••••"
            radius="md"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor component={Link} to={LINKS.FORGOT_PASSWORD} size="sm">
              Forgot password?
            </Anchor>
          </Group>
        </Stack>

        <Group justify="space-between" mt="xl">
          <p className="text-base-content/60">
            Don't have account yet?{" "}
            <Anchor component={Link} to={LINKS.REGISTER} c="blue">
              Register here
            </Anchor>
          </p>
          <Button
            type="submit"
            radius="xl"
            disabled={!isValid || isSubmitting || isPending}
          >
            {isSubmitting || isPending ? (
              <span className="loading loading-spinner" />
            ) : (
              "Log In"
            )}
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export default LoginPage;
