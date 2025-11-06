import { z } from 'zod';

export const itemSchema = z
  .object({
    itemName: z.string().min(3, 'Item name must be at least 3 characters'),
    costPrice: z.string().optional(),
    sellingPrice: z.string().min(1, 'Selling price is required'),
    measurementUnit: z.string().min(1, 'Measuring unit is required'),
    openingStock: z.string().optional(),
    currentStock: z.string().optional(),
    lowStockAlert: z.string().optional(),
    isStockEnabled: z.boolean(),
    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.isStockEnabled) {
        return data.openingStock && data.openingStock.trim() !== '';
      }
      return true;
    },
    {
      message: 'Opening stock is required',
      path: ['openingStock'],
    },
  )
  .refine(
    (data) => {
      if (data.isStockEnabled) {
        return data.currentStock && data.currentStock.trim() !== '';
      }
      return true;
    },
    {
      message: 'Current stock is required',
      path: ['currentStock'],
    },
  )
  .refine(
    (data) => {
      if (data.isStockEnabled) {
        return data.lowStockAlert && data.lowStockAlert.trim() !== '';
      }
      return true;
    },
    {
      message: 'Low stock alert is required',
      path: ['lowStockAlert'],
    },
  )
  .refine(
    (data) => {
      if (data.isStockEnabled && data.openingStock) {
        return /^\d+\.?\d*$/.test(data.openingStock);
      }
      return true;
    },
    {
      message: 'Opening stock must be a valid number',
      path: ['openingStock'],
    },
  )
  .refine(
    (data) => {
      if (data.isStockEnabled && data.currentStock) {
        return /^\d+\.?\d*$/.test(data.currentStock);
      }
      return true;
    },
    {
      message: 'Current stock must be a valid number',
      path: ['currentStock'],
    },
  )
  .refine(
    (data) => {
      if (data.isStockEnabled && data.lowStockAlert) {
        return /^\d+\.?\d*$/.test(data.lowStockAlert);
      }
      return true;
    },
    {
      message: 'Low stock alert must be a valid number',
      path: ['lowStockAlert'],
    },
  );

export type TItemSchema = z.infer<typeof itemSchema>;
