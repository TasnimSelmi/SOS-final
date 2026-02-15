import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usersAPI } from "../services/api";
import { useSocket } from "../context/SocketContext";
import SOSLogo from "../components/SOSLogo";
import SOSDecorations from "../components/SOSDecorations";
import { useAuth } from "../context/AuthContext";
import { SOSIcons } from "../components/SOSIcons";
import "./AdminUsers.css";

function AdminUsers() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, unreadCount } = useSocket();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    role: "",
    isActive: "",
    search: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "mere",
    village: "",
    phoneNumber: "",
    isActive: true,
  });

  const roleLabels = {
    mere: "Mère SOS",
    tante: "Tante SOS",
    educateur: "Éducateur",
    psychologue: "Psychologue",
    decideur1: "Décideur 1",
    decideur2: "Décideur 2",
    admin: "Administrateur",
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [filters, pagination.page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== ""),
        ),
      };

      const response = await usersAPI.getAll(params);

      if (response.data?.status === "success") {
        setUsers(response.data.data.users);
        setPagination((prev) => ({
          ...prev,
          total: response.data.data.pagination.total,
          pages: response.data.data.pagination.pages,
        }));
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Erreur lors du chargement des utilisateurs",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await usersAPI.getRoles();
      if (response.data?.status === "success") {
        setRoles(response.data.data.roles);
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      role: "",
      isActive: "",
      search: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await usersAPI.create(formData);

      if (response.data?.status === "success") {
        setShowCreateModal(false);
        resetForm();
        fetchUsers();
        alert("Utilisateur créé avec succès !");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la création");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        village: formData.village,
        phoneNumber: formData.phoneNumber,
        isActive: formData.isActive,
      };

      const response = await usersAPI.update(selectedUser.id, updateData);

      if (response.data?.status === "success") {
        setShowEditModal(false);
        setSelectedUser(null);
        resetForm();
        fetchUsers();
        alert("Utilisateur mis à jour avec succès !");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?"))
      return;

    try {
      await usersAPI.delete(userId);
      fetchUsers();
      alert("Utilisateur supprimé avec succès !");
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const handleResetPassword = async (userId) => {
    const newPassword = prompt(
      "Entrez le nouveau mot de passe (min. 6 caractères):",
    );
    if (!newPassword || newPassword.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      await usersAPI.resetPassword(userId, { newPassword });
      alert("Mot de passe réinitialisé avec succès !");
    } catch (err) {
      alert(
        err.response?.data?.message || "Erreur lors de la réinitialisation",
      );
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username || "",
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "",
      role: user.role,
      village: user.village || "",
      phoneNumber: user.phoneNumber || "",
      isActive: user.isActive,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "mere",
      village: "",
      phoneNumber: "",
      isActive: true,
    });
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedUser(null);
    resetForm();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Jamais";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Modal Component
  const UserModal = ({ isEdit, onSubmit, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? "Modifier Utilisateur" : "Créer Utilisateur"}</h2>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="modal-form">
          <div className="form-group">
            <label>Nom d'utilisateur *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              disabled={isEdit}
              placeholder="Ex: jdupont"
              pattern="[a-zA-Z0-9_]+"
              title="Lettres, chiffres et underscores uniquement"
              minLength="3"
              maxLength="30"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Prénom *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Nom *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Optionnel"
            />
          </div>

          {!isEdit && (
            <div className="form-group">
              <label>Mot de passe *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required={!isEdit}
                minLength="6"
                placeholder="Min. 6 caractères"
              />
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Rôle *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Village</label>
              <select
                name="village"
                value={formData.village}
                onChange={handleInputChange}
              >
                <option value="">Aucun village</option>
                <option value="gammarth">Village Gammarth</option>
                <option value="siliana">Village Siliana</option>
                <option value="mahres">Village Mahrès</option>
                <option value="akouda">Village Akouda</option>
              </select>
              <small>Requis pour les psychologues</small>
            </div>
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="+216 XX XXX XXX"
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              Compte actif
            </label>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? "Mettre à jour" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="admin-users-container">
      <SOSDecorations />

      <div className="admin-header">
        <SOSLogo size="small" />
        <div>
          <h1>Gestion des Utilisateurs</h1>
          <p className="subtitle">Administration des comptes utilisateurs</p>
        </div>
        {unreadCount > 0 && (
          <div className="notification-badge">
            <SOSIcons.Notification size={24} />
            <span className="badge-count">{unreadCount}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="admin-actions">
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          + Nouvel utilisateur
        </button>
      </div>

      {/* Filtres */}
      <div className="filters-section">
        <div className="filters-row">
          <div className="filter-group">
            <label>Rôle</label>
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
            >
              <option value="">Tous les rôles</option>
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Statut</label>
            <select
              name="isActive"
              value={filters.isActive}
              onChange={handleFilterChange}
            >
              <option value="">Tous</option>
              <option value="true">Actif</option>
              <option value="false">Inactif</option>
            </select>
          </div>

          <div className="filter-group search-group">
            <label>Recherche</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Nom, email..."
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
          <strong>{pagination.total}</strong> utilisateur
          {pagination.total > 1 ? "s" : ""}
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

      {/* Table */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des utilisateurs...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Village</th>
                <th>Statut</th>
                <th>Dernière connexion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <div className="empty-message">
                      <span className="empty-icon">
                        <SOSIcons.Users size={48} color="#00abec" />
                      </span>
                      <p>Aucun utilisateur trouvé</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className={!u.isActive ? "inactive" : ""}>
                    <td className="user-name">
                      <strong>{u.fullName}</strong>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className="badge role-badge">
                        {roleLabels[u.role] || u.role}
                      </span>
                    </td>
                    <td>{u.village || "-"}</td>
                    <td>
                      <span
                        className={`badge status-badge ${u.isActive ? "active" : "inactive"}`}
                      >
                        {u.isActive ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td>{formatDate(u.lastLogin)}</td>
                    <td className="actions-cell">
                      <button
                        className="btn btn-sm btn-edit"
                        onClick={() => openEditModal(u)}
                        title="Modifier"
                      >
                        <SOSIcons.Edit size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-password"
                        onClick={() => handleResetPassword(u.id)}
                        title="Réinitialiser mot de passe"
                      >
                        🔑
                      </button>
                      <button
                        className="btn btn-sm btn-delete"
                        onClick={() => handleDeleteUser(u.id)}
                        title="Supprimer"
                        disabled={u.id === user?.id}
                      >
                        <SOSIcons.Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-pagination"
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
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
                  onClick={() => setPagination((prev) => ({ ...prev, page }))}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          <button
            className="btn btn-pagination"
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            disabled={pagination.page === pagination.pages}
          >
            Suivant →
          </button>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <UserModal
          isEdit={false}
          onSubmit={handleCreateUser}
          onClose={closeModal}
        />
      )}

      {showEditModal && (
        <UserModal
          isEdit={true}
          onSubmit={handleUpdateUser}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default AdminUsers;
