export const formatNumberWithMode = (
  num: number,
  locale: string = 'in',
  decimals: number = 1,
): string => {
  if (num === null || num === undefined || isNaN(num)) return '0';

  const isIndianSystem = locale.toLowerCase() === 'in' || locale.toLowerCase() === 'np';

  if (isIndianSystem) {
    // Indian Numbering System: K, Lakh, Crore
    if (num >= 10000000) {
      // 1 Crore = 10,000,000
      return `${(num / 10000000).toFixed(decimals)}Cr`;
    } else if (num >= 100000) {
      // 1 Lakh = 100,000
      return `${(num / 100000).toFixed(decimals)}L`;
    } else if (num >= 1000) {
      // 1 Thousand
      return `${(num / 1000).toFixed(decimals)}K`;
    }
  } else {
    // Western Numbering System: K, M, B
    if (num >= 1000000000) {
      // 1 Billion
      return `${(num / 1000000000).toFixed(decimals)}B`;
    } else if (num >= 1000000) {
      // 1 Million
      return `${(num / 1000000).toFixed(decimals)}M`;
    } else if (num >= 1000) {
      // 1 Thousand
      return `${(num / 1000).toFixed(decimals)}K`;
    }
  }

  return num.toFixed(0);
};
