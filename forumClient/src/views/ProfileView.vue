<script setup lang="ts" vapor>
import { ref, computed, watch } from 'vue';
import type { Ref } from 'vue';
import { useAuthStore } from '@/stores/auth'; // Assurez-vous que le chemin est correct
import { useAuthValidation } from '@/composables/useAuthValidation'; // <-- Importe le composable de validation

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
// On instancie useAuthValidation avec le ref du formulaire d'édition (editForm).
// On renomme les variables retournées pour éviter les conflits et clarifier leur usage.
const {
  validationErrors: profileValidationErrors, // Erreurs spécifiques au formulaire de profil
  validateUsername,
  validateEmail,
  validateConfirmEmail,
  validateAllFields: validateAllProfileFields, // Fonction pour valider tous les champs du profil
  isFormValid: isProfileFormValid, // Validité globale du formulaire de profil
} = useAuthValidation(editForm);

// --- Utilisation du composable de validation pour le formulaire de mot de passe ---
// On instancie useAuthValidation avec le ref du formulaire de mot de passe (passwordForm).
// On renomme également les variables pour le contexte du mot de passe.
const {
  validationErrors: passwordValidationErrors, // Erreurs spécifiques au formulaire de mot de passe
  validateCurrentPassword,
  validatePassword: validateNewPassword, // La fonction 'validatePassword' du composable est renommée pour le nouveau mot de passe
  validateConfirmPassword: validateConfirmNewPassword, // La fonction 'validateConfirmPassword' est renommée
  validateAllFields: validateAllPasswordFields, // Fonction pour valider tous les champs du mot de passe
  isFormValid: isPasswordFormValid, // Validité globale du formulaire de mot de passe
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
    return;
  }

  try {
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
    <h1 class="page-title">Mon Profil</h1>

    <div v-if="authStore.user" class="profile-card">
      <!-- Messages de succès et d'erreur généraux pour le profil -->
      <p v-if="profileSuccessMessage" class="message success-message">{{ profileSuccessMessage }}</p>
      <p v-if="profileApiError" class="message error-message">{{ profileApiError }}</p>

      <!-- Mode Visualisation du Profil -->
      <div v-if="!isEditingProfile">
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
        <div class="button-group">
          <button @click="startEditing" class="btn btn-primary">
            Modifier le profil
          </button>
        </div>
      </div>

      <!-- Mode Édition du Profil -->
      <div v-else class="form-section">
        <h2 class="section-title">Modifier le Profil</h2>
        <form @submit.prevent="handleProfileUpdate">
          <div class="form-group">
            <label for="edit-username">Nom d'utilisateur</label>
            <input type="text" id="edit-username" v-model="editForm.username" @blur="validateUsername"
                   :class="{ 'input-error': profileValidationErrors.username }">
            <p v-if="profileValidationErrors.username" class="validation-error-text">{{ profileValidationErrors.username }}</p>
          </div>
          <div class="form-group">
            <label for="edit-email">Adresse Email</label>
            <input type="email" id="edit-email" v-model="editForm.email" @blur="validateEmail"
                   :class="{ 'input-error': profileValidationErrors.email }">
            <p v-if="profileValidationErrors.email" class="validation-error-text">{{ profileValidationErrors.email }}</p>
          </div>
          <div class="form-group">
            <label for="edit-confirm-email">Confirmer l'Email</label>
            <input type="email" id="edit-confirm-email" v-model="editForm.confirmEmail" @blur="validateConfirmEmail"
                   :class="{ 'input-error': profileValidationErrors.confirmEmail }">
            <p v-if="profileValidationErrors.confirmEmail" class="validation-error-text">{{ profileValidationErrors.confirmEmail }}</p>
          </div>
          <div class="button-group form-actions">
            <button type="submit" class="btn btn-primary" :disabled="!isProfileFormValid">
              Enregistrer les changements
            </button>
            <button type="button" @click="cancelEditing" class="btn btn-secondary">
              Annuler
            </button>
          </div>
        </form>
      </div>

      <hr class="section-divider" />

      <!-- Section Changement de Mot de Passe -->
      <div class="password-section">
        <h2 class="section-title">Changer le Mot de Passe</h2>
        <p v-if="passwordSuccessMessage" class="message success-message">{{ passwordSuccessMessage }}</p>
        <p v-if="passwordApiError" class="message error-message">{{ passwordApiError }}</p>

        <div v-if="!isChangingPassword" class="button-group">
          <button @click="togglePasswordChange" class="btn btn-primary">
            Changer le mot de passe
          </button>
        </div>

        <form v-else @submit.prevent="handlePasswordChange" class="form-section">
          <div class="form-group">
            <label for="current-password">Mot de passe actuel</label>
            <input type="password" id="current-password" v-model="passwordForm.currentPassword" @blur="validateCurrentPassword"
                   :class="{ 'input-error': passwordValidationErrors.currentPassword }">
            <p v-if="passwordValidationErrors.currentPassword" class="validation-error-text">{{ passwordValidationErrors.currentPassword }}</p>
          </div>
          <div class="form-group">
            <label for="new-password">Nouveau mot de passe</label>
            <input type="password" id="new-password" v-model="passwordForm.newPassword" @blur="validateNewPassword"
                   :class="{ 'input-error': passwordValidationErrors.newPassword }">
            <p v-if="passwordValidationErrors.newPassword" class="validation-error-text">{{ passwordValidationErrors.newPassword }}</p>
          </div>
          <div class="form-group">
            <label for="confirm-new-password">Confirmer le nouveau mot de passe</label>
            <input type="password" id="confirm-new-password" v-model="passwordForm.confirmNewPassword" @blur="validateConfirmNewPassword"
                   :class="{ 'input-error': passwordValidationErrors.confirmNewPassword }">
            <p v-if="passwordValidationErrors.confirmNewPassword" class="validation-error-text">{{ passwordValidationErrors.confirmNewPassword }}</p>
          </div>
          <div class="button-group form-actions">
            <button type="submit" class="btn btn-primary" :disabled="!isPasswordFormValid">
              Mettre à jour le mot de passe
            </button>
            <button type="button" @click="togglePasswordChange" class="btn btn-secondary">
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
/* Conteneur principal */
.profile-view-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
  font-family: 'Inter', sans-serif;
  width: 100vw;
}

