import { z } from "zod";

export const PaymentInSchema = z.object({
  paymentInDate: z.number().optional().or(z.literal(0)),
  amount: z.string().min(1, "Amount is required"),
  remarks: z.string().optional().or(z.literal("")),
  paymentId: z.string().optional().or(z.literal("")),
});

export type TPaymentInSchema = z.infer<typeof PaymentInSchema>;
