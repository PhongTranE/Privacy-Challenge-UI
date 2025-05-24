import React, { useEffect } from "react";
import { Modal, Button, Group, PasswordInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePasswordModalStore } from "@/stores/admin/usersManageStore";
import {
  adminChangeUserPasswordSchema,
  AdminChangeUserPasswordInput,
} from "@/utils/validations/authValidations";
import { AdminChangeUserPasswordRequest } from "@/types/api/requests/adminRequests";
import { useChangePassword } from "@/hooks/api/admin/useUsersManage";

export const ChangePasswordModal: React.FC = () => {
  const { modalOpen, userId, closeModal } = useChangePasswordModalStore();
  const { mutate: changePassword, isPending } = useChangePassword();

  const form = useForm<AdminChangeUserPasswordInput>({
    resolver: zodResolver(adminChangeUserPasswordSchema),
    mode: "onTouched",
    defaultValues: { new_password: "", confirm_password: "" },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!modalOpen) {
      form.reset();
    }
  }, [modalOpen, form]);

  const onSubmit = (values: AdminChangeUserPasswordRequest) => {
    if (!userId) return;
    changePassword(
      { userId, body: { new_password: values.new_password } },
      {
        onSettled: () => {
          form.reset();
          closeModal();
        },
      }
    );
  };

  return (
    <Modal
      opened={modalOpen}
      onClose={closeModal}
      title="Change User Password"
      centered
      classNames={{
        title: "text-xl font-bold text-orange-500",
        content: "bg-gray-800/90 backdrop-blur-sm border border-orange-500/30",
        header: "bg-gray-800/90 border-b border-orange-500/30",
        body: "text-gray-200",
      }}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PasswordInput
          label="New Password"
          {...form.register("new_password")}
          error={form.formState.errors.new_password?.message}
          required
          classNames={{
            label: "text-gray-200 mb-2",
            input: "bg-gray-700/50 border-gray-600 text-gray-200 focus:border-orange-500",
            error: "text-red-400",
          }}
        />
        <PasswordInput
          label="Confirm Password"
          {...form.register("confirm_password")}
          error={form.formState.errors.confirm_password?.message}
          required
          classNames={{
            label: "text-gray-200 mb-2",
            input: "bg-gray-700/50 border-gray-600 text-gray-200 focus:border-orange-500",
            error: "text-red-400",
          }}
        />
        <Group mt="md" justify="flex-end" gap="sm">
          <Button 
            variant="default" 
            onClick={closeModal} 
            disabled={isPending}
            className="bg-gray-700 hover:bg-gray-600 text-gray-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isPending}
            disabled={!form.formState.isValid}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Change Password
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
