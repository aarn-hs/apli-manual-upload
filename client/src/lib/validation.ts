// PMX validation (format: PMX + 8 digits)
export function validatePMX(pmx: string): boolean {
  if (!pmx) return false;
  // Allow case insensitive "PMX" prefix followed by 8 digits
  return /^[Pp][Mm][Xx]\d{8}$/i.test(pmx);
}

// CURP validation (18 alphanumeric characters)
export function validateCURP(curp: string): boolean {
  if (curp.length !== 18) return false;
  
  // Basic CURP format: 4 letters + 6 digits + 8 alphanumeric
  const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]\d$/;
  return curpRegex.test(curp);
}

// RFC validation (13 alphanumeric characters)
export function validateRFC(rfc: string): boolean {
  if (rfc.length !== 13) return false;
  
  // Basic RFC format: 4 letters + 6 digits + 3 alphanumeric
  const rfcRegex = /^[A-Z]{4}\d{6}[0-9A-Z]{3}$/;
  return rfcRegex.test(rfc);
}

// NSS validation (10-11 digits)
export function validateNSS(nss: string): boolean {
  // Check if it has 10 or 11 digits
  if (!/^\d{10,11}$/.test(nss)) return false;
  
  // Extract the year part (positions 5-6) and check if it's between 45 and current year
  const yearPart = parseInt(nss.substring(4, 6));
  const currentYear = new Date().getFullYear() % 100; // Last two digits of current year
  
  // Year should be between 45 and current year
  return (yearPart >= 45 && yearPart <= 99) || (yearPart >= 0 && yearPart <= currentYear);
}

// CLABE validation (18 digits, verify check digit and bank code)
export function validateCLABE(clabe: string): boolean {
  if (!clabe) return true; // Optional field
  if (!/^\d{18}$/.test(clabe)) return false;
  
  // Validate bank code (first 3 digits)
  const bankCode = clabe.substring(0, 3);
  const validBankCodes = ["002", "012", "036", "014"]; // BBVA, HSBC, Inbursa, Banamex
  
  if (!validBankCodes.includes(bankCode)) {
    return false;
  }
  
  // Validate check digit (last digit)
  // This is a simplified implementation
  // In a real application, you would implement the full algorithm
  const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
  let sum = 0;
  
  for (let i = 0; i < 17; i++) {
    sum += parseInt(clabe.charAt(i)) * weights[i];
  }
  
  const checkDigit = (10 - (sum % 10)) % 10;
  return parseInt(clabe.charAt(17)) === checkDigit;
}

// Check if a date is a working day (not weekend or holiday)
export function isWorkingDay(dateStr: string): boolean {
  if (!dateStr) return false;
  
  const date = new Date(dateStr);
  const dayOfWeek = date.getDay();
  
  // Check if it's weekend (0 = Sunday, 6 = Saturday)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }
  
  // Future date validation (max 5 business days in the future)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const differenceInDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate business days (approximate method)
  let businessDays = differenceInDays;
  const fullWeeks = Math.floor(differenceInDays / 7);
  businessDays -= fullWeeks * 2; // Subtract weekend days for each full week
  
  // Add correction for remaining days
  const remainingDays = differenceInDays % 7;
  const startDay = today.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Check if the remaining days include weekend days
  for (let i = 0; i < remainingDays; i++) {
    const currentDay = (startDay + i) % 7;
    if (currentDay === 0 || currentDay === 6) {
      businessDays--;
    }
  }
  
  // Check if date is not in the past and not more than 5 business days in the future
  return differenceInDays >= 0 && businessDays <= 5;
}
