<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useAuthValidation } from '@/composables/useAuthValidation';

const authStore = useAuthStore();

const isEditingProfile = ref(false);
const profileApiError = ref<string | null>(null);
const profileSuccessMessage = ref<string | null>(null);

const editForm = ref({
  username: '',
  email: '',
  confirmEmail: ''
});

const isChangingPassword = ref(false);
const passwordApiError = ref<string | null>(null);
const passwordSuccessMessage = ref<string | null>(null);

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
});

// validation composable
const {
  validationErrors: profileValidationErrors,
  validateUsername,
  validateEmail,
  validateConfirmEmail,
  validateAllFields: validateAllProfileFields,
  isFormValid: isProfileFormValid
} = useAuthValidation(editForm);

const {
  validationErrors: passwordValidationErrors,
  validateCurrentPassword,
  validatePassword: validateNewPassword,
  validateConfirmPassword: validateConfirmNewPassword,
  validateAllFields: validateAllPasswordFields,
  isFormValid: isPasswordFormValid
} = useAuthValidation(passwordForm);

// computed for email masking
const maskEmail = (email: string): string => {
  if (!email || typeof email !== 'string') return '';
  const at = email.indexOf('@');
  if (at <= 1) return email;
  const local = email.substring(0, at);
  const domain = email.substring(at);
  const masked = local.length > 2
    ? local.substring(0,2) + '*'.repeat(local.length - 2)
    : '*'.repeat(local.length);
  return masked + domain;
};

const displayedEmail = computed(() => {
  return authStore.user ? maskEmail(authStore.user.email) : '';
});

// fill form initially
watch(() => authStore.user, (u) => {
  if (u) {
    editForm.value.username = u.username;
    editForm.value.email = u.email;
    editForm.value.confirmEmail = u.email;
  }
}, { immediate: true });

// methods
const startEditing = () => {
  isEditingProfile.value = true;
  profileApiError.value = null;
  profileSuccessMessage.value = null;
};

const cancelEditing = () => {
  isEditingProfile.value = false;
};

const handleProfileUpdate = async () => {
  profileApiError.value = null;
  profileSuccessMessage.value = null;
  validateAllProfileFields();
  if (!isProfileFormValid.value) {
    await nextTick();
    const first = document.querySelector('.profile-form .error-text');
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  try {
    await authStore.updateProfile({
      username: editForm.value.username,
      email: editForm.value.email
    });
    profileSuccessMessage.value = 'Profil mis à jour.';
    isEditingProfile.value = false;
  } catch (err: any) {
    profileApiError.value = err.response?.data?.message || 'Erreur lors de la mise à jour.';
  }
};

const togglePasswordChange = () => {
  isChangingPassword.value = !isChangingPassword.value;
  passwordApiError.value = null;
  passwordSuccessMessage.value = null;
};

const handlePasswordChange = async () => {
  passwordApiError.value = null;
  passwordSuccessMessage.value = null;
  validateAllPasswordFields();
  if (!isPasswordFormValid.value) {
    await nextTick();
    const first = document.querySelector('.password-form .error-text');
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  try {
    await authStore.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    });
    passwordSuccessMessage.value = 'Mot de passe mis à jour.';
    isChangingPassword.value = false;
  } catch (err: any) {
    passwordApiError.value = err.response?.data?.message || 'Erreur lors du changement de mot de passe.';
  }
};
</script>
<template>
  <div class="profile-page-container">
    <div class="profile-card">
      <h1 class="profile-title">Mon Profil</h1>
      
      <!-- Messages de succès / erreur -->
      <div class="message-area">
        <p v-if="profileSuccessMessage" class="message success">{{ profileSuccessMessage }}</p>
        <p v-if="profileApiError" class="message error">{{ profileApiError }}</p>
        <p v-if="passwordSuccessMessage" class="message success">{{ passwordSuccessMessage }}</p>
        <p v-if="passwordApiError" class="message error">{{ passwordApiError }}</p>
      </div>
      
      <!-- Visualisation du profil -->
      <div v-if="!isEditingProfile" class="profile-info">
        <div class="info-row">
          <span class="label">Nom d'utilisateur</span>
          <span class="value">{{ authStore.user.username }}</span>
        </div>
        <div class="info-row">
          <span class="label">Email</span>
          <span class="value">{{ displayedEmail }}</span>
        </div>
        <div class="action-row">
          <button class="btn primary" @click="startEditing">Modifier le profil</button>
        </div>
      </div>
      
      <!-- Édition du profil -->
      <div v-else class="edit-form">
        <h2 class="sub-title">Modifier mes informations</h2>
        <form @submit.prevent="handleProfileUpdate" novalidate>
          <div class="form-group">
            <label for="edit-username">Nom d'utilisateur</label>
            <input
              id="edit-username"
              type="text"
              v-model="editForm.username"
              @blur="validateUsername"
              :class="{ 'input-error': profileValidationErrors.username }"
              placeholder="Entrez votre nom d'utilisateur"
            />
            <span v-if="profileValidationErrors.username" class="error-text">{{ profileValidationErrors.username }}</span>
          </div>
          
          <div class="form-group">
            <label for="edit-email">Email</label>
            <input
              id="edit-email"
              type="email"
              v-model="editForm.email"
              @blur="validateEmail"
              :class="{ 'input-error': profileValidationErrors.email }"
              placeholder="Entrez votre email"
            />
            <span v-if="profileValidationErrors.email" class="error-text">{{ profileValidationErrors.email }}</span>
          </div>
          
          <div class="form-group">
            <label for="edit-confirm-email">Confirmer l’email</label>
            <input
              id="edit-confirm-email"
              type="email"
              v-model="editForm.confirmEmail"
              @blur="validateConfirmEmail"
              :class="{ 'input-error': profileValidationErrors.confirmEmail }"
              placeholder="Confirmez votre email"
            />
            <span v-if="profileValidationErrors.confirmEmail" class="error-text">{{ profileValidationErrors.confirmEmail }}</span>
          </div>
          
          <div class="action-row">
            <button class="btn primary" :disabled="!isProfileFormValid">Enregistrer</button>
            <button type="button" class="btn secondary" @click="cancelEditing">Annuler</button>
          </div>
        </form>
      </div>
      
      <!-- Section changement de mot de passe -->
      <div class="password-section">
        <div v-if="!isChangingPassword">
          <button class="btn primary outline" @click="togglePasswordChange">Changer le mot de passe</button>
        </div>
        <div v-else class="edit-form">
          <h2 class="sub-title">Nouveau mot de passe</h2>
          <form @submit.prevent="handlePasswordChange" novalidate>
            <div class="form-group">
              <label for="current-password">Mot de passe actuel</label>
              <input
                id="current-password"
                type="password"
                v-model="passwordForm.currentPassword"
                @blur="validateCurrentPassword"
                :class="{ 'input-error': passwordValidationErrors.currentPassword }"
                placeholder="Mot de passe actuel"
              />
              <span v-if="passwordValidationErrors.currentPassword" class="error-text">{{ passwordValidationErrors.currentPassword }}</span>
            </div>
            
            <div class="form-group">
              <label for="new-password">Nouveau mot de passe</label>
              <input
                id="new-password"
                type="password"
                v-model="passwordForm.newPassword"
                @blur="validateNewPassword"
                :class="{ 'input-error': passwordValidationErrors.newPassword }"
                placeholder="Nouveau mot de passe"
              />
              <span v-if="passwordValidationErrors.newPassword" class="error-text">{{ passwordValidationErrors.newPassword }}</span>
            </div>
            
            <div class="form-group">
              <label for="confirm-new-password">Confirmer le nouveau mot de passe</label>
              <input
                id="confirm-new-password"
                type="password"
                v-model="passwordForm.confirmNewPassword"
                @blur="validateConfirmNewPassword"
                :class="{ 'input-error': passwordValidationErrors.confirmNewPassword }"
                placeholder="Confirmez le nouveau mot de passe"
              />
              <span v-if="passwordValidationErrors.confirmNewPassword" class="error-text">{{ passwordValidationErrors.confirmNewPassword }}</span>
            </div>
            
            <div class="action-row">
              <button class="btn primary" :disabled="!isPasswordFormValid">Mettre à jour</button>
              <button type="button" class="btn secondary" @click="togglePasswordChange">Annuler</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    
    
  </div>
