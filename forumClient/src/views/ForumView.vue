<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import apiClient from '@/services/apiClient';
import CreatePostForm from '@/components/CreatePostForm.vue';
import type { Post } from '@/types';

const posts: Ref<Post[]> = ref([]);
const isLoading: Ref<boolean> = ref(true);
const error: Ref<string | null> = ref(null);
const isCreating: Ref<boolean> = ref(false);

function handlePostCreated(newPost: Post) {
  // On ajoute le nouveau post au début de la liste pour un retour visuel immédiat !
  posts.value.unshift(newPost);
  // On cache le formulaire
  isCreating.value = false;
}
onMounted(async () => {
  try {
    const response = await apiClient.get<Post[]>('/posts');
    posts.value = response.data;
  } catch (err) {
    error.value = "Impossible de charger les posts. Veuillez réessayer plus tard.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div>
    <div class="forum-header">
      <h1>Forum - Derniers Posts</h1>
      <!-- 3. Le bouton pour basculer l'affichage du formulaire -->
      <button @click="isCreating = !isCreating" class="create-button">
        {{ isCreating ? 'Annuler' : 'Créer un post' }}
      </button>
    </div>

    <!-- 4. On affiche le formulaire si isCreating est true -->
    <!-- On écoute l'événement 'post-created' -->
    <CreatePostForm v-if="isCreating" @post-created="handlePostCreated" />

    <div v-if="isLoading" class="loading-state">Chargement des discussions...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
          
<!-- ... dans la partie <template> ... -->
<ul v-else-if="posts.length > 0" class="post-list">
  <!-- On retire la balise <li> et on la remplace par RouterLink -->
  <RouterLink 
    v-for="post in posts" 
    :key="post.id" 
    :to="{ name: 'post-detail', params: { id: post.id } }"
    class="post-item-link"
  >
    <li class="post-item">
      <div class="post-header">
        <h2 class="post-title">{{ post.title }}</h2>
        <div class="post-meta">
          Par <span class="author">{{ post.author_username }}</span>
          le <span class="date">{{ new Date(post.created_at).toLocaleDateString('fr-FR') }}</span>
        </div>
      </div>
    </li>
  </RouterLink>
</ul>
    <div v-else class="empty-state">
      <p>Aucun post n'a été trouvé. Soyez le premier à en créer un !</p>
    </div>
  </div>
  
</template>

<style scoped>
.post-item-link {
  text-decoration: none;
  color: inherit;
}
.forum-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.create-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: var(--primary-color);
  color: white;
  font-size: 1rem;
  cursor: pointer;
}
.loading-state, .empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--secondary-color);
}
.error-message {
  color: #dc3545;
  text-align: center;
  padding: 3rem;
}
.post-list {
  list-style: none;
  padding: 0;
}
.post-item {
  background-color: #fff;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: box-shadow 0.2s ease-in-out;
}
.post-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.post-title {
  margin: 0 0 0.5rem 0;
  color: var(--primary-color);
}
.post-meta {
  font-size: 0.9rem;
  color: var(--secondary-color);
}
.author {
  font-weight: 500;
}
</style>