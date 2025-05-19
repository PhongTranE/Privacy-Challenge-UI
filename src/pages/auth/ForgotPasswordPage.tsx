import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordInput } from '@/utils/validations/authValidations';
import { useForgotPassword } from '@/hooks/api/auth/useForgotPassword';
import { Button, Paper, Stack, Text, TextInput } from '@mantine/core';

const ForgotPasswordPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting, isValid } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
  });

  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const onSubmit = (data: ForgotPasswordInput) => {
    forgotPassword(data);
  };

  return (
    <Paper radius="md" p="xl" className="authen-form authen-form__forgot-pasword ">
      <Text size="lg" fw={500} ta="center">
        Forgot your password?
      </Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack mt="md">
          <TextInput
            label="Email"
            placeholder="Enter your email"
            {...register('email', { required: 'Email is required' })}
            error={errors.email?.message}
          />
          <Button
            type="submit"
            radius="xl"
            loading={isSubmitting || isPending}
            disabled={!isValid}
          >
            Send Reset Email
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default ForgotPasswordPage;
