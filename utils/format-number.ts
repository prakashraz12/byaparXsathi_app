export function formatNumberWithComma(value: number | string): string {
  if (value === null || value === undefined) return '0';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  return `Rs.${num.toLocaleString('en-US')}`;
}
