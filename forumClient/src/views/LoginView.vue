<script setup lang="ts">
import { nextTick, ref } from 'vue';
import type { Ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import BaseInput from '@/components/BaseInput.vue'
import BaseMessageAlert from '@/components/BaseMessageAlert.vue'

const authStore = useAuthStore();
const router = useRouter();
const form = ref({ email: '', password: '' });
const error: Ref<string | null> = ref(null);

async function handleLogin() {
  try {
    error.value = null;
    await authStore.login(form.value);
    await nextTick();
    router.push('/forum'); // Redirige vers le forum après connexion réussie
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Email ou mot de passe incorrect.';
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-form-container">
      <form @submit.prevent="handleLogin" class="auth-form">
        <h1>Connexion</h1>
        <p class="subtitle">Connectez-vous pour accéder à votre espace.</p>
        <BaseInput
          id="email"
          label="Adresse Email"
          type="email"
          v-model="form.email"
          required
          autocomplete="email"
          placeholder="votre.email@example.com"
        />
        <BaseInput
          id="password"
          label="Mot de passe"
          type="password"
          v-model="form.password"
          required
          autocomplete="current-password"
          placeholder="********"
        />
        <BaseMessageAlert :text="error" type="error" />
        <button type="submit" class="submit-button">Se connecter</button>
        <div class="form-links">
          <router-link to="/forgot-password">Mot de passe oublié ?</router-link>
          <router-link to="/register">S'inscrire</router-link>
        </div>
      </form>
    </div>
  </div>
</template>


<style scoped>

/* Styles globaux pour la page (le conteneur principal du composant) */
.auth-page {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
  animation: fadeInBackground 1.5s ease-out forwards; /* Animation d'apparition du fond */
}

@keyframes fadeInBackground {
    from { background-position: 0% 50%; opacity: 0.8; }
    to { background-position: 100% 50%; opacity: 1; }
}

/* Conteneur principal du formulaire */
.auth-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;;
}

/* Style du formulaire lui-même */
.auth-form {
  background: var(--md-sys-color-on-primary);
  padding: 3rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  animation: slideIn 0.8s ease-out forwards; /* Animation d'apparition du formulaire */
  width: 100%;
  max-width: 440px;
}

@keyframes slideIn {
    from { opacity: 0;  }
    to { opacity: 1; }
}



/* Titre du formulaire */
.auth-form h1 {
  font-size: 2.5rem; /* Plus grand et plus impactant */
  font-weight: 700;
  color: var(--primary-color); /* Utilise la couleur primaire */
  margin-bottom: 0.5rem;
  text-align: center;
  letter-spacing: 1px; /* Espacement des lettres pour un look moderne */
}

.auth-form .subtitle {
  font-size: 1rem;
  color: var(--text-color-light);
  margin-bottom: 2rem;
  text-align: center;
}

/* Groupe de champ de saisie */
.form-group {
  margin-bottom: 1.8rem; /* Plus d'espace entre les groupes */
}

/* Bouton de soumission */
.submit-button {
  width: 100%;
  padding: 1.1rem; /* Plus de padding */
  border: none;
  border-radius: 10px; /* Coins plus arrondis */
  background:  #e0e6ed; /* Dégradé pour le bouton */
  color: #7f8c8d;
  font-size: 1.15rem; /* Plus grand */
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.8px; /* Espacement des lettres */
  text-transform: uppercase; /* Texte en majuscules */
  border-radius: 100px;
}

.submit-button:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2); /* Ombre plus prononcée */
  transform: translateY(-3px); /* Effet 3D léger */
}

.submit-button:active {
  transform: translateY(0); /* Retour à la position normale */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Option "mot de passe oublié" et "s'inscrire" */
.form-links {
  margin-top: 2rem;
  text-align: center;
  display: flex; /* Pour aligner les liens */
  justify-content: space-around; /* Pour espacer les liens */
}

.form-links a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.3s, text-decoration 0.3s;
}

.form-links a:hover {
  color: var(--primary-color-dark);
  text-decoration: underline;
}

/* Media queries pour la réactivité */
@media (max-width: 600px) {
  .auth-form {
    padding: 2.5rem 1.5rem;
    border-radius: 12px;
  }
  .auth-form h1 {
    font-size: 2rem;
  }
  .submit-button,
  .form-links a {
    font-size: 0.9rem;
  }
  .submit-button {
    padding: 0.9rem;
  }
  .auth-page {
    padding: 1rem;
  }
}
</style>