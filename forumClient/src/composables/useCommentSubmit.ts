// src/composables/useCommentSubmit.ts
import { ref } from 'vue';
import apiClient from '@/services/apiClient';
import type { Comment } from '@/types';
import { useAuthStore } from '@/stores/auth';

// 1. Définir et exporter la constante de limite
export const COMMENT_MAX_LENGTH = 1000;

interface UseCommentSubmitOptions {
  postId: number;
  onSuccess?: (comment: Comment) => void;
}

export function useCommentSubmit({ postId, onSuccess }: UseCommentSubmitOptions) {
  const authStore = useAuthStore();
  const content = ref('');
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function submitComment() {
    error.value = null;

    // 2. Ajouter la logique de validation
    if (!content.value.trim()) {
      error.value = 'Le commentaire ne peut pas être vide.';
      return;
    }
    if (content.value.length > COMMENT_MAX_LENGTH) {
      error.value = `Le commentaire ne doit pas dépasser ${COMMENT_MAX_LENGTH} caractères.`;
      return;
    }

    isLoading.value = true;
    try {
      const response = await apiClient.post<Comment>(`/posts/${postId}/comments`, { content: content.value });
      
      const newComment: Comment = {
        ...response.data,
        author_username: authStore.user?.username || 'Vous'
      };

      // Appeler le callback de succès si fourni
      if (onSuccess) {
        onSuccess(newComment);
      }
      
      content.value = ''; // Vider le champ après succès
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de l\'envoi du commentaire.';
    } finally {
      isLoading.value = false;
    }
  }

  return {
    content,
    isLoading,
    error,
    submitComment
  };
}