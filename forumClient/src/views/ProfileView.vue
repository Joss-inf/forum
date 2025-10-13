<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import UserForm from '@/components/UserForm.vue';
import PasswordForm from '@/components/PasswordForm.vue';
import { maskEmail } from '@/composables/useMaskEmail.ts';

const authStore = useAuthStore();
const isEditingProfile = ref(false);
const isChangingPassword = ref(false);
const displayedEmail = computed(() => authStore.user ? maskEmail(authStore.user.email) : '');

const startEditing = () => { isEditingProfile.value = true; };
const cancelEditing = () => { isEditingProfile.value = false; };
const togglePasswordChange = () => { isChangingPassword.value = !isChangingPassword.value; };
</script>

<template>
  <div class="profile-page-container">
    <div class="profile-card">
      <h1 class="profile-title">Mon Profil</h1>

      <!-- Affichage profil -->
      <div v-if="!isEditingProfile" class="profile-info">
        <div class="info-row">
          <span class="label">Nom d'utilisateur</span>
          <span class="value">{{ authStore.user?.username }}</span>
        </div>
        <div class="info-row">
          <span class="label">Email</span>
          <span class="value">{{ displayedEmail }}</span>
        </div>
        <div class="action-row">
          <button class="btn primary" @click="startEditing">Modifier le profil</button>
        </div>
      </div>

      <!-- Formulaire utilisateur -->
      <UserForm v-else @cancel="cancelEditing" />

      <!-- Section changement mot de passe -->
      <div class="password-section">
        <div v-if="!isChangingPassword">
          <button class="btn primary outline" @click="togglePasswordChange">Changer le mot de passe</button>
        </div>
        <div v-else>
          <PasswordForm @cancel="togglePasswordChange" />
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
  align-items: flex-start; /* Aligner en haut pour les pages longues */
  padding: var(--space-xl);
  background-color: var(--color-background-body);
  min-height: 100vh;
}

.profile-card {
  background-color: var(--color-background-card);
  border-radius: var(--radius-xl);
  max-width: 500px;
  width: 100%;
  padding: var(--space-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
}

.profile-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-text-headings);
  margin-bottom: var(--space-lg);
  text-align: center;
}

/* 
  Note : Les styles pour .message, .form-group, .input-error, .error-text
  devraient être gérés par les composants enfants (BaseMessageAlert, BaseInput).
  Je les laisse ici car la consigne est de ne modifier que ce fichier,
  mais dans une refonte complète, ils disparaîtraient.
*/

.profile-info, .edit-form {
  margin-bottom: var(--space-lg);
  border: 1px solid var(--color-border);
  padding: var(--space-sm);
  border-radius: var(--radius-md);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-sm);
  border-bottom: 1px solid var(--color-border);
}

.info-row:last-child {
  border-bottom: none;
}

.info-row .label {
  color: var(--color-text-muted);
  font-weight: 500;
}

.info-row .value {
  color: var(--color-text-body);
  font-weight: 500;
}

.action-row {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  margin-top: var(--space-md);
}

.password-section {
  margin-top: var(--space-lg);
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-lg);
}

/* 
  Les styles des boutons (.btn) devraient être gérés par le composant BaseButton.
  Si vous utilisez des <button> natifs, ce CSS les alignera avec le design system.
*/
.btn {
  padding: var(--space-sm) var(--space-lg);
  font-size: 0.95rem;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.btn.primary {
  background-color: var(--color-primary);
  color: var(--color-text-light);
}
.btn.primary:hover {
  background-color: var(--color-primary-dark);
}

.btn.primary.outline {
  background-color: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.btn.primary.outline:hover {
  background-color: hsl(153, 48%, 95%);
}

.btn.secondary {
  background-color: var(--color-background-alt);
  color: var(--color-text-body);
  border-color: var(--color-border);
}
.btn.secondary:hover {
  background-color: hsl(210, 20%, 90%);
}

.loading-state {
  text-align: center;
  color: var(--color-text-muted);
  padding: var(--space-xl);
}
</style>
