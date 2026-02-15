import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { reportsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { SOSIcons } from "./SOSIcons";
import { SOSCard, SOSStatCard } from "./SOSCard";
import "./Level3Dashboard.css";

function Level3Dashboard() {
  const [activeTab, setActiveTab] = useState("vue-globale");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    urgent: 0,
    resolved: 0,
  });
  const { notifications, unreadCount } = useSocket();

  useEffect(() => {
    fetchStats();
  }, [notifications]);

  const fetchStats = async () => {
    try {
      const response = await reportsAPI.getAll();
      const reports = response.data?.data?.reports || [];

      // Count reports awaiting decision (workflow complete, no decision)
      const pendingDecisions = reports.filter((r) => {
        const hasWorkflow = r.workflowSteps && r.workflowSteps.length > 0;
        const workflowCompleted =
          hasWorkflow && r.workflowSteps.every((s) => s.status === "completed");
        const noDecision = !r.decision || !r.decision.type;
        return workflowCompleted && noDecision;
      }).length;

      // Count all urgent cases (not just those awaiting decision)
      const urgentCases = reports.filter(
        (r) =>
          r.urgencyLevel === "critique" &&
          !["cloture", "faux"].includes(r.status),
      ).length;

      // Count resolved cases (closed or with decision)
      const resolvedCases = reports.filter(
        (r) => r.status === "cloture" || (r.decision && r.decision.type),
      ).length;

      setStats({
        total: reports.length,
        pending: pendingDecisions,
        urgent: urgentCases,
        resolved: resolvedCases,
      });
    } catch (error) {
      console.error("Erreur stats:", error);
    }
  };

  return (
    <div className="level3-dashboard">
      <div className="dashboard-header">
        <SOSIcons.Shield size={48} color="#00abec" />
        <div>
          <h1>Espace Gouvernance & Décision</h1>
          <p>Niveau 3 - Direction du Village, Bureau National</p>
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
          className={`nav-btn ${activeTab === "vue-globale" ? "active" : ""}`}
          onClick={() => setActiveTab("vue-globale")}
        >
          <SOSIcons.Document size={20} />
          Vue Globale
        </button>
        <button
          className={`nav-btn ${activeTab === "decisions" ? "active" : ""}`}
          onClick={() => setActiveTab("decisions")}
        >
          <SOSIcons.Check size={20} />
          Prise de Décision
          {stats.pending > 0 && (
            <span className="tab-badge">{stats.pending}</span>
          )}
        </button>
        <button
          className={`nav-btn ${activeTab === "archives" ? "active" : ""}`}
          onClick={() => setActiveTab("archives")}
        >
          <SOSIcons.Family size={20} />
          Archives Sécurisées
        </button>
      </div>

      {activeTab === "vue-globale" && <GovernanceOverview stats={stats} />}
      {activeTab === "decisions" && <DecisionMaking />}
      {activeTab === "archives" && <SecureArchives />}
    </div>
  );
}

