// Códigos de estados mexicanos para validación de CURP
const MEXICAN_STATE_CODES = {
  'AS': 'AGUASCALIENTES',
  'BC': 'BAJA CALIFORNIA',
  'BS': 'BAJA CALIFORNIA SUR',
  'CC': 'CAMPECHE',
  'CL': 'COAHUILA',
  'CM': 'COLIMA',
  'CS': 'CHIAPAS',
  'CH': 'CHIHUAHUA',
  'DF': 'DISTRITO FEDERAL',
  'DG': 'DURANGO',
  'GT': 'GUANAJUATO',
  'GR': 'GUERRERO',
  'HG': 'HIDALGO',
  'JC': 'JALISCO',
  'MC': 'MÉXICO',
  'MN': 'MICHOACÁN',
  'MS': 'MORELOS',
  'NT': 'NAYARIT',
  'NL': 'NUEVO LEÓN',
  'OC': 'OAXACA',
  'PL': 'PUEBLA',
  'QT': 'QUERÉTARO',
  'QR': 'QUINTANA ROO',
  'SP': 'SAN LUIS POTOSÍ',
  'SL': 'SINALOA',
  'SR': 'SONORA',
  'TC': 'TABASCO',
  'TS': 'TAMAULIPAS',
  'TL': 'TLAXCALA',
  'VZ': 'VERACRUZ',
  'YN': 'YUCATÁN',
  'ZS': 'ZACATECAS',
  'NE': 'NACIDO EN EL EXTRANJERO'
};

// Algoritmo para calcular el dígito verificador de CURP
function calculateCURPCheckDigit(curp: string): string {
  const first17 = curp.substring(0, 17);
  const dictionary = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
  let sum = 0;
  
  for (let i = 0; i < 17; i++) {
    const charValue = dictionary.indexOf(first17[i]);
    if (charValue === -1) return ''; // Carácter inválido
    sum += charValue * (18 - i);
  }
  
  const remainder = sum % 10;
  return remainder === 0 ? '0' : (10 - remainder).toString();
}

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

// Función para limpiar y formatear texto
export function cleanAndFormatText(text: string): string {
  if (!text) return text;
  
  return text
    .trim() // Eliminar espacios al inicio y final
    .replace(/\s+/g, ' '); // Reemplazar múltiples espacios con uno solo
}

// Validación para campos de texto que no deben ser solo espacios
export function validateTextNotOnlySpaces(text: string): { isValid: boolean; error?: string } {
  if (!text) return { isValid: false, error: "Este campo es requerido" };
  
  // Verificar que no sea solo espacios
  if (text.trim().length === 0) {
    return { isValid: false, error: "No puede contener solo espacios" };
  }
  
  return { isValid: true };
}

// Validación específica para nombres y apellidos
export function validateNameWithDetails(name: string): { isValid: boolean; error?: string } {
  if (!name) return { isValid: false, error: "Este campo es requerido" };
  
  // Verificar que no sea solo espacios
  if (name.trim().length === 0) {
    return { isValid: false, error: "No puede contener solo espacios" };
  }
  
  // Verificar longitud mínima después de limpiar
  const cleanName = cleanAndFormatText(name);
  if (cleanName.length < 2) {
    return { isValid: false, error: "Debe tener al menos 2 caracteres" };
  }
  
  // Solo permite letras y espacios
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(cleanName)) {
    return { isValid: false, error: "Solo se permiten letras y espacios" };
  }
  
  return { isValid: true };
}

// Validación específica para apellido materno (opcional pero debe validarse si se ingresa)
export function validateSecondLastNameWithDetails(name: string): { isValid: boolean; error?: string } {
  console.log('validateSecondLastNameWithDetails called with:', JSON.stringify(name));
  
  // Si está vacío, es válido (campo opcional)
  if (!name) {
    console.log('Empty value, returning valid');
    return { isValid: true };
  }
  
  // Verificar que no sea solo espacios - aquí debe ser requerido si se intenta llenar
  if (name.length > 0 && name.trim().length === 0) {
    console.log('Only spaces detected, returning error');
    return { isValid: false, error: "Este campo es requerido" };
  }
  
  // Verificar longitud mínima después de limpiar
  const cleanName = cleanAndFormatText(name);
  if (cleanName.length < 2) {
    return { isValid: false, error: "Debe tener al menos 2 caracteres" };
  }
  
  // Solo permite letras y espacios
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(cleanName)) {
    return { isValid: false, error: "Solo se permiten letras y espacios" };
  }
  
  return { isValid: true };
}

