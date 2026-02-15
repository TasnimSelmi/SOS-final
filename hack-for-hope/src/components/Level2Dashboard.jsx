import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { reportsAPI } from "../services/api";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import { SOSIcons } from "./SOSIcons";
import { SOSCard, SOSStatCard } from "./SOSCard";
import ReportEditor from "./ReportEditor";
import "./Level2Dashboard.css";

function Level2Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    pending: 0,
    urgent: 0,
    monthly: 0,
    villages: 4,
  });
  const { notifications, unreadCount } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, [notifications]);

  const fetchStats = async () => {
    try {
      // Filter by psychologue's village if they have one
      const params = {};
      if (user?.village) {
        params.village = user.village;
      }
      const response = await reportsAPI.getAll(params);
      const reports = response.data?.data?.reports || [];

      setStats({
        pending: reports.filter(
          (r) => r.status === "en_attente" || r.status === "en_cours",
        ).length,
        urgent: reports.filter((r) => r.urgencyLevel === "critique").length,
        monthly: reports.filter((r) => {
          const date = new Date(r.createdAt);
          const now = new Date();
          return (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
          );
        }).length,
        villages: 4,
      });
    } catch (error) {
      console.error("Erreur stats:", error);
    }
  };

  return (
    <div className="level2-dashboard">
      <div className="dashboard-header">
        <SOSIcons.Search size={48} color="#00abec" />
        <div>
          <h1>Espace Analyse & Traitement</h1>
          <p>Niveau 2 - Psychologues, Responsables sociaux</p>
        </div>
        {unreadCount > 0 && (
          <div className="notification-badge">
            <SOSIcons.Notification size={24} />
            <span className="badge-count">{unreadCount}</span>
          </div>
        )}
      </div>

      <div className="nav-tabs">
        <button
          className={`nav-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <SOSIcons.Document size={20} />
          Dashboard
        </button>
        <button
          className={`nav-btn ${activeTab === "a-traiter" ? "active" : ""}`}
          onClick={() => setActiveTab("a-traiter")}
        >
          <SOSIcons.Alert size={20} />À Traiter
          {stats.pending > 0 && (
            <span className="tab-badge">{stats.pending}</span>
          )}
        </button>
        <button
          className={`nav-btn ${activeTab === "workflow" ? "active" : ""}`}
          onClick={() => setActiveTab("workflow")}
        >
          <SOSIcons.Family size={20} />
          Workflow 6 Étapes
        </button>
        <button
          className={`nav-btn ${activeTab === "mes-cas" ? "active" : ""}`}
          onClick={() => setActiveTab("mes-cas")}
        >
          <SOSIcons.Check size={20} />
          Mes Cas Traités
        </button>
      </div>

      {activeTab === "dashboard" && <AnalystDashboard stats={stats} />}
      {activeTab === "a-traiter" && <ReportsToProcess />}
      {activeTab === "workflow" && <WorkflowView />}
      {activeTab === "mes-cas" && <MyProcessedCases />}
    </div>
  );
}

function AnalystDashboard({ stats }) {
  const [villageStats, setVillageStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchVillageStats();
  }, []);

  const fetchVillageStats = async () => {
    try {
      setLoadingStats(true);
      const response = await reportsAPI.getVillageStats();
      if (response.data?.status === "success") {
        setVillageStats(response.data.data.stats || []);
      }
    } catch (error) {
      console.error("Erreur chargement stats villages:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <>
      <div className="stats-grid">
        <SOSStatCard
          number={stats.pending}
          label="Signalements en attente"
          variant="info"
        />
        <SOSStatCard
          number={stats.urgent}
          label="Cas urgents"
          variant="urgent"
        />
        <SOSStatCard
          number={stats.monthly}
          label="Cas ce mois"
          variant="success"
        />
        <SOSStatCard
          number={stats.villages}
          label="Villages actifs"
          variant="warning"
        />
      </div>

      <SOSCard
        title="Vue par village"
        subtitle="Répartition des cas par village SOS"
        variant="info"
      >
        {loadingStats ? (
          <div className="loading-state">Chargement des statistiques...</div>
        ) : villageStats.length === 0 ? (
          <div className="empty-state">
            <SOSIcons.Village size={64} color="#00abec" />
            <p>Aucune statistique disponible</p>
          </div>
        ) : (
          <table className="sos-table">
            <thead>
              <tr>
                <th>
                  <SOSIcons.Village size={16} /> Village
                </th>
                <th>
                  <SOSIcons.Document size={16} /> Actifs
                </th>
                <th>
                  <SOSIcons.Notification size={16} /> En traitement
                </th>
                <th>
                  <SOSIcons.Check size={16} /> Cloturés
                </th>
              </tr>
            </thead>
            <tbody>
              {villageStats.map((v) => (
                <tr key={v.village}>
                  <td>
                    <strong>
                      Village{" "}
                      {v.village.charAt(0).toUpperCase() + v.village.slice(1)}
                    </strong>
                  </td>
                  <td>{v.actifs || 0}</td>
                  <td>{v.enTraitement || 0}</td>
                  <td>{v.clotures || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SOSCard>
    </>
  );
}

function ReportsToProcess() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [classificationModal, setClassificationModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // Filter by psychologue's village and status
      const params = { status: "en_attente,en_cours" };
      if (user?.village) {
        params.village = user.village;
      }
      const response = await reportsAPI.getAll(params);
      setReports(response.data?.data?.reports || []);
    } catch (error) {
      console.error("Erreur chargement signalements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClassify = (report) => {
    setSelectedReport(report);
    setClassificationModal(true);
  };

  const handleClassification = async (classification, notes) => {
    try {
      await reportsAPI.classify(selectedReport.id, { classification, notes });
      alert("Signalement classifié avec succès !");
      setClassificationModal(false);
      setSelectedReport(null);
      fetchReports();
    } catch (error) {
      console.error("Erreur classification:", error);
      alert("Erreur lors de la classification");
    }
  };

  const handleViewDetails = (reportId) => {
    navigate(`/reports/${reportId}`);
  };

  const getPriorityBadge = (urgency) => {
    const badges = {
      critique: "sos-badge-urgent",
      moyen: "sos-badge-warning",
      faible: "sos-badge-success",
    };
    return badges[urgency] || "sos-badge-info";
  };

  if (loading) {
    return (
      <SOSCard title="Chargement..." variant="info">
        <div className="loading-state">Chargement des signalements...</div>
      </SOSCard>
    );
  }

  return (
    <>
      <SOSCard
        title="Signalements à traiter"
        subtitle={`${reports.length} cas nécessitant une analyse`}
        variant="info"
      >
        {reports.length === 0 ? (
          <div className="empty-state">
            <SOSIcons.Check size={64} color="#00abec" />
            <p>Aucun signalement en attente</p>
            <p className="empty-hint">Tous les cas ont été traités !</p>
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
                  <SOSIcons.Village size={16} /> Village
                </th>
                <th>
                  <SOSIcons.Alert size={16} /> Type
                </th>
                <th>
                  <SOSIcons.Heart size={16} /> Urgence
                </th>
                <th>
                  <SOSIcons.User size={16} /> Enfant
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <strong>{report.reportId || report.id}</strong>
                  </td>
                  <td>
                    {new Date(report.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td>{report.village}</td>
                  <td>{report.incidentType}</td>
                  <td>
                    <span
                      className={`sos-badge ${getPriorityBadge(report.urgencyLevel)}`}
                    >
                      {report.urgencyLevel}
                    </span>
                  </td>
                  <td>{report.childName}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleViewDetails(report.id)}
                        title="Voir détails"
                      >
                        <SOSIcons.Search size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleClassify(report)}
                        title="Classifier"
                      >
                        <SOSIcons.Check size={16} />
                        Classer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SOSCard>

      {classificationModal && selectedReport && (
        <ClassificationModal
          report={selectedReport}
          onClose={() => setClassificationModal(false)}
          onClassify={handleClassification}
        />
      )}
    </>
  );
}

function ClassificationModal({ report, onClose, onClassify }) {
  const [classification, setClassification] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classification) {
      alert("Veuillez sélectionner une classification");
      return;
    }
    setSubmitting(true);
    await onClassify(classification, notes);
    setSubmitting(false);
  };

  const classifications = [
    {
      value: "sauvegarde",
      label: "Sauvegarde",
      desc: "Cas nécessitant une protection immédiate",
      color: "#ef4444",
    },
    {
      value: "prise_en_charge",
      label: "Prise en charge",
      desc: "Accompagnement psychosocial",
      color: "#f59e0b",
    },
    {
      value: "faux_signalement",
      label: "Faux signalement",
      desc: "Signalement non fondé",
      color: "#6b7280",
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content classification-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Classifier le signalement</h3>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="report-info">
            <p>
              <strong>Référence:</strong> {report.reportId || report.id}
            </p>
            <p>
              <strong>Enfant:</strong> {report.childName}
            </p>
            <p>
              <strong>Village:</strong> {report.village}
            </p>
          </div>

          <div className="classification-options">
            {classifications.map((c) => (
              <div
                key={c.value}
                className={`classification-option ${classification === c.value ? "selected" : ""}`}
                onClick={() => setClassification(c.value)}
                style={{
                  borderColor: classification === c.value ? c.color : undefined,
                }}
              >
                <div
                  className="classification-color"
                  style={{ background: c.color }}
                ></div>
                <div className="classification-details">
                  <h4>{c.label}</h4>
                  <p>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label">Notes / Observations</label>
            <textarea
              className="form-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              placeholder="Ajoutez vos observations et recommandations..."
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Classification..." : "Confirmer la classification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function WorkflowView() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [showReportEditor, setShowReportEditor] = useState(false);

  useEffect(() => {
    fetchReportsWithWorkflow();
  }, []);

  useEffect(() => {
    if (selectedReport) {
      // Refresh selected report data
      refreshSelectedReport();
    }
  }, [selectedReport?.id]);

  const refreshSelectedReport = async () => {
    if (!selectedReport) return;
    try {
      const response = await reportsAPI.getById(selectedReport.id);
      setSelectedReport(response.data.data.report);
    } catch (error) {
      console.error("Erreur rafraîchissement signalement:", error);
    }
  };

  const fetchReportsWithWorkflow = async () => {
    try {
      setLoading(true);
      const params = { status: "en_cours,pris_en_charge,sauvegarde" };
      if (user?.village) {
        params.village = user.village;
      }
      const response = await reportsAPI.getAll(params);
      const reportsList = response.data?.data?.reports || [];
      setReports(reportsList);

      // Auto-select first report if none selected
      if (!selectedReport && reportsList.length > 0) {
        setSelectedReport(reportsList[0]);
      }
    } catch (error) {
      console.error("Erreur chargement signalements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartStep = async (reportId, stepNumber) => {
    try {
      await reportsAPI.startWorkflowStep(reportId, stepNumber);
      alert(`Étape ${stepNumber} démarrée avec succès`);
      await refreshSelectedReport();
      await fetchReportsWithWorkflow();
    } catch (error) {
      alert("Erreur lors du démarrage de l'étape");
      console.error(error);
    }
  };

  const handleCompleteStep = async (reportId, stepNumber, notes) => {
    if (!notes || notes.trim() === "") {
      alert("Veuillez ajouter des notes avant de compléter l'étape");
      return;
    }

    try {
      await reportsAPI.completeWorkflowStep(reportId, stepNumber, notes);
      alert(`Étape ${stepNumber} complétée avec succès`);
      await refreshSelectedReport();
      await fetchReportsWithWorkflow();

      // Auto-advance to next step if not last
      if (activeStep < 5) {
        setActiveStep(activeStep + 1);
      }
    } catch (error) {
      alert("Erreur lors de la complétion de l'étape");
      console.error(error);
    }
  };

  const handleUploadDocuments = async (reportId, stepNumber, files) => {
    if (!files || files.length === 0) {
      alert("Veuillez sélectionner au moins un document");
      return;
    }

    try {
      setUploadingDocs(true);
      await reportsAPI.uploadStepDocuments(reportId, stepNumber, files);
      alert(`${files.length} document(s) uploadé(s) avec succès`);
      await refreshSelectedReport();
      setDocuments([]);
    } catch (error) {
      alert("Erreur lors de l'upload des documents");
      console.error(error);
    } finally {
      setUploadingDocs(false);
    }
  };

  const handleSaveReport = async (reportData) => {
    if (!selectedReport) return;

    try {
      await reportsAPI.createDocument(selectedReport.id, reportData);
      await refreshSelectedReport();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du rapport:", error);
      throw error;
    }
  };

  const getStepStatus = (report, stepNumber) => {
    if (!report?.workflowSteps || report.workflowSteps.length === 0)
      return "pending";
    const step = report.workflowSteps.find((s) => s.stepNumber === stepNumber);
    if (!step) return "pending";

    // Check if overdue
    if (
      step.deadline &&
      new Date(step.deadline) < new Date() &&
      step.status !== "completed"
    ) {
      return "overdue";
    }

    return step.status || "pending";
  };

  const getCurrentStepData = (report, stepNumber) => {
    if (!report?.workflowSteps) return null;
    return report.workflowSteps.find((s) => s.stepNumber === stepNumber);
  };

  const workflowSteps = [
    {
      title: "Fiche Initiale + DPE",
      description:
        "Création de la fiche initiale de signalement et du rapport DPE. Notifications automatiques au Directeur du village et au Bureau National.",
      documents: [
        "Fiche initiale de signalement",
        "Rapport DPE (Document de Protection de l'Enfant)",
      ],
      actions: [
        "Remplir la fiche initiale avec tous les détails du cas",
        "Rédiger le rapport DPE confidentiel",
        "Notifier automatiquement le Directeur du village",
        "Transmettre au Bureau National",
      ],
    },
    {
      title: "Évaluation Complète",
      description:
        "Analyse approfondie de la situation de l'enfant incluant évaluation psychologique et sociale.",
      documents: [
        "Rapport d'évaluation psychologique",
        "Rapport d'évaluation sociale",
        "Entretiens",
      ],
      actions: [
        "Entretien individuel avec l'enfant",
        "Évaluation psychologique complète",
        "Évaluation de l'environnement familial",
        "Collecte de témoignages si nécessaire",
      ],
    },
    {
      title: "Plan d'Action",
      description:
        "Élaboration d'un plan d'action détaillé avec objectifs, interventions et timeline.",
      documents: [
        "Plan d'action détaillé",
        "Calendrier d'interventions",
        "Ressources mobilisées",
      ],
      actions: [
        "Définir les objectifs à court et long terme",
        "Planifier les interventions nécessaires",
        "Identifier et assigner les ressources",
        "Établir un calendrier de suivi",
      ],
    },
    {
      title: "Rapport de Suivi",
      description:
        "Documentation continue de l'évolution du cas et des actions entreprises.",
      documents: [
        "Rapports de suivi périodiques",
        "Notes d'observation",
        "Comptes-rendus d'interventions",
      ],
      actions: [
        "Documenter chaque intervention",
        "Évaluer la progression régulièrement",
        "Ajuster le plan si nécessaire",
        "Maintenir contact avec toutes les parties",
      ],
    },
    {
      title: "Rapport Final",
      description:
        "Synthèse complète du cas avec recommandations finales pour décision. Une fois cette étape complétée, le cas est transmis au décideur pour validation finale.",
      documents: [
        "Rapport final de synthèse",
        "Recommandations finales",
        "Bilan des interventions",
      ],
      actions: [
        "Rédiger la synthèse complète du cas",
        "Formuler les recommandations finales",
        "Évaluer l'atteinte des objectifs",
        "Transmettre au décideur pour décision formelle",
      ],
    },
    {
      title: "Avis de Clôture",
      description:
        "Clôture finale du dossier après décision du décideur. Rédaction de l'avis de clôture et archivage sécurisé du dossier complet.",
      documents: [
        "Avis de clôture signé",
        "Dossier complet archivé",
        "Rapport de transmission",
      ],
      actions: [
        "Examiner la décision du décideur",
        "Rédiger l'avis de clôture formel",
        "Archiver le dossier de manière sécurisée",
        "Confirmer la clôture définitive du cas",
      ],
      requiresDecision: true,
    },
  ];

  if (loading) {
    return (
      <SOSCard title="Chargement..." variant="info">
        <div className="loading-state">Chargement des signalements...</div>
      </SOSCard>
    );
  }

  return (
    <>
      <SOSCard
        title="Gestion du Workflow - 6 Étapes"
        subtitle="Complétez les 5 premières étapes d'analyse. Après la décision du décideur, complétez l'étape 6 de clôture."
        variant="info"
      >
        {reports.length === 0 ? (
          <div className="empty-state">
            <SOSIcons.Check size={64} color="#00abec" />
            <p>Aucun signalement en cours de traitement</p>
            <p className="empty-hint">
              Les signalements assignés apparaîtront ici
            </p>
          </div>
        ) : (
          <div className="reports-selector">
            {reports.map((report) => {
              const completedSteps =
                report.workflowSteps?.filter(
                  (s) => s.stepNumber <= 6 && s.status === "completed",
                ).length || 0;
              const totalSteps = 6;
              const progress = (completedSteps / totalSteps) * 100;

              return (
                <div
                  key={report.id}
                  className={`report-selector-item ${selectedReport?.id === report.id ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedReport(report);
                    // Find first incomplete step
                    const firstIncomplete =
                      report.workflowSteps?.findIndex(
                        (s) => s.status !== "completed",
                      ) || 0;
                    setActiveStep(firstIncomplete >= 0 ? firstIncomplete : 0);
                  }}
                >
                  <div className="report-selector-content">
                    <div>
                      <strong>{report.reportId}</strong>
                      <span className="report-meta">
                        {report.village} - {report.childName}
                      </span>
                    </div>
                    <span className={`urgency-badge ${report.urgencyLevel}`}>
                      {report.urgencyLevel === "critique" ? (
                        <>
                          <SOSIcons.CircleCritical size={12} /> Critique
                        </>
                      ) : report.urgencyLevel === "moyen" ? (
                        <>
                          <SOSIcons.CircleMedium size={12} /> Moyen
                        </>
                      ) : (
                        <>
                          <SOSIcons.CircleLow size={12} /> Faible
                        </>
                      )}
                    </span>
                  </div>
                  <div className="workflow-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {completedSteps}/{totalSteps} étapes
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SOSCard>

      {selectedReport && (
        <SOSCard
          title={
            <span
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <SOSIcons.Clipboard size={20} />
              Workflow: {selectedReport.reportId}
            </span>
          }
          subtitle={`${selectedReport.childName} - ${selectedReport.village} | Urgence: ${selectedReport.urgencyLevel}`}
          variant="info"
        >
          <div className="workflow-container">
            {/* Steps Timeline */}
            <div className="workflow-steps-timeline">
              {workflowSteps.map((step, idx) => {
                const stepStatus = getStepStatus(selectedReport, idx + 1);
                const stepData = getCurrentStepData(selectedReport, idx + 1);
                const isActive = idx === activeStep;
                const isCompleted = stepStatus === "completed";
                const isOverdue = stepStatus === "overdue";

                // Step 6 (Clôture) is only accessible after a decision has been made
                const hasDecision =
                  selectedReport.decision && selectedReport.decision.type;
                const isStep6 = idx === 5; // Step 6 (index 5)
                const isStep6Disabled = isStep6 && !hasDecision;

                return (
                  <div
                    key={idx}
                    className={`workflow-step-card ${isActive ? "active" : ""} ${stepStatus} ${isStep6Disabled ? "disabled" : ""}`}
                    onClick={() => {
                      if (!isStep6Disabled) {
                        setActiveStep(idx);
                      }
                    }}
                    style={{
                      cursor: isStep6Disabled ? "not-allowed" : "pointer",
                      opacity: isStep6Disabled ? 0.5 : 1,
                    }}
                  >
                    <div className={`step-number ${stepStatus}`}>
                      {isCompleted ? "✓" : isStep6Disabled ? "🔒" : idx + 1}
                    </div>
                    <div className="step-content">
                      <h4>{step.title}</h4>
                      {stepData?.deadline && (
                        <small
                          className={`step-deadline ${isOverdue ? "overdue" : ""}`}
                        >
                          {isOverdue ? (
                            <SOSIcons.Alert size={12} color="#de5a6c" />
                          ) : (
                            <SOSIcons.Calendar size={12} color="#00abec" />
                          )}{" "}
                          {new Date(stepData.deadline).toLocaleDateString(
                            "fr-FR",
                          )}
                        </small>
                      )}
                      {isCompleted && stepData?.completedAt && (
                        <small className="step-completed">
                          <SOSIcons.Check size={12} color="#00abec" />{" "}
                          {new Date(stepData.completedAt).toLocaleDateString(
                            "fr-FR",
                          )}
                        </small>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Step Detail */}
            <div className="workflow-detail-panel">
              <div className="workflow-detail-header">
                <h3>
                  <span className="step-badge">Étape {activeStep + 1}/6</span>
                  {workflowSteps[activeStep].title}
                </h3>
                <span
                  className={`status-badge ${getStepStatus(selectedReport, activeStep + 1)}`}
                >
                  {getStepStatus(selectedReport, activeStep + 1) === "completed"
                    ? "✓ Complété"
                    : getStepStatus(selectedReport, activeStep + 1) ===
                        "in_progress"
                      ? "⟳ En cours"
                      : getStepStatus(selectedReport, activeStep + 1) ===
                          "overdue"
                        ? "⚠ En retard"
                        : "○ En attente"}
                </span>
              </div>

              <div className="workflow-detail-body">
                {/* Warning for Step 6 if no decision */}
                {activeStep === 5 && !selectedReport.decision?.type && (
                  <div
                    className="alert-box warning"
                    style={{
                      marginBottom: "1rem",
                      padding: "1rem",
                      background: "#fff3cd",
                      border: "1px solid #ffc107",
                      borderRadius: "4px",
                    }}
                  >
                    <h4 style={{ color: "#856404", marginBottom: "0.5rem" }}>
                      🔒 Étape verrouillée
                    </h4>
                    <p style={{ color: "#856404", margin: 0 }}>
                      L'étape de clôture n'est accessible qu'après qu'une
                      décision formelle ait été prise par le décideur. Veuillez
                      compléter les 5 premières étapes pour transmettre le
                      dossier au décideur.
                    </p>
                  </div>
                )}

                {/* Show decision details if it exists (for Step 6) */}
                {activeStep === 5 && selectedReport.decision?.type && (
                  <div
                    className="alert-box success"
                    style={{
                      marginBottom: "1rem",
                      padding: "1rem",
                      background: "#d4edda",
                      border: "1px solid #28a745",
                      borderRadius: "4px",
                    }}
                  >
                    <h4 style={{ color: "#155724", marginBottom: "0.5rem" }}>
                      ✓ Décision du décideur reçue
                    </h4>
                    <p style={{ color: "#155724", margin: 0 }}>
                      <strong>Type:</strong> {selectedReport.decision.type}
                      <br />
                      {selectedReport.decision.details && (
                        <>
                          <strong>Détails:</strong>{" "}
                          {selectedReport.decision.details}
                          <br />
                        </>
                      )}
                      <strong>Date:</strong>{" "}
                      {new Date(
                        selectedReport.decision.madeAt,
                      ).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                )}

                <div className="step-description">
                  <p>{workflowSteps[activeStep].description}</p>
                </div>

                {/* Documents Required */}
                <div className="step-documents-section">
                  <h4>
                    <SOSIcons.File size={18} color="#00abec" /> Documents requis
                  </h4>
                  <ul className="documents-list">
                    {workflowSteps[activeStep].documents.map((doc, idx) => (
                      <li key={idx}>
                        <SOSIcons.Document size={16} />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions Checklist */}
                <div className="step-actions-section">
                  <h4>✓ Actions à effectuer</h4>
                  <ul className="actions-checklist">
                    {workflowSteps[activeStep].actions.map((action, idx) => (
                      <li key={idx}>
                        <span className="action-number">{idx + 1}</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Current Step Data */}
                {(() => {
                  const currentStep = getCurrentStepData(
                    selectedReport,
                    activeStep + 1,
                  );
                  const stepStatus = getStepStatus(
                    selectedReport,
                    activeStep + 1,
                  );

                  return (
                    <>
                      {/* Show uploaded documents */}
                      {currentStep?.documents &&
                        currentStep.documents.length > 0 && (
                          <div className="uploaded-documents">
                            <h4>
                              <SOSIcons.Paperclip size={18} color="#00abec" />{" "}
                              Documents uploadés ({currentStep.documents.length}
                              )
                            </h4>
                            <div className="documents-grid">
                              {currentStep.documents.map((doc, idx) => (
                                <div key={idx} className="document-item">
                                  <SOSIcons.Document size={24} />
                                  <span className="doc-name">
                                    {doc.originalName}
                                  </span>
                                  <span className="doc-size">
                                    {(doc.size / 1024).toFixed(1)} KB
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Show notes if completed */}
                      {currentStep?.notes && (
                        <div className="step-notes-display">
                          <h4>
                            <SOSIcons.Writing size={18} color="#00abec" /> Notes
                            de complétion
                          </h4>
                          <p>{currentStep.notes}</p>
                          {currentStep.completedBy && (
                            <small>
                              Par:{" "}
                              {currentStep.completedBy.fullName ||
                                currentStep.completedBy.firstName}
                            </small>
                          )}
                        </div>
                      )}

                      {/* Step Actions */}
                      <div className="step-actions-panel">
                        {stepStatus === "pending" &&
                          !(
                            activeStep === 5 && !selectedReport.decision?.type
                          ) && (
                            <div className="action-buttons">
                              <button
                                className="btn btn-primary btn-lg"
                                onClick={() =>
                                  handleStartStep(
                                    selectedReport.id,
                                    activeStep + 1,
                                  )
                                }
                              >
                                <SOSIcons.Check size={20} />
                                Démarrer cette étape
                              </button>
                              <p className="action-hint">
                                <SOSIcons.Lightbulb size={16} color="#00abec" />{" "}
                                Démarrez l'étape pour commencer à travailler
                                dessus
                              </p>
                            </div>
                          )}

                        {stepStatus === "in_progress" && (
                          <>
                            {/* Document Upload */}
                            <div className="document-upload-section">
                              <h4>
                                <SOSIcons.Send size={18} color="#00abec" />{" "}
                                Upload de documents
                              </h4>
                              <input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) =>
                                  setDocuments(Array.from(e.target.files))
                                }
                                className="file-input"
                                id={`docs-step-${activeStep + 1}`}
                              />
                              <label
                                htmlFor={`docs-step-${activeStep + 1}`}
                                className="file-input-label"
                              >
                                <SOSIcons.Document size={20} />
                                Sélectionner des documents
                              </label>
                              {documents.length > 0 && (
                                <div className="selected-files">
                                  <p>
                                    {documents.length} fichier(s) sélectionné(s)
                                  </p>
                                  <button
                                    className="btn btn-secondary"
                                    onClick={() =>
                                      handleUploadDocuments(
                                        selectedReport.id,
                                        activeStep + 1,
                                        documents,
                                      )
                                    }
                                    disabled={uploadingDocs}
                                  >
                                    {uploadingDocs
                                      ? "Upload en cours..."
                                      : "Uploader maintenant"}
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Report Editor Button */}
                            <div
                              className="document-upload-section"
                              style={{ marginTop: "1rem" }}
                            >
                              <h4>
                                <SOSIcons.Writing size={18} color="#00abec" />{" "}
                                Rédaction de rapport confidentiel
                              </h4>
                              <button
                                className="btn btn-primary"
                                onClick={() => setShowReportEditor(true)}
                                style={{ width: "100%" }}
                              >
                                <SOSIcons.Edit size={20} />
                                Rédiger un rapport pour cette étape
                              </button>
                              <p
                                className="action-hint"
                                style={{ marginTop: "0.5rem" }}
                              >
                                <SOSIcons.Lightbulb size={16} color="#00abec" />{" "}
                                Utilisez les modèles prédéfinis pour documenter
                                cette étape
                              </p>
                            </div>

                            {/* Completion Form */}
                            <WorkflowStepCompleteForm
                              reportId={selectedReport.id}
                              stepNumber={activeStep + 1}
                              stepTitle={workflowSteps[activeStep].title}
                              onComplete={handleCompleteStep}
                            />
                          </>
                        )}

                        {stepStatus === "completed" && (
                          <div className="completed-info">
                            <SOSIcons.CheckCircle size={48} color="#00abec" />
                            <h4
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                justifyContent: "center",
                              }}
                            >
                              <SOSIcons.Check size={20} color="#00abec" />
                              Étape complétée avec succès
                            </h4>
                            <p>
                              Complétée le{" "}
                              {currentStep?.completedAt
                                ? new Date(
                                    currentStep.completedAt,
                                  ).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "N/A"}
                            </p>
                          </div>
                        )}

                        {stepStatus === "overdue" && (
                          <div className="overdue-warning">
                            <SOSIcons.Alert size={24} color="#de5a6c" />
                            <p
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <SOSIcons.Alert size={16} color="#de5a6c" />
                              Cette étape est en retard ! Veuillez la compléter
                              rapidement.
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Navigation */}
              <div className="workflow-navigation">
                <button
                  className="btn btn-secondary"
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep(activeStep - 1)}
                >
                  ← Étape précédente
                </button>
                <span className="step-indicator">
                  Étape {activeStep + 1} sur {workflowSteps.length}
                </span>
                <button
                  className="btn btn-secondary"
                  disabled={activeStep === workflowSteps.length - 1}
                  onClick={() => setActiveStep(activeStep + 1)}
                >
                  Étape suivante →
                </button>
              </div>
            </div>
          </div>
        </SOSCard>
      )}

      {/* Report Editor Modal */}
      {showReportEditor && selectedReport && (
        <ReportEditor
          reportId={selectedReport.id}
          stepNumber={activeStep + 1}
          onSave={handleSaveReport}
          onClose={() => setShowReportEditor(false)}
        />
      )}
    </>
  );
}

function WorkflowStepCompleteForm({
  reportId,
  stepNumber,
  stepTitle,
  onComplete,
}) {
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!notes || notes.trim() === "") {
      alert("Les notes sont obligatoires pour compléter une étape");
      return;
    }

    setSubmitting(true);
    await onComplete(reportId, stepNumber, notes);
    setSubmitting(false);
    setNotes("");
  };

  return (
    <form onSubmit={handleSubmit} className="step-complete-form">
      <h4 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <SOSIcons.Writing size={18} color="#00abec" />
        Compléter l'étape: {stepTitle}
      </h4>
      <div className="form-group">
        <label>Notes de complétion (obligatoire) *</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="6"
          placeholder="Décrivez ce qui a été fait, les observations importantes, les décisions prises, etc..."
          required
          className="form-textarea"
        />
        <small className="form-hint">
          Minimum 20 caractères. Ces notes seront confidentielles et archivées
          dans le dossier.
        </small>
      </div>
      <button
        type="submit"
        className="btn btn-primary btn-lg"
        disabled={submitting || notes.length < 20}
      >
        <SOSIcons.Check size={20} />
        {submitting ? "Enregistrement..." : "Marquer comme complété"}
      </button>
    </form>
  );
}

function MyProcessedCases() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProcessedReports();
  }, []);

  const fetchProcessedReports = async () => {
    try {
      setLoading(true);
      const response = await reportsAPI.getAll({
        status: "sauvegarde,pris_en_charge,faux,cloture",
      });
      setReports(response.data?.data?.reports || []);
    } catch (error) {
      console.error("Erreur chargement cas traités:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      sauvegarde: { class: "sos-badge-urgent", label: "Sauvegarde" },
      pris_en_charge: { class: "sos-badge-warning", label: "Pris en charge" },
      faux: { class: "sos-badge-secondary", label: "Faux signalement" },
      cloture: { class: "sos-badge-success", label: "Cloturé" },
    };
    const badge = badges[status] || { class: "sos-badge-info", label: status };
    return <span className={`sos-badge ${badge.class}`}>{badge.label}</span>;
  };

  return (
    <SOSCard
      title="Mes Cas Traités"
      subtitle="Historique des signalements que vous avez traités"
      variant="info"
    >
      {loading ? (
        <div className="loading-state">Chargement...</div>
      ) : reports.length === 0 ? (
        <div className="empty-state">
          <SOSIcons.Document size={64} color="#00abec" />
          <p>Aucun cas traité pour le moment</p>
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
                <SOSIcons.Village size={16} /> Village
              </th>
              <th>
                <SOSIcons.Alert size={16} /> Type
              </th>
              <th>
                <SOSIcons.Check size={16} /> Classification
              </th>
              <th>
                <SOSIcons.Heart size={16} /> Statut
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>
                  <strong>{report.reportId || report.id}</strong>
                </td>
                <td>
                  {new Date(report.createdAt).toLocaleDateString("fr-FR")}
                </td>
                <td>{report.village}</td>
                <td>{report.incidentType}</td>
                <td>{report.classification || "-"}</td>
                <td>{getStatusBadge(report.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </SOSCard>
  );
}

export default Level2Dashboard;
