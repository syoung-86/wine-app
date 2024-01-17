import { z } from "zod";

export const WineType = z.enum([
  "Red",
  "White",
  "Rosé",
  "White Blend",
  "Red Blend",
]);

export const updateWineSchema = z.object({
  id: z.number(),
  name: z.string(),
  year: z
    .number()
    .min(1000, "Year must be at least 1000")
    .max(new Date().getFullYear(), "Year can't be in the future"),
  type: WineType,
  varietals: z.number().array(),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  consumed: z.boolean(),
  date_consumed: z.date().optional().nullable(),
});

export const createWineSchema = z.object({
  name: z.string(),
  year: z
    .number()
    .min(1000, "Year must be at least 1000")
    .max(new Date().getFullYear(), "Year can't be in the future"),
  type: WineType,
  varietals: z.number().array(),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  consumed: z.boolean(),
  date_consumed: z.date().optional().nullable(),
});
