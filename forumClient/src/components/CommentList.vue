<script setup lang="ts">
import type { Comment } from '@/types';
import { useAuthStore } from '@/stores/auth';
import apiClient from '@/services/apiClient';

// On récupère le store pour savoir qui est l'utilisateur connecté
const authStore = useAuthStore();

defineProps<{
  comments: Comment[]
}>();

// On définit l'événement que ce composant peut émettre vers son parent
const emit = defineEmits<{
  (e: 'comment-deleted', commentId: number): void
}>();

async function deleteComment(commentId: number) {
  // C'est une bonne pratique de demander confirmation pour une action destructive
  if (!confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
    return;
  }

  try {
    // On appelle l'API pour supprimer le commentaire
    await apiClient.delete(`/comments/${commentId}`);
    // Si la suppression réussit, on émet l'événement vers le parent
    emit('comment-deleted', commentId);
  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire:", error);
    alert("Une erreur est survenue. Impossible de supprimer le commentaire.");
  }
}
</script>

<template>
  <div class="comment-list-container">
    <h3>Commentaires</h3>
    <ul v-if="comments.length > 0" class="comment-list">
      <li v-for="comment in comments" :key="comment.id" class="comment-item">
        <p class="comment-content">{{ comment.content }}</p>
        <div class="comment-footer">
          <div class="comment-meta">
            Par <span class="author">{{ comment.author_username }}</span>
            le <span class="date">{{ new Date(comment.created_at).toLocaleString('fr-FR') }}</span>
          </div>
          <!--
            LE POINT CLÉ : On affiche le bouton uniquement si l'ID de l'utilisateur
            connecté correspond à l'ID de l'auteur du commentaire.
          -->
          <button 
            v-if="authStore.user?.id === comment.user_id" 
            @click="deleteComment(comment.id)"
            class="delete-button"
            title="Supprimer mon commentaire"
          >
            Supprimer
          </button>
        </div>
      </li>
    </ul>
    <p v-else class="empty-state">Soyez le premier à commenter !</p>
  </div>
</template>

<style scoped>
.comment-list-container {
  margin-top: 2rem;
}
.comment-list {
  list-style: none;
  padding: 0;
}
.comment-item {
  border: 1px solid var(--border-color);
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 5px;
}
.comment-content {
  margin-top: 0;
}
.comment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}
.comment-meta {
  font-size: 0.85rem;
  color: var(--secondary-color);
}
.author {
  font-weight: 500;
}
.empty-state {
  color: var(--secondary-color);
  padding: 1rem;
  text-align: center;
}
.delete-button {
  background-color: transparent;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
}
.delete-button:hover {
  background-color: #dc3545;
  color: white;
}
</style>