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
/* Conteneur principal de la liste de commentaires */
.comment-list-container {
  margin-top: 2rem;
}

/* Liste de commentaires */
.comment-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Élément de commentaire individuel */
.comment-item {
  background-color: #ffffff; /* Fond blanc pur pour le contraste */
  border: 1px solid #e9ecef; /* Bordure très fine et subtile */
  padding: 1.5rem;
  margin-bottom: 1.2rem;
  border-radius: 12px; /* Coins arrondis pour la douceur */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04); /* Ombre légère pour la profondeur */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.comment-item:hover {
  transform: translateY(-3px); /* Effet de survol subtil */
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

/* Contenu du commentaire */
.comment-content {
  margin-top: 0;
  line-height: 1.6; /* Pour une meilleure lisibilité */
  color: #333;
}

/* Pied de page du commentaire (méta-données et bouton) */
.comment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 0.8rem;
  border-top: 1px solid #f0f0f0; /* Séparateur discret */
}

/* Méta-données (auteur, date) */
.comment-meta {
  font-size: 0.9rem;
  color: #777;
}

.author {
  font-weight: 600;
  color: #555;
}

/* Bouton de suppression */
.delete-button {
  background-color: transparent;
  border: 1px solid #e74c3c; /* Rouge pour le danger */
  color: #e74c3c;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.delete-button:hover {
  background-color: #e74c3c;
  color: white;
}

/* État vide */
.empty-state {
  color: #999;
  padding: 2rem;
  text-align: center;
  font-style: italic;
  font-size: 1rem;
}

</style>