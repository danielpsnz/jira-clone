import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Required"),
});

export const signUpSchema = z.object({
  name: z.string().min(1, "Required"),
  email: z.email(),
  password: z.string().min(8, "Minimum 8 characters required"),
});