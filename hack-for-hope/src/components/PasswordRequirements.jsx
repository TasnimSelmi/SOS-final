import React from "react";
import { validatePasswordStrength } from "../utils/passwordValidator";
import "../utils/passwordValidator.css";

/**
 * Composant React pour afficher les exigences du mot de passe
 */
export const PasswordRequirements = ({ password }) => {
  const validation = validatePasswordStrength(password || "");

  const requirements = [
    { text: "Au moins 8 caractères", met: password && password.length >= 8 },
    { text: "Une majuscule (A-Z)", met: password && /[A-Z]/.test(password) },
    { text: "Une minuscule (a-z)", met: password && /[a-z]/.test(password) },
    { text: "Un chiffre (0-9)", met: password && /[0-9]/.test(password) },
    {
      text: "Un caractère spécial (!@#$...)",
      met: password && /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`~;]/.test(password),
    },
  ];

  return (
    <div className="password-requirements">
      <p className="requirements-title">Exigences du mot de passe :</p>
      <ul className="requirements-list">
        {requirements.map((req, index) => (
          <li
            key={index}
            className={`requirement-item ${req.met ? "met" : "unmet"}`}
          >
            <span className="requirement-icon">{req.met ? "✓" : "○"}</span>
            <span className="requirement-text">{req.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordRequirements;
