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

// Validación detallada para calles y colonias
export function validateStreetColonyWithDetails(text: string): { isValid: boolean; error?: string } {
  if (!text) return { isValid: false, error: "Este campo es requerido" };
  
  // No debe contener únicamente números
  if (/^\d+$/.test(text.trim())) {
    return { isValid: false, error: "No puede contener únicamente números" };
  }
  
  // Debe tener al menos 3 letras
  const letterCount = (text.match(/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g) || []).length;
  if (letterCount < 3) {
    return { isValid: false, error: "Debe contener al menos 3 letras" };
  }
  
  // Solo permite letras, números, espacios, / y algunos caracteres especiales básicos
  if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\/\.\-\#\']+$/.test(text)) {
    return { isValid: false, error: "Solo se permiten letras, números, espacios y el símbolo /" };
  }
  
  // Verificar longitud mínima
  if (text.trim().length < 3) {
    return { isValid: false, error: "El texto es demasiado corto" };
  }
  
  return { isValid: true };
}

// Validación detallada para empleador y puesto
export function validateEmployerPositionWithDetails(text: string): { isValid: boolean; error?: string } {
  if (!text) return { isValid: false, error: "Este campo es requerido" };
  
  // No debe contener únicamente números
  if (/^\d+$/.test(text.trim())) {
    return { isValid: false, error: "No puede contener únicamente números" };
  }
  
  // Debe tener al menos 3 letras
  const letterCount = (text.match(/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g) || []).length;
  if (letterCount < 3) {
    return { isValid: false, error: "Debe contener al menos 3 letras" };
  }
  
  // Verificar longitud mínima
  if (text.trim().length < 3) {
    return { isValid: false, error: "El texto es demasiado corto" };
  }
  
  return { isValid: true };
}

// Birth date validation for dd/mm/yyyy format
export function validateBirthDate(dateStr: string): boolean {
  if (!dateStr) return false;
  
  // Check format dd/mm/yyyy
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateStr.match(dateRegex);
  
  if (!match) return false;
  
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  
  // Basic range checks
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1940 || year > new Date().getFullYear()) return false;
  
  // Create date object (month is 0-indexed in Date constructor)
  const birthDate = new Date(year, month - 1, day);
  
  // Check if the date is valid (handles leap years, etc.)
  if (birthDate.getDate() !== day || birthDate.getMonth() !== month - 1 || birthDate.getFullYear() !== year) {
    return false;
  }
  
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

// CURP validation with birth date cross-check
export function validateCURPWithBirthDate(curp: string, birthDate: string): boolean {
  // First check basic CURP format
  if (!validateCURP(curp)) return false;
  
  // If no birth date provided, we can't cross-validate
  if (!birthDate) return true;
  
  // Extract date from CURP (positions 4-9: YYMMDD)
  const curpYear = curp.substring(4, 6);
  const curpMonth = curp.substring(6, 8);
  const curpDay = curp.substring(8, 10);
  
  // Convert birth date string (DD/MM/YYYY format) to components
  const dateParts = birthDate.split('/');
  if (dateParts.length !== 3) return false;
  
  const birthDay = parseInt(dateParts[0]);
  const birthMonth = parseInt(dateParts[1]);
  const birthYear = parseInt(dateParts[2]);
  
  // Determine full year from CURP (considering century)
  // If year is 00-29, assume 2000s; if 30-99, assume 1900s
  const fullCurpYear = parseInt(curpYear) <= 29 ? 2000 + parseInt(curpYear) : 1900 + parseInt(curpYear);
  
  // Debug logging
  console.log('CURP Validation Debug:', {
    curp,
    birthDate,
    curpYear,
    curpMonth,
    curpDay,
    fullCurpYear,
    birthYear,
    birthMonth,
    birthDay,
    yearMatch: fullCurpYear === birthYear,
    monthMatch: parseInt(curpMonth) === birthMonth,
    dayMatch: parseInt(curpDay) === birthDay
  });
  
  // Compare dates
  return (
    fullCurpYear === birthYear &&
    parseInt(curpMonth) === birthMonth &&
    parseInt(curpDay) === birthDay
  );
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

// Validate that a date is in the past (not today or future)
export function validatePastDate(dateStr: string): boolean {
  if (!dateStr) return false;
  
  const [day, month, year] = dateStr.split('/').map(Number);
  if (!day || !month || !year) return false;
  
  const date = new Date(year, month - 1, day);
  const today = new Date();
  
  // Set today to start of day for comparison
  today.setHours(0, 0, 0, 0);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return false;
  
  // Check if date is before today (not today or future)
  if (date >= today) return false;
  
  return true;
}

// Detailed date validation with specific error messages
export function validateDateWithDetails(dateStr: string): { isValid: boolean; error?: string } {
  if (!dateStr) return { isValid: false, error: "La fecha es requerida" };
  
  // Check format dd/mm/yyyy
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateStr.match(dateRegex);
  
  if (!match) return { isValid: false, error: "El formato debe ser dd/mm/aaaa" };
  
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  
  // Validate day
  if (day < 1 || day > 31) return { isValid: false, error: "El día ingresado no es válido" };
  
  // Validate month
  if (month < 1 || month > 12) return { isValid: false, error: "El mes ingresado no es válido" };
  
  // Validate year
  if (year < 1945) return { isValid: false, error: "El año debe ser posterior a 1945" };
  if (year > new Date().getFullYear()) return { isValid: false, error: "El año ingresado no es válido" };
  
  // Create date object (month is 0-indexed in Date constructor)
  const date = new Date(year, month - 1, day);
  
  // Check if the date is valid (handles leap years, days in month, etc.)
  if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
    return { isValid: false, error: "La fecha ingresada no es válida" };
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if date is not in the future
  if (date >= today) return { isValid: false, error: "La fecha debe ser anterior al día de hoy" };
  
  return { isValid: true };
}

// Birth date validation with age check
export function validateBirthDateWithDetails(dateStr: string): { isValid: boolean; error?: string } {
  const basicValidation = validateDateWithDetails(dateStr);
  if (!basicValidation.isValid) return basicValidation;
  
  const [day, month, year] = dateStr.split('/').map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  
  // Calculate age
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
  
  // Check if the person is at least 18 years old and less than 80 years old
  if (actualAge < 18 || actualAge >= 80) {
    return { isValid: false, error: "El candidato debe ser mayor de edad y menor a 80 años" };
  }
  
  return { isValid: true };
}