// Dominios de email bloqueados específicamente
const blockedEmailDomains = [
  'walmart.com'
];

// Dominios de email válidos
const validEmailDomains = [
  // Proveedores públicos internacionales
  'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'yahoo.es', 'yahoo.com.mx',
  'live.com', 'msn.com', 'aol.com', 'icloud.com', 'me.com', 'mac.com',
  'protonmail.com', 'tutanota.com', 'zoho.com', 'mail.com', 'gmx.com',
  
  // Proveedores mexicanos
  'terra.com.mx', 'prodigy.net.mx', 'latinmail.com', 'mexicomail.com',
  
  // Universidades públicas mexicanas principales
  'unam.mx', 'comunidad.unam.mx', 'ipn.mx', 'uanl.mx', 'udg.mx', 'buap.mx', 'uv.mx', 'uabc.mx',
  'uas.edu.mx', 'uach.mx', 'uaem.mx', 'uat.edu.mx', 'uabjo.mx', 'unicach.mx',
  'ujed.mx', 'uadec.edu.mx', 'uaslp.mx', 'ugto.mx', 'umich.mx', 'unison.mx',
  'uson.mx', 'uacj.mx', 'uacam.mx', 'uqroo.mx', 'unach.mx', 'uaz.edu.mx',
  'uaeh.edu.mx', 'uaemex.mx', 'utleon.edu.mx', 'itesm.mx',
  'tec.mx', 'tecnm.mx', 'itm.edu.mx', 'itsm.edu.mx',
  
  // Universidades estatales por estado
  'cecyteg.edu.mx', 'uaaan.mx', 'uabcs.mx', 'uacoah.mx',
  'uagro.mx', 'uahgo.edu.mx', 'uady.mx', 'uaemor.mx',
  'uan.edu.mx', 'uabc.edu.mx', 'uach.edu.mx',
  
  // Tecnológicos públicos
  'itcelaya.edu.mx', 'itmorelia.edu.mx', 'ittoluca.edu.mx',
  'itchihuahua.edu.mx', 'ittepic.edu.mx', 'itpuebla.edu.mx', 'itsur.edu.mx',
  'itver.edu.mx', 'itmexicali.edu.mx', 'itlp.edu.mx', 'itcd.edu.mx',
  
  // Centros de investigación públicos
  'cinvestav.mx', 'conacyt.mx', 'cide.edu', 'colmex.mx', 'ecosur.mx',
  'ciesas.edu.mx', 'colsan.edu.mx', 'cimat.mx', 'inecol.mx'
];

