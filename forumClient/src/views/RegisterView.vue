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
  error.value = null
  validateAllFields()

  if (!isFormValid.value) return

  try {
    // Appel au store
    await authStore.register(form.value)

    // Vérifie si l'inscription a réussi
    if (authStore.user) {
      await router.push('/login')
    } else {
      error.value = 'Une erreur est survenue lors de l\'inscription.'
    }
  } catch {
    error.value = 'Une erreur inattendue est survenue.'
  }
}


</script>

<template>
  <div class="auth-page">
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
.auth-page {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 10px;
  box-sizing: border-box;
  animation: fadeInBackground 1.5s ease-out forwards; 
}

@keyframes fadeInBackground {
    from { background-position: 0% 50%; opacity: 0.8; }
    to { background-position: 100% 50%; opacity: 1; }
}

.auth-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;;
}

.auth-form {
  background: var(--md-sys-color-surface-bright);
  padding: 3rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  animation: slideIn 0.8s ease-out forwards;
  width: 100%;
  max-width: 440px;
}

@keyframes slideIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.auth-form h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--md-sys-color-primary);
  margin-bottom: 0.5rem;
  text-align: center;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 1rem;
  color: var(--md-sys-color-on-surface-variant);
  margin-bottom: 2rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.8rem;
}

.submit-button {
  width: 100%;
  padding: 1.1rem;
  border: none;
  border-radius: 100px;
  background: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface-variant);
  font-size: 1.15rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.submit-button:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  transform: translateY(-3px);
}

.submit-button:disabled {
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface-variant);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.form-links {
  margin-top: 2rem;
  text-align: center;
  display: flex;
  justify-content: space-around;
}

.form-links a {
  color: var(--md-sys-color-primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.3s, text-decoration 0.3s;
}

.form-links a:hover {
  color: var(--md-sys-color-primary-dark);
  text-decoration: underline;
}

@media (max-width: 600px) {
  .auth-form {
    padding: 2.5rem 1.5rem;
    border-radius: var(--md-sys-shape-corner-medium);
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
}
</style>
