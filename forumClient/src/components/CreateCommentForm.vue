<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import apiClient from '@/services/apiClient';
import type { Comment } from '@/types';

const props = defineProps<{
  postId: number
}>();

const emit = defineEmits<{
  (e: 'comment-created', comment: Comment): void
}>();

const content: Ref<string> = ref('');
const isLoading: Ref<boolean> = ref(false);
const error: Ref<string | null> = ref(null);

async function handleSubmit() {
  if (!content.value.trim()) return;

  isLoading.value = true;
  error.value = null;

  try {
    const response = await apiClient.post<Comment>(`/posts/${props.postId}/comments`, {
      content: content.value
    });
    emit('comment-created', response.data);
    content.value = ''; // Vider le formulaire
  } catch (err: any) {
    error.value = err.response?.data?.message || "Erreur lors de l'envoi du commentaire.";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="comment-form">
    <h4>Ajouter un commentaire</h4>
    <textarea 
      v-model="content"
      rows="3"
      placeholder="Votre commentaire..."
      required
    ></textarea>
    <p v-if="error" class="error-message">{{ error }}</p>
    <button type="submit" :disabled="isLoading">
      {{ isLoading ? 'Envoi...' : 'Envoyer' }}
    </button>
  </form>
</template>

<style scoped>
.comment-form {
  margin-top: 2rem;
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}
textarea {
  min-width: 100%;
  max-width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-sizing: border-box;
  font-family: inherit;
  margin-bottom: 1rem;

}
button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: var(--primary-color);
  color: white;
  cursor: pointer;
}
button:disabled {
  background-color: var(--secondary-color);
}
.error-message { color: #dc3545; }
</style>