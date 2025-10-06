<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import SideContentRegister from '@/components/SideContentRegister.vue';
import { useAuthValidation } from '@/composables/useAuthValidation';


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
const apiError = ref<string | null>(null);

// --- Gestion de l'inscription ---
async function handleRegister() {
  apiError.value = null;
  validateAllFields();

  if (!isFormValid.value) {
    return;
  }

  try {
    await authStore.register(form.value);
    await router.push('/login');
  } catch (err: any) {
    apiError.value = err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.';
  }
}
</script>

<template>
  <div class="register-wrapper">
    <SideContentRegister />
    <div class="auth-form-container">
      <form @submit.prevent="handleRegister" class="auth-form">
        <h1>Inscription</h1>

        <div class="form-group">
          <label for="username">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            v-model="form.username"
            @blur="validateUsername"
            required
            autocomplete="username"
          />
          <p v-if="validationErrors.username" class="error-message">{{ validationErrors.username }}</p>
        </div>

        <div class="form-group">
          <label for="email">Adresse Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            @blur="validateEmail"
            required
            autocomplete="email"
          />
          <p v-if="validationErrors.email" class="error-message">{{ validationErrors.email }}</p>
        </div>

        <div class="form-group">
          <label for="confirmEmail">Confirmer l'Adresse Email</label>
          <input
            type="email"
            id="confirmEmail"
            v-model="form.confirmEmail"
            @blur="validateConfirmEmail"
            required
            autocomplete="email"
          />
          <p v-if="validationErrors.confirmEmail" class="error-message">{{ validationErrors.confirmEmail }}</p>
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            @blur="validatePassword"
            required
            autocomplete="new-password"
          />
          <p v-if="validationErrors.password" class="error-message">{{ validationErrors.password }}</p>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmer le Mot de passe</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="form.confirmPassword"
            @blur="validateConfirmPassword"
            required
            autocomplete="new-password"
          />
          <p v-if="validationErrors.confirmPassword" class="error-message">{{ validationErrors.confirmPassword }}</p>
        </div>

        <p v-if="apiError" class="error-message">{{ apiError }}</p>
        <button type="submit" class="submit-button" :disabled="!isFormValid">S'inscrire</button>
      </form>
    </div>
  </div>
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;600&display=swap');

:root {
  --primary-color: #6a11cb;
  --primary-color-dark: #2575fc;
  --secondary-color: #2c3e50;
  --text-color: #333;
  --text-color-light: #7f8c8d;
  --bg-color: linear-gradient(to right, #6a11cb, #2575fc);
  --card-bg-color: #fff;
  --border-color: #e0e6ed;
  --input-bg-color: #f0f0f0;
  --shadow-light: 0 10px 25px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 15px 35px rgba(0, 0, 0, 0.15);
  --error-color: #e74c3c;
}
.register-wrapper{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-self: center;
  flex-direction: row-reverse;
}
.auth-form-container {
  font-family: 'Poppins', 'Inter', sans-serif;
  background: var(--bg-color);
  color: var(--text-color);
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
  background-color: var(--card-bg-color);
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
.form-group{
  height: 100px;
}
.form-group label {
  display: block;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--secondary-color);
}

.form-group input {
  width: 100%;
  padding: 1rem 1.2rem;
  border: 1px solid var(--border-color);
  background-color: var(--input-bg-color);
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s, background-color 0.3s;
  box-sizing: border-box;
  border-radius: 10px;
}

.form-group input:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(106, 17, 203, 0.15);
  background-color: #fff;
}

.form-group input::placeholder {
  color: var(--text-color-light);
  opacity: 0.6;
}

.error-message {
  color: red;
  border-radius: 8px;
  margin-top: 0.1rem;
  font-size: 0.9rem;
  font-weight: 500;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
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