</template>



<style scoped>
/* Style inspiré Material / Google */

.profile-page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  background-color: #f1f3f4;
  min-height: 100vh;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

.profile-card {
  background-color: white;
  border-radius: 8px;
  max-width: 480px;
  width: 100%;
  height: fit-content;
  padding: 2rem;
  box-shadow: 0px 2px 4px rgba(0,0,0,0.2), 0px 1px 1px rgba(0,0,0,0.14), 0px 1px 3px rgba(0,0,0,0.12);
}

.profile-title {
  font-size: 1.8rem;
  font-weight: 500;
  color: #202124;
  margin-bottom: 1.5rem;
  text-align: center;
}

.message-area {
  margin-bottom: 1rem;
}

.message {
  padding: 0.75rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.message.success {
  background-color: #e6f4ea;
  color: #188038;
}

.message.error {
  background-color: #fce8e6;
  color: #d93025;
}

.profile-info, .edit-form {
  margin-bottom: 1.5rem;
  border: solid 1px #e0e0e0;
  padding: 5px;
  border-radius: 5px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.info-row .label {
  color: #5f6368;
  font-weight: 500;
}

.info-row .value {
  color: #202124;
}

.sub-title {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: #202124;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  color: #3c4043;
  margin-bottom: 0.4rem;
}

.form-group input {
  width: -moz-available;
  width: -webkit-fill-available;
  width: fill-available;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #dadce0;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s ease;
  
}

.form-group input:focus {
  border-color: #1a73e8;
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
}

.input-error {
  border-color: #d93025 !important;
}

.error-text {
  color: #d93025;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.action-row {
  display: flex;
  justify-content: flex-end;
  margin: 4px;
}

.btn {
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn.primary {
  background-color: #1a73e8;
  color: white;
  float: right;
}

.btn.primary:hover {
  background-color: #1669c2;
}

.btn.secondary {
  background-color: #f1f3f4;
  color: #202124;
}

.btn.secondary:hover {
  background-color: #e8eaed;
}

.password-section {
  margin-top: 2rem;
  border-top: 1px solid #e0e0e0;
  padding-top: 1.5rem;
}

.loading-state {
  font-size: 1rem;
  color: #5f6368;
  text-align: center;
}
</style>
