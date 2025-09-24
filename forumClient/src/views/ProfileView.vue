<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import type { Ref } from 'vue';
import { useAuthStore } from '@/stores/auth'; // Assurez-vous que le chemin est correct
import { useAuthValidation } from '@/composables/useAuthValidation'; // <-- Importe le composable de validation

// Initialisation des stores et du routeur
const authStore = useAuthStore();

// --- State pour le profil ---
const isEditingProfile = ref(false); // Mode édition du profil
const editForm = ref({
  username: '',
  email: '',
  confirmEmail: ''
});
const profileApiError: Ref<string | null> = ref(null);
const profileSuccessMessage: Ref<string | null> = ref(null);

// --- State pour le mot de passe ---
const isChangingPassword = ref(false); // Mode changement de mot de passe
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
});
const passwordApiError: Ref<string | null> = ref(null);
const passwordSuccessMessage: Ref<string | null> = ref(null);

// --- Utilisation du composable de validation pour le formulaire de profil ---
const {
  validationErrors: profileValidationErrors,
  validateUsername,
  validateEmail,
  validateConfirmEmail,
  validateAllFields: validateAllProfileFields,
  isFormValid: isProfileFormValid,
} = useAuthValidation(editForm);

// --- Utilisation du composable de validation pour le formulaire de mot de passe ---
const {
  validationErrors: passwordValidationErrors,
  validateCurrentPassword,
  validatePassword: validateNewPassword,
  validateConfirmPassword: validateConfirmNewPassword,
  validateAllFields: validateAllPasswordFields,
  isFormValid: isPasswordFormValid,
} = useAuthValidation(passwordForm);

// --- Fonction pour masquer l'email côté client pour l'affichage ---
const maskEmail = (email: string): string => {
  if (!email || typeof email !== 'string') return '';
  const atIndex = email.indexOf('@');
  if (atIndex <= 1) return email;
  const localPart = email.substring(0, atIndex);
  const domainPart = email.substring(atIndex);

  const maskedLocalPart = localPart.length > 2
    ? localPart.substring(0, 2) + '*'.repeat(localPart.length - 2)
    : '*'.repeat(localPart.length);

  return maskedLocalPart + domainPart;
};

// --- Initialisation du formulaire d'édition quand l'utilisateur est chargé ---
watch(() => authStore.user, (newUser) => {
  if (newUser) {
    editForm.value.username = newUser.username || '';
    editForm.value.email = newUser.email || '';
    editForm.value.confirmEmail = newUser.email || '';
  }
}, { immediate: true });

// --- Propriété calculée pour afficher l'email masqué en mode lecture seule ---
const displayedEmail = computed(() => {
  return authStore.user ? maskEmail(authStore.user.email) : 'Chargement...';
});

// --- Gestion des actions utilisateur ---
const startEditing = () => {
  isEditingProfile.value = true;
  if (authStore.user) {
    editForm.value.username = authStore.user.username || '';
    editForm.value.email = authStore.user.email || '';
    editForm.value.confirmEmail = authStore.user.email || '';
  }
  profileApiError.value = null;
  profileSuccessMessage.value = null;
  // Réinitialiser les erreurs de validation spécifiques au profil via le composable
  Object.keys(profileValidationErrors.value).forEach(key => (profileValidationErrors.value[key as keyof typeof profileValidationErrors.value] = ''));
};

const cancelEditing = () => {
  isEditingProfile.value = false;
  if (authStore.user) {
    editForm.value.username = authStore.user.username || '';
    editForm.value.email = authStore.user.email || '';
    editForm.value.confirmEmail = authStore.user.email || '';
  }
  profileApiError.value = null;
  profileSuccessMessage.value = null;
  // Réinitialiser les erreurs de validation spécifiques au profil via le composable
  Object.keys(profileValidationErrors.value).forEach(key => (profileValidationErrors.value[key as keyof typeof profileValidationErrors.value] = ''));
};

