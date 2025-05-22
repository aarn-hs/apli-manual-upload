// PMX validation (format: PMX + 8 digits)
export function validatePMX(pmx: string): boolean {
  if (!pmx) return false;
  // Allow case insensitive "PMX" prefix followed by 8 digits
  return /^[Pp][Mm][Xx]\d{8}$/i.test(pmx);
}

// Validate name (letters, spaces, accents, no special chars)
export function validateName(name: string): boolean {
  if (!name) return false;
  // Only allows letters, spaces and accents, blocks special characters
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(name);
}

// Phone validation (exactly 10 digits)
export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  return /^\d{10}$/.test(phone);
}

// Postal code validation (exactly 5 digits)
export function validatePostalCode(postalCode: string): boolean {
  if (!postalCode) return false;
  return /^\d{5}$/.test(postalCode);
}

// Address validation
export function validateAddress(address: string): boolean {
  if (!address) return false;
  // Min 2 chars, allows letters, numbers, spaces and some special chars
  return /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\.\-\#\']{2,}$/.test(address);
}

// Birth date validation
export function validateBirthDate(dateStr: string): boolean {
  if (!dateStr) return false;
  
  const birthDate = new Date(dateStr);
  if (isNaN(birthDate.getTime())) return false;
  
  const today = new Date();
  
  // Check if date is before today
  if (birthDate > today) return false;
  
  // Calculate age
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
  
  // Check if the person is at least 18 years old and less than 80 years old
  return actualAge >= 18 && actualAge < 80;
}

// CURP validation (18 alphanumeric characters)
export function validateCURP(curp: string): boolean {
  if (curp.length !== 18) return false;
  
  // Basic CURP format: 4 letters + 6 digits + 8 alphanumeric
  const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]\d$/;
  
  if (!curpRegex.test(curp)) {
    return false;
  }
  
  // Extraer fecha de nacimiento de CURP
  const yearPart = curp.substring(4, 6);
  const monthPart = curp.substring(6, 8);
  const dayPart = curp.substring(8, 10);
  
  // Convertir a fecha completa (asumiendo siglo XX para años >= 30 y siglo XXI para años < 30)
  const century = parseInt(yearPart) >= 30 ? "19" : "20";
  const birthYear = century + yearPart;
  
  // Verificar que la fecha sea válida
  const birthDate = new Date(`${birthYear}-${monthPart}-${dayPart}`);
  if (isNaN(birthDate.getTime())) {
    return false;
  }
  
  // Verificar que la persona sea mayor de edad
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 18;
  }
  return age >= 18;
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
