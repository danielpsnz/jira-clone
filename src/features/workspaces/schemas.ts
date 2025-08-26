import { z } from "zod";

const fileSchema =
  typeof File !== "undefined" ? z.instanceof(File) : z.any();

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: z
    .union([
      fileSchema,
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});
