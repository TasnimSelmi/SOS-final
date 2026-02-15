import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { reportsAPI } from "../services/api";
import SOSLogo from "../components/SOSLogo";
import SOSDecorations from "../components/SOSDecorations";
import { SOSIcons } from "../components/SOSIcons";
import "./ReportsList.css";

function ReportsList() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    urgencyLevel: "",
    village: "",
    incidentType: "",
    search: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const statusOptions = [
    { value: "", label: "Tous les statuts" },
    { value: "en_attente", label: "En attente" },
    { value: "en_cours", label: "En cours" },
    { value: "pris_en_charge", label: "Pris en charge" },
    { value: "sauvegarde", label: "Sauvegarde" },
    { value: "faux", label: "Faux signalement" },
    { value: "cloture", label: "Clôturé" },
  ];

  const urgencyOptions = [
    { value: "", label: "Toutes les urgences" },
    { value: "faible", label: "Faible" },
    { value: "moyen", label: "Moyen" },
    { value: "critique", label: "Critique" },
  ];

  const incidentTypeOptions = [
    { value: "", label: "Tous les types" },
    { value: "sante", label: "Santé" },
    { value: "comportement", label: "Comportement" },
    { value: "violence", label: "Violence" },
    { value: "negligence", label: "Négligence" },
    { value: "abus", label: "Abus" },
    { value: "autre", label: "Autre" },
  ];

  const getStatusColor = (status) => {
    const colors = {
      en_attente: "#f59e0b",
      en_cours: "#3b82f6",
      pris_en_charge: "#10b981",
      sauvegarde: "#8b5cf6",
      faux: "#ef4444",
      cloture: "#6b7280",
    };
    return colors[status] || "#6b7280";
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      faible: "#10b981",
      moyen: "#f59e0b",
      critique: "#ef4444",
    };
    return colors[urgency] || "#6b7280";
  };

  const getStatusLabel = (status) => {
    const labels = {
      en_attente: "En attente",
      en_cours: "En cours",
      pris_en_charge: "Pris en charge",
      sauvegarde: "Sauvegarde",
      faux: "Faux",
      cloture: "Clôturé",
    };
    return labels[status] || status;
  };

  const getUrgencyLabel = (urgency) => {
    const labels = {
      faible: "Faible",
      moyen: "Moyen",
      critique: "Critique",
    };
    return labels[urgency] || urgency;
  };

  const getIncidentTypeLabel = (type) => {
    const labels = {
      sante: "Santé",
      comportement: "Comportement",
      violence: "Violence",
      negligence: "Négligence",
      abus: "Abus",
      autre: "Autre",
    };
    return labels[type] || type;
  };

  useEffect(() => {
    fetchReports();
  }, [filters, pagination.page]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== ""),
        ),
      };

      const response = await reportsAPI.getAll(params);

      if (response.data?.status === "success") {
        setReports(response.data.data.reports);
        setPagination((prev) => ({
          ...prev,
          total: response.data.data.pagination.total,
          pages: response.data.data.pagination.pages,
        }));
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Erreur lors du chargement des signalements",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      urgencyLevel: "",
      village: "",
      incidentType: "",
      search: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleViewReport = (id) => {
    navigate(`/reports/${id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="reports-list-container">
      <SOSDecorations />

      <div className="reports-header">
        <SOSLogo size="small" />
        <h1>Liste des Signalements</h1>
        <p className="subtitle">Gérez et suivez tous les signalements</p>
      </div>

      {/* Filtres */}
      <div className="filters-section">
        <div className="filters-row">
          <div className="filter-group">
            <label>Statut</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Urgence</label>
            <select
              name="urgencyLevel"
              value={filters.urgencyLevel}
              onChange={handleFilterChange}
            >
              {urgencyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Type</label>
            <select
              name="incidentType"
              value={filters.incidentType}
              onChange={handleFilterChange}
            >
              {incidentTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group search-group">
            <label>Recherche</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="ID, enfant, village..."
            />
          </div>

          <button
            className="btn btn-secondary btn-clear"
            onClick={clearFilters}
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-bar">
        <span className="stat-item">
          <strong>{pagination.total}</strong> signalement
          {pagination.total > 1 ? "s" : ""}
        </span>
        <span className="stat-item">
          Page {pagination.page} sur {pagination.pages}
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="error-banner">
          <span className="error-icon">
            <SOSIcons.Alert size={20} color="#de5a6c" />
          </span>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des signalements...</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="table-container">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Enfant</th>
                  <th>Type</th>
                  <th>Urgence</th>
                  <th>Statut</th>
                  <th>Village</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      <div className="empty-message">
                        <span className="empty-icon">
                          <SOSIcons.Clipboard size={48} color="#00abec" />
                        </span>
                        <p>Aucun signalement trouvé</p>
                        <button
                          className="btn btn-primary"
                          onClick={() => navigate("/reports/create")}
                        >
                          Créer un signalement
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr
                      key={report.id}
                      className={`report-row ${report.isOverdue ? "overdue" : ""}`}
                      onClick={() => handleViewReport(report.id)}
                    >
                      <td className="report-id">{report.reportId}</td>
                      <td className="child-name">{report.childName}</td>
                      <td>{getIncidentTypeLabel(report.incidentType)}</td>
                      <td>
                        <span
                          className="badge urgency-badge"
                          style={{
                            backgroundColor: `${getUrgencyColor(report.urgencyLevel)}20`,
                            color: getUrgencyColor(report.urgencyLevel),
                            borderColor: getUrgencyColor(report.urgencyLevel),
                          }}
                        >
                          {getUrgencyLabel(report.urgencyLevel)}
                        </span>
                      </td>
                      <td>
                        <span
                          className="badge status-badge"
                          style={{
                            backgroundColor: `${getStatusColor(report.status)}20`,
                            color: getStatusColor(report.status),
                            borderColor: getStatusColor(report.status),
                          }}
                        >
                          {getStatusLabel(report.status)}
                        </span>
                      </td>
                      <td>{report.village}</td>
                      <td>{formatDate(report.createdAt)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-view"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewReport(report.id);
                          }}
                        >
                          Voir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-pagination"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                ← Précédent
              </button>

              <div className="page-numbers">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`btn btn-page ${page === pagination.page ? "active" : ""}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                className="btn btn-pagination"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                Suivant →
              </button>
            </div>
          )}
        </>
      )}

      {/* Bouton créer */}
      <button
        className="btn btn-primary btn-floating"
        onClick={() => navigate("/reports/create")}
      >
        + Nouveau
      </button>
    </div>
  );
}

export default ReportsList;
