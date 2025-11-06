import { z } from 'zod';

export const completeSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters long'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters long'),
  address: z.string().min(5, 'Address must be at least 5 characters long'),
  shopName: z.string().min(3, 'Name must be at least 3 characters long'),
  shopType: z.string().min(3, 'Name must be at least 3 characters long'),
});

export type TCompleteSchema = z.infer<typeof completeSchema>;
