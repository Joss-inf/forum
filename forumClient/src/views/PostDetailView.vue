<script setup lang="ts" vapor>
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // <-- 1. Importer useRouter
import { useAuthStore } from '@/stores/auth'; // <-- 2. Importer le store d'authentification
import apiClient from '@/services/apiClient';
import type { Post, Comment } from '@/types';
import CommentList from '@/components/CommentList.vue';
import CreateCommentForm from '@/components/CreateCommentForm.vue';

const route = useRoute();
const router = useRouter(); // <-- 3. Obtenir l'instance du routeur
const authStore = useAuthStore(); // <-- 4. Obtenir l'instance du store

const postId = Number(route.params.id);

const post: Ref<Post | null> = ref(null);
const comments: Ref<Comment[]> = ref([]);
const isLoading: Ref<boolean> = ref(true);
const error: Ref<string | null> = ref(null);

function handleCommentCreated(newComment: Comment) {
  comments.value.push(newComment);
}

function handleCommentDeleted(deletedCommentId: number) {
  comments.value = comments.value.filter(comment => comment.id !== deletedCommentId);
}

// 5. LA NOUVELLE FONCTION DE SUPPRESSION DU POST
async function deletePost() {
  if (!confirm("Êtes-vous absolument sûr de vouloir supprimer ce sujet ? Cette action est irréversible et supprimera aussi tous les commentaires.")) {
    return;
  }

  try {
    await apiClient.delete(`/posts/${postId}`);
    // Si la suppression réussit, on redirige l'utilisateur vers le forum
    await router.push({ name: 'forum' });
    // On pourrait aussi afficher une notification de succès ici
  } catch (err) {
    console.error("Erreur lors de la suppression du post:", err);
    alert("Une erreur est survenue. Impossible de supprimer ce sujet.");
  }
}

onMounted(async () => {
  try {
    const [postResponse, commentsResponse] = await Promise.all([
      apiClient.get<Post>(`/posts/${postId}`),
      apiClient.get<Comment[]>(`/posts/${postId}/comments`)
    ]);
    post.value = postResponse.data;
    comments.value = commentsResponse.data;
  } catch (err) {
    error.value = "Impossible de charger le post ou les commentaires.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});
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
            <span>{{ post.tag_name }}</span>
          </div>
        </header>

        <div class="post-body" v-html="post.content"></div>

        <div class="post-footer">
          <button
            v-if="authStore.user && post && authStore.user.id === post.user_id"
            @click="deletePost"
            class="delete-post-button"
          >
            Supprimer le sujet
          </button>
        </div>
      </article>

      <section class="comments-section">
        <hr class="separator" />
        <CommentList
          :comments="comments" 
          @comment-deleted="handleCommentDeleted" 
        />
        <CreateCommentForm 
          v-if="authStore.user"
          :post-id="postId"
          @comment-created="handleCommentCreated" 
        />
        <div v-else class="comment-warning">Connectez vous pour poster un commentaire.</div>
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
}

.post-footer {
  margin-top: 2rem;
  text-align: right;
}

.delete-post-button {
  background: var(--danger-color);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.delete-post-button:hover {
  background: var(--danger-color-dark);
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
