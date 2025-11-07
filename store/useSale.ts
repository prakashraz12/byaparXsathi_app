import { create } from 'zustand';

import Customer from '@/database/model/customer.model';

type PaymentStatus = 'Unpaid' | 'Paid' | 'PartiallyPaid';

type SalesState = {
  paymentStatus: PaymentStatus;
  paymentId?: string;
  paidAmount?: string;
  customer?: Customer | null;
  subTotal: string;
  grandTotal: number;
  oldDue: number;
  invoiceDate: Date;
  remarks: string;
  additionalAmount: string;
  discountAmount: string;
  discountPercentage: string;
  taxAmount: string;
  taxPercentage: string;
  dueAmount: string;


  // actions
  setPaymentStatus: (status: PaymentStatus) => void;
  setPaymentId: (id: string) => void;
  setPaidAmount: (amount: string) => void;
  setCustomer: (customer: Customer | null) => void;
  setSubTotal: (amount: string) => void;
  setGrandTotal: (amount: number) => void;
  setDiscountAmount: (amount: string) => void;
  setDiscountPercentage: (percentage: string) => void;
  setTaxAmount: (amount: string) => void;
  setTaxPercentage: (percentage: string) => void;
  setDueAmount: (amount: string) => void;
  resetSales: () => void;
  setInvoiceDate: (date: Date) => void;
  setAdditionalAmount: (amount: string) => void;
};

export const useSalesStore = create<SalesState>()((set) => ({
  paymentStatus: 'Paid',
  paymentId: undefined,
  paidAmount: "",
  customer: null,
  subTotal: "",
  grandTotal: 0,
  oldDue: 0,
  invoiceDate: new Date(),
  remarks: '',
  additionalAmount: "",
  discountAmount: "",
  discountPercentage: "",    
  taxAmount: "",
  taxPercentage: "",
  dueAmount: "",
  setPaymentStatus: (status) => set(() => ({ paymentStatus: status })),
  setPaymentId: (id) => set(() => ({ paymentId: id })),
  setPaidAmount: (amount) => set(() => ({ paidAmount: amount })),
  setCustomer: (customer) => set(() => ({ customer: customer })),
  setSubTotal: (amount) => set(() => ({ subTotal: amount })),
  setGrandTotal: (amount) => set(() => ({ grandTotal: amount })),
  setDiscountAmount: (amount) => set(() => ({ discountAmount: amount })),
  setDiscountPercentage: (percentage) => set(() => ({ discountPercentage: percentage })),
  setTaxAmount: (amount) => set(() => ({ taxAmount: amount })),
  setTaxPercentage: (percentage) => set(() => ({ taxPercentage: percentage })),
  setDueAmount: (amount) => set(() => ({ dueAmount: amount })),
  setInvoiceDate: (date) => set(() => ({ invoiceDate: date })),
  setAdditionalAmount: (amount) => set(() => ({ additionalAmount: amount })),

  resetSales: () =>
    set(() => ({
      paymentStatus: 'Paid',
      paymentId: undefined,
      paidAmount:   "",
      customer: null,
      subTotal: "",
      grandTotal: 0,
      oldDue: 0,
      invoiceDate: new Date(),
      remarks: '',
      additionalAmount: "",
      discountAmount: "",
      taxAmount: "",
      discountPercentage: "",
      taxPercentage: "",
      dueAmount: "",
    })),
}));
