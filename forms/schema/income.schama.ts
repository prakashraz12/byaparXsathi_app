import { z } from "zod";

export const IncomeSchema = z.object({
    incomeSource: z.string().optional().or(z.literal("")),
    amount: z.string().min(1, "Amount is required"),
    remarks: z.string().optional().or(z.literal("")),
    createdAt: z.date(),
});

export type TIncomeSchema = z.infer<typeof IncomeSchema>;
