export const PaymentStatus = {
  PAID: 'PAID',
  UNPAID: 'UNPAID',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
} as const;

export const PaymentStatusOptions = [
  { label: 'Paid', value: PaymentStatus.PAID },
  { label: 'Unpaid', value: PaymentStatus.UNPAID },
  { label: 'Partially Paid', value: PaymentStatus.PARTIALLY_PAID },
];
