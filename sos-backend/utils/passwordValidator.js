/**
 * Valide la force d'un mot de passe
 * @param {string} password - Le mot de passe à valider
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
const validatePasswordStrength = (password) => {
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
    errors.push("Au moins un caractère spécial");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = { validatePasswordStrength };
