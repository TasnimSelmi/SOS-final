import React from 'react'
import { SOSIcons } from '../components/SOSIcons'
import { SOSCard, SOSStatCard, SOSInfoCard } from '../components/SOSCard'
import { SOSNumberedList } from '../components/SOSChart'
import { SOSDecorations } from '../components/SOSDecorations'
import SOSLogo from '../components/SOSLogo'
import './AboutPage.css'

function AboutPage() {
  const values = [
    {
      title: "Courage",
      description: "Nous prenons des positions et agissons pour les droits des enfants, même face à des obstacles importants."
    },
    {
      title: "Détermination",
      description: "Nous persévérons avec ténacité pour accompagner chaque enfant vers un avenir meilleur."
    },
    {
      title: "Intégrité",
      description: "Nous agissons avec honnêteté, transparence et responsabilité dans tout ce que nous faisons."
    },
    {
      title: "Humilité",
      description: "Nous écoutons, apprenons et travaillons ensemble avec respect et ouverture d'esprit."
    }
  ]

  const timeline = [
    { year: "1985", event: "Fondation du premier village à Gammarth", description: "Début de l'aventure SOS en Tunisie avec l'ouverture du premier village d'enfants." },
    { year: "1992", event: "Ouverture du village de Siliana", description: "Extension vers le centre-ouest de la Tunisie pour plus d'enfants." },
    { year: "1998", event: "Inauguration du village de Mahrès", description: "Nouveau foyer familial dans la région du Sahel." },
    { year: "2005", event: "Lancement du village d'Akouda", description: "Quatrième village pour répondre aux besoins croissants." },
    { year: "2010", event: "Programme Jeunes SOS", description: "Lancement du programme d'accompagnement vers l'autonomie." },
    { year: "2020", event: "Digitalisation des services", description: "Modernisation des outils de protection de l'enfance." }
  ]

  const team = [
    { role: "Mères SOS", count: 120, icon: SOSIcons.Family, description: "Cœur battant de nos villages" },
    { role: "Éducateurs", count: 45, icon: SOSIcons.Village, description: "Accompagnement quotidien" },
    { role: "Psychologues", count: 12, icon: SOSIcons.Heart, description: "Soutien émotionnel" },
    { role: "Administratifs", count: 28, icon: SOSIcons.Document, description: "Gestion des programmes" }
  ]

  return (
    <div className="about-page">
      <SOSDecorations />
      
      {/* HEADER */}
      <header className="page-header">
        <div className="page-header-content">
          <SOSLogo size={60} />
          <h1>À Propos de Nous</h1>
          <p>Découvrez l'histoire et la mission de SOS Villages d'Enfants Tunisie</p>
        </div>
      </header>

      {/* MISSION SECTION */}
      <section className="about-section">
        <div className="about-container">
          <div className="section-title">
            <SOSIcons.Heart size={40} color="#de5a6c" />
            <h2>Notre Mission</h2>
          </div>
          
          <div className="mission-grid">
            <SOSCard title="Ce que nous faisons" variant="info" className="mission-card">
              <p className="mission-text">
                Nous construisons des <strong>familles</strong> pour les enfants qui en ont besoin, 
                les aidons à façonner leur propre avenir et partageons ces développements avec 
                la société dans son ensemble.
              </p>
              <div className="mission-highlight">
                <span className="highlight-number">410+</span>
                <span className="highlight-text">enfants pris en charge dans nos 4 villages</span>
              </div>
            </SOSCard>
            
            <SOSCard title="Pourquoi nous existons" variant="success" className="mission-card">
              <p className="mission-text">
                Chaque enfant a droit à une <strong>famille aimante</strong>, à la sécurité et à 
                l'opportunité de développer son plein potentiel. Nous œuvrons pour que cette 
                vision devienne réalité.
              </p>
              <div className="mission-highlight">
                <span className="highlight-number">38</span>
                <span className="highlight-text">années d'engagement ininterrompu</span>
              </div>
            </SOSCard>
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="about-section about-values">
        <div className="about-container">
          <div className="section-title">
            <SOSIcons.Shield size={40} color="#1c325d" />
            <h2>Nos Valeurs</h2>
          </div>
          
          <div className="values-grid">
            {values.map((value, index) => (
              <SOSCard key={index} title={value.title} variant="info">
                <p>{value.description}</p>
              </SOSCard>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE SECTION */}
      <section className="about-section">
        <div className="about-container">
          <div className="section-title">
            <SOSIcons.Document size={40} color="#00abec" />
            <h2>Notre Histoire</h2>
          </div>
          
          <div className="timeline">
            {timeline.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-year">{item.year}</div>
                <div className="timeline-content">
                  <h4>{item.event}</h4>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="about-section about-team">
        <div className="about-container">
          <div className="section-title">
            <SOSIcons.Family size={40} color="#00abec" />
            <h2>Notre Équipe</h2>
          </div>
          
          <div className="team-grid">
            {team.map((member, index) => (
              <SOSStatCard
                key={index}
                number={member.count}
                label={member.role}
                description={member.description}
                variant={index % 2 === 0 ? 'info' : 'success'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* VILLAGES DETAIL SECTION */}
      <section className="about-section">
        <div className="about-container">
          <div className="section-title">
            <SOSIcons.Village size={40} color="#00abec" />
            <h2>Nos 4 Villages</h2>
          </div>
          
          <div className="villages-detail">
            <div className="village-item">
              <div className="village-icon">
                <SOSIcons.Village size={64} color="#00abec" />
              </div>
              <div className="village-content">
                <h3>Village SOS Gammarth</h3>
                <span className="village-year">Fondé en 1985</span>
                <p>Notre premier village, situé dans la banlieue nord de Tunis. Il accueille 
                120 enfants dans 12 familles SOS, offrant un environnement familial chaleureux 
                et sécurisant.</p>
              </div>
            </div>
            
            <div className="village-item">
              <div className="village-icon">
                <SOSIcons.Village size={64} color="#4ECDC4" />
              </div>
              <div className="village-content">
                <h3>Village SOS Siliana</h3>
                <span className="village-year">Fondé en 1992</span>
                <p>Situé dans le centre-ouest du pays, ce village prend en charge 85 enfants 
                et joue un rôle crucial dans une région rurale où les besoins sont importants.</p>
              </div>
            </div>
            
            <div className="village-item">
              <div className="village-icon">
                <SOSIcons.Village size={64} color="#de5a6c" />
              </div>
              <div className="village-content">
                <h3>Village SOS Mahrès</h3>
                <span className="village-year">Fondé en 1998</span>
                <p>Dans la région du Sahel, ce village accueille 95 enfants et contribue 
                au développement social de la communauté locale.</p>
              </div>
            </div>
            
            <div className="village-item">
              <div className="village-icon">
                <SOSIcons.Village size={64} color="#FFB347" />
              </div>
              <div className="village-content">
                <h3>Village SOS Akouda</h3>
                <span className="village-year">Fondé en 2005</span>
                <p>Notre plus récent village accueille 110 enfants et représente notre 
                engagement continu envers la protection de l'enfance en Tunisie.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS SECTION */}
      <section className="about-section about-partners">
        <div className="about-container">
          <div className="section-title">
            <h2>Nos Partenaires</h2>
            <p>Ensemble pour la protection de l'enfance</p>
          </div>
          
          <div className="partners-grid">
            <div className="partner-category">
              <h4>Partenaires Institutionnels</h4>
              <ul>
                <li>Ministère des Affaires Sociales</li>
                <li>UNICEF Tunisie</li>
                <li>Union Européenne</li>
              </ul>
            </div>
            <div className="partner-category">
              <h4>Entreprises Engagées</h4>
              <ul>
                <li>Tunisie Télécom</li>
                <li>Ooredoo</li>
                <li>BIAT</li>
              </ul>
            </div>
            <div className="partner-category">
              <h4>Réseau International</h4>
              <ul>
                <li>SOS Children's Villages International</li>
                <li>133 pays membres</li>
                <li>550+ villages mondiaux</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="about-container">
          <h2>Vous voulez en savoir plus ?</h2>
          <p>Contactez-nous pour visiter nos villages ou devenir partenaire.</p>
          <button className="btn btn-primary btn-large">
            Nous Contacter
          </button>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
