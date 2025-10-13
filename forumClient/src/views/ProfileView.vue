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
