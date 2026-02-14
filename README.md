# Hack for Hope - SOS Villages d'Enfants

Plateforme digitale interne pour la protection de l'enfance dans les SOS Villages d'Enfants Tunisie.

## Structure du Projet

```
H4H/
├── hack-for-hope/              # Frontend React
│   ├── src/
│   │   ├── components/        # Composants React
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── SOSLogo.jsx         # Logo officiel
│   │   │   ├── SOSIcons.jsx        # Icônes SOS (Village, Family, etc.)
│   │   │   ├── SOSCard.jsx          # Cartes brandées
│   │   │   ├── SOSChart.jsx         # Graphiques (barres, lollipop, pictogram)
│   │   │   ├── SOSDecorations.jsx   # J-shape, three lines
│   │   │   ├── Level1Dashboard.jsx
│   │   │   ├── Level2Dashboard.jsx
│   │   │   └── Level3Dashboard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # JWT auth
│   │   ├── services/
│   │   │   └── api.js              # API calls
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
│
└── hack-for-hope-api/         # Backend Node.js
    ├── routes/
    │   ├── auth.js            # Authentification RBAC
    │   ├── reports.js         # CRUD signalements
    │   └── upload.js          # Upload fichiers
    ├── server.js
    └── package.json
```

## Charte Graphique SOS

| Élément | Valeur |
|---------|--------|
| Bleu primaire | `#00abec` |
| Bleu foncé | `#1c325d` |
| Rose accent | `#de5a6c` |
| Bleu clair | `#e8f7fc` |
| Police | Inter (fallback Aktiv Grotesk) |
| Slogan | "WE CAN, WE DO, WITH love" |

## Hiérarchie des Rôles (RBAC)

| Niveau | Rôle | Fonctionnalités |
|--------|------|-----------------|
| 1 | Déclarant | Créer signalement, voir ses signalements |
| 2 | Analyse | Dashboard, traiter cas, workflow 6 étapes |
| 3 | Gouvernance | Vue globale, décisions, archives |

## Installation

### Frontend
```bash
cd hack-for-hope
npm install
npm run dev
# Accès: http://localhost:5173
```

### Backend
```bash
cd hack-for-hope-api
npm install
npm run dev
# API: http://localhost:3001
```

## Technologies

- **Frontend**: React 18, Vite, CSS3
- **Backend**: Node.js, Express, JWT
- **API**: RESTful avec axios
- **Charte**: 100% SOS Brand Guidelines

## Fonctionnalités Implémentées

✅ Authentification JWT + context React  
✅ RBAC 3 niveaux hiérarchiques  
✅ Formulaire création signalement (Niveau 1) + API  
✅ Dashboard Analyste (Niveau 2) + Workflow 6 étapes  
✅ Vue Gouvernance (Niveau 3)  
✅ Composants SOS Brand: Logo, Icons, Cards, Charts  
✅ Éléments décoratifs: J-shape, three lines, speech bubbles  
✅ Upload fichiers sécurisé  
✅ API REST complète (auth, reports, upload)
