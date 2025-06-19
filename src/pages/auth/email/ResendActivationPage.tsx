import { Button, Stack, TextInput, Text, Title, Group } from "@mantine/core";
import { useResendActivation } from "@/hooks/api/auth/useResendActivation";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { IconLogout, IconMail } from "@tabler/icons-react";
import { LINKS } from "@/constants/links";

export default function ResendActivationPage() {
  const { mutate: resend, isPending } = useResendActivation();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const form = useForm({
    mode: "controlled",
    clearInputErrorOnChange: true,
    initialValues: {
      email: "",
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
    setSentEmail(values.email);
    resend(values, {
      onSuccess: () => {
        setEmailSent(true);
      },
      onError: (err) => {
        //Handle by Backend
        console.log(err);
      },
    });
  };

  if (emailSent) {
    return (
      <Stack align="center" gap="md">        
        <Title order={3}>Email Sent Successfully!</Title>
        
        <Text ta="center" size="sm" c="#ffffffb0">
          We've sent an activation link to <strong>{sentEmail}</strong>
        </Text>

        <Text ta="center" size="sm" c="#ffffffb0">
          Please check your email and click the activation link to verify your account.
        </Text>

        <Text ta="center" size="xs" c="#ffffff80">
          Didn't receive the email? Check your spam folder.
        </Text>

        <Button
          variant="subtle"
          leftSection={<IconLogout size={16} />}
          onClick={handleLogout}
          mt="md"
          size="sm"
          color="gray"
        >
          Return to login
        </Button>
      </Stack>
    );
  }

  return (
    <Stack align="center" gap="md">
      <Title order={3}>Resend Activation Email</Title>
      
      <Text ta="center" size="sm" c="#ffffffb0">
        Enter the email address you used to register your account.
      </Text>

      <Text ta="center" size="xs" c="#ffffff80">
        We'll send you a new activation link to verify your account.
      </Text>

      <form
        onSubmit={form.onSubmit(handleSubmit)}
        style={{ width: "100%", maxWidth: 400 }}
      >
        <TextInput
          withAsterisk
          label="Email Address"
          placeholder="email@example.com"
          leftSection={<IconMail size="1rem" />}
          {...form.getInputProps("email")}
          classNames={{
            input: "bg-gray-800 text-white border-gray-600",
            label: "text-gray-300",
          }}
        />
        
        <Button 
          type="submit" 
          mt="md" 
          loading={isPending} 
          fullWidth
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isPending ? "Sending..." : "Send Activation Email"}
        </Button>
      </form>

      <Group justify="center" mt="md">
        <Button
          variant="subtle"
          leftSection={<IconLogout size={16} />}
          onClick={handleLogout}
          size="sm"
          color="gray"
        >
          Return to login
        </Button>
      </Group>
    </Stack>
  );
}
