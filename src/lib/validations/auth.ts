import { z } from "zod/v4";

export const loginSchema = z.object({
    username_or_email: z
        .string()
        .min(1, "Username or email is required"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    first_name: z
        .string()
        .min(2, "First name must be at least 2 characters"),
    last_name: z
        .string()
        .min(2, "Last name must be at least 2 characters"),
    username: z
        .string()
        .min(3, "Username must be at least 3 characters"),
    email: z
        .email("Please enter a valid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