const handleProfileUpdate = async () => {
  profileApiError.value = null;
  profileSuccessMessage.value = null;

  validateAllProfileFields(); // Déclenche toutes les validations du composable pour le profil

  if (!isProfileFormValid.value) {
    // Si la validation échoue, on peut faire défiler jusqu'à la première erreur
    await nextTick();
    const firstError = document.querySelector('.profile-form .validation-error-text');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  try {
    // Supposons que updateProfile ne nécessite pas confirmEmail côté backend
    await authStore.updateProfile({
      username: editForm.value.username,
      email: editForm.value.email
    });
    profileSuccessMessage.value = 'Profil mis à jour avec succès !';
    isEditingProfile.value = false;
  } catch (err: any) {
    profileApiError.value = err.response?.data?.message || 'Une erreur est survenue lors de la mise à jour du profil.';
  }
};

const togglePasswordChange = () => {
  isChangingPassword.value = !isChangingPassword.value;
  if (!isChangingPassword.value) {
    passwordForm.value = { currentPassword: '', newPassword: '', confirmNewPassword: '' };
    passwordApiError.value = null;
    passwordSuccessMessage.value = null;
    // Réinitialiser les erreurs de validation spécifiques au mot de passe via le composable
    Object.keys(passwordValidationErrors.value).forEach(key => (passwordValidationErrors.value[key as keyof typeof passwordValidationErrors.value] = ''));
  }
};

const handlePasswordChange = async () => {
  passwordApiError.value = null;
  passwordSuccessMessage.value = null;

  validateAllPasswordFields(); // Déclenche toutes les validations du composable pour le mot de passe

  if (!isPasswordFormValid.value) {
    // Si la validation échoue, on peut faire défiler jusqu'à la première erreur
    await nextTick();
    const firstError = document.querySelector('.password-form .validation-error-text');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  try {
    await authStore.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    });
    passwordSuccessMessage.value = 'Mot de passe mis à jour avec succès !';
    togglePasswordChange();
  } catch (err: any) {
    passwordApiError.value = err.response?.data?.message || 'Une erreur est survenue lors du changement de mot de passe.';
  }
};
</script>

