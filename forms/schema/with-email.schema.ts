import { z } from "zod";

export const withEmailSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email" })
  });