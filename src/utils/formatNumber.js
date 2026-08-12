const ARABIC_NUMERALS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export const toArabicNumerals = (number) => {
  return number.toString().replace(/\d/g, (digit) => ARABIC_NUMERALS[digit]);
};

export const formatPrice = (price, lang = 'en') => {
  if (price === null || price === undefined || isNaN(price)) return '—';
  
  const num = Number(price);
  const formatted = num.toFixed(2);
  
  // Remove trailing .00
  const withoutTrailingZeros = formatted.endsWith('.00') 
    ? formatted.slice(0, -3) 
    : formatted;
  
  // Convert to Arabic numerals if language is Arabic
  if (lang === 'ar') {
    return toArabicNumerals(withoutTrailingZeros);
  }
  
  return withoutTrailingZeros;
};
