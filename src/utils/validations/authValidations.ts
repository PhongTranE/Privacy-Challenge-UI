import { z } from 'zod';

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,128}$/;

export const registerSchema = z
  .object({
    // Email field
    email: z
      .string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
      })
      .nonempty('Email cannot be empty')
      .email({ message: 'Invalid email format' })
      .max(255, { message: 'Email must be at most 255 characters long' }),

    // Username field
    username: z
      .string({
        required_error: 'Username is required',
        invalid_type_error: 'Username must be a string',
      })
      .nonempty('Username cannot be empty')
      .min(3, { message: 'Username must be between 3 and 50 characters' })
      .max(50, { message: 'Username must be between 3 and 50 characters' }),

    // Password field with strong regex
    password: z
      .string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string',
      })
      .nonempty('Password cannot be empty')
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(128, { message: 'Password must be at most 128 characters long' })
      .regex(strongPasswordRegex, {
        message:
          'Password must contain uppercase, lowercase, a digit, and a symbol',
      }),

    confirmPassword: z.string({
      required_error: 'Confirm password is required',
    })
    .nonempty('Confirm password cannot be empty'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });


export const loginSchema = z.object({
    username: z.string({
      required_error: 'Username is required',
    })
    .nonempty('Username cannot be empty'),
  
    password: z.string({
      required_error: 'Password is required',
    })
    .nonempty('Password cannot be empty'),
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
