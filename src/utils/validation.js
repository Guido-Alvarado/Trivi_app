/**
 * Valida que el texto no contenga emojis ni caracteres especiales peligrosos
 * Permite letras, números, espacios y puntuación básica (. , ; : ? ! ¿ ¡ - () "")
 */
export const validateText = (text) => {
  // Regex para detectar emojis y caracteres especiales no permitidos
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}\u{238C}-\u{2454}\u{20D0}-\u{20FF}\u{FE00}-\u{FE0F}]/u;
  
  // Caracteres especiales peligrosos (permite puntuación básica)
  const specialCharsRegex = /[<>{}[\]\\|`~^]/;
  
  if (emojiRegex.test(text)) {
    return { valid: false, error: "No se permiten emojis" };
  }
  
  if (specialCharsRegex.test(text)) {
    return { valid: false, error: "No se permiten caracteres especiales como < > { } [ ] \\ | ` ~ ^" };
  }
  
  return { valid: true };
};

/**
 * Sanitiza el texto removiendo emojis y caracteres especiales
 */
export const sanitizeText = (text) => {
  // Remover emojis
  let sanitized = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}\u{238C}-\u{2454}\u{20D0}-\u{20FF}\u{FE00}-\u{FE0F}]/gu, '');
  
  // Remover caracteres especiales peligrosos
  sanitized = sanitized.replace(/[<>{}[\]\\|`~^]/g, '');
  
  return sanitized;
};