// Validación robusta para email con reglas específicas y validación de dominio
export function validateEmailWithDetails(email: string): { isValid: boolean; error?: string } {
  if (!email) return { isValid: false, error: "Este campo es requerido" };
  
  // Verificar que no sea solo espacios
  if (email.trim().length === 0) {
    return { isValid: false, error: "No puede contener solo espacios" };
  }
  
  const cleanEmail = email.trim().toLowerCase();
  
  // Verificar que contenga exactamente un @
  const atCount = (cleanEmail.match(/@/g) || []).length;
  if (atCount !== 1) {
    return { isValid: false, error: "Debe contener exactamente un @" };
  }
  
  const [localPart, domainPart] = cleanEmail.split('@');
  
  // Validar parte local (antes del @)
  if (!localPart || localPart.length === 0) {
    return { isValid: false, error: "Falta la parte antes del @" };
  }
  
  // Verificar caracteres permitidos en parte local: a-z, 0-9, -, _, .
  if (!/^[a-z0-9._-]+$/.test(localPart)) {
    return { isValid: false, error: "Solo se permiten letras, números, puntos, guiones y guiones bajos antes del @" };
  }
  
  // El punto no puede estar al inicio o al final de la parte local
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return { isValid: false, error: "El punto no puede estar al inicio o al final antes del @" };
  }
  
  // No puede haber dos puntos seguidos
  if (localPart.includes('..')) {
    return { isValid: false, error: "No puede haber dos puntos seguidos" };
  }
  
  // Validar parte del dominio (después del @)
  if (!domainPart || domainPart.length === 0) {
    return { isValid: false, error: "Falta la parte después del @" };
  }
  
  // Verificar caracteres permitidos en dominio: a-z, 0-9, -, .
  if (!/^[a-z0-9.-]+$/.test(domainPart)) {
    return { isValid: false, error: "Solo se permiten letras, números, puntos y guiones en el dominio" };
  }
  
  // Debe contener al menos un punto en el dominio
  if (!domainPart.includes('.')) {
    return { isValid: false, error: "El dominio debe contener al menos un punto (ej: gmail.com)" };
  }
  
  // El dominio no puede empezar o terminar con punto
  if (domainPart.startsWith('.') || domainPart.endsWith('.')) {
    return { isValid: false, error: "El dominio no puede empezar o terminar con punto" };
  }
  
  // No puede haber dos puntos seguidos en el dominio
  if (domainPart.includes('..')) {
    return { isValid: false, error: "No puede haber dos puntos seguidos en el dominio" };
  }
  
  // Validar cada subdominio (no puede empezar o terminar con guion)
  const subdomains = domainPart.split('.');
  for (const subdomain of subdomains) {
    if (subdomain.length === 0) {
      return { isValid: false, error: "Cada parte del dominio debe tener al menos un caracter" };
    }
    
    if (subdomain.startsWith('-') || subdomain.endsWith('-')) {
      return { isValid: false, error: "Cada parte del dominio no puede empezar o terminar con guion" };
    }
  }
  
  // Verificar que la última parte del dominio (TLD) tenga al menos 2 caracteres
  const tld = subdomains[subdomains.length - 1];
  if (tld.length < 2) {
    return { isValid: false, error: "La extensión del dominio debe tener al menos 2 caracteres" };
  }
  
  // Verificar si el dominio está específicamente bloqueado
  if (blockedEmailDomains.includes(domainPart)) {
    return { isValid: false, error: "Este dominio de email no está permitido" };
  }
  
  // Verificar si el dominio está en la lista de dominios válidos
  if (!validEmailDomains.includes(domainPart)) {
    return { isValid: false, error: "Dominio de email no válido. Use un proveedor público o universidad reconocida" };
  }
  
  return { isValid: true };
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
  
  // Verificar que no sea solo espacios
  if (text.trim().length === 0) {
    return { isValid: false, error: "No puede contener solo espacios" };
  }
  
  const cleanText = cleanAndFormatText(text);
  
  // No debe contener únicamente números
  if (/^\d+$/.test(cleanText)) {
    return { isValid: false, error: "No puede contener únicamente números" };
  }
  
  // Debe tener al menos 3 letras
  const letterCount = (cleanText.match(/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g) || []).length;
  if (letterCount < 3) {
    return { isValid: false, error: "Debe contener al menos 3 letras" };
  }
  
  // Solo permite letras, números y espacios (sin caracteres especiales)
  if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(cleanText)) {
    return { isValid: false, error: "Solo se permiten letras, números y espacios" };
  }
  
  // Verificar longitud mínima
  if (cleanText.length < 3) {
    return { isValid: false, error: "El texto es demasiado corto" };
  }
  
  return { isValid: true };
}

