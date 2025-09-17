<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

// Initialisation des stores et du routeur
const authStore = useAuthStore();
const router = useRouter();

// Formulaire de données
const form = ref({
  username: '',
  email: '',
  confirmEmail: '', // Nouveau champ
  password: '',
  confirmPassword: '' // Nouveau champ
});

// Erreur de l'API (backend)
const apiError: Ref<string | null> = ref(null);

// Erreurs de validation côté client
const validationErrors = ref({
  username: '',
  email: '',
  confirmEmail: '',
  password: '',
  confirmPassword: ''
});

// --- Fonctions de validation ---

// Valide le nom d'utilisateur
const validateUsername = () => {
  if (!form.value.username) {
    validationErrors.value.username = 'Le pseudo est requis.';
  } else if (form.value.username.length < 3 || form.value.username.length > 64) {
    validationErrors.value.username = 'Le pseudo doit contenir entre 3 et 64 caractères.';
  } else {
    validationErrors.value.username = '';
  }
};

// Valide l'email
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.value.email) {
    validationErrors.value.email = "L'email est requis.";
  } else if (!emailRegex.test(form.value.email)) {
    validationErrors.value.email = "Le format de l'email est invalide.";
  } else if (form.value.email.length > 64) {
    validationErrors.value.email = "L'email ne doit pas dépasser 64 caractères.";
  } else {
    validationErrors.value.email = '';
  }
  // Re-valide confirmEmail si l'email change
  validateConfirmEmail();
};

// Valide la confirmation d'email
const validateConfirmEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.value.confirmEmail) {
    validationErrors.value.confirmEmail = "La confirmation d'email est requise.";
  } else if (!emailRegex.test(form.value.confirmEmail)) {
    validationErrors.value.confirmEmail = "Le format de l'email de confirmation est invalide.";
  } else if (form.value.confirmEmail !== form.value.email) {
    validationErrors.value.confirmEmail = 'Les adresses email ne correspondent pas.';
  } else {
    validationErrors.value.confirmEmail = '';
  }
};

// Valide le mot de passe
const validatePassword = () => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/;
  if (!form.value.password) {
    validationErrors.value.password = 'Le mot de passe est requis.';
  } else if (form.value.password.length < 8 || form.value.password.length > 256) {
    validationErrors.value.password = 'Le mot de passe doit contenir entre 8 et 256 caractères.';
  } else if (!passwordRegex.test(form.value.password)) {
    validationErrors.value.password = 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un caractère spécial (!@#$%^&*).';
  } else {
    validationErrors.value.password = '';
  }
  // Re-valide confirmPassword si le mot de passe change
  validateConfirmPassword();
};

// Valide la confirmation du mot de passe
const validateConfirmPassword = () => {
  if (!form.value.confirmPassword) {
    validationErrors.value.confirmPassword = 'La confirmation du mot de passe est requise.';
  } else if (form.value.confirmPassword !== form.value.password) {
    validationErrors.value.confirmPassword = 'Les mots de passe ne correspondent pas.';
  } else {
    validationErrors.value.confirmPassword = '';
  }
};

// Vérifie si le formulaire est globalement valide
const isFormValid = computed(() => {
  // Exécute toutes les validations pour s'assurer que toutes les erreurs sont mises à jour
  validateUsername();
  validateEmail();
  validateConfirmEmail();
  validatePassword();
  validateConfirmPassword();

  // Vérifie si toutes les chaînes d'erreur sont vides
  return Object.values(validationErrors.value).every(error => error === '');
});

// --- Gestion de l'inscription ---
async function handleRegister() {
  apiError.value = null; // Réinitialise les erreurs de l'API

  // Exécute toutes les validations avant de soumettre
  validateUsername();
  validateEmail();
  validateConfirmEmail();
  validatePassword();
  validateConfirmPassword();

  // Si le formulaire n'est pas valide, arrête la soumission
  if (!isFormValid.value) {
    return;
  }

  try {
    await authStore.register(form.value);
    await router.push('/login');
  } catch (err: any) {
    // Gère les erreurs renvoyées par l'API (par ex. utilisateur déjà existant)
    apiError.value = err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.';
  }
}
</script>

<template>
  <div class="auth-form-container">
    <form @submit.prevent="handleRegister" class="auth-form">
      <h1>Inscription</h1>

      <div class="form-group">
        <label for="username">Nom d'utilisateur</label>
        <input type="text" id="username" v-model="form.username" @blur="validateUsername" required autocomplete="username">
        <p v-if="validationErrors.username" class="error-message">{{ validationErrors.username }}</p>
      </div>

      <div class="form-group">
        <label for="email">Adresse Email</label>
        <input type="email" id="email" v-model="form.email" @blur="validateEmail" required autocomplete="email">
        <p v-if="validationErrors.email" class="error-message">{{ validationErrors.email }}</p>
      </div>

      <div class="form-group">
        <label for="confirmEmail">Confirmer l'Adresse Email</label>
        <input type="email" id="confirmEmail" v-model="form.confirmEmail" @blur="validateConfirmEmail" required autocomplete="email">
        <p v-if="validationErrors.confirmEmail" class="error-message">{{ validationErrors.confirmEmail }}</p>
      </div>

      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input type="password" id="password" v-model="form.password" @blur="validatePassword" required autocomplete="new-password">
        <p v-if="validationErrors.password" class="error-message">{{ validationErrors.password }}</p>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirmer le Mot de passe</label>
        <input type="password" id="confirmPassword" v-model="form.confirmPassword" @blur="validateConfirmPassword" required autocomplete="new-password">
        <p v-if="validationErrors.confirmPassword" class="error-message">{{ validationErrors.confirmPassword }}</p>
      </div>

      <p v-if="apiError" class="error-message">{{ apiError }}</p>
      
      <button type="submit" class="submit-button" :disabled="!isFormValid && Object.values(form).some(val => val !== '')">S'inscrire</button>
    </form>
  </div>
</template>

<style scoped>
/* Styles de base pour le conteneur du formulaire */
.auth-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 1rem 20px; /* Fusion du padding */
  box-sizing: border-box;
  width: 100vw;
}

/* Styles du formulaire lui-même */
.auth-form {
  background-color: #ffffff;
  padding: 40px; /* Un padding plus généreux pour une meilleure aération */
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
  font-family: 'Inter', sans-serif; /* L'une des familles de polices les plus courantes */
  box-sizing: border-box;
}

h1 {
  color: #333;
  margin-bottom: 30px;
  font-size: 2em;
  font-weight: 700;
}

/* Styles pour le groupe label/input */
.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 600;
  font-size: 0.9em;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1em;
  color: #333;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  outline: none;
}

/* Messages d'erreur */
.error-message {
  color: #dc3545;
  font-size: 0.85em;
  margin-top: 5px;
  text-align: left;
}

/* Bouton de soumission */
.submit-button {
  background-color: #007bff;
  color: white;
  padding: 14px 25px;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  margin-top: 20px;
}

.submit-button:hover {
  background-color: #0056b3;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  box-shadow: none;
}

/* --- Styles pour l'animation de succès --- */
@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(20px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-20px); }
}

.success-message-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  text-align: center;
  animation: fadeInOut 2s ease-in-out;
}

.success-message h2 {
  font-size: 2.5em;
  color: #28a745;
  margin-bottom: 10px;
  animation: appear 1s ease-out;
}

.success-message p {
  font-size: 1.2em;
  color: #555;
  animation: appear 1.2s ease-out;
}

@keyframes appear {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>