import { useForm } from "@mantine/form";

import { useUpdateGroupName } from "@/hooks/api/admin/useGroupManage";
import { UpdateGroupNameRequest } from "@/types/api/requests/adminRequests";

import { useChangeGroupNameModalStore } from "@/stores/admin/groupManageStore";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/utils/useDebounce";
import { Modal, Stack, Text, TextInput, Button } from "@mantine/core";
import { checkGroup } from "@/services/api/authApi";

export const ChangeGroupNameModal = () => {
    const { modalOpen, groupToEdit, closeModal } = useChangeGroupNameModalStore();
    const { mutate: updateGroupName, isPending } = useUpdateGroupName();
  
    const [groupExists, setGroupExists] = useState(false);
    const [checking, setChecking] = useState(false);
  
    const form = useForm<UpdateGroupNameRequest>({
      initialValues: {
        name: groupToEdit?.name || "",
      },
      validate: {
        name: (value) => {
          if (!value) return "Group name is required";
          if (value.length < 1) return "Group name must be at least 1 character";
          if (value.length > 64) return "Group name must be at most 64 characters";
          return null;
        },
      },
    });
  
    const debouncedName = useDebounce(form.values.name, 300);
  
    useEffect(() => {
      if (!debouncedName || debouncedName === groupToEdit?.name) {
        setGroupExists(false);
        return;
      }
  
      setChecking(true);
      checkGroup(debouncedName)
        .then(() => setGroupExists(true))
        .catch((err) => {
          if (err?.response?.status === 404) {
            setGroupExists(false);
          }
        })
        .finally(() => setChecking(false));
    }, [debouncedName]);
  
    useEffect(() => {
      if (modalOpen && groupToEdit) {
        form.setValues({ name: groupToEdit.name });
        form.clearErrors();
        setGroupExists(false);
      }
    }, [modalOpen, groupToEdit]);
  
    const handleSubmit = (values: UpdateGroupNameRequest) => {
      if (!groupToEdit) return;
  
      updateGroupName({
        groupId: groupToEdit.id,
        data: values,
      });
    };
  
    const handleClose = () => {
      closeModal();
      form.reset();
    };
  
    return (
      <Modal
        opened={modalOpen}
        onClose={handleClose}
        title={<Text fw={700} size="lg">Change Group Name</Text>}
        centered
        size="md"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Current group: <Text span fw={500}>{groupToEdit?.name}</Text>
          </Text>
  
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="New Group Name"
                placeholder="Enter new group name"
                required
                {...form.getInputProps("name")}
                error={groupExists ? "Group name already exists" : form.getInputProps("name").error}
                disabled={isPending}
              />
  
              <Stack gap="sm" mt="md">
                <Button
                  type="submit"
                  fullWidth
                  loading={isPending}
                  disabled={
                    !form.isDirty() || !form.isValid() || groupExists || checking
                  }
                >
                  Update Group Name
                </Button>
                <Button
                  variant="light"
                  fullWidth
                  onClick={handleClose}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Modal>
    );
  };
  