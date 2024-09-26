import { z } from "zod";

// Regular expression for strong password:
// At least 6 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character.
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
const passwordErrorMessage =
  "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character";

// User creation schema with strong password validation
export const userSchema = z.object({
  names: z
    .string()
    .min(3, { message: "Names must be at least 3 characters long" })
    .refine((val) => val.trim().length > 0, { message: "Name is required" }),

  email: z
    .string()
    .email({ message: "Invalid email format" })
    .refine((val) => val.trim().length > 0, { message: "Email is required" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(strongPasswordRegex, { message: passwordErrorMessage })
    .refine((val) => val.trim().length > 0, { message: "Password is required" }),
});

// User update schema
export const userUpdateSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .optional(),

  email: z
    .string()
    .email({ message: "Invalid email format" })
    .optional(),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(strongPasswordRegex, { message: passwordErrorMessage })
    .optional(),
});

// Login schema
export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please provide a valid email address" })
    .refine((val) => val.trim().length > 0, { message: "Email is required" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(strongPasswordRegex, { message: passwordErrorMessage })
    .refine((val) => val.trim().length > 0, { message: "Password is required" }),
});

// Password reset schema
export const passwordResetSchema = z.object({
  email: z
    .string()
    .email({ message: "Please provide a valid email address" })
    .refine((val) => val.trim().length > 0, { message: "Email is required" }),
});

// Reset password with confirmation schema
export const passwordResetUpdateSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(strongPasswordRegex, { message: passwordErrorMessage })
    .refine((val) => val.trim().length > 0, { message: "Password is required" }),

  confirmPassword: z
    .string()
    .min(6, { message: "Confirm password must be at least 6 characters long" })
    .refine((val) => val.trim().length > 0, { message: "Confirm password is required" }),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Update password schema
export const passwordUpdateSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Current password must be at least 6 characters long" })
    .refine((val) => val.trim().length > 0, { message: "Current password is required" }),

  newPassword: z
    .string()
    .min(6, { message: "New password must be at least 6 characters long" })
    .regex(strongPasswordRegex, { message: passwordErrorMessage })
    .refine((val) => val.trim().length > 0, { message: "New password is required" }),

  confirmPassword: z
    .string()
    .min(6, { message: "Confirm password must be at least 6 characters long" })
    .refine((val) => val.trim().length > 0, { message: "Confirm password is required" }),
})
.refine((data) => data.newPassword === data.confirmPassword, {
  message: "New password and confirm password do not match",
  path: ["confirmPassword"],
});