<template>
  <div class="profile-view-container">

    <div v-if="authStore.user" class="profile-card">
      <h1 class="page-title">Mon Profil</h1>
      <!-- Section Messages -->
      <div class="message-area">
        <p v-if="profileSuccessMessage" class="message success-message fade-in-out">{{ profileSuccessMessage }}</p>
        <p v-if="profileApiError" class="message error-message fade-in-out">{{ profileApiError }}</p>
        <p v-if="passwordSuccessMessage" class="message success-message fade-in-out">{{ passwordSuccessMessage }}</p>
        <p v-if="passwordApiError" class="message error-message fade-in-out">{{ passwordApiError }}</p>
      </div>

      <!-- Mode Visualisation du Profil -->
      <div v-if="!isEditingProfile" class="profile-details-section fade-in">
        <div class="profile-info-group">
          <span class="label">ID Utilisateur :</span>
          <span class="value">{{ authStore.user.id }}</span>
        </div>
        <div class="profile-info-group">
          <span class="label">Nom d'utilisateur :</span>
          <span class="value">{{ authStore.user.username }}</span>
        </div>
        <div class="profile-info-group">
          <span class="label">Email :</span>
          <span class="value">{{ displayedEmail }}</span>
        </div>
        <div class="button-row">
          <button @click="startEditing" class="btn primary-btn">
            Modifier le profil
          </button>
        </div>
      </div>

      <!-- Mode Édition du Profil -->
      <div v-else class="form-section profile-form fade-in">
        <h2 class="section-title">Modifier les informations</h2>
        <form @submit.prevent="handleProfileUpdate">
          <div class="form-group">
            <label for="edit-username">Nom d'utilisateur</label>
            <div class="input-with-icon">
              <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4C14.2091 4 16 5.79086 16 8C16 10.2091 14.2091 12 12 12C9.79086 12 8 10.2091 8 8C8 5.79086 9.79086 4 12 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <input type="text" id="edit-username" v-model="editForm.username" @blur="validateUsername"
                     :class="{ 'input-error-border': profileValidationErrors.username }" placeholder="Votre nom d'utilisateur">
            </div>
            <p v-if="profileValidationErrors.username" class="validation-error-text">{{ profileValidationErrors.username }}</p>
          </div>
          <div class="form-group">
            <label for="edit-email">Adresse Email</label>
            <div class="input-with-icon">
              <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 7.00005L10.2647 11.2353C11.2184 11.8841 12.7816 11.8841 13.7353 11.2353L20 7.00005M6 18H18C19.1046 18 20 17.1046 20 16V8C20 6.89543 19.1046 6 18 6H6C4.89543 6 4 6.89543 4 8V16C4 17.1046 4.89543 18 6 18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <input type="email" id="edit-email" v-model="editForm.email" @blur="validateEmail"
                     :class="{ 'input-error-border': profileValidationErrors.email }" placeholder="Votre adresse email">
            </div>
            <p v-if="profileValidationErrors.email" class="validation-error-text">{{ profileValidationErrors.email }}</p>
          </div>
          <div class="form-group">
            <label for="edit-confirm-email">Confirmer l'Email</label>
            <div class="input-with-icon">
              <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 7.00005L10.2647 11.2353C11.2184 11.8841 12.7816 11.8841 13.7353 11.2353L20 7.00005M6 18H18C19.1046 18 20 17.1046 20 16V8C20 6.89543 19.1046 6 18 6H6C4.89543 6 4 6.89543 4 8V16C4 17.1046 4.89543 18 6 18Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18 6L16 8L18 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <input type="email" id="edit-confirm-email" v-model="editForm.confirmEmail" @blur="validateConfirmEmail"
                     :class="{ 'input-error-border': profileValidationErrors.confirmEmail }" placeholder="Confirmez votre adresse email">
            </div>
            <p v-if="profileValidationErrors.confirmEmail" class="validation-error-text">{{ profileValidationErrors.confirmEmail }}</p>
          </div>
          <div class="button-row form-actions">
            <button type="submit" class="btn primary-btn" :disabled="!isProfileFormValid">
              Enregistrer les changements
            </button>
            <button type="button" @click="cancelEditing" class="btn secondary-btn">
              Annuler
            </button>
          </div>
        </form>
      </div>
      <!-- Section Changement de Mot de Passe -->
      <div class="password-section">
        <div v-if="!isChangingPassword" class="button-row">
          <button @click="togglePasswordChange" class="btn primary-btn">
            Changer le mot de passe
          </button>
        </div>

        <form v-else @submit.prevent="handlePasswordChange" class="form-section password-form fade-in">
          <h2 class="section-title">Changer le Mot de Passe</h2>
          <div class="form-group">
            <label for="current-password">Mot de passe actuel</label>
            <div class="input-with-icon">
              <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 17C13.1046 17 14 16.1046 14 15C14 13.8954 13.1046 13 12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18 10H6C4.89543 10 4 10.8954 4 12V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V12C20 10.8954 19.1046 10 18 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 10V7C8 5.34315 9.34315 4 11 4H13C14.6569 4 16 5.34315 16 7V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <input type="password" id="current-password" v-model="passwordForm.currentPassword" @blur="validateCurrentPassword"
                     :class="{ 'input-error-border': passwordValidationErrors.currentPassword }" placeholder="Votre mot de passe actuel">
            </div>
            <p v-if="passwordValidationErrors.currentPassword" class="validation-error-text">{{ passwordValidationErrors.currentPassword }}</p>
          </div>
          <div class="form-group">
            <label for="new-password">Nouveau mot de passe</label>
            <div class="input-with-icon">
              <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 17C13.1046 17 14 16.1046 14 15C14 13.8954 13.1046 13 12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18 10H6C4.89543 10 4 10.8954 4 12V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V12C20 10.8954 19.1046 10 18 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 10V7C8 5.34315 9.34315 4 11 4H13C14.6569 4 16 5.34315 16 7V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <input type="password" id="new-password" v-model="passwordForm.newPassword" @blur="validateNewPassword"
                     :class="{ 'input-error-border': passwordValidationErrors.newPassword }" placeholder="Votre nouveau mot de passe">
            </div>
            <p v-if="passwordValidationErrors.newPassword" class="validation-error-text">{{ passwordValidationErrors.newPassword }}</p>
          </div>
          <div class="form-group">
            <label for="confirm-new-password">Confirmer le nouveau mot de passe</label>
            <div class="input-with-icon">
              <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 17C13.1046 17 14 16.1046 14 15C14 13.8954 13.1046 13 12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18 10H6C4.89543 10 4 10.8954 4 12V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V12C20 10.8954 19.1046 10 18 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 10V7C8 5.34315 9.34315 4 11 4H13C14.6569 4 16 5.34315 16 7V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 17V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <input type="password" id="confirm-new-password" v-model="passwordForm.confirmNewPassword" @blur="validateConfirmNewPassword"
                     :class="{ 'input-error-border': passwordValidationErrors.confirmNewPassword }" placeholder="Confirmez votre nouveau mot de passe">
            </div>
            <p v-if="passwordValidationErrors.confirmNewPassword" class="validation-error-text">{{ passwordValidationErrors.confirmNewPassword }}</p>
          </div>
          <div class="button-row form-actions">
            <button type="submit" class="btn primary-btn" :disabled="!isPasswordFormValid">
              Mettre à jour le mot de passe
            </button>
            <button type="button" @click="togglePasswordChange" class="btn secondary-btn">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-else class="loading-message">
      <p>Chargement des informations du profil...</p>
    </div>
  </div>
