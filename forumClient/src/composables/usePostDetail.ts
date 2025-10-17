// src/composables/usePost.ts
import { ref, computed, onMounted, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useApi } from '@/composables/useApi'
import type { Post, Comment } from '@/types'

/**
 * Composable pour gérer la logique d'un post et de ses commentaires.
 * @param postId L'ID du post à gérer.
 */
export function usePost(postId: number) {
  const router = useRouter()
  const authStore = useAuthStore()

  // --- État Réactif ---
  const post: Ref<Post | null> = ref(null)
  const comments: Ref<Comment[]> = ref([])

  // GET Post
  const {
    data: postData,
    loading: postLoading,
    error: postError,
    execute: fetchPost
  } = useApi<Post>(`/posts/${postId}`, { method: 'GET' })

  // GET Comments
  const {
    data: commentsData,
    loading: commentsLoading,
    error: commentsError,
    execute: fetchComments
  } = useApi<Comment[]>(`/posts/${postId}/comments`, { method: 'GET' })

  // --- Propriétés Calculées ---
  const isLoading = computed(() => postLoading.value || commentsLoading.value)
  const error = computed(() => postError.value?.message || commentsError.value?.message || null)

  const canDelete = computed(() =>
    !!(authStore.isAuthenticated && authStore.user && post.value && authStore.user.id === post.value.user_id)
  )

  // --- Méthodes ---
  async function fetchPostAndComments() {
    await Promise.all([fetchPost(), fetchComments()])
    if (postData.value) post.value = postData.value
    if (commentsData.value) comments.value = commentsData.value
  }

  async function deletePost() {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce sujet ? Cette action est irréversible.")) return

    try {
      await useApi<void>(`/posts/${postId}`, { method: 'DELETE' }).execute()
      await router.push({ name: 'forum' })
    } catch (err) {
      console.error("Erreur lors de la suppression du post:", err)
      alert("Une erreur est survenue. Impossible de supprimer ce sujet.")
    }
  }

  function addComment(newComment: Comment) {
    comments.value.push(newComment)
  }

  function removeComment(deletedCommentId: number) {
    comments.value = comments.value.filter(comment => comment.id !== deletedCommentId)
  }

  // --- Cycle de vie ---
  onMounted(fetchPostAndComments)

  // --- Exposition ---
  return {
    post,
    comments,
    isLoading,
    error,
    canDelete,
    deletePost,
    addComment,
    removeComment
  }
}