// Validación detallada para empleador y puesto
export function validateEmployerPositionWithDetails(text: string): { isValid: boolean; error?: string } {
  if (!text) return { isValid: false, error: "Este campo es requerido" };
  
  // Verificar que no sea solo espacios
  if (text.trim().length === 0) {
    return { isValid: false, error: "No puede contener solo espacios" };
  }
  
  const cleanText = cleanAndFormatText(text);
  
  // No debe contener únicamente números
  if (/^\d+$/.test(cleanText)) {
    return { isValid: false, error: "No puede contener únicamente números" };
  }
  
  // Debe tener al menos 3 letras
  const letterCount = (cleanText.match(/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g) || []).length;
  if (letterCount < 3) {
    return { isValid: false, error: "Debe contener al menos 3 letras" };
  }
  
  // Solo permite letras, números y espacios (sin caracteres especiales)
  if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(cleanText)) {
    return { isValid: false, error: "Solo se permiten letras, números y espacios" };
  }
  
  // Verificar longitud mínima
  if (cleanText.length < 3) {
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
  
  // Validar estado de nacimiento (posiciones 11-12)
  const stateCode = curp.substring(11, 13);
  if (!MEXICAN_STATE_CODES[stateCode as keyof typeof MEXICAN_STATE_CODES]) {
    return false;
  }
  
  // Validar dígito verificador
  const expectedCheckDigit = calculateCURPCheckDigit(curp);
  const actualCheckDigit = curp.substring(17, 18);
  if (expectedCheckDigit !== actualCheckDigit) {
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

// CURP validation with birth date and nationality cross-check
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
  

  
  // Compare dates
  return (
    fullCurpYear === birthYear &&
    parseInt(curpMonth) === birthMonth &&
    parseInt(curpDay) === birthDay
  );
}

// CURP validation with nationality cross-check
export function validateCURPWithNationality(curp: string, nationality: string): boolean {
  // First check basic CURP format
  if (!validateCURP(curp)) return false;
  
  // If no nationality provided, we can't cross-validate
  if (!nationality) return true;
  
  // Extract state code from CURP (positions 11-12)
  const stateCode = curp.substring(11, 13);
  
  // Check nationality consistency
  if (nationality === 'México') {
    // For Mexican nationality, state code should NOT be NE (Nacido en el Extranjero)
    return stateCode !== 'NE';
  } else {
    // For foreign nationality, state code SHOULD be NE (Nacido en el Extranjero)
    return stateCode === 'NE';
  }
}

// Complete CURP validation with birth date and nationality
export function validateCURPComplete(curp: string, birthDate: string, nationality: string): boolean {
  return validateCURPWithBirthDate(curp, birthDate) && validateCURPWithNationality(curp, nationality);
}

// CURP validation with detailed error messages
export function validateCURPWithDetails(curp: string, birthDate?: string, nationality?: string): { isValid: boolean; error?: string } {
  if (!curp) {
    return { isValid: false, error: "El CURP es requerido" };
  }
  
  if (curp.length !== 18) {
    return { isValid: false, error: "El CURP debe tener exactamente 18 caracteres" };
  }
  
  // Basic CURP format validation
  const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]\d$/;
  if (!curpRegex.test(curp)) {
    return { isValid: false, error: "Formato de CURP inválido. Debe seguir el patrón: 4 letras + 6 dígitos + H/M + 5 caracteres + 1 dígito" };
  }
  
  // Validate state code
  const stateCode = curp.substring(11, 13);
  if (!MEXICAN_STATE_CODES[stateCode as keyof typeof MEXICAN_STATE_CODES]) {
    return { isValid: false, error: `Código de estado '${stateCode}' no válido en el CURP` };
  }
  
  // Validate check digit
  const expectedCheckDigit = calculateCURPCheckDigit(curp);
  const actualCheckDigit = curp.substring(17, 18);
  if (expectedCheckDigit !== actualCheckDigit) {
    return { isValid: false, error: "El dígito verificador del CURP es incorrecto" };
  }
  
  // Validate nationality consistency if provided
  if (nationality) {
    if (nationality === 'México' && stateCode === 'NE') {
      return { isValid: false, error: "Para nacionalidad mexicana, el CURP no debe tener código NE (extranjero)" };
    }
    if (nationality !== 'México' && stateCode !== 'NE') {
      return { isValid: false, error: "Para nacionalidad extranjera, el CURP debe tener código NE" };
    }
  }
  
  // Validate birth date consistency if provided
  if (birthDate && !validateCURPWithBirthDate(curp, birthDate)) {
    return { isValid: false, error: "La fecha en el CURP no coincide con la fecha de nacimiento ingresada" };
  }
  
  // Validate age
  const yearPart = curp.substring(4, 6);
  const monthPart = curp.substring(6, 8);
  const dayPart = curp.substring(8, 10);
  
  const century = parseInt(yearPart) >= 30 ? "19" : "20";
  const birthYear = century + yearPart;
  const curpBirthDate = new Date(`${birthYear}-${monthPart}-${dayPart}`);
  
  if (isNaN(curpBirthDate.getTime())) {
    return { isValid: false, error: "La fecha de nacimiento en el CURP no es válida" };
  }
  
  const today = new Date();
  const age = today.getFullYear() - curpBirthDate.getFullYear();
  const monthDiff = today.getMonth() - curpBirthDate.getMonth();
  const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < curpBirthDate.getDate()) ? age - 1 : age;
  
  if (actualAge < 18) {
    return { isValid: false, error: "El candidato debe ser mayor de edad (18 años)" };
  }
  
  return { isValid: true };
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
    return { isValid: false, error: "La edad debe estar entre 18 y 79 años" };
  }
  
  return { isValid: true };
}

