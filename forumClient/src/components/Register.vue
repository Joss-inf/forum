<template>
  <div class="register-view">
    <div class="form-card reveal-item">
      <div class="illustration-side">
        <!-- Une illustration SVG abstraite ou un dégradé dynamique -->
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="register-illustration">
          <defs>
            <linearGradient id="gradient-form" x1="100" y1="0" x2="100" y2="200" gradientUnits="userSpaceOnUse">
              <stop stop-color="#8E24AA"/>
              <stop offset="1" stop-color="#4CAF50"/>
            </linearGradient>
            <linearGradient id="gradient-circle" x1="50" y1="0" x2="150" y2="200" gradientUnits="userSpaceOnUse">
              <stop stop-color="#AEEA00"/>
              <stop offset="1" stop-color="#1DE9B6"/>
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="80" fill="url(#gradient-form)" opacity="0.8"/>
          <circle cx="70" cy="70" r="30" fill="url(#gradient-circle)" opacity="0.6" class="floating-element"/>
          <path d="M120 120L150 150L120 180L90 150L120 120Z" fill="white" opacity="0.05" class="floating-element delay-1"/>
          <path d="M50 80L80 50L110 80L80 110L50 80Z" fill="white" opacity="0.05" class="floating-element delay-2"/>
        </svg>
        <h2>Rejoignez VueSphere</h2>
        <p>Découvrez une communauté passionnée de développeurs Vue.js. Apprenez, partagez, innovez !</p>
      </div>
      <div class="form-side">
        <h1 class="form-title">Créez votre compte</h1>
        <p class="form-subtitle">Commencez votre aventure Vue.js dès aujourd'hui.</p>

        <form @submit.prevent="register">
          <div class="input-group">
            <label for="name" class="sr-only">Nom complet</label>
            <input id="name" v-model="form.name" type="text" placeholder="Nom complet" required />
          </div>
          <div class="input-group">
            <label for="email" class="sr-only">Adresse email</label>
            <input id="email" v-model="form.email" type="email" placeholder="Adresse email" required />
          </div>
          <div class="input-group">
            <label for="password" class="sr-only">Mot de passe</label>
            <input id="password" v-model="form.password" type="password" placeholder="Mot de passe" required />
          </div>
          <button type="submit" class="submit-button">S’inscrire</button>
        </form>

        <p class="footer-text">
          Tu as déjà un compte ? <RouterLink to="/login">Connecte-toi</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router'; // Assurez-vous d'importer RouterLink

defineOptions({
  name: 'UserRegister'
});

const form = reactive({
  name: '',
  email: '',
  password: '',
});

const register = () => {
  console.log('Infos du formulaire :', form);
  // Ici, vous intégreriez votre logique d'appel API
  // Exemple:
  // fetch('/api/register', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(form)
  // })
  // .then(response => response.json())
  // .then(data => {
  //   if (data.success) {
  //     console.log('Inscription réussie', data);
  //     // Rediriger ou afficher un message de succès
  //   } else {
  //     console.error('Erreur d\'inscription', data);
  //     // Afficher un message d'erreur
  //   }
  // })
  // .catch(error => {
  //   console.error('Erreur réseau ou serveur', error);
  // });
};

// Intersection Observer pour les animations au scroll (si la page contient d'autres éléments)
const setupIntersectionObserver = () => {
  const revealElements = document.querySelectorAll('.reveal-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target); // Animer une seule fois
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px'
  });

  revealElements.forEach(el => observer.observe(el));
  return observer;
};

let observerInstance: IntersectionObserver | null = null;

onMounted(() => {
  observerInstance = setupIntersectionObserver();
});

onUnmounted(() => {
  if (observerInstance) {
    observerInstance.disconnect();
  }
});
</script>

<style scoped>
/* Variables CSS */
:root {
  --primary-gradient: linear-gradient(45deg, #4CAF50, #8E24AA); /* Vert à Violet */
  --accent-color-light: #1DE9B6; /* Cyan */
  --text-color-dark: #1e1e1e;
  --text-color-light: #f5f5f5;
  --bg-form: rgba(255, 255, 255, 0.2); /* Pour Glassmorphism sur la card */
  --border-color-form: rgba(255, 255, 255, 0.3);
  --input-bg-color: rgba(255, 255, 255, 0.7);
  --input-border-color: rgba(0, 0, 0, 0.1);
  --input-focus-border: #8E24AA;
  --shadow-card: 0 10px 40px rgba(0, 0, 0, 0.15);
  --transition-speed: 0.3s;
  --border-radius-large: 20px;
  --border-radius-input: 10px;
}

/* Base styles */
.register-view {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #c2e9fb, #a1c4fd); /* Beau dégradé de fond */
  padding: 2rem;
  overflow: hidden; /* Empêche le débordement des éléments flottants */
}

/* Form Card Container (Split Layout) */
.form-card {
  display: flex;
  background: var(--bg-form); /* Glassmorphism background */
  backdrop-filter: blur(25px); /* Stronger blur for glass effect */
  border: 1px solid var(--border-color-form);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-card);
  overflow: hidden; /* Important pour les bords arrondis internes */
  max-width: 900px; /* Grande carte */
  width: 100%;
  animation: fadeInZoom 0.6s ease-out forwards; /* Animation au chargement */
}

