import { SHOP_TYPE } from '@/types/shop';
import { z } from 'zod';

export const shopSchema = z.object({
  shopName: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('Invalid email address').or(z.literal('')),
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 characters long')
    .or(z.literal('')),
  address: z.string().min(5, 'Address must be at least 5 characters long'),
  panNumber: z.string().min(5, 'Pan number must be at least 5 characters long').or(z.literal('')),
  registrationNumber: z
    .string()
    .min(5, 'Registration number must be at least 5 characters long')
    .or(z.literal('')),
  shopType: z.enum(SHOP_TYPE),
});

export type TShopSchema = z.infer<typeof shopSchema>;
