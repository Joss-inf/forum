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
    <article v-else-if="post" class="post-content">
      
      <header class="post-header">
        <div class="header-main">
          <h1>{{ post.title }}</h1>
          <div class ='post-warper'>
          <div class="post-meta">
            Par <span class="author">{{ post.author_username }}</span>
            le <span class="date">{{ new Date(post.created_at).toLocaleDateString('fr-FR') }}</span>
          </div>
          <div class="header-actions">
          <button
            v-if="authStore.user && post && authStore.user.id === post.user_id"
            @click="deletePost"
            class="delete-post-button"
          >
            Supprimer le sujet
          </button>
        </div>
        </div>
        </div>

      </header>
      
      <div class="post-body" v-html="post.content"></div>
      
      <hr class="separator">

      <section class="comments-section">
        <CommentList 
          :comments="comments" 
          @comment-deleted="handleCommentDeleted" 
        />
        <CreateCommentForm 
          :post-id="postId" 
          @comment-created="handleCommentCreated" 
        />
      </section>
    </article>
  </div>
</template>

<style scoped>
.post-detail-view{
  width: 100vw;
  max-width: 800px;
}
.post-header {
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
  gap: 1rem;
}
.post-header h1 {
  margin: 0;
}
.post-warper{
  display: flex;
  justify-content: space-between;
}
.post-meta {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--secondary-color);
}
.author {
  font-weight: bold;
}
.delete-post-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  white-space: nowrap;
}
.delete-post-button:hover {
  background-color: #c82333;
}
.post-body {
  line-height: 1.6;
  font-size: 1.1rem;
  white-space: pre-wrap; 
}
.separator {
  border: 0;
  border-top: 1px solid var(--border-color);
  margin: 3rem 0;
}
.loading-state, .error-message {
  text-align: center;
  padding: 3rem;
}
</style>