import { z } from "zod";

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,128}$/;

// registerSchema
export const registerSchema = z
  .object({
    // Email field
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .nonempty("Email cannot be empty")
      .email({ message: "Invalid email format" })
      .max(255, { message: "Email must be at most 255 characters long" }),

    // Username field
    username: z
      .string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string",
      })
      .nonempty("Username cannot be empty")
      .min(3, { message: "Username must be between 3 and 50 characters" })
      .max(50, { message: "Username must be between 3 and 50 characters" }),

    // Password field with strong regex
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .nonempty("Password cannot be empty")
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(128, { message: "Password must be at most 128 characters long" })
      .regex(strongPasswordRegex, {
        message:
          "Password must contain uppercase, lowercase, a digit, and a symbol",
      }),

    confirmPassword: z
      .string({
        required_error: "Confirm password is required",
      })
      .nonempty("Confirm password cannot be empty"),

    // GroupName field - required
    group_name: z
      .string({
        required_error: "Group Name is required",
      })
      .nonempty("Group Name cannot be empty"),
    // InviteKey field - required
    invite_key: z
      .string({
        required_error: "Invite key is required",
      })
      .nonempty("Invite Key cannot be empty"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// loginSchema
export const loginSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
    })
    .nonempty("Username cannot be empty"),

  password: z
    .string({
      required_error: "Password is required",
    })
    .nonempty("Password cannot be empty"),
});

//changePasswordSchema
export const changePasswordSchema = z
  .object({
    old_password: z
      .string({
        required_error: "Old password is required",
        invalid_type_error: "Old password must be a string",
      })
      .nonempty("Old password cannot be empty"),
    new_password: z
      .string({
        required_error: "New password is required",
        invalid_type_error: "New password must be a string",
      })
      .nonempty("New password cannot be empty")
      .min(8, { message: "New password must be at least 8 characters long" })
      .max(128, { message: "New password must be at most 128 characters long" })
      .regex(strongPasswordRegex, {
        message:
          "New password must contain uppercase, lowercase, a digit, and a symbol",
      }),
    confirm_password: z
      .string({
        required_error: "Confirm new password is required",
      })
      .nonempty("Confirm new password cannot be empty"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"], 
  });

// forgotPasswordSchema
export const forgotPasswordSchema = z.object({
  // Email field
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .nonempty("Email cannot be empty")
    .email({ message: "Invalid email format" })
    .max(255, { message: "Email must be at most 255 characters long" }),
});

// resetPasswordSchema
export const resetPasswordSchema = z
  .object({
    // Password field with strong regex
    new_password: z
      .string({
        required_error: "New password is required",
        invalid_type_error: "New password must be a string",
      })
      .nonempty("New password cannot be empty")
      .min(8, { message: "New password must be at least 8 characters long" })
      .max(128, { message: "New password must be at most 128 characters long" })
      .regex(strongPasswordRegex, {
        message:
          "New password must contain uppercase, lowercase, a digit, and a symbol",
      }),

    confirm_new_password: z
      .string({
        required_error: "Confirm new password is required",
      })
      .nonempty("Confirm new password cannot be empty"),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords do not match",
    path: ["confirm_new_password"],
  });

// adminChangeUserPasswordSchema (chỉ cần new_password)
export const adminChangeUserPasswordSchema = z
  .object({
    new_password: z
      .string({
        required_error: "New password is required",
        invalid_type_error: "New password must be a string",
      })
      .nonempty("New password cannot be empty")
      .min(8, { message: "New password must be at least 8 characters long" })
      .max(128, { message: "New password must be at most 128 characters long" })
      .regex(strongPasswordRegex, {
        message:
          "New password must contain uppercase, lowercase, a digit, and a symbol",
      }),
    confirm_password: z
      .string({
        required_error: "Confirm password is required",
      })
      .nonempty("Confirm password cannot be empty"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type AdminChangeUserPasswordInput = z.infer<
  typeof adminChangeUserPasswordSchema
>;
