import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Formatação de CNPJ
export const formatCnpj = (cnpj) => {
  if (!cnpj) return '';
  
  // Remove caracteres não numéricos
  const numbers = cnpj.replace(/\D/g, '');
  
  // Verifica se tem o tamanho correto
  if (numbers.length !== 14) return cnpj;
  
  // Aplica a máscara
  return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};

// Formatação de valor monetário
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Formatação de porcentagem
export const formatPercentage = (value) => {
  if (value === null || value === undefined) return '0%';
  
  return `${Number(value).toFixed(2).replace('.', ',')}%`;
};

// Formatação de número com separador de milhares
export const formatNumber = (value) => {
  if (value === null || value === undefined) return '0';
  
  return new Intl.NumberFormat('pt-BR').format(value);
};

// Formatação de telefone
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Remove caracteres não numéricos
  const numbers = phone.replace(/\D/g, '');
  
  // Verifica tamanho para aplicar máscara correta
  if (numbers.length === 11) {
    // Celular com DDD
    return numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (numbers.length === 10) {
    // Telefone fixo com DDD
    return numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  } else if (numbers.length === 9) {
    // Celular sem DDD
    return numbers.replace(/^(\d{5})(\d{4})$/, '$1-$2');
  } else if (numbers.length === 8) {
    // Telefone fixo sem DDD
    return numbers.replace(/^(\d{4})(\d{4})$/, '$1-$2');
  }
  
  // Se não se encaixar em nenhum padrão, retorna como está
  return phone;
};

// Formatação de texto para exibição limitada com reticências
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return `${text.slice(0, maxLength)}...`;
};

// Format date with time
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
};