import React, { useState, useEffect } from "react";
import { reportsAPI, usersAPI } from "../services/api";
import { SOSIcons } from "./SOSIcons";
import { SOSCard, SOSDataCard, SOSStatCard } from "./SOSCard";
import { SOSProgressRing } from "./SOSChart";
import "./Level1Dashboard.css";

function Level1Dashboard() {
  const [activeTab, setActiveTab] = useState("nouveau");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "mes-signalements") {
      fetchReports();
    }
  }, [activeTab]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportsAPI.getAll();
      console.log("Fetched reports:", response.data);
      console.log("Fetched reports 2.0:", response.data.reports);
      setReports(response.data.data.reports || []);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="level1-dashboard">
      <div className="dashboard-header">
        <SOSIcons.Village size={48} color="#00abec" />
        <div>
          <h1>Espace Déclarant</h1>
          <p>Niveau 1 - Mères SOS, Tantes SOS, Éducateurs</p>
        </div>
      </div>

      <div className="nav-tabs">
        <button
          className={`nav-btn ${activeTab === "nouveau" ? "active" : ""}`}
          onClick={() => setActiveTab("nouveau")}
        >
          <SOSIcons.Document size={20} />
          Nouveau Signalement
        </button>
        <button
          className={`nav-btn ${activeTab === "mes-signalements" ? "active" : ""}`}
          onClick={() => setActiveTab("mes-signalements")}
        >
          <SOSIcons.Notification size={20} />
          Mes Signalements
        </button>
      </div>

      {activeTab === "nouveau" && (
        <NewReportForm onSuccess={() => setActiveTab("mes-signalements")} />
      )}
      {activeTab === "mes-signalements" && (
        <MyReportsTable reports={reports} loading={loading} />
      )}
    </div>
  );
}

