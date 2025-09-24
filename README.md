# Forum vuesphere
<img width="1563" height="1221" alt="image" src="https://github.com/user-attachments/assets/8e43d331-de6e-40b5-a34e-2ccb6b8b7ed6" />
<img width="1579" height="1226" alt="image" src="https://github.com/user-attachments/assets/e03f2465-ff6e-4bfb-9546-64951839a617" />
<img width="1573" height="1147" alt="image" src="https://github.com/user-attachments/assets/67bd4a84-4367-416c-a26a-6e98ea8e19f3" />
<img width="1605" height="1229" alt="image" src="https://github.com/user-attachments/assets/3502d799-735a-4fe9-9567-8f12eb3f10fb" />




## projet en chantier 

Bienvenue sur le Forum vuesphere, une plateforme de discussion moderne et interactive construite avec Vue.js 3, Pinia, Axios et un backend robuste basé sur Ultimate Express.

Ce projet vise à offrir une expérience utilisateur fluide et rapide pour la création et la gestion de discussions, de posts et de commentaires.
🚀 Fonctionnalités

    Authentification et Autorisation : Inscription, connexion, déconnexion sécurisées avec gestion des rôles (utilisateur, administrateur) et protection CSRF.

    Gestion des Utilisateurs : Profils utilisateur et potentiellement la modification du mot de passe.

    Création de Posts : Les utilisateurs peuvent créer de nouveaux sujets de discussion avec un titre et un contenu.

    Commentaires : Possibilité de commenter les posts et d'interagir avec d'autres utilisateurs.

    Modération (potentiel) : Extensions futures pour la modération de contenu.

    Architecture Robuste : Séparation claire des responsabilités entre le frontend et le backend, avec une base de données PostgreSQL optimisée.

💻 Technologies Utilisées

Ce projet est une démonstration d'une architecture full-stack moderne.
Frontend (Client)

    Vue.js 3 : Framework JavaScript progressif pour construire des interfaces utilisateur interactives.

    Vite : Outil de build de nouvelle génération, ultra-rapide pour le développement frontend.

    Pinia : Store Vue.js intuitif et léger pour la gestion d'état global de l'application.

    Vue Router : Pour la navigation au sein de l'application monopage (SPA).

    Axios : Client HTTP basé sur les promesses pour effectuer des requêtes vers l'API backend.

Backend (API)

    Ultimate Express : Un framework Express.js avec des utilitaires améliorés pour un développement plus rapide et plus sûr (gestion des erreurs asynchrones, routage simplifié).

    Node.js : Environnement d'exécution JavaScript côté serveur.

    PostgreSQL : Système de gestion de base de données relationnelle puissant et fiable.

    Bcrypt : Pour le hachage sécurisé des mots de passe.

    CORS : Configuration pour permettre les requêtes cross-origin sécurisées depuis le frontend.

    Cookie-parser : Middleware pour l'analyse des en-têtes de cookie.

    Express Rate Limit : Protection contre les attaques de force brute et les abus de l'API.

    Winston (Logger) : Système de log robuste pour le suivi des événements du serveur.

Autres

    TypeScript : Ajoute des types statiques à JavaScript pour une meilleure maintenabilité et moins d'erreurs.

    ESLint / Prettier : Pour maintenir un code propre et cohérent.

⚙️ Configuration du Projet

Suivez ces étapes pour installer et lancer le projet en local.
Prérequis

Assurez-vous d'avoir installé les éléments suivants :

    Node.js (version 18 ou supérieure recommandée)

    npm ou Yarn (gestionnaire de paquets Node.js)

    PostgreSQL (version 12 ou supérieure recommandée)

    Un client PostgreSQL GUI comme pgAdmin ou DBeaver (facultatif mais recommandé pour la gestion de la base de données)

1. Configuration de la Base de Données (PostgreSQL)

    Créez une nouvelle base de données PostgreSQL pour le projet (ex: forum_db).

    Exécutez le script SQL fourni dans database/schema.sql (ou le chemin où vous l'avez enregistré) pour créer les tables nécessaires.

        Vous pouvez utiliser un outil comme pgAdmin/DBeaver : ouvrez un "Query Tool", collez le contenu du script et exécutez-le.

        Ou via la ligne de commande : psql -U <votre_utilisateur_db> -d <votre_nom_de_db> -h localhost -f chemin/vers/schema.sql

2. Configuration du Backend (API)

    Clonez le dépôt :
    code Bash


    
git clone <URL_DU_VOTRE_DEPOT>
cd forum-backend # ou le nom de votre dossier backend

  

Installez les dépendances :
code Bash

    
npm install
# ou
yarn install

  

Créez un fichier .env à la racine du dossier backend et configurez-le comme suit :
code Code

    
PORT=3100
URL=http://localhost:5173 # URL de votre frontend (pour CORS)
COOKIE_SECRET=votre_secret_de_cookie_securise
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<your_db_name>
# Exemple: DATABASE_URL=postgresql://postgres:password@localhost:5432/forum_db

  

Lancez le serveur backend :
code Bash


        
    npm run dev # ou `yarn dev` si vous avez configuré un script `dev`
    # Si non, la commande standard est `npm start` (ou `yarn start`)

      

    Le serveur devrait démarrer sur http://localhost:3100 (ou le port que vous avez spécifié).

3. Configuration du Frontend (Client)

    Naviguez vers le dossier du frontend :
    code Bash


    
cd ../forum-frontend # ou le nom de votre dossier frontend

  

Installez les dépendances :
code Bash


    
npm install
# ou
yarn install

  

Créez un fichier .env à la racine du dossier frontend et configurez-le comme suit :
code Code

    
VITE_API_URL=http://localhost:3100 # L'URL de votre backend

  

Lancez l'application frontend :
code Bash


        
    npm run dev
    # ou
    yarn dev

      

    L'application frontend devrait démarrer sur http://localhost:5173 (ou un autre port par défaut de Vite).

🚀 Utilisation

Une fois que les serveurs backend et frontend sont tous les deux lancés :

    Ouvrez votre navigateur et naviguez vers l'URL de votre frontend (par exemple, http://localhost:5173).

    Vous devriez être accueilli par la page d'accueil du forum.

    Inscrivez-vous, connectez-vous, créez des posts et interagissez avec les commentaires !
