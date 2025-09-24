<script setup lang="ts" vapor>
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import apiClient from '@/services/apiClient';
import CreatePostForm from '@/components/CreatePostForm.vue';
import type { Post } from '@/types';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
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
      <h1>Forum</h1>
      <!-- 3. Le bouton pour basculer l'affichage du formulaire -->
      <button
        v-if="authStore.user"
        @click="isCreating = !isCreating"
        class="create-button"
      >
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
:root {
  --primary-color: #4a90e2; /* Un bleu moderne et apaisant */
  --primary-color-dark: #357ABD;
  --secondary-color: #555;
  --text-color-light: #777;
  --bg-color: #f5f7fa; /* Un fond gris très clair, presque blanc */
  --card-bg-color: #fff;
  --border-color: #e3e8ee;
  --shadow-light: 0 4px 15px rgba(0, 0, 0, 0.05);
  --shadow-hover: 0 8px 25px rgba(0, 0, 0, 0.1);
  --font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
}

/* Styles globaux pour une meilleure esthétique */
body {
  font-family: var(--font-family);
  background-color: var(--bg-color);
  color: var(--secondary-color);
  margin: 0;
  padding: 2rem;
}
template{
  display: flex;
  flex-direction: column;
  align-items: center;
}
/* En-tête du forum */
.forum-header {
  margin-top: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: white;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  margin: 100px auto 2.5rem auto;
  max-width: 1000px;
}

.forum-header h1 {
  font-size: 2.0rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  padding-left: 10px;
}

/* Bouton pour créer un post */
.create-button {
  padding: 0.75rem 1.5rem;
  border: none;
  background-color: var(--primary-color);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
  height: 55px;
}

.create-button:hover {
  background-color: white;
  color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(74, 144, 226, 0.5);
}

/* États de chargement et d'erreur */
.loading-state, .empty-state, .error-message {
  text-align: center;
  padding: 3rem;
  color: var(--text-color-light);
  font-size: 1.1rem;
}

.error-message {
  color: #e74c3c;
  font-weight: 500;
}

/* Liste des posts */
.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.post-item-link {
  text-decoration: none;
  color: inherit;
  max-width: 1000px;
  width: 100%;
}

/* Style de chaque élément de post */
.post-item {
  background-color: white;
  padding: 2rem;
  margin-bottom: 0.1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.post-item:hover {
  transform: translateY(-5px);

}

/* Contenu du post */
.post-header {
  display: flex;
  flex-direction: column;
}

.post-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
  margin: 0 0 0.5rem 0;
}

.post-meta {
  font-size: 0.9rem;
  color: var(--text-color-light);
}

.author {
  font-weight: 600;
  color: var(--secondary-color);
}
</style>