function NewReportForm({ onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [psychologues, setPsychologues] = useState([]);
  const [loadingPsychos, setLoadingPsychos] = useState(false);
  const [attachments, setAttachments] = useState([]);

  // Fetch psychologues when village changes
  useEffect(() => {
    if (selectedVillage) {
      fetchPsychologues(selectedVillage);
    } else {
      setPsychologues([]);
    }
  }, [selectedVillage]);

  const fetchPsychologues = async (village) => {
    try {
      setLoadingPsychos(true);
      console.log("Fetching psychologues for village:", village);
      const response = await usersAPI.getPsychologuesByVillage(village);
      console.log("Psychologues response:", response.data);
      setPsychologues(response.data?.psychologues || []);
    } catch (error) {
      console.error("Erreur chargement psychologues:", error);
    } finally {
      setLoadingPsychos(false);
    }
  };

  const handleVillageChange = (e) => {
    setSelectedVillage(e.target.value);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Maximum 5 fichiers autorisés");
      return;
    }
    setAttachments(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const formData = new FormData(e.target);

      // Map urgency level: form uses "urgent"/"bas" but backend expects "critique"/"faible"
      let urgency = formData.get("urgence");
      if (urgency === "urgent") urgency = "critique";
      if (urgency === "bas") urgency = "faible";

      // Map incident type
      let type = formData.get("type");
      if (type === "conflit") type = "violence";
      if (type === "maltraitance") type = "abus";

      // Map form fields to backend expected fields
      const data = {
        childName: formData.get("enfant"),
        childGender: "other",
        village: formData.get("village"),
        incidentType: type,
        incidentDate: new Date().toISOString().split("T")[0],
        urgencyLevel: urgency,
        description: formData.get("description"),
        abuserName: formData.get("abuseur") || "",
        isAnonymous: formData.get("anonyme") === "oui" ? "true" : "false",
      };

      // Only add attachments if they exist
      if (attachments && attachments.length > 0) {
        data.attachments = attachments;
      }

      console.log("Submitting report:", JSON.stringify(data, null, 2));

      const response = await reportsAPI.create(data);
      console.log("Report created successfully:", response.data);

      alert("Signalement soumis avec succès !");
      e.target.reset();
      setSelectedVillage("");
      setPsychologues([]);
      setAttachments([]);
      onSuccess();
    } catch (err) {
      console.error("Full error object:", err);
      console.error("Error response:", err.response);
      console.error("Error data:", err.response?.data);
      console.error("Error status:", err.response?.status);

      // Display detailed validation errors
      if (
        err.response?.data?.errors &&
        Array.isArray(err.response.data.errors)
      ) {
        const errorMessages = err.response.data.errors
          .map((e) => `${e.param}: ${e.msg}`)
          .join("\n");
        setError(`Données invalides:\n${errorMessages}`);
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Erreur lors de la création du signalement",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getPsychologueDisplay = () => {
    if (!selectedVillage) return null;
    if (loadingPsychos)
      return <span className="psychologue-loading">Chargement...</span>;
    if (psychologues.length === 0)
      return (
        <span className="psychologue-none">
          Aucun psychologue assigné à ce village
        </span>
      );

    const psycho = psychologues[0];
    return (
      <div className="psychologue-info">
        <SOSIcons.User size={16} />
        <span>
          Assigné à: <strong>{psycho.fullName}</strong>
        </span>
        {psychologues.length > 1 && (
          <small>
            {" "}
            (+{psychologues.length - 1} autre
            {psychologues.length > 2 ? "s" : ""})
          </small>
        )}
      </div>
    );
  };

  return (
    <SOSCard
      title="Nouveau Signalement"
      subtitle="Les champs marqués d'un astérisque (*) sont obligatoires"
      variant="info"
    >
      {error && (
        <div
          className="error-message"
          style={{
            whiteSpace: "pre-line",
            background: "#fee",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #fcc",
            marginBottom: "1rem",
          }}
        >
          <strong>⚠️ Erreur:</strong>
          <br />
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label required">
              <SOSIcons.Alert size={16} style={{ marginRight: "6px" }} />
              Type d'incident
            </label>
            <select className="form-select" name="type" required>
              <option value="">Sélectionner</option>
              <option value="sante">Santé</option>
              <option value="comportement">Comportement</option>
              <option value="violence">Violence</option>
              <option value="conflit">Conflit</option>
              <option value="maltraitance">Maltraitance</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label required">
              <SOSIcons.Heart size={16} style={{ marginRight: "6px" }} />
              Niveau d'urgence
            </label>
            <select className="form-select" name="urgence" required>
              <option value="">Sélectionner</option>
              <option value="urgent">🔴 Urgent</option>
              <option value="moyen">🟡 Moyen</option>
              <option value="bas">🟢 Bas</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label required">
              <SOSIcons.Village size={16} style={{ marginRight: "6px" }} />
              Village
            </label>
            <select
              className="form-select"
              name="village"
              required
              value={selectedVillage}
              onChange={handleVillageChange}
            >
              <option value="">Sélectionner</option>
              <option value="gammarth">Village Gammarth</option>
              <option value="siliana">Village Siliana</option>
              <option value="mahres">Village Mahrès</option>
              <option value="akouda">Village Akouda</option>
            </select>
            {selectedVillage && (
              <div className="psychologue-badge">
                {loadingPsychos ? (
                  <span className="loading-text">
                    Recherche du psychologue...
                  </span>
                ) : psychologues.length > 0 ? (
                  <div className="psychologue-assigned">
                    <SOSIcons.User size={14} />
                    <span>
                      Assigné à: <strong>{psychologues[0].fullName}</strong>
                    </span>
                    {psychologues.length > 1 && (
                      <small>
                        {" "}
                        (+{psychologues.length - 1} autre
                        {psychologues.length > 2 ? "s" : ""})
                      </small>
                    )}
                  </div>
                ) : (
                  <span className="no-psychologue">
                    ⚠️ Aucun psychologue pour ce village
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">
              <SOSIcons.User size={16} style={{ marginRight: "6px" }} />
              Anonyme
            </label>
            <select className="form-select" name="anonyme">
              <option value="non">Non</option>
              <option value="oui">Oui</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label required">
              <SOSIcons.Family size={16} style={{ marginRight: "6px" }} />
              Nom de l'enfant
            </label>
            <input type="text" className="form-input" name="enfant" required />
          </div>
          <div className="form-group">
            <label className="form-label">
              <SOSIcons.User size={16} style={{ marginRight: "6px" }} />
              Nom de l'abuseur
            </label>
            <input type="text" className="form-input" name="abuseur" />
          </div>
          <div className="form-group full-width">
            <label className="form-label required">
              <SOSIcons.Document size={16} style={{ marginRight: "6px" }} />
              Description
            </label>
            <textarea
              className="form-textarea"
              name="description"
              required
              rows="5"
            ></textarea>
          </div>
          <div className="form-group full-width">
            <label className="form-label">
              <SOSIcons.Upload size={16} style={{ marginRight: "6px" }} />
              Pièces jointes (Photo, Audio, Vidéo)
            </label>
            <input
              type="file"
              className="form-input-file"
              name="attachments"
              multiple
              accept="image/*,audio/*,video/*"
              onChange={handleFileChange}
            />
            <small className="file-help">
              Max 5 fichiers (images, audio, vidéo). Taille max: 15MB par
              fichier
            </small>
            {attachments.length > 0 && (
              <div className="attachments-preview">
                {attachments.map((file, idx) => (
                  <span key={idx} className="attachment-tag">
                    📎 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="btn-group">
          <button
            type="reset"
            className="btn btn-secondary"
            disabled={submitting}
          >
            <SOSIcons.Alert size={18} />
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            <SOSIcons.Upload size={18} />
            {submitting ? "Soumission..." : "Soumettre le signalement"}
          </button>
        </div>
      </form>
    </SOSCard>
  );
}

function MyReportsTable({ reports, loading }) {
  if (loading)
    return (
      <SOSCard title="Chargement..." variant="info">
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <SOSProgressRing value={75} size={60} />
          <p>Chargement de vos signalements...</p>
        </div>
      </SOSCard>
    );

  return (
    <SOSCard
      title="Mes Signalements"
      subtitle="Historique de vos signalements"
      variant="info"
    >
      {reports.length === 0 ? (
        <div className="empty-state">
          <SOSIcons.Document size={64} color="#00abec" />
          <p>Aucun signalement pour le moment</p>
          <p className="empty-hint">
            Utilisez l'onglet "Nouveau Signalement" pour créer votre premier
            signalement
          </p>
        </div>
      ) : (
        <table className="sos-table">
          <thead>
            <tr>
              <th>
                <SOSIcons.Document size={16} /> Référence
              </th>
              <th>
                <SOSIcons.Notification size={16} /> Date
              </th>
              <th>
                <SOSIcons.Alert size={16} /> Type
              </th>
              <th>
                <SOSIcons.Heart size={16} /> Statut
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td>
                  <strong>{r.reportId}</strong>
                </td>
                <td>{new Date(r.createdAt).toLocaleDateString("fr-FR")}</td>
                <td>{r.incidentType}</td>
                <td>
                  <span
                    className={`sos-badge sos-badge-${r.status?.toLowerCase().replace("_", "-") || "en-attente"}`}
                  >
                    {r.statusDisplay || r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </SOSCard>
  );
}

export default Level1Dashboard;
