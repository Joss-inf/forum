<!-- src/components/CreateCommentForm.vue -->
<script setup lang="ts">
// 1. Importer la constante
import { useCommentSubmit, COMMENT_MAX_LENGTH } from '@/composables/useCommentSubmit';
import type { Comment } from '@/types';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/buttons/BaseButton.vue';
import BaseMessageAlert from '@/components/BaseMessageAlert.vue';

const props = defineProps<{postId: number}>();
const emit = defineEmits<{(e: 'comment-created', comment: Comment): void}>();

const { content, isLoading, error, submitComment } = useCommentSubmit({
  postId: props.postId,
  onSuccess: (comment) => emit('comment-created', comment),
});
</script>

<template>
  <form @submit.prevent="submitComment" class="comment-form">
    <h4 class="form-title">Laisser un commentaire</h4>
    
    <!-- 2. Utiliser la prop maxlength -->
    <BaseInput
      id="comment-content"
      type="textarea"
      v-model="content"
      placeholder="Partagez vos pensées, questions ou solutions..."
      :rows="4"
      :maxlength="COMMENT_MAX_LENGTH"
    />
    
    <BaseMessageAlert v-if="error" :text="error" type="error" />
    
    <div class="form-actions">
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Envoi...' : 'Envoyer' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
/* 3. "Un petit CSS en plus" */
.comment-form {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
  border-radius: 0 0 12px 12px; /* Arrondir seulement le bas pour s'intégrer */
}

.form-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end; /* Aligner le bouton à droite */
  margin-top: 1rem;
}
</style>