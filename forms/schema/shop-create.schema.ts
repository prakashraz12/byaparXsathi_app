import { z } from 'zod';

export const shopSchema = z.object({
  shopName: z.string().min(3, 'Shop Name must be at least 3 characters long'),
  email: z.string().email('Invalid email address').or(z.literal('')),
  phone: z.string().min(10, 'Phone number must be at least 10 characters long'),
  address: z.string().min(5, 'Address must be at least 5 characters long'),
  shopType: z.string().min(1, 'Shop type is required'),
  panNumber: z.string().or(z.literal('')).optional(),
  registrationNumber: z.string().or(z.literal('')).optional(),
});

export type TShop = z.infer<typeof shopSchema>;
