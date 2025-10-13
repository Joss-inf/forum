<script setup lang="ts">
import { ref, reactive, nextTick, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useAuthValidation } from '@/composables/useAuthValidation';
import BaseInput from '@/components/BaseInput.vue';
import BaseMessageAlert from '@/components/BaseMessageAlert.vue'
const authStore = useAuthStore();
const formContainer = ref<HTMLElement | null>(null);
const editForm = ref({ username: '', email: '', confirmEmail: '' });
const messages = reactive({ success: null as string | null, error: null as string | null });

const { validationErrors, validateUsername, validateEmail, validateConfirmEmail, validateAllFields, isFormValid } = useAuthValidation(editForm);

watch(() => authStore.user, (u) => {
  if (u) {
    editForm.value.username = u.username;
    editForm.value.email = u.email;
    editForm.value.confirmEmail = u.email;
  }
}, { immediate: true });

const handleUpdate = async () => {
  messages.success = null;
  messages.error = null;
  validateAllFields();

  if (!isFormValid.value) {
    await nextTick();
    const firstError = formContainer.value?.querySelector('.error-message');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  try {
    await authStore.updateProfile({ username: editForm.value.username, email: editForm.value.email });
    messages.success = 'Profil mis à jour.';
  } catch (err: any) {
    messages.error = err.response?.data?.message || 'Erreur lors de la mise à jour.';
  }
};
</script>

<template>
  <div class="edit-form " ref="formContainer">
    <h2 class="sub-title">Modifier mes informations</h2>

    <BaseMessageAlert :text="messages.success" type="success" />
    <BaseMessageAlert :text="messages.error" type="error" />

    <form @submit.prevent="handleUpdate" class="profile-form" novalidate>
      <BaseInput
        id="edit-username"
        label="Nom d'utilisateur"
        type="text"
        v-model="editForm.username"
        :error="validationErrors.username"
        @blur="validateUsername"
      />

      <BaseInput
        id="edit-email"
        label="Email"
        type="email"
        v-model="editForm.email"
        :error="validationErrors.email"
        @blur="validateEmail"
      />

      <BaseInput
        id="edit-confirm-email"
        label="Confirmer l’email"
        type="email"
        v-model="editForm.confirmEmail"
        :error="validationErrors.confirmEmail"
        @blur="validateConfirmEmail"
      />

      <div class="action-row">
        <button class="btn primary" :disabled="!isFormValid">Enregistrer</button>
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
.profile-form {
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


