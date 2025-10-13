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
:root {
  --primary-color: #3e81f5;
  --primary-color-dark: #2a61c4;
  --danger-color: #e74c3c;
  --danger-color-dark: #c0392b;
  --text-color: #333;
  --text-muted: #6c757d;
  --bg-color: #f8f9fa;
  --card-bg: #ffffff;
  --border-color: #dee2e6;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  --font-family: 'Inter', 'Segoe UI', sans-serif;
}

.post-detail-view {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  font-family: var(--font-family);
}

.post-wrapper {
  display: flex;
  flex-direction: column;
  margin-top: 100px;
  gap: 2rem;
  min-height: 100vh;
}

.post-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.0rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
}

.post-header {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
}

.post-title {
  font-size: 2rem;
  font-weight: bold;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
  overflow-wrap: break-word
}

.post-meta {
  display: flex;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.95rem;
  align-items: center;
}

.post-meta .dot {
  font-weight: bold;
}

.post-body {
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text-color);
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

.delete-post-button {
  background: red;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-left: auto;
}

.delete-post-button:hover {
  background: rgb(213, 0, 0);
}

/* Comments section */
.comments-section {
  margin-top: 2rem;
}

.separator {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 2rem 0;
}

/* Loading and error states */
.loading-state,
.error-message {
  text-align: center;
  font-size: 1.2rem;
  color: var(--text-muted);
  padding: 4rem 2rem;
}

.error-message {
  color: var(--danger-color);
  font-weight: 500;
}
.warning{
  color: var(--danger-color);
  font-weight: 500;
}
/* Responsive */
@media (max-width: 768px) {

  .post-card {
    padding: 2rem 1.5rem;
  }

  .post-title {
    font-size: 1.5rem;
  }

  .post-footer {
    text-align: left;
  }
}
</style>
