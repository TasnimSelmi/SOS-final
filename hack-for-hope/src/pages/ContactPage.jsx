import React, { useState } from 'react'
import { SOSIcons } from '../components/SOSIcons'
import { SOSCard } from '../components/SOSCard'
import { SOSDecorations } from '../components/SOSDecorations'
import SOSLogo from '../components/SOSLogo'
import './ContactPage.css'

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Message envoyé ! Nous vous répondrons dans les plus brefs délais.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const villages = [
    {
      name: 'Village SOS Gammarth',
      address: 'Route de la Marsa, Gammarth',
      phone: '+216 71 740 600',
      email: 'gammarth@sos-tunisie.org',
      mapLink: 'https://goo.gl/maps/xxxx'
    },
    {
      name: 'Village SOS Siliana',
      address: 'Route de Kairouan, Siliana',
      phone: '+216 78 863 200',
      email: 'siliana@sos-tunisie.org',
      mapLink: 'https://goo.gl/maps/xxxx'
    },
    {
      name: 'Village SOS Mahrès',
      address: 'Avenue Habib Bourguiba, Mahrès',
      phone: '+216 75 360 400',
      email: 'mahres@sos-tunisie.org',
      mapLink: 'https://goo.gl/maps/xxxx'
    },
    {
      name: 'Village SOS Akouda',
      address: 'Route de Sousse, Akouda',
      phone: '+216 73 315 800',
      email: 'akouda@sos-tunisie.org',
      mapLink: 'https://goo.gl/maps/xxxx'
    }
  ]

  return (
    <div className="contact-page">
      <SOSDecorations />
      
      {/* HEADER */}
      <header className="page-header">
        <div className="page-header-content">
          <SOSLogo size={60} />
          <h1>Contactez-Nous</h1>
          <p>Nous sommes à votre écoute</p>
        </div>
      </header>

      {/* CONTACT INFO CARDS */}
      <section className="contact-section">
        <div className="contact-container">
          <div className="section-title">
            <SOSIcons.User size={40} color="#00abec" />
            <h2>Nos Coordonnées</h2>
          </div>
          
          <div className="contact-info-grid">
            <SOSCard title="Siège Social" variant="info">
              <div className="contact-item">
                <SOSIcons.Village size={32} color="#00abec" />
                <div>
                  <p className="contact-label">Adresse</p>
                  <p>Route de la Marsa, Gammarth</p>
                  <p>La Marsa, Tunisie</p>
                </div>
              </div>
            </SOSCard>
            
            <SOSCard title="Téléphone" variant="success">
              <div className="contact-item">
                <SOSIcons.Notification size={32} color="#00abec" />
                <div>
                  <p className="contact-label">Standard</p>
                  <p className="contact-value">+216 71 740 600</p>
                  <p className="contact-note">Lun-Ven, 8h-17h</p>
                </div>
              </div>
            </SOSCard>
            
            <SOSCard title="Email" variant="warning">
              <div className="contact-item">
                <SOSIcons.Document size={32} color="#00abec" />
                <div>
                  <p className="contact-label">Email général</p>
                  <p className="contact-value">contact@sos-tunisie.org</p>
                  <p className="contact-note">Réponse sous 48h</p>
                </div>
              </div>
            </SOSCard>
          </div>
        </div>
      </section>

      {/* VILLAGES CONTACT */}
      <section className="contact-section contact-villages">
        <div className="contact-container">
          <div className="section-title">
            <SOSIcons.Family size={40} color="#00abec" />
            <h2>Contact par Village</h2>
          </div>
          
          <div className="villages-contact-grid">
            {villages.map((village, index) => (
              <SOSCard key={index} title={village.name} variant={index % 2 === 0 ? 'info' : 'success'}>
                <div className="village-contact-details">
                  <div className="village-contact-item">
                    <SOSIcons.Village size={20} />
                    <span>{village.address}</span>
                  </div>
                  <div className="village-contact-item">
                    <SOSIcons.Notification size={20} />
                    <span>{village.phone}</span>
                  </div>
                  <div className="village-contact-item">
                    <SOSIcons.Document size={20} />
                    <span>{village.email}</span>
                  </div>
                  <a href={village.mapLink} target="_blank" rel="noopener noreferrer" className="map-link">
                    Voir sur la carte →
                  </a>
                </div>
              </SOSCard>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="contact-section">
        <div className="contact-container">
          <div className="section-title">
            <SOSIcons.Upload size={40} color="#00abec" />
            <h2>Envoyez-nous un Message</h2>
          </div>
          
          <div className="contact-form-wrapper">
            <SOSCard title="Formulaire de Contact" variant="info">
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nom complet *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      placeholder="Votre nom"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Sujet *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="don">Faire un don</option>
                    <option value="parrainage">Parrainer un enfant</option>
                    <option value="benevolat">Devenir bénévole</option>
                    <option value="visite">Visiter un village</option>
                    <option value="partenariat">Proposer un partenariat</option>
                    <option value="emploi">Offres d'emploi</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                    rows={6}
                    placeholder="Votre message..."
                  />
                </div>
                
                <button type="submit" className="btn btn-primary btn-large">
                  <SOSIcons.Upload size={20} />
                  Envoyer le Message
                </button>
              </form>
            </SOSCard>
          </div>
        </div>
      </section>

      {/* EMERGENCY CONTACT */}
      <section className="contact-section contact-emergency">
        <div className="contact-container">
          <SOSCard title="Contact d'Urgence" variant="urgent">
            <div className="emergency-content">
              <div className="emergency-icon">
                <SOSIcons.Alert size={48} color="#de5a6c" />
              </div>
              <div className="emergency-info">
                <h3>En cas d'urgence concernant un enfant</h3>
                <p>Notre ligne d'urgence est disponible 24h/24, 7j/7 pour les situations 
                critiques concernant la protection de l'enfance.</p>
                <div className="emergency-phone">
                  <SOSIcons.Notification size={24} />
                  <span className="phone-number">+216 71 740 999</span>
                </div>
              </div>
            </div>
          </SOSCard>
        </div>
      </section>

      {/* SOCIAL MEDIA */}
      <section className="contact-section">
        <div className="contact-container">
          <div className="section-title">
            <h2>Suivez-nous sur les Réseaux Sociaux</h2>
          </div>
          
          <div className="social-grid">
            <a href="https://www.facebook.com/SOSTunisie" target="_blank" rel="noopener noreferrer" className="social-card">
              <div className="social-icon facebook">
                <SOSIcons.Family size={32} />
              </div>
              <span>Facebook</span>
            </a>
            <a href="https://www.linkedin.com/company/sos-villages-d-enfants-en-tunisie" target="_blank" rel="noopener noreferrer" className="social-card">
              <div className="social-icon linkedin">
                <SOSIcons.User size={32} />
              </div>
              <span>LinkedIn</span>
            </a>
            <a href="#" className="social-card">
              <div className="social-icon youtube">
                <SOSIcons.Document size={32} />
              </div>
              <span>YouTube</span>
            </a>
            <a href="#" className="social-card">
              <div className="social-icon instagram">
                <SOSIcons.Heart size={32} />
              </div>
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
