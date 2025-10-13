<!-- src/views/PostDetailView.vue -->
<script setup lang="ts" vapor>
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usePost } from '@/composables/usePostDetail.ts'; 
import CommentList from '@/components/CommentList.vue';
import CreateCommentForm from '@/components/CreateCommentForm.vue';

const route = useRoute();
const authStore = useAuthStore();
const postId = Number(route.params.id);

// On appelle le composable qui nous fournit toute la logique et l'état.
const {
  post,
  comments,
  isLoading,
  error,
  canDelete,
  deletePost,
  addComment,
  removeComment
} = usePost(postId);
</script>

<template>
  <div class="post-detail-view">
    <div v-if="isLoading" class="loading-state">Chargement...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    
    <div v-else-if="post" class="post-wrapper">
      <article class="post-card">
        <header class="post-header">
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-meta">
            <span>Par <strong>{{ post.author_username }}</strong></span>
            <span class="dot">•</span>
            <span>{{ new Date(post.created_at).toLocaleDateString('fr-FR') }}</span>
            <span class="tag">{{ post.tag_name }}</span>
            <button v-if="canDelete" @click="deletePost" class="delete-post-button">
              Supprimer
            </button>
          </div>
        </header>
        <div class="post-body" v-html="post.content"></div>
      </article>

      <section class="comments-section">
        <hr class="separator" />
        <CommentList 
          :comments="comments" 
          @comment-deleted="removeComment" 
        />
        <CreateCommentForm
          v-if="authStore.isAuthenticated"
          :post-id="postId"
          @comment-created="addComment"
        />
        <div v-else class="comment-warning">
          <RouterLink to="/login">Connectez-vous</RouterLink> pour laisser un commentaire.
        </div>
      </section>
    </div>
  </div>
</template>


    
<style scoped>
/*
 * ==========================================================================
 *  DESIGN REFACTORISÉ POUR UNE EXPÉRIENCE PREMIUM
 * ==========================================================================
 */

.post-detail-view {
  /* On utilise la classe .container pour centrer et espacer le contenu */
  max-width: 800px; /* Largeur idéale pour la lecture d'articles */
  margin: 0 auto;
  padding: var(--space-xl) var(--space-lg);
}

.post-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

/* --- Le Post Principal --- */
.post-card {
  /* On n'utilise pas la classe .card pour avoir plus de contrôle */
  background-color: var(--color-background-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
}

.post-header {
  padding-bottom: var(--space-lg);
  margin-bottom: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

.post-title {
  font-size: 2.5rem; /* Plus grand et impactant */
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text-headings);
  margin-bottom: var(--space-md);
  overflow-wrap: break-word;
}

.post-meta {
  display: flex;
  flex-wrap: wrap; /* Passe à la ligne sur mobile */
  align-items: center;
  gap: var(--space-sm) var(--space-md);
  color: var(--color-text-muted);
  font-size: 0.95rem;
}

.post-meta .dot {
  /* Caché car on utilise une autre méthode de séparation */
  display: none;
}

/* Ajoute une séparation élégante entre les métadonnées */
.post-meta > span:not(:last-child)::after {
  content: '•';
  margin-left: var(--space-md);
  color: var(--color-border);
}

.post-meta .tag {
  background-color: var(--color-background-alt);
  color: var(--color-text-body);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-weight: 500;
  font-size: 0.85rem;
}

.post-meta .tag::after {
  /* Le tag est le dernier, pas de séparateur après */
  content: none;
}

.delete-post-button {
  /* On le place à part pour un meilleur contrôle */
  margin-left: auto;
  background-color: transparent;
  color: var(--color-danger);
  border: 1px solid transparent;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
}
.delete-post-button:hover {
  background-color: hsl(0, 72%, 95%);
  border-color: var(--color-danger);
}

.post-body {
  font-size: 1.1rem;
  line-height: 1.8; /* Interlignage généreux pour la lisibilité */
  color: var(--color-text-body);
  white-space: pre-wrap;
  overflow-wrap: break-word;
}
/* Style pour le contenu HTML (code, citations, etc.) */
.post-body :deep(h2) {
  font-size: 1.5rem;
  margin: var(--space-lg) 0 var(--space-md) 0;
}
.post-body :deep(p) {
  margin-bottom: var(--space-md);
}
.post-body :deep(code) {
  background-color: var(--color-background-alt);
  padding: 0.2rem 0.4rem;
  border-radius: var(--radius-md);
  font-size: 0.9em;
}

/* --- Section des Commentaires --- */
.comments-section {
  /* Les commentaires sont visuellement séparés du post principal */
}

.separator {
  display: none; /* Remplacé par un espacement plus moderne */
}

.comment-warning {
  text-align: center;
  padding: var(--space-xl);
  background-color: var(--color-background-alt);
  border-radius: var(--radius-lg);
  color: var(--color-text-muted);
}
.comment-warning a {
  color: var(--color-secondary);
  font-weight: 600;
  text-decoration: none;
}
.comment-warning a:hover {
  text-decoration: underline;
}

/* --- États de la page --- */
.loading-state,
.error-message {
  text-align: center;
  padding: 6rem var(--space-lg);
  color: var(--color-text-muted);
  font-size: 1.2rem;
}

.error-message {
  color: var(--color-danger);
  font-weight: 500;
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .post-detail-view {
    padding-top: var(--space-lg);
  }
  .post-card {
    padding: var(--space-lg);
  }
  .post-title {
    font-size: 2rem;
  }
}
</style>

  