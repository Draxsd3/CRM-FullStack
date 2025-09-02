// Validation of CNPJ with tweakable parameters
export const validateCnpj = (cnpj) => {
  /* @tweakable minimum length of a valid CNPJ */
  const MIN_CNPJ_LENGTH = 14;

  /* @tweakable whether to allow formatting characters */
  const ALLOW_FORMATTING_CHARS = true;

  /* @tweakable validation strictness (0-2, with 2 being most strict) */
  const VALIDATION_STRICTNESS = 2;

  /* @tweakable list of invalid known CNPJ patterns to reject */
  const INVALID_CNPJ_PATTERNS = [
    '00000000000000', 
    '11111111111111', 
    '22222222222222', 
    '33333333333333', 
    '44444444444444', 
    '55555555555555', 
    '66666666666666', 
    '77777777777777', 
    '88888888888888', 
    '99999999999999'
  ];

  // Remove non-numeric characters if allowed
  const numbers = ALLOW_FORMATTING_CHARS 
    ? cnpj.replace(/\D/g, '') 
    : cnpj;
  
  // Strict length check
  if (numbers.length !== MIN_CNPJ_LENGTH) {
    return false;
  }
  
  // Check against known invalid patterns
  if (INVALID_CNPJ_PATTERNS.includes(numbers)) {
    return false;
  }

  // Digit calculation function
  const calculateDigit = (baseNumber, weights) => {
    const sum = baseNumber
      .split('')
      .map((digit, index) => parseInt(digit) * weights[index])
      .reduce((acc, curr) => acc + curr, 0);
    
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  // Weights for check digits
  const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  // First check digit calculation
  const baseFirstDigit = numbers.slice(0, 12);
  const firstCheckDigit = calculateDigit(baseFirstDigit, firstWeights);
  
  // Validate first check digit
  if (parseInt(numbers[12]) !== firstCheckDigit) {
    return false;
  }

  // Second check digit calculation
  const baseSecondDigit = numbers.slice(0, 13);
  const secondCheckDigit = calculateDigit(baseSecondDigit, secondWeights);
  
  // Validate second check digit
  return parseInt(numbers[13]) === secondCheckDigit;
};

// Validação de email
export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// Validação de telefone
export const validatePhone = (phone) => {
  // Remove caracteres não numéricos
  const numbers = phone.replace(/\D/g, '');
  
  // Verifica se tem entre 10 e 11 dígitos (com DDD)
  return numbers.length >= 10 && numbers.length <= 11;
};

// Validação de data
export const validateDate = (dateStr) => {
  // Verifica formato dd/mm/yyyy
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return false;
  
  const [day, month, year] = dateStr.split('/').map(Number);
  
  // Verifica se é uma data válida
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

// Valida se uma string é vazia ou contém apenas espaços
export const isEmptyString = (str) => {
  return !str || /^\s*$/.test(str);
};

// Valida se um objeto é vazio
export const isEmptyObject = (obj) => {
  return obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype;
};