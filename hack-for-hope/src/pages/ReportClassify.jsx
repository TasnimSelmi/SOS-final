import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { reportsAPI } from "../services/api";
import SOSLogo from "../components/SOSLogo";
import SOSDecorations from "../components/SOSDecorations";
import { SOSIcons } from "../components/SOSIcons";
import "./ReportClassify.css";

function ReportClassify() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [classification, setClassification] = useState("");
  const [notes, setNotes] = useState("");

  const classificationOptions = [
    {
      value: "sauvegarde",
      label: "Sauvegarde",
      description:
        "L'enfant nécessite une protection immédiate et doit être placé en lieu sûr.",
      color: "#8b5cf6",
      icon: "🛡️",
    },
    {
      value: "prise_en_charge",
      label: "Prise en charge",
      description:
        "L'incident nécessite un suivi psychologique et des mesures d'accompagnement.",
      color: "#10b981",
      icon: "🤝",
    },
    {
      value: "faux_signalement",
      label: "Faux signalement",
      description:
        "Après analyse, le signalement ne présente pas de fondement réel.",
      color: "#ef4444",
      icon: "❌",
    },
  ];

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await reportsAPI.getById(id);

      if (response.data?.status === "success") {
        const reportData = response.data.data.report;
        setReport(reportData);

        // Pre-fill if already classified
        if (reportData.classification) {
          setClassification(reportData.classification);
          setNotes(reportData.classificationNotes || "");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classification) {
      setError("Veuillez sélectionner une classification");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await reportsAPI.classify(id, {
        classification,
        notes,
      });

      if (response.data?.status === "success") {
        alert("Signalement classifié avec succès !");
        navigate(`/reports/${id}`);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Erreur lors de la classification",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      faible: "#10b981",
      moyen: "#f59e0b",
      critique: "#ef4444",
    };
    return colors[urgency] || "#6b7280";
  };

  const getUrgencyLabel = (urgency) => {
    const labels = {
      faible: "Faible",
      moyen: "Moyen",
      critique: "Critique",
    };
    return labels[urgency] || urgency;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non spécifié";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="report-classify-container">
        <SOSDecorations />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="report-classify-container">
        <SOSDecorations />
        <div className="error-container">
          <h2>Signalement non trouvé</h2>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/reports")}
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="report-classify-container">
      <SOSDecorations />

      <div className="classify-header">
        <button
          className="btn btn-back"
          onClick={() => navigate(`/reports/${id}`)}
        >
          ← Retour au signalement
        </button>
        <SOSLogo size="small" />
        <h1>Classifier le Signalement</h1>
        <p className="subtitle">
          {report.reportId} - {report.childName}
        </p>
      </div>

      {/* Résumé du signalement */}
      <div className="report-summary">
        <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <SOSIcons.Clipboard size={20} color="#00abec" />
          Résumé du signalement
        </h3>
        <div className="summary-grid">
          <div className="summary-item">
            <label>Enfant</label>
            <span>{report.childName}</span>
          </div>
          <div className="summary-item">
            <label>Type d'incident</label>
            <span>{report.incidentType}</span>
          </div>
          <div className="summary-item">
            <label>Urgence</label>
            <span
              className="urgency-badge"
              style={{ color: getUrgencyColor(report.urgencyLevel) }}
            >
              {getUrgencyLabel(report.urgencyLevel)}
            </span>
          </div>
          <div className="summary-item">
            <label>Date</label>
            <span>{formatDate(report.incidentDate)}</span>
          </div>
        </div>
        <div className="summary-description">
          <label>Description</label>
          <p>{report.description}</p>
        </div>
      </div>

      {/* Formulaire de classification */}
      <form onSubmit={handleSubmit} className="classify-form">
        <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <SOSIcons.Tag size={20} color="#00abec" />
          Classification
        </h3>

        {error && (
          <div className="error-banner">
            <span className="error-icon">
              <SOSIcons.Alert size={20} color="#de5a6c" />
            </span>
            {error}
          </div>
        )}

        <div className="classification-options">
          {classificationOptions.map((option) => (
            <label
              key={option.value}
              className={`classification-card ${classification === option.value ? "selected" : ""}`}
              style={{ "--option-color": option.color }}
            >
              <input
                type="radio"
                name="classification"
                value={option.value}
                checked={classification === option.value}
                onChange={(e) => setClassification(e.target.value)}
              />
              <div className="card-content">
                <span className="card-icon">{option.iconComponent}</span>
                <div className="card-text">
                  <h4>{option.label}</h4>
                  <p>{option.description}</p>
                </div>
                <div className="selection-indicator"></div>
              </div>
            </label>
          ))}
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes de classification (optionnel)</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="4"
            placeholder="Ajoutez des notes explicatives sur votre décision de classification..."
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(`/reports/${id}`)}
            disabled={submitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || !classification}
          >
            {submitting
              ? "Classification en cours..."
              : "Confirmer la classification"}
          </button>
        </div>
      </form>

      {/* Information */}
      <div className="info-box">
        <h4 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <SOSIcons.Info size={18} color="#00abec" />
          Information
        </h4>
        <p>
          La classification déterminera le statut du signalement et les
          prochaines étapes du processus. Cette action est enregistrée dans
          l'historique et ne peut pas être annulée.
        </p>
      </div>
    </div>
  );
}

export default ReportClassify;