function GovernanceOverview({ stats }) {
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
        <SOSStatCard number={stats.total} label="Total cas" variant="info" />
        <SOSStatCard
          number={stats.pending}
          label="Décisions en attente"
          variant="urgent"
        />
        <SOSStatCard
          number={stats.urgent}
          label="Cas urgents"
          variant="urgent"
        />
        <SOSStatCard
          number={stats.resolved}
          label="Cas résolus"
          variant="success"
        />
      </div>

      <SOSCard
        title="Performance par village"
        subtitle="Taux de résolution et statistiques"
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
                  <SOSIcons.Document size={16} /> Total Cas
                </th>
                <th>
                  <SOSIcons.Notification size={16} /> En attente
                </th>
                <th>
                  <SOSIcons.Check size={16} /> Résolus
                </th>
                <th>
                  <SOSIcons.Alert size={16} /> Urgents
                </th>
                <th>
                  <SOSIcons.Heart size={16} /> Taux résolution
                </th>
              </tr>
            </thead>
            <tbody>
              {villageStats.map((v) => (
                <tr key={v.village}>
                  <td>
                    <strong>Village {v.village}</strong>
                  </td>
                  <td>{v.total}</td>
                  <td>{v.pending}</td>
                  <td>{v.resolved}</td>
                  <td>
                    <span className="urgent-count">{v.urgent}</span>
                  </td>
                  <td>
                    <span
                      className={`success-rate ${v.resolutionRate > 80 ? "high" : v.resolutionRate > 60 ? "medium" : "low"}`}
                    >
                      {Math.round(v.resolutionRate || 0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SOSCard>

      <SOSCard
        title="Alertes - Analyses Psychologues Complètes"
        subtitle="Cas avec analyse psychologique complète en attente de décision"
        variant="urgent"
      >
        <AlertsSection stats={stats} villageStats={villageStats} />
      </SOSCard>
    </>
  );
}

function AlertsSection({ stats, villageStats }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, [stats]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      // Get all classified reports
      const response = await reportsAPI.getAll({
        status: "sauvegarde,pris_en_charge",
      });
      const allReports = response.data?.data?.reports || [];

      // Filter for reports with completed psychologist analysis awaiting decision
      const reportsReadyForDecision = allReports.filter((report) => {
        const hasWorkflow =
          report.workflowSteps && report.workflowSteps.length > 0;
        const workflowCompleted =
          hasWorkflow &&
          report.workflowSteps.every((s) => s.status === "completed");
        const noDecision = !report.decision || !report.decision.type;
        return workflowCompleted && noDecision;
      });

      const alertsList = [];

      // Group by village and urgency
      const urgentByVillage = {};
      const normalByVillage = {};

      reportsReadyForDecision.forEach((report) => {
        if (report.urgencyLevel === "critique") {
          urgentByVillage[report.village] =
            (urgentByVillage[report.village] || 0) + 1;
        } else {
          normalByVillage[report.village] =
            (normalByVillage[report.village] || 0) + 1;
        }
      });

      // Add urgent alerts
      Object.entries(urgentByVillage).forEach(([village, count]) => {
        alertsList.push({
          type: "urgent",
          title: `${count} cas critique${count > 1 ? "s" : ""} - Analyse psychologue complète`,
          message: `Village ${village.charAt(0).toUpperCase() + village.slice(1)} - Décision urgente requise`,
          icon: SOSIcons.Alert,
          color: "#ef4444",
          village,
        });
      });

      // Add normal priority alerts
      Object.entries(normalByVillage).forEach(([village, count]) => {
        alertsList.push({
          type: "warning",
          title: `${count} cas - Analyse psychologue complète`,
          message: `Village ${village.charAt(0).toUpperCase() + village.slice(1)} - En attente de décision formelle`,
          icon: SOSIcons.Notification,
          color: "#f59e0b",
          village,
        });
      });

      // Check for old pending decisions (>7 days)
      const now = new Date();
      const oldPending = reportsReadyForDecision.filter((report) => {
        const lastStep = report.workflowSteps[report.workflowSteps.length - 1];
        if (lastStep && lastStep.completedAt) {
          const daysSince = Math.floor(
            (now - new Date(lastStep.completedAt)) / (1000 * 60 * 60 * 24),
          );
          return daysSince > 7;
        }
        return false;
      });

      if (oldPending.length > 0) {
        alertsList.push({
          type: "urgent",
          title: `${oldPending.length} dossier${oldPending.length > 1 ? "s" : ""} en retard`,
          message:
            "Analyse complète depuis plus de 7 jours - Décision urgente requise",
          icon: SOSIcons.Clock,
          color: "#dc2626",
        });
      }

      setAlerts(alertsList);
    } catch (error) {
      console.error("Erreur chargement alertes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-state">Chargement des alertes...</div>;
  }

  if (alerts.length === 0) {
    return (
      <div className="empty-state">
        <SOSIcons.Check size={64} color="#22c55e" />
        <p>Aucune alerte</p>
        <p className="empty-hint">
          Aucun dossier analysé en attente de décision
        </p>
      </div>
    );
  }

  return (
    <div className="alerts-list">
      {alerts.map((alert, index) => (
        <div key={index} className={`alert-item ${alert.type}`}>
          <alert.icon size={20} color={alert.color} />
          <div>
            <h4>{alert.title}</h4>
            <p>{alert.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function DecisionMaking() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [decisionModal, setDecisionModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingDecisions();
  }, []);

  const fetchPendingDecisions = async () => {
    try {
      setLoading(true);
      // Get classified reports that need decision
      const params = {
        status: "sauvegarde,pris_en_charge",
      };

      // Directeur village only sees their village reports
      if (user?.role === "decideur1" && user?.village) {
        params.village = user.village;
      }

      const response = await reportsAPI.getAll(params);
      const allReports = response.data?.data?.reports || [];

      // Filter for reports that:
      // 1. Have completed all workflow steps
      // 2. Don't have a decision yet
      const pendingReports = allReports.filter((report) => {
        const hasWorkflow =
          report.workflowSteps && report.workflowSteps.length > 0;
        const workflowCompleted =
          hasWorkflow &&
          report.workflowSteps.every((s) => s.status === "completed");
        const noDecision = !report.decision || !report.decision.type;

        return workflowCompleted && noDecision;
      });

      setReports(pendingReports);
    } catch (error) {
      console.error("Erreur chargement décisions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (reportId) => {
    navigate(`/reports/${reportId}`);
  };

  const handleMakeDecision = (report) => {
    setSelectedReport(report);
    setDecisionModal(true);
  };

  const handleDecisionSubmit = async (decision, details) => {
    try {
      await reportsAPI.makeDecision(selectedReport.id, { decision, details });
      alert("Décision enregistrée avec succès !");
      setDecisionModal(false);
      setSelectedReport(null);
      fetchPendingDecisions();
    } catch (error) {
      console.error("Erreur décision:", error);
      alert("Erreur lors de l'enregistrement de la décision");
    }
  };

  const getClassificationBadge = (classification) => {
    const badges = {
      sauvegarde: { class: "sos-badge-urgent", label: "Sauvegarde" },
      prise_en_charge: { class: "sos-badge-warning", label: "Prise en charge" },
    };
    const badge = badges[classification] || {
      class: "sos-badge-info",
      label: classification,
    };
    return <span className={`sos-badge ${badge.class}`}>{badge.label}</span>;
  };

  return (
    <>
      <SOSCard
        title="Prise de Décision"
        subtitle={`${reports.length} cas en attente de décision formelle`}
        variant="info"
      >
        {loading ? (
          <div className="loading-state">Chargement...</div>
        ) : reports.length === 0 ? (
          <div className="empty-state">
            <SOSIcons.Check size={64} color="#22c55e" />
            <p>Aucune décision en attente</p>
            <p className="empty-hint">
              Tous les cas ont été traités et validés
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
                  <SOSIcons.Village size={16} /> Village
                </th>
                <th>
                  <SOSIcons.User size={16} /> Enfant
                </th>
                <th>
                  <SOSIcons.Alert size={16} /> Classification
                </th>
                <th>
                  <SOSIcons.Heart size={16} /> Urgence
                </th>
                <th>
                  <SOSIcons.Check size={16} /> Statut Workflow
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => {
                const workflowCompleted =
                  report.workflowSteps &&
                  report.workflowSteps.length > 0 &&
                  report.workflowSteps.every((s) => s.status === "completed");

                return (
                  <tr key={report.id}>
                    <td>
                      <strong>{report.reportId || report.id}</strong>
                    </td>
                    <td>
                      {new Date(report.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td>{report.village}</td>
                    <td>{report.childName}</td>
                    <td>{getClassificationBadge(report.classification)}</td>
                    <td>
                      <span
                        className={`sos-badge ${report.urgencyLevel === "critique" ? "sos-badge-urgent" : "sos-badge-warning"}`}
                      >
                        {report.urgencyLevel}
                      </span>
                    </td>
                    <td>
                      {workflowCompleted ? (
                        <span className="sos-badge sos-badge-success">
                          <SOSIcons.CheckCircle size={14} /> Complet
                        </span>
                      ) : (
                        <span className="sos-badge sos-badge-warning">
                          <SOSIcons.Clock size={14} /> En cours
                        </span>
                      )}
                    </td>
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
                          className="btn btn-primary btn-sm"
                          onClick={() => handleMakeDecision(report)}
                          disabled={!workflowCompleted}
                          title={
                            workflowCompleted
                              ? "Prendre une décision"
                              : "Attendez la fin du workflow"
                          }
                        >
                          <SOSIcons.Check size={16} />
                          Décider
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </SOSCard>

      {decisionModal && selectedReport && (
        <DecisionModal
          report={selectedReport}
          onClose={() => setDecisionModal(false)}
          onSubmit={handleDecisionSubmit}
        />
      )}
    </>
  );
}

function DecisionModal({ report, onClose, onSubmit }) {
  const [decision, setDecision] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!decision) {
      alert("Veuillez sélectionner une décision");
      return;
    }
    setSubmitting(true);
    await onSubmit(decision, details);
    setSubmitting(false);
  };

  const decisions = [
    {
      value: "prise_en_charge",
      label: "Prise en charge",
      desc: "Valider la prise en charge formelle",
      color: "#22c55e",
    },
    {
      value: "sanction",
      label: "Sanction",
      desc: "Appliquer des sanctions appropriées",
      color: "#ef4444",
    },
    {
      value: "suivi",
      label: "Suivi",
      desc: "Mettre en place un suivi renforcé",
      color: "#3b82f6",
    },
    {
      value: "escalade",
      label: "Escalade",
      desc: "Escalader vers instances supérieures",
      color: "#f59e0b",
    },
    {
      value: "cloture",
      label: "Clôture",
      desc: "Clôturer le dossier définitivement",
      color: "#6b7280",
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content decision-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Prise de Décision Formelle</h3>
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
            <p>
              <strong>Classification:</strong> {report.classification}
            </p>
            <p>
              <strong>Urgence:</strong>{" "}
              <span
                className={`sos-badge ${report.urgencyLevel === "critique" ? "sos-badge-urgent" : "sos-badge-warning"}`}
              >
                {report.urgencyLevel}
              </span>
            </p>
          </div>

          {report.workflowSteps && report.workflowSteps.length > 0 && (
            <div className="workflow-summary">
              <h4>
                <SOSIcons.CheckCircle size={18} color="#22c55e" /> Analyse
                psychologique complète
              </h4>
              <div className="workflow-steps-list">
                {report.workflowSteps.map((step, idx) => (
                  <div key={idx} className="workflow-step-item">
                    <SOSIcons.Check size={14} color="#22c55e" />
                    <span>
                      Étape {step.stepNumber}: {step.title}
                    </span>
                    {step.completedAt && (
                      <span className="step-date">
                        {new Date(step.completedAt).toLocaleDateString("fr-FR")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="decision-options">
            {decisions.map((d) => (
              <div
                key={d.value}
                className={`decision-option ${decision === d.value ? "selected" : ""}`}
                onClick={() => setDecision(d.value)}
                style={{
                  borderColor: decision === d.value ? d.color : undefined,
                }}
              >
                <div
                  className="decision-color"
                  style={{ background: d.color }}
                ></div>
                <div className="decision-details">
                  <h4>{d.label}</h4>
                  <p>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label">Détails de la décision</label>
            <textarea
              className="form-textarea"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows="4"
              placeholder="Précisez les mesures prises, sanctions éventuelles, recommandations..."
              required
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
              {submitting ? "Enregistrement..." : "Enregistrer la décision"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SecureArchives() {
  const [archivedReports, setArchivedReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchArchivedReports();
  }, []);

  const fetchArchivedReports = async () => {
    try {
      setLoading(true);
      const response = await reportsAPI.getAll({ status: "cloture,faux" });
      setArchivedReports(response.data?.data?.reports || []);
    } catch (error) {
      console.error("Erreur chargement archives:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (reportId) => {
    navigate(`/reports/${reportId}`);
  };

  const filteredReports = archivedReports.filter(
    (r) =>
      r.childName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reportId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.village?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status) => {
    const badges = {
      cloture: { class: "sos-badge-success", label: "Clôturé" },
      faux: { class: "sos-badge-secondary", label: "Faux signalement" },
    };
    const badge = badges[status] || { class: "sos-badge-info", label: status };
    return <span className={`sos-badge ${badge.class}`}>{badge.label}</span>;
  };

  return (
    <SOSCard
      title="Archives Sécurisées"
      subtitle={`${archivedReports.length} dossiers archivés`}
      variant="info"
    >
      <div className="archives-search">
        <input
          type="text"
          className="form-input"
          placeholder="Rechercher par nom, référence ou village..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state">Chargement...</div>
      ) : filteredReports.length === 0 ? (
        <div className="empty-state">
          <SOSIcons.Document size={64} color="#00abec" />
          <p>Aucun dossier archivé</p>
          <p className="empty-hint">Les dossiers clôturés apparaîtront ici</p>
        </div>
      ) : (
        <table className="sos-table">
          <thead>
            <tr>
              <th>
                <SOSIcons.Document size={16} /> Référence
              </th>
              <th>
                <SOSIcons.Notification size={16} /> Date archivage
              </th>
              <th>
                <SOSIcons.Village size={16} /> Village
              </th>
              <th>
                <SOSIcons.User size={16} /> Enfant
              </th>
              <th>
                <SOSIcons.Alert size={16} /> Type
              </th>
              <th>
                <SOSIcons.Check size={16} /> Statut final
              </th>
              <th>Accès</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id}>
                <td>
                  <strong>{report.reportId || report.id}</strong>
                </td>
                <td>
                  {new Date(report.updatedAt).toLocaleDateString("fr-FR")}
                </td>
                <td>{report.village}</td>
                <td>{report.childName}</td>
                <td>{report.incidentType}</td>
                <td>{getStatusBadge(report.status)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleViewDetails(report.id)}
                    title="Voir détails"
                  >
                    <SOSIcons.Search size={16} />
                    Voir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </SOSCard>
  );
}

export default Level3Dashboard;
