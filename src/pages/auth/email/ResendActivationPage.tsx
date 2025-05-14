import { Button, Stack, TextInput, Text, Title, Group } from "@mantine/core";
import { useResendActivation } from "@/hooks/api/useResendActivation";
import { useNotify } from "@/hooks/useNotify";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { IconLogout } from "@tabler/icons-react";
import { LINKS } from "@/constants/links";

export default function ResendActivationPage() {
  const { mutate: resend, isPending } = useResendActivation();
  const { error, success } = useNotify();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm({
    mode: "uncontrolled",
    clearInputErrorOnChange: false,
    initialValues: {
      email: "",
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  useEffect(() => {
    if (user?.isActive) {
      navigate("/me/profile");
    }
  }, [user]);

  const handleLogout = () => {
    navigate(LINKS.LOGIN);
  };

  const handleSubmit = (values: { email: string }) => {
    resend(values, {
      onSuccess: (res) => {
        if (typeof res.message === "string") {
          success(res.message || "Sent!");
        } else {
          success("Sent!"); // fallback nếu res.message không phải string
        }
      },
      onError: (err) => {
        error(err);
      },
    });
  };

  return (
    <Stack align="center">
      <Title order={3}>Resend Activation</Title>
      <Text size="sm">Enter the email you used to register</Text>

      <form
        onSubmit={form.onSubmit(handleSubmit)}
        style={{ width: "100%", maxWidth: 400 }}
      >
        <TextInput
          withAsterisk
          label="Email"
          placeholder="email@example.com"
          {...form.getInputProps("email")}
        />
        <Button type="submit" mt="md" loading={isPending} fullWidth>
          Resend Activation Email
        </Button>
      </form>
      <Group justify="flex-end" mt="md">
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
      </Group>
    </Stack>
  );
}
