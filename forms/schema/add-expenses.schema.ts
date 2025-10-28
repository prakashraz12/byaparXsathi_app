import { z } from "zod";

export const addExpensesSchema = z.object({
    title: z.string().min(1, "Expenses heading is required"),
    amount: z.string().min(1, "Amount is required"),
    remarks: z.string().optional().or(z.literal("")),
    createdAt: z.date(),
});

export type AddExpensesSchema = z.infer<typeof addExpensesSchema>;
