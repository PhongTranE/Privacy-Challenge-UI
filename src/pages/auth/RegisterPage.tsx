import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { LINKS } from "@/constants/links"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterInput } from "@/utils/validations/authValidations"
import { useRegister } from "@/hooks/api/useRegister"
import { useCheckGroup } from "@/hooks/api/useCheckGroup"
import { useDebounce } from "@/hooks/utils/useDebounce"

import {
  Anchor,
  Button,
  Checkbox,
  createTheme,
  Group,
  MantineProvider,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core"

const RegisterPage: React.FC = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [groupName, setGroupName] = useState("")
  const debouncedGroupName = useDebounce(groupName, 1000) // 500ms debounce
  const [groupStatus, setGroupStatus] = useState<{
    message: string
    type: "success" | "error" | "info" | null
  }>({ message: "", type: null })

  const {
    register,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
    setValue,
    watch,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  })

  const { mutate: registerAuth, isPending } = useRegister()
  const { mutate: checkGroupName, isPending: isCheckingGroup } = useCheckGroup()

  // Watch the group_name field to sync with our local state
  const watchedGroupName = watch("group_name")

  // Update local state when the form field changes
  useEffect(() => {
    if (watchedGroupName !== groupName) {
      setGroupName(watchedGroupName || "")
    }
  }, [watchedGroupName, groupName])

  // Check group name when debounced value changes
  useEffect(() => {
    if (debouncedGroupName && debouncedGroupName.length > 2) {
      checkGroupName(debouncedGroupName, {
        onSuccess: (res) => {
          if (res.status === "success") {
            setGroupStatus({
              message: `Group "${res.data?.group}" is available.`,
              type: "success",
            })
          } else {
            setGroupStatus({
              message: res.message as string,
              type: "error",
            })
          }
        },
        onError: (err: any) => {
          // Check if the error contains "Group not found" message
          const errorMessage = err?.response?.data?.message || "Error checking group name"

          if (errorMessage.includes("Group not found")) {
            setGroupStatus({
              message: "Group not found",
              type: "error",
            })
          } else {
            setGroupStatus({
              message: errorMessage,
              type: "error",
            })
          }
        },
      })
    } else if (debouncedGroupName) {
      setGroupStatus({
        message: "Group name must be longer than 2 characters",
        type: "info",
      })
    } else {
      setGroupStatus({ message: "", type: null })
    }
  }, [debouncedGroupName, checkGroupName])

  const onSubmit = (data: RegisterInput) => {
    registerAuth(data)
  }

  const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setGroupName(value)
    setValue("group_name", value, { shouldValidate: true })
  }

  const theme = createTheme({
    cursorType: "pointer",
  })

  return (
    <Paper radius="md" p="xl" className="authen-form authen-form__register">
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
              required: "Username is required",
            })}
            radius="md"
          />
          {errors.username && <span className="text-red-500 text-sm max-w-[320px]">{errors.username.message}</span>}
          <TextInput
            required
            label="Email"
            placeholder="hello@mantine.dev"
            {...register("email", {
              required: "Email is required",
            })}
            radius="md"
          />
          {errors.email && <span className="text-red-500 text-sm max-w-[320px] ">{errors.email.message}</span>}
          <PasswordInput
            required
            {...register("password", {
              required: "Password is required",
            })}
            label="Password"
            placeholder="•••••••••••••••••••••"
            radius="md"
          />

          {errors.password && <span className="text-red-500 text-sm max-w-[320px]">{errors.password.message}</span>}

          <PasswordInput
            required
            {...register("confirmPassword", {
              required: "Password confirm is required",
            })}
            label="Confirm Password"
            placeholder="•••••••••••••••••••••"
            radius="md"
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm max-w-[320px]">{errors.confirmPassword.message}</span>
          )}
          <TextInput
            required
            label="Group Name"
            placeholder="KMA-01"
            value={groupName}
            onChange={handleGroupNameChange}
            radius="md"
            rightSection={isCheckingGroup ? <span className="loading loading-spinner loading-xs" /> : null}
          />
          {errors.group_name && <span className="text-red-500 text-sm max-w-[320px]">{errors.group_name.message}</span>}
          {groupStatus.message && (
            <div
              className={`text-sm max-w-[320px] ${
                groupStatus.type === "success"
                  ? "text-green-500"
                  : groupStatus.type === "error"
                    ? "text-red-500"
                    : "text-blue-500"
              }`}
            >
              {groupStatus.message}
              {groupStatus.type === "error" && (
                <div className="mt-1 text-gray-500">
                  Note: If this group doesn't exist, a new group will be created.
                </div>
              )}
            </div>
          )}
          <TextInput
            required
            label="Invite Key"
            placeholder="abc123"
            {...register("invite_key", {
              required: "Invite Key is required",
            })}
            radius="md"
          />
          {errors.invite_key && <span className="text-red-500 text-sm max-w-[320px]">{errors.invite_key.message}</span>}
          <MantineProvider theme={theme}>
            <Checkbox
              label={
                <>
                  I accept{" "}
                  <Anchor
                    href="https://docs.google.com/document/d/e/2PACX-1vRCWk6yIxzfylhms5PVVGnGkzW4l4UbpejnyhaFrqfMRKfQpZzdSb75_ObW4iBnJ8vGx16uDDncBJ1k/pub"
                    target="_blank"
                    inherit
                  >
                    terms and conditions
                  </Anchor>
                </>
              }
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.currentTarget.checked)}
            />
          </MantineProvider>
        </Stack>

        <Group justify="space-between" mt="xl">
          <p className="text-base-content/60">
            Already have an account?{" "}
            <Anchor component={Link} to={LINKS.LOGIN} c="blue">
              Login here
            </Anchor>
          </p>
          <Button type="submit" radius="xl" disabled={!isValid || isSubmitting || isPending || !acceptedTerms}>
            {isSubmitting || isPending ? <span className="loading loading-spinner" /> : "Register"}
          </Button>
        </Group>
      </form>
    </Paper>
  )
}

export default RegisterPage
