/**
 * Valide la force d'un mot de passe
 * @param {string} password - Le mot de passe à valider
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validatePasswordStrength = (password) => {
  const errors = [];

  if (!password) {
    return { isValid: false, errors: ["Le mot de passe est requis"] };
  }

  if (password.length < 8) {
    errors.push("Au moins 8 caractères");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Au moins une majuscule");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Au moins une minuscule");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Au moins un chiffre");
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`~;]/.test(password)) {
    errors.push("Au moins un caractère spécial (!@#$%^&*...)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Retourne un indicateur de force du mot de passe
 * @param {string} password
 * @returns {string} - 'weak', 'medium', 'strong'
 */
export const getPasswordStrength = (password) => {
  const validation = validatePasswordStrength(password);
  const errorCount = validation.errors.length;

  if (errorCount === 0) return "strong";
  if (errorCount <= 2) return "medium";
  return "weak";
};