// Validate work experience start date
export function validateWorkStartDate(startDateStr: string, birthDateStr?: string): { isValid: boolean; error?: string } {
  if (!startDateStr) {
    return { isValid: false, error: "La fecha de inicio es requerida" };
  }
  
  // Basic date validation
  const basicValidation = validateDateWithDetails(startDateStr);
  if (!basicValidation.isValid) return basicValidation;
  
  // If birth date provided, validate against it
  if (birthDateStr) {
    const [startDay, startMonth, startYear] = startDateStr.split('/').map(Number);
    const [birthDay, birthMonth, birthYear] = birthDateStr.split('/').map(Number);
    
    const startDate = new Date(startYear, startMonth - 1, startDay);
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    
    // Work start date must be after birth date
    if (startDate <= birthDate) {
      return { isValid: false, error: "La fecha de inicio debe ser posterior a la fecha de nacimiento" };
    }
    
    // Calculate age at start of work
    const ageAtWork = startYear - birthYear;
    const monthDiff = startMonth - birthMonth;
    const actualAgeAtWork = monthDiff < 0 || (monthDiff === 0 && startDay < birthDay) ? ageAtWork - 1 : ageAtWork;
    
    // Must be at least 16 years old to work
    if (actualAgeAtWork < 16) {
      return { isValid: false, error: "La edad mínima para trabajar es 16 años" };
    }
  }
  
  return { isValid: true };
}

// Validate work experience end date
export function validateWorkEndDate(endDateStr: string, startDateStr?: string, birthDateStr?: string): { isValid: boolean; error?: string } {
  if (!endDateStr) {
    return { isValid: false, error: "La fecha de fin es requerida" };
  }
  
  // Basic date validation
  const basicValidation = validateDateWithDetails(endDateStr);
  if (!basicValidation.isValid) return basicValidation;
  
  // If start date provided, validate against it
  if (startDateStr) {
    const [endDay, endMonth, endYear] = endDateStr.split('/').map(Number);
    const [startDay, startMonth, startYear] = startDateStr.split('/').map(Number);
    
    const endDate = new Date(endYear, endMonth - 1, endDay);
    const startDate = new Date(startYear, startMonth - 1, startDay);
    
    // End date must be after start date
    if (endDate <= startDate) {
      return { isValid: false, error: "La fecha de fin debe ser posterior a la fecha de inicio" };
    }
  }
  
  // If birth date provided, validate against it
  if (birthDateStr) {
    const [endDay, endMonth, endYear] = endDateStr.split('/').map(Number);
    const [birthDay, birthMonth, birthYear] = birthDateStr.split('/').map(Number);
    
    const endDate = new Date(endYear, endMonth - 1, endDay);
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    
    // End date must be after birth date
    if (endDate <= birthDate) {
      return { isValid: false, error: "La fecha de fin debe ser posterior a la fecha de nacimiento" };
    }
  }
  
  return { isValid: true };
}
