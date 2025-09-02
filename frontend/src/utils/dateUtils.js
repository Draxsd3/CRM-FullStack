import { format, parse, addDays, addMonths } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export const formatDate = (dateString, formatStr = 'dd/MM/yyyy') => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return format(date, formatStr, { locale: ptBR });
};

export const formatDateTime = (dateString, formatStr = 'dd/MM/yyyy HH:mm') => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return format(date, formatStr, { locale: ptBR });
};

export const parseDate = (dateStr, formatStr = 'dd/MM/yyyy') => {
  if (!dateStr) return null;
  
  return parse(dateStr, formatStr, new Date(), { locale: ptBR });
};

export const addDaysToDate = (dateString, days) => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  return addDays(date, days);
};

export const addMonthsToDate = (dateString, months) => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  return addMonths(date, months);
};

export const getFirstDayOfMonth = (dateString = new Date()) => {
  const date = new Date(dateString);
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getLastDayOfMonth = (dateString = new Date()) => {
  const date = new Date(dateString);
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

export const getCurrentDate = (formatStr = 'yyyy-MM-dd') => {
  return format(new Date(), formatStr, { locale: ptBR });
};

