<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useAuthValidation } from '@/composables/useAuthValidation';
import BaseInput from '@/components/BaseInput.vue'
import BaseMessageAlert from '@/components/BaseMessageAlert.vue'

// Initialisation des stores et du routeur
const authStore = useAuthStore();
const router = useRouter();

// Formulaire de données
const form = ref({
  username: '',
  email: '',
  confirmEmail: '',
  password: '',
  confirmPassword: ''
});

// Utilisation du composable de validation
const {
  validationErrors,
  validateUsername,
  validateEmail,
  validateConfirmEmail,
  validatePassword,
  validateConfirmPassword,
  validateAllFields,
  isFormValid
} = useAuthValidation(form);

// Erreur de l'API
const error = ref<string | null>(null);

// --- Gestion de l'inscription ---
async function handleRegister() {
  error.value = null;
  validateAllFields();

  if (!isFormValid.value) {
    return;
  }

  try {
    await authStore.register(form.value);
    await router.push('/login');
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.';
  }
}
</script>

<template>
  <div class="register-wrapper">
    <div class="auth-form-container">
      <form @submit.prevent="handleRegister" class="auth-form">
        <h1>Inscription</h1>

        <BaseInput
          id="username"
          label="Nom d'utilisateur"
          type="text"
          v-model="form.username"
          :error="validationErrors.username"
          required
          autocomplete="username"
          @blur="validateUsername"
        />

        <BaseInput
          id="email"
          label="Adresse Email"
          type="email"
          v-model="form.email"
          :error="validationErrors.email"
          required
          autocomplete="email"
          @blur="validateEmail"
        />

        <BaseInput
          id="confirmEmail"
          label="Confirmer l'Adresse Email"
          type="email"
          v-model="form.confirmEmail"
          :error="validationErrors.confirmEmail"
          required
          autocomplete="email"
          @blur="validateConfirmEmail"
        />

        <BaseInput
          id="password"
          label="Mot de passe"
          type="password"
          v-model="form.password"
          :error="validationErrors.password"
          required
          autocomplete="new-password"
          @blur="validatePassword"
        />

        <BaseInput
          id="confirmPassword"
          label="Confirmer le Mot de passe"
          type="password"
          v-model="form.confirmPassword"
          :error="validationErrors.confirmPassword"
          required
          autocomplete="new-password"
          @blur="validateConfirmPassword"
        />
        <BaseMessageAlert :text="error" type="error" />
        
        <button type="submit" class="submit-button" :disabled="!isFormValid">
          S'inscrire
        </button>
      </form>
    </div>
  </div>
</template>



<style scoped>
.auth-layout {
  display: grid;
  /* Sur grand écran, on a une grille 50/50 */
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

.register-wrapper {
  /* Style pour le conteneur de gauche */
  /* C'est à SideContentRegister de gérer son propre style interne */
  background-color: var(--color-background-alt); /* Un fond subtil */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
  min-height: 100vh;
}

.auth-form-container {
  display: grid;
  place-items: center;
  padding: var(--space-xl);
  width: -moz-available;
  width: -webkit-fill-available;
  width: fill-available;
  background-color: var(--color-background);
}

.auth-form {
  width: 100%;
  max-width: 440px;
  /* On enlève la bordure et l'ombre pour un look plus plat qui s'intègre mieux */
  border: none;
  box-shadow: none;
  background-color: transparent;
}

h1 {
  font-size: 2rem;
  text-align: center;
  margin-bottom: var(--space-xs);
}

.form-subtitle {
  text-align: center;
  color: var(--color-text-muted);
  margin-bottom: var(--space-lg);
}

.submit-button {
  width: 100%;
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  padding-bottom: var(--space-md);
  font-size: 1.1rem;
}

.auth-link {
  text-align: center;
  margin-top: var(--space-lg);
  font-size: 0.95rem;
}

.auth-link a {
  color: var(--color-secondary);
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition-smooth);
}
.auth-link a:hover {
  text-decoration: underline;
}

/* --- Responsive --- */
@media (max-width: 992px) {
  .auth-layout {
    /* Sur petit écran, on passe à une seule colonne */
    grid-template-columns: 1fr;
  }
  
  .side-content-container {
    /* On peut choisir de le cacher sur mobile... */
    display: none; 
    
    /* ...OU de le mettre au-dessus (plus moderne) */
    /* Pour cela, décommentez la ligne ci-dessous et ajustez sa hauteur */
    /* order: -1; min-height: 300px; */
  }

  .auth-form-container {
    /* Le formulaire prend toute la largeur */
    padding: var(--space-lg);
  }
}
</style>