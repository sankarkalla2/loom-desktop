import { z } from "zod";

export const updatedStudioSchema = z.object({
  id: z.string(),
  screen: z.string().optional(),
  mic: z.string().optional(),
  audio: z.string().optional(),
  preset: z.enum(["HD", "SD"]).optional(),
});
