import { z } from "zod/v4";

export const ideaSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters"),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters"),
});

export type IdeaFormValues = z.infer<typeof ideaSchema>;
