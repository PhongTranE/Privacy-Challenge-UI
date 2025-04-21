import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { LINKS } from '@/constants/links';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@/utils/validations/authValidations';
import { useRegister } from '@/hooks/api/useRegister';

import {
    Anchor,
    Button,
    Checkbox,
    Group,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
  } from '@mantine/core';

const RegisterPage: React.FC = () => {
    const {
        register,
        formState: { errors, isSubmitting, isValid },
        handleSubmit,
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        mode: 'onTouched',
    });

    const { mutate: registerAuth, isPending} = useRegister();

    const onSubmit = (data: RegisterInput) => {
        registerAuth(data); 
    };
  return (
    <Paper radius="md" p="xl">
      <Text size="lg" fw={500} ta="center">
      Create Account
      </Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>

          <TextInput
            required
            label="Username"
            placeholder="mantine"
            {...register("username", {
                required: "Username is required"
                })}
            radius="md"
          />
            {errors.username && (
                <span className="text-red-500 text-sm max-w-[320px]">{errors.username.message}</span>
            )}
          <TextInput
            required
            label="Email"
            placeholder="hello@mantine.dev"
            {...register("email", {
                required: "Email is required"
                })}
            radius="md"
          />
            {errors.email && (
                <span className="text-red-500 text-sm max-w-[320px] ">{errors.email.message}</span>
            )}
          <PasswordInput
            required
            {...register("password", {
              required: "Password is required"
            })}
            label="Password"
            placeholder="•••••••••••••••••••••"
            radius="md"
          />

            {errors.password && (
                <span className="text-red-500 text-sm max-w-[320px]">{errors.password.message}</span>
            )}

            <PasswordInput
            required
            {...register("confirmPassword", {
              required: "Password confirm is required"
            })}
            label="Conmfirm Password"
            placeholder="•••••••••••••••••••••"
            radius="md"
          />
            {errors.confirmPassword && (
                <span className="text-red-500 text-sm max-w-[320px]">{errors.confirmPassword.message}</span>
            )}
          <Checkbox
            label="I accept terms and conditions"
            // checked={form.values.terms}
            // onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
          />
        </Stack>

        <Group justify="space-between" mt="xl">
            <p className="text-base-content/60">
                Already have an account?{' '}
                <Anchor component={Link} to={LINKS.LOGIN} c="blue">
                    Login here
                </Anchor>
            </p>
            <Button type="submit" radius="xl" disabled={!isValid || isSubmitting || isPending}>
                {(isSubmitting || isPending) ? (
                    <span className="loading loading-spinner" />
                ) : (
                    'Register'
                )}
            </Button>
        </Group>
      </form>
    </Paper>
  );
};

export default RegisterPage;
