<template>
  <footer class="main-footer">
    <div class="footer-container">
      <div class="footer-section about-section">
        <h4>À propos</h4>
        <p>
          VueSphere est une plateforme communautaire dédiée aux développeurs **Vue.js**. Rejoignez notre forum, partagez vos idées, et progressez avec nous.
        </p>
      </div>

      <div class="footer-section">
        <h4>Navigation</h4>
        <ul>
          <li><RouterLink to="/">Accueil</RouterLink></li>
          <li><RouterLink to="/forum">Forum</RouterLink></li>
          <li><RouterLink to="/about">À propos</RouterLink></li>
          <li><RouterLink to="/contact">Contact</RouterLink></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>Légal</h4>
        <ul>
          <li><RouterLink to="/privacy">Politique de confidentialité</RouterLink></li>
          <li><RouterLink to="/terms">Conditions d'utilisation</RouterLink></li>
          <li><RouterLink to="/cookies">Politique de cookies</RouterLink></li>
        </ul>
      </div>

      <div class="footer-section contact-section">
        <h4>Contact</h4>
        <ul>
          <li>**Email** : <a href="mailto:support@vuesphere.com">support@vuesphere.com</a></li>
          <li>**Téléphone** : +33 1 23 45 67 89</li>
          <li>**Adresse** : 123 Rue Vue, Paris, France</li>
        </ul>
      </div>
      
      <div class="footer-bottom">
        <div class="social-links">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12C0 17.387 3.438 21.868 8.205 23.479C8.799 23.585 9.027 23.224 9.027 22.925C9.027 22.656 9.017 21.751 9.014 20.812C5.602 21.503 4.862 19.336 4.862 19.336C4.301 17.915 3.518 17.551 3.518 17.551C2.449 16.819 3.593 16.833 3.593 16.833C4.787 16.912 5.419 17.949 5.419 17.949C6.467 19.712 8.172 19.227 8.943 18.948C9.049 18.239 9.331 17.763 9.641 17.502C6.913 17.202 4.053 16.142 4.053 11.411C4.053 10.117 4.501 9.046 5.234 8.196C5.101 7.892 4.708 6.772 5.337 5.176C5.337 5.176 6.307 4.863 9.006 6.711C9.919 6.463 10.877 6.339 11.838 6.339C12.799 6.339 13.757 6.463 14.67 6.711C17.369 4.863 18.339 5.176 18.339 5.176C18.968 6.772 18.575 7.892 18.442 8.196C19.175 9.046 19.623 10.117 19.623 11.411C19.623 16.153 16.759 17.209 14.022 17.50C14.477 17.899 14.896 18.667 14.896 19.866C14.896 21.571 14.881 22.915 14.881 23.224C14.881 23.526 15.106 23.882 15.707 23.775C20.477 22.169 23.913 17.689 23.913 12C24 5.373 18.627 0 12 0Z"/></svg>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.46 6C21.687 6.356 20.865 6.591 20 6.685C20.889 6.168 21.572 5.334 21.898 4.318C21.052 4.809 20.106 5.161 19.102 5.352C18.271 4.453 17.075 4 15.766 4C13.292 4 11.278 6.014 11.278 8.488C11.278 8.847 11.317 9.199 11.393 9.539C7.579 9.358 4.254 7.558 2.072 4.79C1.676 5.487 1.444 6.31 1.444 7.182C1.444 8.799 2.278 10.219 3.524 11.054C2.766 11.029 2.052 10.828 1.447 10.495C1.447 10.511 1.447 10.526 1.447 10.542C1.447 12.761 3.067 14.625 5.176 15.04C4.789 15.146 4.387 15.201 3.978 15.201C3.693 15.201 3.417 15.183 3.149 15.127C3.725 16.942 5.429 18.257 7.429 18.295C5.876 19.46 3.931 20.158 1.838 20.158C1.488 20.158 1.144 20.138 0.803 20.096C2.859 21.439 5.239 22.158 7.78 22.158C15.753 22.158 20.147 15.539 20.147 9.873C20.147 9.689 20.143 9.508 20.135 9.328C20.985 8.724 21.728 8.01 22.46 7.182V6Z"/></svg>
          </a>
          </div>
        <p class="copyright">
          &copy; {{ new Date().getFullYear() }} **VueSphere**. Tous droits réservés.
        </p>
      </div>
    </div>
  </footer>
</template>
<style scoped>

/* --- Footer Global --- */
.main-footer {
 
  background-color: var(--bg-color-light, #f8f9fa); 
  padding: 3rem 0;
  font-size: 0.9rem;
  color: var(--text-color-dark, #333); 
}

/* --- Conteneur Principal (grille) --- */
.footer-container {
  max-width: 1200px; /* Taille de votre conteneur global */
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2.5rem; /* Espace plus généreux entre les colonnes */
}

/* --- Sections (colonnes) --- */
.footer-section {
  flex: 1 1 220px; /* Plus grand pour l'espace */
  min-width: 180px; /* Minimum de 180px pour les petites sections */
}

.about-section {
  flex: 1 1 250px; /* Un peu plus d'espace pour la section À propos */
}

.footer-section h4 {
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
  font-weight: 600;
  color: var(--text-color-dark, #333);
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 0.7rem;
  line-height: 1.4;
}

/* --- Liens --- */
.footer-section a, 
.footer-section p {
  color: var(--text-muted, #6c757d);
  text-decoration: none;
}

.footer-section a:hover {
  color: var(--text-color-light, #007bff);
  text-decoration: underline;
}

/* --- Partie du bas (Copyright et Sociaux) --- */
.footer-bottom {
  width: 100%;
  margin-top: 3rem;
  /* Utilise une couleur de bordure plus neutre ou basée sur une variable */
  border-top: 1px solid rgba(0, 0, 0, 0.1); 
  padding-top: 1.5rem;
  text-align: center;
}

.copyright {
  color: var(--text-muted, #6c757d);
}

/* --- Liens Sociaux --- */
.social-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.social-links svg {
  width: 24px;
  height: 24px;
  /* Assurez-vous que le fill utilise la même variable que les autres textes muted */
  fill: var(--text-muted, #6c757d); 
  transition: transform 0.3s ease, fill 0.3s ease;
}

.social-links a:hover svg {
  transform: translateY(-3px);
  fill: #00c6ff; /* Couleur Vue.js/claire pour le hover */
}

/* --- Réactivité (Mobile) --- */
@media (max-width: 992px) {
  .footer-container {
    /* Maintient les sections en grille sur tablette, mais avec moins d'espace */
    justify-content: space-around;
  }
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.5rem; /* Réduit l'espace vertical entre les sections */
  }

  .footer-section {
    flex: 1 1 100%; /* Prend toute la largeur */
    min-width: unset;
  }

  .footer-section ul {
    margin-bottom: 1rem;
  }
}
</style>