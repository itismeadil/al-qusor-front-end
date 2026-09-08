/**
 * Translates text from Arabic to English using MyMemory Translation API
 * This is a free API that doesn't require authentication
 * @param {string} text - The Arabic text to translate
 * @returns {Promise<string>} - The translated English text
 */
export const translateArToEn = async (text) => {
  if (!text || !text.trim()) {
    return '';
  }

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ar|en`
    );
    
    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }
    
    // If translation fails, return original text
    console.error('Translation failed:', data);
    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

/**
 * Translates multiple fields from Arabic to English
 * @param {Object} fields - Object with Arabic text fields
 * @param {Array<string>} fieldNames - Array of field names to translate
 * @returns {Promise<Object>} - Object with translated fields
 */
export const translateFields = async (fields, fieldNames) => {
  const translated = { ...fields };
  
  for (const fieldName of fieldNames) {
    if (fields[fieldName]) {
      translated[`${fieldName}En`] = await translateArToEn(fields[fieldName]);
    }
  }
  
  return translated;
};
