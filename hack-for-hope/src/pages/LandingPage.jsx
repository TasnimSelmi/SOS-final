import React from "react";
import { SOSIcons } from "../components/SOSIcons";
import { SOSCard, SOSDataCard, SOSStatCard } from "../components/SOSCard";
import { SOSBarChart, SOSProgressRing } from "../components/SOSChart";
import { SOSDecorations, SOSJShape } from "../components/SOSDecorations";
import SOSLogo from "../components/SOSLogo";
import "./LandingPage.css";

function LandingPage({ onEnterApp }) {
  const impactData = [
    { label: "Livelihood", value1: 85, value2: 92 },
    { label: "Food", value1: 78, value2: 88 },
    { label: "Healthcare", value1: 65, value2: 72 },
    { label: "Education", value1: 55, value2: 60 },
    { label: "Water", value1: 35, value2: 42 },
    { label: "Debt", value1: 25, value2: 30 },
    { label: "Nutrition", value1: 15, value2: 20 },
  ];

  const villages = [
    { name: "Gammarth", children: 120, year: 1985 },
    { name: "Siliana", children: 85, year: 1992 },
    { name: "Mahrès", children: 95, year: 1998 },
    { name: "Akouda", children: 110, year: 2005 },
  ];

  return (
    <div className="landing-page">
      <SOSDecorations showJ={true} showLines={true} showBubble={true} />

      {/* HERO SECTION */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-logo-section">
            <div className="landing-logo-container">
              <SOSLogo size={100} />
            </div>
            <div className="landing-slogan">
              <span className="we-can">WE CAN,</span>
              <span className="we-do">WE DO,</span>
              <span className="with">WITH</span>
              <span className="love">love</span>
            </div>
          </div>

          <h1 className="landing-title">
            SOS Villages d'Enfants <span className="highlight">Tunisie</span>
          </h1>

          <p className="landing-subtitle">
            Œuvrons ensemble pour qu'
            <span className="highlight">aucun enfant</span> ne grandisse seul
          </p>

          <div className="landing-cta">
            <button className="btn btn-primary btn-large" onClick={onEnterApp}>
              <SOSIcons.Village size={24} />
              Accéder à la Plateforme
            </button>
            <button
              className="btn btn-secondary btn-large"
              onClick={() =>
                document
                  .getElementById("about")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              En savoir plus
            </button>
          </div>
        </div>

        <div className="landing-hero-visual">
          <div className="hero-stats">
            <div className="hero-stat-item">
              <SOSProgressRing value={94} size={100} />
              <span>Taux de réussite</span>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SOS TUNISIE */}
      <section id="about" className="landing-section landing-about">
        <div className="landing-container">
          <div className="section-header">
            <SOSIcons.Family size={48} color="#00abec" />
            <h2>À Propos de SOS Tunisie</h2>
          </div>

          <div className="about-grid">
            <SOSCard title="Notre Mission" variant="info">
              <p className="about-text">
                L'Association Tunisienne des Villages d'Enfants SOS est une
                organisation
                <strong> non-gouvernementale à caractère humanitaire</strong>,
                qui prend en charge des enfants sans soutien familial ou en
                danger : orphelins, abandonnés, défavorisés.
              </p>
              <p className="about-text">
                À travers nos <strong>quatre Villages d'Enfants SOS</strong>{" "}
                (Gammarth, Siliana, Mahrès et Akouda), nous contribuons à créer
                un espace familial accueillant dans lequel ces enfants peuvent
                vivre dans la dignité et se développer en tant qu'individus à
                part entière.
              </p>
            </SOSCard>

            <SOSCard title="Notre Vision" variant="success">
              <p className="about-text">
                Nous croyons que{" "}
                <strong>chaque enfant mérite une famille</strong>. Notre vision
                est de garantir que chaque enfant qui ne peut pas grandir avec
                ses parents biologiques reçoive l'amour et le soutien d'une
                famille SOS.
              </p>
              <div className="vision-stats">
                <div className="vision-stat">
                  <SOSIcons.Heart size={32} color="#de5a6c" />
                  <span>4 Villages</span>
                </div>
                <div className="vision-stat">
                  <SOSIcons.Village size={32} color="#00abec" />
                  <span>410+ Enfants</span>
                </div>
                <div className="vision-stat">
                  <SOSIcons.Shield size={32} color="#1c325d" />
                  <span>Depuis 1985</span>
                </div>
              </div>
            </SOSCard>
          </div>
        </div>
      </section>

      {/* NOS VILLAGES */}
      <section className="landing-section landing-villages">
        <div className="landing-container">
          <div className="section-header">
            <SOSIcons.Village size={48} color="#00abec" />
            <h2>Nos 4 Villages d'Enfants</h2>
            <p>Des foyers d'amour et de protection à travers la Tunisie</p>
          </div>

          <div className="villages-grid">
            {villages.map((village, index) => (
              <SOSDataCard
                key={village.name}
                label={`Fondé en ${village.year}`}
                value={village.children}
                unit="enfants"
                icon={SOSIcons.Village}
                variant={index % 2 === 0 ? "info" : "success"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* STATISTIQUES IMPACT */}
      <section className="landing-section landing-stats">
        <div className="landing-container">
          <div className="section-header">
            <h2>Notre Impact</h2>
            <p>Des résultats concrets pour les enfants et les familles</p>
          </div>

          <div className="stats-grid">
            <SOSStatCard
              number="410+"
              label="Enfants pris en charge"
              description="Dans nos 4 villages à travers la Tunisie"
              variant="info"
            />
            <SOSStatCard
              number="94%"
              label="Taux de réussite scolaire"
              description="Nos enfants réussissent brillamment"
              variant="success"
            />
            <SOSStatCard
              number="38"
              label="Années d'engagement"
              description="Depuis notre fondation en 1985"
              variant="warning"
            />
            <SOSStatCard
              number="120+"
              label="Mères SOS"
              description="Des femmes dévouées au service des enfants"
              variant="urgent"
            />
          </div>
        </div>
      </section>

      {/* PROGRAMMES */}
      <section className="landing-section landing-programs">
        <div className="landing-container">
          <div className="section-header">
            <SOSIcons.Plant size={48} color="#00abec" />
            <h2>Nos Programmes</h2>
          </div>

          <div className="programs-grid">
            <SOSCard title="Villages d'Enfants" variant="info">
              <div className="program-icon">
                <SOSIcons.Village size={48} color="#00abec" />
              </div>
              <p>
                Un foyer familial aimant pour les enfants sans soutien parental.
              </p>
            </SOSCard>

            <SOSCard title="Jeunes SOS" variant="success">
              <div className="program-icon">
                <SOSIcons.Family size={48} color="#00abec" />
              </div>
              <p>
                Accompagnement des jeunes vers l'autonomie et l'insertion
                professionnelle.
              </p>
            </SOSCard>

            <SOSCard title="Renforcement Familial" variant="warning">
              <div className="program-icon">
                <SOSIcons.Heart size={48} color="#de5a6c" />
              </div>
              <p>
                Soutien aux familles vulnérables pour prévenir la séparation des
                enfants.
              </p>
            </SOSCard>

            <SOSCard title="SOS Urgences" variant="urgent">
              <div className="program-icon">
                <SOSIcons.Shield size={48} color="#1c325d" />
              </div>
              <p>
                Intervention rapide pour protéger les enfants en situation
                d'urgence.
              </p>
            </SOSCard>
          </div>
        </div>
      </section>

      {/* IMPACT VISUEL - BAR CHART */}
      <section className="landing-section landing-chart">
        <div className="landing-container">
          <div className="section-header">
            <h2>Objectifs de Développement Durable</h2>
            <p>Notre contribution aux ODD de l'ONU</p>
          </div>

          <div className="chart-container">
            <SOSBarChart
              data={impactData}
              title="Impact par secteur (%)"
              barColors={["#1c325d", "#00abec"]}
            />
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="landing-section landing-cta-section">
        <div className="landing-container">
          <div className="cta-content">
            <h2>Rejoignez Notre Mission</h2>
            <p>
              Devenez acteur de la protection de l'enfance en Tunisie. Ensemble,
              nous pouvons faire la différence.
            </p>

            <div className="cta-buttons">
              <button
                className="btn btn-primary btn-large"
                onClick={onEnterApp}
              >
                <SOSIcons.Village size={24} />
                Accéder à SOS-معاك
              </button>
              <a
                href="https://www.sosve.tn/faire-un-don-maintenant/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-pink btn-large"
              >
                <SOSIcons.Heart size={24} />
                Faire un Don
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-content">
            <div className="footer-logo">
              <SOSLogo size={60} />
              <div className="footer-slogan">
                <span>WE CAN,</span>
                <span>WE DO,</span>
                <span>WITH</span>
                <span className="love">love</span>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-section">
                <h4>Nos Villages</h4>
                <ul>
                  <li>Gammarth (1985)</li>
                  <li>Siliana (1992)</li>
                  <li>Mahrès (1998)</li>
                  <li>Akouda (2005)</li>
                </ul>
              </div>

              <div className="footer-section">
                <h4>Contact</h4>
                <ul>
                  <li>Route de la Marsa, Gammarth</li>
                  <li>Tél: +216 71 740 600</li>
                  <li>Email: contact@sos-tunisie.org</li>
                </ul>
              </div>

              <div className="footer-section">
                <h4>Suivez-nous</h4>
                <div className="social-links">
                  <a href="#" className="social-link">
                    Facebook
                  </a>
                  <a href="#" className="social-link">
                    LinkedIn
                  </a>
                  <a href="#" className="social-link">
                    YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 SOS Villages d'Enfants Tunisie. Tous droits réservés.</p>
            <p>SOS-معاك - Plateforme de Protection de l'Enfance</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
