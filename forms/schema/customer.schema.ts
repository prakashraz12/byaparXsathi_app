import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('Invalid email address').or(z.literal('')),
  phone: z.string().min(10, 'Phone number must be at least 10 characters long'),
  address: z.string().min(5, 'Address must be at least 5 characters long'),
});

export type TCustomerSchema = z.infer<typeof customerSchema>;