/* Animation au chargement de la carte */
@keyframes fadeInZoom {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Illustration Side (Left) */
.illustration-side {
  flex: 1;
  background: var(--primary-gradient); /* Dégradé vibrant */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: var(--text-color-light);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.illustration-side::before {
  content: '';
  position: absolute;
  top: -20%;
  left: -20%;
  width: 140%;
  height: 140%;
  background: rgba(255, 255, 255, 0.05); /* Overlay subtil */
  transform: rotate(20deg);
  pointer-events: none;
}

.register-illustration {
  width: 150px;
  height: auto;
  margin-bottom: 2rem;
  filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2));
}

.floating-element {
  animation: floatUp 8s ease-in-out infinite alternate;
}
.floating-element.delay-1 { animation-delay: 1s; }
.floating-element.delay-2 { animation-delay: 2s; }

@keyframes floatUp {
  0% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
  50% { transform: translateY(-10px) rotate(5deg); opacity: 0.8; }
  100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
}

.illustration-side h2 {
  font-size: 2.2rem;
  font-family: 'Poppins', sans-serif;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.illustration-side p {
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 300px;
  margin: 0 auto;
  color: var(--text-color-light); /* Assurez-vous que le texte est clair */
}

/* Form Side (Right) */
.form-side {
  flex: 1;
  background-color: var(--text-color-light); /* Fond blanc pur pour le formulaire */
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.form-title {
  font-size: 2.5rem;
  color: var(--text-color-dark);
  margin-bottom: 0.5rem;
}

.form-subtitle {
  font-size: 1.1rem;
  color: rgba(30, 30, 30, 0.7);
  margin-bottom: 2rem;
}

/* Form Inputs */
.input-group {
  margin-bottom: 1.2rem;
  text-align: left; /* Pour que les labels soient alignés à gauche */
}

input {
  display: block;
  width: 100%;
  padding: 1rem 1.2rem;
  border: 1px solid var(--input-border-color);
  border-radius: var(--border-radius-input);
  font-size: 1rem;
  color: var(--text-color-dark);
  background-color: var(--input-bg-color);
  transition: all var(--transition-speed) ease;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05); /* Effet neumorphism léger */
}

input::placeholder {
  color: rgba(30, 30, 30, 0.4);
}

input:focus {
  outline: none;
  border-color: var(--input-focus-border);
  box-shadow: 0 0 0 3px rgba(142, 36, 170, 0.2), inset 0 1px 3px rgba(0, 0, 0, 0.08); /* Glow effect */
  background-color: white; /* Retour au blanc pur au focus */
}

/* Submit Button */
.submit-button {
  width: 100%;
  padding: 1rem 1.5rem;
  background: var(--primary-gradient);
  color: var(--text-color-light);
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 50px; /* Plus arrondi pour un look moderne */
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  margin-top: 1.5rem;
}

.submit-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

/* Footer Text */
.footer-text {
  margin-top: 2rem;
  font-size: 0.95rem;
  color: rgba(30, 30, 30, 0.7);
}

.footer-text a {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
  text-decoration: none;
  position: relative;
}

.footer-text a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  background: var(--primary-gradient);
  transform: scaleX(0); /* Cache la ligne par défaut */
  transform-origin: bottom right;
  transition: transform 0.3s ease-out;
}

.footer-text a:hover::after {
  transform: scaleX(1); /* Affiche la ligne au hover */
  transform-origin: bottom left;
}

/* Screen Reader Only (Accessibility) */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .form-card {
    flex-direction: column; /* Empile les sections verticalement */
    max-width: 500px;
    margin: 1rem;
  }

  .illustration-side {
    padding: 2.5rem 2rem;
    border-bottom-left-radius: 0; /* Pas de coin arrondi en bas à gauche */
    border-bottom-right-radius: 0; /* Pas de coin arrondi en bas à droite */
  }

  .illustration-side h2 {
    font-size: 1.8rem;
  }

  .illustration-side p {
    font-size: 1rem;
  }

  .register-illustration {
    width: 120px;
    margin-bottom: 1.5rem;
  }

  .form-side {
    padding: 2.5rem 2rem;
  }

  .form-title {
    font-size: 2rem;
  }

  .form-subtitle {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .input-group {
    margin-bottom: 1rem;
  }

  .submit-button {
    font-size: 1rem;
    padding: 0.8rem 1rem;
    margin-top: 1rem;
  }

  .footer-text {
    margin-top: 1.5rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .register-view {
    padding: 1rem;
  }

  .form-card {
    border-radius: 12px;
  }

  .illustration-side {
    padding: 2rem 1.5rem;
  }

  .illustration-side h2 {
    font-size: 1.6rem;
  }

  .illustration-side p {
    font-size: 0.9rem;
  }

  .register-illustration {
    width: 100px;
  }

  .form-side {
    padding: 2rem 1.5rem;
  }

  .form-title {
    font-size: 1.8rem;
  }

  .form-subtitle {
    font-size: 0.9rem;
    margin-bottom: 1.2rem;
  }

  input {
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
  }

  .submit-button {
    font-size: 0.95rem;
    padding: 0.75rem 1rem;
  }
}
</style>