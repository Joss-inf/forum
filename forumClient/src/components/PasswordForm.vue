<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useAuthValidation } from '@/composables/useAuthValidation';
import BaseInput from '@/components/BaseInput.vue';
import BaseMessageAlert from '@/components/BaseMessageAlert.vue'

const authStore = useAuthStore();
const passwordForm = ref({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
const messages = reactive({ success: null as string | null, error: null as string | null });

const { validationErrors, validateCurrentPassword, validatePassword, validateConfirmPassword, validateAllFields, isFormValid } = useAuthValidation(passwordForm);

const handleUpdate = async () => {
    messages.success = null;
    messages.error = null;
    validateAllFields();

    if (!isFormValid.value) {
        const firstError = document.querySelector('.edit-form .error-text');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    try {
        await authStore.changePassword({ currentPassword: passwordForm.value.currentPassword, newPassword: passwordForm.value.newPassword });
        messages.success = 'Mot de passe mis à jour.';
    } catch (err: any) {
        messages.error = err.response?.data?.message || 'Erreur lors du changement de mot de passe.';
    }
};
</script>
<template>
  <div class="edit-form">
    <h2 class="sub-title">Nouveau mot de passe</h2>

    <BaseMessageAlert :text="messages.success" type="success" />
    <BaseMessageAlert :text="messages.error" type="error" />

    <form @submit.prevent="handleUpdate" class="password-form" novalidate>
      <BaseInput
        id="current-password"
        label="Mot de passe actuel"
        type="password"
        v-model="passwordForm.currentPassword"
        :error="validationErrors.currentPassword"
        @blur="validateCurrentPassword"
      />

      <BaseInput
        id="new-password"
        label="Nouveau mot de passe"
        type="password"
        v-model="passwordForm.newPassword"
        :error="validationErrors.newPassword"
        @blur="validatePassword"
      />

      <BaseInput
        id="confirm-new-password"
        label="Confirmer le nouveau mot de passe"
        type="password"
        v-model="passwordForm.confirmNewPassword"
        :error="validationErrors.confirmNewPassword"
        @blur="validateConfirmPassword"
      />

      <div class="action-row">
        <button class="btn primary" :disabled="!isFormValid">Mettre à jour</button>
        <button type="button" class="btn secondary" @click="$emit('cancel')">Annuler</button>
      </div>
    </form>
  </div>
</template>
<style scoped>
.edit-form {
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.sub-title {
  font-size: 1.3rem;
  font-weight: 500;
  color: #202124;
  margin-bottom: 1rem;
  text-align: center;
}

/* Messages d’état */
.message {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.message.success {
  background-color: #e6f4ea;
  color: #188038;
}

.message.error {
  background-color: #fce8e6;
  color: #d93025;
}

/* Formulaire */
.password-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Actions */
.action-row {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

/* Boutons */
.btn {
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.btn.primary {
  background-color: #1a73e8;
  color: #fff;
}

.btn.primary:hover {
  background-color: #1669c2;
}

.btn.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.secondary {
  background-color: #f1f3f4;
  color: #202124;
}

.btn.secondary:hover {
  background-color: #e8eaed;
}

/* Accent visuel pour le formulaire de mot de passe */
.password-form input[type="password"] {
  letter-spacing: 0.05em;
}

/* Responsive */
@media (max-width: 480px) {
  .edit-form {
    padding: 1rem;
  }

  .action-row {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>

