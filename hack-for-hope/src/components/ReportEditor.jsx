import React, { useState } from "react";
import "./ReportEditor.css";
import { SOSIcons } from "./SOSIcons";

const REPORT_TEMPLATES = {
  fiche_initiale: {
    title: "Fiche Initiale de Signalement",
    sections: [
      {
        label: "Informations du Signalant",
        placeholder: "Nom, contact, relation avec l'enfant...",
      },
      {
        label: "Informations de l'Enfant",
        placeholder: "Nom, âge, lieu de résidence...",
      },
      {
        label: "Nature du Signalement",
        placeholder: "Description détaillée des faits observés ou rapportés...",
      },
      {
        label: "Circonstances",
        placeholder: "Quand, où, comment les faits se sont produits...",
      },
      {
        label: "Témoins ou Preuves",
        placeholder:
          "Personnes présentes, documents, photos (si applicable)...",
      },
      {
        label: "État de l'Enfant",
        placeholder: "État physique, psychologique observé...",
      },
      {
        label: "Urgence",
        placeholder: "Évaluation du niveau de danger immédiat...",
      },
      {
        label: "Actions Immédiates",
        placeholder: "Mesures prises immédiatement après le signalement...",
      },
    ],
  },
  rapport_dpe: {
    title: "Rapport DPE - Document de Protection de l'Enfant",
    sections: [
      {
        label: "Résumé Exécutif",
        placeholder: "Synthèse des éléments clés du cas...",
      },
      {
        label: "Évaluation du Risque",
        placeholder: "Analyse détaillée des risques pour l'enfant...",
      },
      {
        label: "Contexte Familial",
        placeholder: "Situation familiale, dynamiques, ressources...",
      },
      {
        label: "Historique Pertinent",
        placeholder: "Événements antérieurs, signalements précédents...",
      },
      {
        label: "Besoins Identifiés",
        placeholder: "Besoins immédiats et à long terme de l'enfant...",
      },
      {
        label: "Recommandations Initiales",
        placeholder: "Premières recommandations d'intervention...",
      },
      {
        label: "Plan de Sécurité",
        placeholder: "Mesures pour assurer la sécurité immédiate...",
      },
      {
        label: "Suivi Proposé",
        placeholder: "Étapes suivantes et échéancier proposé...",
      },
    ],
  },
  evaluation_complete: {
    title: "Évaluation Psychosociale Complète",
    sections: [
      {
        label: "Méthodologie",
        placeholder: "Outils utilisés, entretiens menés, observations...",
      },
      {
        label: "Profil Psychologique",
        placeholder: "État émotionnel, comportemental, développemental...",
      },
      {
        label: "Évaluation Sociale",
        placeholder: "Environnement social, scolaire, récréatif...",
      },
      {
        label: "Relations Familiales",
        placeholder: "Qualité des liens, attachement, communication...",
      },
      {
        label: "Facteurs de Protection",
        placeholder: "Ressources, forces, soutiens disponibles...",
      },
      {
        label: "Facteurs de Risque",
        placeholder: "Vulnérabilités, dangers persistants...",
      },
      {
        label: "Diagnostic Préliminaire",
        placeholder: "Impressions cliniques, diagnostic si applicable...",
      },
      {
        label: "Conclusions",
        placeholder: "Synthèse de l'évaluation et perspectives...",
      },
    ],
  },
  plan_action: {
    title: "Plan d'Action Détaillé",
    sections: [
      {
        label: "Objectifs Généraux",
        placeholder: "Buts principaux de l'intervention...",
      },
      {
        label: "Objectifs Spécifiques",
        placeholder: "Objectifs mesurables et atteignables...",
      },
      {
        label: "Interventions Prévues",
        placeholder: "Actions concrètes à entreprendre...",
      },
      {
        label: "Responsabilités",
        placeholder: "Qui fait quoi, rôles des intervenants...",
      },
      { label: "Échéancier", placeholder: "Timeline avec jalons et délais..." },
      {
        label: "Ressources Mobilisées",
        placeholder: "Ressources humaines, matérielles, financières...",
      },
      {
        label: "Indicateurs de Succès",
        placeholder: "Critères pour évaluer la progression...",
      },
      {
        label: "Plan de Contingence",
        placeholder: "Actions alternatives si nécessaire...",
      },
    ],
  },
  rapport_suivi: {
    title: "Rapport de Suivi",
    sections: [
      { label: "Période Couverte", placeholder: "Du ... au ..." },
      {
        label: "Interventions Réalisées",
        placeholder: "Actions menées durant cette période...",
      },
      {
        label: "Observations",
        placeholder: "Changements observés, évolution de la situation...",
      },
      {
        label: "Progression",
        placeholder: "Avancement par rapport aux objectifs...",
      },
      {
        label: "Défis Rencontrés",
        placeholder: "Obstacles, difficultés, résistances...",
      },
      {
        label: "Ajustements Effectués",
        placeholder: "Modifications au plan d'action...",
      },
      {
        label: "Prochaines Étapes",
        placeholder: "Actions prévues pour la période suivante...",
      },
      {
        label: "Recommandations",
        placeholder: "Suggestions pour améliorer l'intervention...",
      },
    ],
  },
  rapport_final: {
    title: "Rapport Final de Synthèse",
    sections: [
      {
        label: "Résumé du Cas",
        placeholder: "Vue d'ensemble du parcours de l'enfant...",
      },
      {
        label: "Interventions Réalisées",
        placeholder: "Récapitulatif de toutes les actions menées...",
      },
      {
        label: "Résultats Obtenus",
        placeholder: "Atteinte des objectifs, changements mesurables...",
      },
      {
        label: "Évolution de l'Enfant",
        placeholder: "Progression psychosociale de l'enfant...",
      },
      {
        label: "Analyse Critique",
        placeholder: "Ce qui a fonctionné, ce qui pourrait être amélioré...",
      },
      {
        label: "Impact de l'Intervention",
        placeholder: "Effets observés sur l'enfant et son environnement...",
      },
      {
        label: "Recommandations Finales",
        placeholder: "Suggestions pour le suivi post-clôture...",
      },
      {
        label: "Proposition de Clôture",
        placeholder: "Justification de la clôture du dossier...",
      },
    ],
  },
  avis_cloture: {
    title: "Avis de Clôture",
    sections: [
      {
        label: "Justification",
        placeholder: "Raisons de la clôture du dossier...",
      },
      {
        label: "Objectifs Atteints",
        placeholder: "Récapitulatif des objectifs réalisés...",
      },
      {
        label: "État Final",
        placeholder: "Situation actuelle de l'enfant et de sa famille...",
      },
      {
        label: "Recommandations Post-Clôture",
        placeholder: "Suivi léger, ressources communautaires...",
      },
      {
        label: "Conditions de Réouverture",
        placeholder: "Circonstances justifiant une réouverture...",
      },
      {
        label: "Archivage",
        placeholder: "Dispositions pour l'archivage sécurisé...",
      },
      {
        label: "Notifications",
        placeholder: "Parties à informer de la clôture...",
      },
      { label: "Validation", placeholder: "Approbation du décideur..." },
    ],
  },
};

