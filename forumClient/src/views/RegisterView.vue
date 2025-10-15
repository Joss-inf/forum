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
.register-wrapper{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-self: center;
  flex-direction: row-reverse;
}
.auth-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  min-width: 50vw;
  padding: 2rem;
  box-sizing: border-box;
  animation: fadeInBackground 1.5s ease-out forwards;
  order: 1;
}

@keyframes fadeInBackground {
  from { background-position: 0% 50%; opacity: 0.8; }
  to { background-position: 100% 50%; opacity: 1; }
}



.auth-form {
   background: var(--md-sys-color-on-primary);
  padding: 3rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  animation: slideIn 0.8s ease-out forwards;
  width: 100vw;
  max-width: 440px;
}

@keyframes slideIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.auth-form h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin:0;
  margin-bottom: 0.5rem;
  text-align: center;
  letter-spacing: 1px;
}

.submit-button {
  width: 100%;
  padding: 1.1rem;
  border: none;
  border-radius: 10px;
  background: #e0e6ed;
  color: #7f8c8d;
  font-size: 1.15rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-top: 1rem;
  border-radius: 100px;
}

.submit-button:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  transform: translateY(-3px);
}

.submit-button:disabled {
  background-color: #ccc;
  color: #999;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* Responsive */
@media (max-width: 600px) {
  .auth-form {
    padding: 2.5rem 1.5rem;
    border-radius: 12px;
  }

  .auth-form h1 {
    font-size: 2rem;
  }

  .form-group label,
  .form-group input,
  .submit-button,
  .error-message {
    font-size: 0.9rem;
  }

  .submit-button {
    padding: 0.9rem;
  }

  .auth-form-container{
    padding: 1rem;
  }
}
</style>