/* Carte du profil */
.profile-card {
  width: 100%;
  max-width: 600px;
  box-sizing: border-box;
}

/* Groupe d'informations (pour le mode visualisation) */
.profile-info-group {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #e2e8f0; /* border-gray-200 */
}

.profile-info-group:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600; /* semi-bold */
  color: #4a5568; /* gray-700 */
}

.value {
  color: #2d3748; /* gray-800 */
  font-family: monospace;
}

/* Styles pour les formulaires (édition et mot de passe) */
.form-group {
  margin-bottom: 1.25rem; /* mb-5 */
 
}

label {
  display: block;
  margin-bottom: 0.5rem; /* mb-2 */
  font-size: 0.875rem; /* text-sm */
  font-weight: 700; /* bold */
  color: #4a5568; /* text-gray-700 */
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: calc(100% - 20px);
  padding: 0.5rem 0.75rem; /* py-2 px-3 */
  border: 1px solid #cbd5e0; /* border-gray-300 */
  border-radius: 0.25rem; /* rounded */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow */
  color: #2d3748; /* text-gray-800 */
  line-height: 1.25; /* leading-tight */
  outline: none;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus {
  border-color: #3182ce; /* blue-500 */
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5); /* focus:shadow-outline */
}
.rod{
  border: solid;
  border-radius: 10px;
}
/* Erreurs de validation */
.text-red-500 {
  color: #ef4444;
}

.text-xs {
  font-size: 0.75rem;
}

.italic {
  font-style: italic;
}

.mt-1 {
  margin-top: 0.25rem;
}

/* Boutons */
.btn-primary {
  background-color: #4299e1; /* blue-500 */
  color: white;
  padding: 0.75rem 1.5rem; /* py-3 px-6 */
  border: none;
  border-radius: 0.5rem; /* rounded-lg */
  font-weight: 700; /* font-bold */
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.btn-primary:hover {
  background-color: #3182ce; /* blue-600 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
}

.btn-primary:disabled {
  background-color: #a0aec0; /* gray-400 */
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-secondary {
  background-color: #e2e8f0; /* gray-200 */
  color: #2d3748; /* gray-800 */
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.btn-secondary:hover {
  background-color: #cbd5e0; /* gray-300 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Messages de succès et d'erreur d'API */
.success-message {
  color: #38a169; /* green-600 */
  font-weight: 600;
}
.input-error,
.validation-error-text,
.error-message {
  color: #e53e3e; /* red-600 */
  font-weight: 600;
}
</style>