</template>

<style scoped>
/* Polices Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;600;700;800&display=swap');

/* Couleurs et styles de base */
.profile-view-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa; /* Fond blanc cassé doux */
  padding: 3rem 1.5rem;
  font-family: 'Inter', sans-serif;
  color: #343a40; /* Gris foncé pour le texte principal */
  box-sizing: border-box;
  width: 100%;
}

.page-title {
  font-family: 'Poppins', sans-serif;
  font-size: 3rem;
  font-weight: 700;
  color: #495057; /* Un gris légèrement plus clair */
  margin-bottom: 2.5rem;
  text-align: center;
  position: relative;

}

/* Carte de profil */
.profile-card {
  background-color: #ffffff;
  border-radius: 20px; /* Bords très arrondis */
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.1); /* Ombre douce et prononcée */
  padding: 2.5rem 3.5rem;
  width: 100%;
  max-width: 700px; /* Largeur confortable */
  box-sizing: border-box;
  animation-delay: 0.4s;
}

/* Zone de messages (succès/erreur) */
.message-area {
  margin-bottom: 1.5rem;
}
.message {
  padding: 0.8rem 1rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
  margin-bottom: 1rem;
  opacity: 0; /* Caché par défaut */
  animation: messageFadeIn 0.4s ease-out forwards;
}
.success-message {
  background-color: #d4edda; /* Vert clair */
  color: #155724; /* Vert foncé */
  border: 1px solid #c3e6cb;
}
.error-message {
  background-color: #f8d7da; /* Rouge clair */
  color: #721c24; /* Rouge foncé */
  border: 1px solid #f5c6cb;
}
@keyframes messageFadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.profile-info-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.2rem 0;
  border-bottom: 3px solid #eee;
  padding: 10px;
  background: #8080800f;
  
}

.profile-info-group:last-of-type {
  border-bottom: none;
}

.profile-info-group:hover {
  background-color: #f8f9fa; /* Léger highlight au survol */
}

.label {
  font-weight: 600;
  color: #495057;
  font-size: 1rem;
}

.value {
  color: #212529;
  font-family: 'Fira Code', monospace; /* Police monospace moderne */
  font-size: 1rem;
  font-weight: 500;
}

/* Titres de section */
.section-title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #343a40;
  margin-bottom: 2rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
  text-align: left;
  position: relative;
  /* Ligne de gradient sous le titre */
  display: inline-block;
}
.section-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 60px; /* Longueur de la barre */
  height: 2px;
  background: linear-gradient(90deg, #4CAF50, #8E24AA); /* Dégradé vibrant */
  border-radius: 1px;
}

/* Formulaires (profil et mot de passe) */
.form-section {
  padding-top: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

label {
  display: block;
  margin-bottom: 0.6rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #495057;
}

/* Input avec icône */
.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}
.input-with-icon input {
  padding-left: 3rem !important; /* Espace pour l'icône */
}
.input-with-icon .icon {
  position: absolute;
  left: 1rem;
  width: 20px;
  height: 20px;
  color: #adb5bd; /* Gris neutre pour l'icône par défaut */
  transition: color 0.2s ease-in-out;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.8rem 1.2rem;
  border: 1px solid #ced4da; /* Gris clair */
  border-radius: 12px; /* Coins arrondis */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); /* Ombre subtile */
  color: #343a40;
  font-size: 1rem;
  line-height: 1.5;
  outline: none;
  transition: all 0.2s ease-in-out;
  background-color: #fdfdfe; /* Blanc très léger */
}