export default function ReportEditor({
  reportId,
  stepNumber,
  onSave,
  onClose,
}) {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleTemplateSelect = (templateKey) => {
    const template = REPORT_TEMPLATES[templateKey];
    setSelectedTemplate(templateKey);
    setTitle(template.title);
    setSections(template.sections.map((s) => ({ ...s, content: "" })));
  };

  const handleSectionChange = (index, content) => {
    const newSections = [...sections];
    newSections[index].content = content;
    setSections(newSections);
  };

  const handleSave = async () => {
    if (!title || sections.some((s) => !s.content || s.content.trim() === "")) {
      alert("Veuillez remplir tous les champs du rapport");
      return;
    }

    // Compile content
    const fullContent = sections
      .map((s) => `### ${s.label}\n\n${s.content}\n\n`)
      .join("");

    const reportData = {
      type: selectedTemplate,
      title,
      content: fullContent,
      attachments,
    };

    setSaving(true);
    try {
      await onSave(reportData);
      alert("Rapport enregistré avec succès");
      onClose();
    } catch (error) {
      alert("Erreur lors de l'enregistrement du rapport");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="report-editor-overlay" onClick={onClose}>
      <div className="report-editor-modal" onClick={(e) => e.stopPropagation()}>
        <div className="report-editor-header">
          <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <SOSIcons.Writing size={24} color="#00abec" />
            Rédaction de Rapport Confidentiel
          </h2>
          <button className="close-btn" onClick={onClose}>
            <SOSIcons.Close size={24} />
          </button>
        </div>

        {!selectedTemplate ? (
          <div className="template-selector">
            <h3>Sélectionnez un type de document</h3>
            <div className="templates-grid">
              {Object.entries(REPORT_TEMPLATES).map(([key, template]) => (
                <div
                  key={key}
                  className="template-card"
                  onClick={() => handleTemplateSelect(key)}
                >
                  <SOSIcons.Document size={32} />
                  <h4>{template.title}</h4>
                  <p>{template.sections.length} sections</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="report-editor-content">
            <div className="report-title-section">
              <label>Titre du Document</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="report-title-input"
                placeholder="Titre du document..."
              />
            </div>

            <div className="report-sections">
              {sections.map((section, index) => (
                <div key={index} className="report-section">
                  <label className="section-label">
                    <SOSIcons.Edit size={16} />
                    {section.label}
                  </label>
                  <textarea
                    value={section.content}
                    onChange={(e) => handleSectionChange(index, e.target.value)}
                    placeholder={section.placeholder}
                    rows="6"
                    className="section-textarea"
                  />
                </div>
              ))}
            </div>

            <div className="attachments-section">
              <h4
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <SOSIcons.Paperclip size={18} color="#00abec" />
                Pièces jointes (optionnel)
              </h4>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => setAttachments(Array.from(e.target.files))}
                className="file-input"
                id="report-attachments"
              />
              <label htmlFor="report-attachments" className="file-input-label">
                <SOSIcons.Upload size={20} />
                Ajouter des fichiers
              </label>
              {attachments.length > 0 && (
                <div className="attachments-list">
                  <p>{attachments.length} fichier(s) sélectionné(s)</p>
                  <ul>
                    {attachments.map((file, idx) => (
                      <li key={idx}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="editor-actions">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedTemplate("");
                  setSections([]);
                }}
              >
                ← Changer de modèle
              </button>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleSave}
                disabled={saving}
              >
                <SOSIcons.Save size={20} />
                {saving ? "Enregistrement..." : "Enregistrer le rapport"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
