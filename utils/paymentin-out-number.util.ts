export const paymentInOutNumberGenerator = (type: 'paymentIn' | 'paymentOut'): string => {
  const mainPart = Math.floor(100000 + Math.random() * 900000);
  return `${type === 'paymentIn' ? 'PI' : 'PO'}-${mainPart}`;
};
