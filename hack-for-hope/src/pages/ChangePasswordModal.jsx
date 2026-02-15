import React, { useState } from "react";
import { validatePasswordStrength } from "../utils/passwordValidator";
import PasswordRequirements from "../components/PasswordRequirements";
import { SOSIcons } from "../components/SOSIcons";
import "../utils/passwordValidator.css";
import "./ChangePasswordModal.css";

function ChangePasswordModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation de la force du mot de passe
    const passwordValidation = validatePasswordStrength(formData.newPassword);
    if (!passwordValidation.isValid) {
      setError(
        "Mot de passe trop faible. " + passwordValidation.errors.join(", "),
      );
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError("Le nouveau mot de passe doit être différent de l'ancien");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      onClose();
    } catch (err) {
      setError(err.message || "Erreur lors du changement de mot de passe");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Changer le mot de passe</h2>
          <button className="modal-close" onClick={handleClose}>
            <SOSIcons.XCircle size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Mot de passe actuel *</label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
              required
              placeholder="Votre mot de passe actuel"
            />
          </div>

          <div className="form-group">
            <label>Nouveau mot de passe *</label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              required
              placeholder="Nouveau mot de passe"
            />
            <PasswordRequirements password={formData.newPassword} />
          </div>

          <div className="form-group">
            <label>Confirmer le nouveau mot de passe *</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
              placeholder="Confirmer le nouveau mot de passe"
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Modification..." : "Modifier le mot de passe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