input::placeholder {
  color: #adb5bd;
  opacity: 0.8;
}

input:focus {
  border-color: #8E24AA; /* Couleur d'accentuation violette au focus */
  box-shadow: 0 0 0 4px rgba(142, 36, 170, 0.2); /* Halo doux */
  background-color: #ffffff;
}
input:focus + .icon {
  color: #8E24AA; /* Icône devient violette au focus */
}

/* Style pour les inputs en erreur */
.input-error-border {
  border-color: #dc3545 !important; /* Rouge pour l'erreur */
  box-shadow: 0 0 0 4px rgba(220, 53, 69, 0.2) !important;
}
.input-error-border + .icon {
  color: #dc3545 !important; /* Icône rouge en cas d'erreur */
}


.validation-error-text {
  color: #dc3545; /* Rouge pour les messages d'erreur */
  font-size: 0.85rem;
  margin-top: 0.5rem;
  text-align: left;
  font-weight: 500;
  animation: shake 0.4s ease-in-out;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}

/* Boutons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.8rem;
  border-radius: 50px; /* Bords très arrondis */
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease-in-out;
  letter-spacing: 0.2px;
  text-transform: uppercase;
}

.primary-btn {
  background: linear-gradient(45deg, #4CAF50, #8E24AA); /* Dégradé vert-violet */
  color: #ffffff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  background: linear-gradient(45deg, #8E24AA, #4CAF50); /* Inverser le dégradé au hover */
}

.secondary-btn {
  background-color: #e9ecef; /* Gris clair */
  color: #343a40;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.secondary-btn:hover:not(:disabled) {
  background-color: #dee2e6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn:disabled {
  background-color: #ced4da; /* Gris désactivé */
  color: #6c757d;
  cursor: not-allowed;
  opacity: 0.7;
  box-shadow: none;
  transform: none;
}

.button-row {
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
  justify-content: flex-start; /* Aligner à gauche par défaut */
}

.form-actions {
  justify-content: flex-end; /* Aligner les boutons d'action des formulaires à droite */
}

/* Message de chargement */
.loading-message {
  font-size: 1.1rem;
  color: #6c757d;
  animation: pulseText 1.5s infinite ease-in-out;
}
@keyframes pulseText {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

/* Animations d'entrée (fade-in pour les sections qui apparaissent) */
.fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

/* Media Queries pour la responsivité */
@media (max-width: 768px) {
  .profile-view-container {
    padding: 2rem 1rem;
  }
  .page-title {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }
  .profile-card {
    padding: 2rem;
    border-radius: 15px;
  }
  .section-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .profile-info-group, .form-group {
    margin-bottom: 1.2rem;
  }
  .label, .value, input {
    font-size: 0.95rem;
  }
  input {
    padding: 0.7rem 1rem;
  }
  .input-with-icon input {
    padding-left: 2.8rem !important;
  }
  .input-with-icon .icon {
    left: 0.8rem;
    width: 18px;
    height: 18px;
  }
  .btn {
    padding: 0.7rem 1.5rem;
    font-size: 0.9rem;
  }
  .button-row {
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  .button-row .btn {
    width: 100%;
  }

}

@media (max-width: 480px) {
  .profile-view-container {
    padding: 1rem;
  }
  .page-title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  .profile-card {
    padding: 1.5rem;
    border-radius: 12px;
  }
  .section-title {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }
  .profile-info-group {
    padding: 0.8rem 0;
  }
  .label, .value, input {
    font-size: 0.9rem;
  }
  input {
    padding: 0.6rem 0.8rem;
  }
  .input-with-icon input {
    padding-left: 2.5rem !important;
  }
  .input-with-icon .icon {
    left: 0.6rem;
    width: 16px;
    height: 16px;
  }
  .btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.85rem;
  }
  .validation-error-text {
    font-size: 0.75rem;
  }
}
</style>