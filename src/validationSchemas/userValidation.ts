import z from "zod";

export const emailSchema = z.string().email("Invalid email address");

export const passwordSchema = z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(15, "Password must be at most 15 characters long")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character");

export const userDetailsSchema = z.object({
    password: z.string().optional(),
    firstname: z.string().optional(),
    lastname: z.string().optional()
})