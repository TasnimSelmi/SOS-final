# SOS Hack for Hope - Fullstack Application

Plateforme digitale interne complète (React + Node.js/Express + MongoDB) pour la protection de l'enfance dans les SOS Villages d'Enfants Tunisie.

## Structure du Projet

```
H4H/
├── sos-backend/              # Backend Node.js + Express + MongoDB
│   ├── models/               # Modèles MongoDB
│   │   ├── User.js          # Utilisateurs (RBAC)
│   │   ├── Report.js        # Signalements
│   │   └── Notification.js  # Notifications
│   ├── routes/              # Routes API REST
│   │   ├── auth.js         # Authentification JWT
│   │   ├── users.js        # CRUD utilisateurs (Admin)
│   │   ├── reports.js      # Gestion signalements
│   │   └── notifications.js # Notifications temps réel
│   ├── middleware/          # Middleware
│   │   ├── auth.js         # JWT + RBAC
│   │   └── upload.js       # Upload fichiers (Multer)
│   ├── server.js           # Point d'entrée serveur
│   ├── package.json
│   └── .env.example
│
└── hack-for-hope/            # Frontend React + Vite
    ├── src/
    │   ├── components/       # Composants React
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Header.jsx
    │   │   ├── SOSLogo.jsx
    │   │   ├── SOSIcons.jsx
    │   │   ├── SOSCard.jsx
    │   │   ├── SOSChart.jsx
    │   │   ├── SOSDecorations.jsx
    │   │   ├── Level1Dashboard.jsx
    │   │   ├── Level2Dashboard.jsx
    │   │   └── Level3Dashboard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   └── api.js        # API calls (axios)
    │   ├── pages/            # Pages
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    └── .env.example
```

## Charte Graphique SOS

| Élément | Valeur |
|---------|--------|
| Bleu primaire | `#0066FF` |
| Bleu foncé | `#1c325d` |
| Rose accent | `#FF006E` |
| Bleu clair | `#E6F0FF` |
| Police | Inter (fallback system) |
| Slogan | "WE CAN, WE DO, WITH love" |

## Hiérarchie des Rôles (RBAC)

| Niveau | Rôle | Fonctionnalités |
|--------|------|-----------------|
| 1 | Déclarant (Mère/Tante/Éducateur) | Créer signalement, ajouter pièces jointes, voir ses signalements |
| 2 | Analyse (Psychologue) | Dashboard avec filtres, classifier, assigner, workflow 6 étapes |
| 3 | Gouvernance (Directeur/Admin) | Vue globale stats, décisions valider/clôturer, CRUD utilisateurs |

## Installation & Démarrage

### Prérequis
- Node.js v18+
- MongoDB (local ou MongoDB Atlas)
- npm ou yarn

### 1. Backend (Node.js + Express + MongoDB)
```bash
cd sos-backend
npm install

# Créer le fichier .env
cp .env.example .env
# Éditer .env avec votre configuration MongoDB

npm run dev
# API disponible sur: http://localhost:5000
```

### 2. Frontend (React + Vite)
```bash
# Dans un nouveau terminal
cd hack-for-hope
npm install

# Créer le fichier .env
cp .env.example .env

npm run dev
# Application disponible sur: http://localhost:5173
```

## Technologies Stack

### Frontend
- **React 18** avec hooks et context API
- **Vite** pour le build rapide
- **React Router DOM** pour la navigation
- **Axios** pour les requêtes HTTP

### Backend
- **Node.js** + **Express** pour l'API REST
- **MongoDB** + **Mongoose** pour la base de données
- **JWT** pour l'authentification sécurisée
- **Multer** pour l'upload de fichiers
- **Helmet** + **CORS** pour la sécurité

### Sécurité
- Authentification JWT avec expiration
- RBAC (Role-Based Access Control)
- Rate limiting et data sanitization
- Validation des uploads (15MB max, types autorisés)

## Fonctionnalités Implémentées

### Authentification & Sécurité
✅ Authentification JWT avec tokens sécurisés  
✅ RBAC 3 niveaux hiérarchiques (Déclarant/Analyste/Admin)  
✅ CRUD utilisateurs (Admin uniquement)  
✅ Changement et réinitialisation de mot de passe  

### Gestion des Signalements
✅ Création de signalements avec pièces jointes (Niveau 1)  
✅ Classification des signalements (Niveau 2)  
✅ Assignation aux analystes  
✅ Workflow 6 étapes avec suivi  
✅ Prise de décision et clôture (Niveau 3)  
✅ Historique complet des actions  

### Système de Notifications
✅ Notifications temps réel  
✅ Alertes pour nouveaux signalements  
✅ Rappels de délais  
✅ Marquage comme lu/non lu  

### Interface Utilisateur
✅ Design moderne avec charte SOS  
✅ Dashboard adaptatif par rôle  
✅ Upload sécurisé de fichiers (PDF, images, audio, vidéo)  
✅ Responsive design  

### API REST Complète
✅ Endpoints auth (/api/auth)  
✅ Endpoints utilisateurs (/api/users)  
✅ Endpoints signalements (/api/reports)  
✅ Endpoints notifications (/api/notifications)
