/**
 * 
 * @param {File} file 
 * @returns {Promise<string>} 
 */
export const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 *
 * @param {File} file 
 * @returns {{valid: boolean, error?: string}} 
 */
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Faqat rasm fayllari (JPEG, PNG, GIF, WEBP) qabul qilinadi.'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Rasm hajmi 5MB dan oshmasligi kerak.'
    };
  }

  return { valid: true };
};
