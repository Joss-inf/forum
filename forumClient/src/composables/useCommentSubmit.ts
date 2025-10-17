import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth';
import { useApi } from '@/composables/useApi'
import type { Comment, UseCommentSubmitOptions } from '@/types'


export const COMMENT_MAX_LENGTH = 1000

export function useCommentSubmit({ postId, onSuccess }: UseCommentSubmitOptions) {
  const authStore = useAuthStore()
  const content = ref('')

  // Crée un composable useApi pour le POST
  const { data, loading, error, execute } = useApi<Comment>(`/posts/${postId}/comments`, {
    method: 'POST',
    data: { content: '' }, // placeholder, sera remplacé dynamiquement
  })

  const submitComment = async () => {
    // Validation
    if (!content.value.trim()) {
      error.value = new Error('Le commentaire ne peut pas être vide.')
      return
    }
    if (content.value.length > COMMENT_MAX_LENGTH) {
      error.value = new Error(`Le commentaire ne doit pas dépasser ${COMMENT_MAX_LENGTH} caractères.`)
      return
    }

    // Execute le POST avec le contenu dynamique
    await execute({ data: { content: content.value } })

    if (!error.value && data.value) {
      const newComment: Comment = {
        ...data.value,
        author_username: authStore.user?.username || 'Vous',
      }

      onSuccess?.(newComment)
      content.value = '' // reset
    }
  }

  return {
    content,
    isLoading: loading,
    error,
    submitComment,
  }
}
