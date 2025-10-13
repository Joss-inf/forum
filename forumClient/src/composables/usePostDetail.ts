// src/composables/usePost.ts
import { ref, computed, onMounted } from 'vue';
import type { Ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import apiClient from '@/services/apiClient';
import type { Post, Comment } from '@/types';

/**
 * Composable pour gérer la logique d'un post et de ses commentaires.
 * @param postId L'ID du post à gérer.
 */
export function usePost(postId: number) {
  // Dépendances externes
  const router = useRouter();
  const authStore = useAuthStore();

  // --- État Réactif ---
  const post: Ref<Post | null> = ref(null);
  const comments: Ref<Comment[]> = ref([]);
  const isLoading: Ref<boolean> = ref(true);
  const error: Ref<string | null> = ref(null);

  // --- Propriétés Calculées ---
  /**
   * Vérifie si l'utilisateur actuel a le droit de supprimer le post.
   */
  const canDelete = computed(() => !!(
    authStore.isAuthenticated &&
    authStore.user &&
    post.value &&
    authStore.user.id === post.value.user_id
  ));

  // --- Méthodes ---
  /**
   * Récupère le post et ses commentaires depuis l'API.
   */
  async function fetchPostAndComments() {
    isLoading.value = true;
    error.value = null;
    try {
      const postPromise = apiClient.get<Post>(`/posts/${postId}`);
      const commentsPromise = apiClient.get<Comment[]>(`/posts/${postId}/comments`);
      
      const [postResponse, commentsResponse] = await Promise.all([postPromise, commentsPromise]);

      post.value = postResponse.data;
      comments.value = commentsResponse.data;
    } catch (err) {
      error.value = "Impossible de charger le post ou les commentaires.";
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Supprime le post actuel et redirige vers le forum.
   */
  async function deletePost() {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce sujet ? Cette action est irréversible.")) {
      return;
    }
    try {
      await apiClient.delete(`/posts/${postId}`);
      await router.push({ name: 'forum' });
    } catch (err) {
      console.error("Erreur lors de la suppression du post:", err);
      alert("Une erreur est survenue. Impossible de supprimer ce sujet.");
    }
  }

  /**
   * Ajoute un nouveau commentaire à la liste (réaction à un événement).
   */
  function addComment(newComment: Comment) {
    comments.value.push(newComment);
  }

  /**
   * Supprime un commentaire de la liste (réaction à un événement).
   */
  function removeComment(deletedCommentId: number) {
    comments.value = comments.value.filter(comment => comment.id !== deletedCommentId);
  }

  // --- Cycle de vie ---
  // Lance la récupération des données dès que le composable est utilisé.
  onMounted(fetchPostAndComments);

  // --- Exposition ---
  // On retourne tout ce dont le composant de vue aura besoin.
  return {
    post,
    comments,
    isLoading,
    error,
    canDelete,
    deletePost,
    addComment,
    removeComment
  };
}