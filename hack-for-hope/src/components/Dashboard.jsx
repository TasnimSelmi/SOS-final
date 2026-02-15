import React from "react";
import { useNavigate } from "react-router-dom";
import SidebarNavigation from "./SidebarNavigation";
import ConfidentialBanner from "./ConfidentialBanner";
import StatsOverview from "./StatsOverview";
import NotificationsPanel from "./NotificationsPanel";
import Level1Dashboard from "./Level1Dashboard";
import Level2Dashboard from "./Level2Dashboard";
import Level3Dashboard from "./Level3Dashboard";
import AdminDashboard from "./AdminDashboard";
import "./Dashboard.css";

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();

  // Safety check for user
  if (!user) {
    return <div className="loading-screen">Chargement...</div>;
  }

  const renderDashboard = () => {
    try {
      // Backend uses string roles: 'mere', 'tante', 'educateur', 'psychologue', 'decideur1', 'decideur2', 'admin'
      const level1Roles = ["mere", "tante", "educateur"];
      const level2Roles = ["psychologue"];
      const level3Roles = ["decideur1", "decideur2"];

      if (user.role === "admin") {
        return <AdminDashboard />;
      } else if (level1Roles.includes(user.role)) {
        return <Level1Dashboard />;
      } else if (level2Roles.includes(user.role)) {
        return <Level2Dashboard />;
      } else if (level3Roles.includes(user.role)) {
        return <Level3Dashboard />;
      } else {
        return <Level1Dashboard />;
      }
    } catch (error) {
      console.error("Dashboard render error:", error);
      return (
        <div className="error-screen">Erreur de rendu: {error.message}</div>
      );
    }
  };

  return (
    <div className="dashboard-container">
      <ConfidentialBanner />
      <div className="dashboard-layout">
        <SidebarNavigation user={user} onLogout={onLogout} />
        <main className="dashboard-main">
          <div className="dashboard-header-bar">
            <div className="header-title">
              <h1>SOS-معاك</h1>
              <p className="header-subtitle">
                "Aucun enfant ne devrait grandir seul" — SOS Tunisie
              </p>
            </div>
          </div>

          <div className="dashboard-body">
            <div className="dashboard-content-area">
              <StatsOverview />
              {renderDashboard()}
            </div>
            <aside className="dashboard-sidebar-right">
              <NotificationsPanel />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
