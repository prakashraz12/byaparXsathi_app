export const invoiceNumberGenerator = (): string => {
    // 6-digit main invoice number (random between 100000–999999)
    const mainPart = Math.floor(100000 + Math.random() * 900000);
  
    // 4 random digits
    const randomPart = Math.floor(1000 + Math.random() * 9000);
  
    // last two digits from current time
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const timeDigits = `${hours[0]}${minutes[1]}`; // e.g., 1:07 → 17, 12:45 → 25
  
    // Combine all parts
    return `INV-${mainPart}${randomPart}${timeDigits}`;
  };
  
