<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import apiClient from '@/services/apiClient';
import CreatePostForm from '@/components/CreatePostForm.vue';
import type { Post } from '@/types';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// État
const posts: Ref<Post[]> = ref([]);
const isLoading: Ref<boolean> = ref(false);
const error: Ref<string | null> = ref(null);
const isCreating: Ref<boolean> = ref(false);
const searchQuery: Ref<string> = ref('');

// Pagination cursor-based
const postsPerPage = 10;
const lastCursorCreatedAt: Ref<string | null> = ref(null);
const lastCursorId: Ref<number | null> = ref(null);
const hasMorePosts: Ref<boolean> = ref(true);

// --- Fonctions ---
async function fetchPosts(reset = false) {
  if (isLoading.value) return;

  isLoading.value = true;
  error.value = null;

  try {
    const params: any = { limit: postsPerPage };
    if (!reset && lastCursorCreatedAt.value && lastCursorId.value) {
      params.cursorCreatedAt = lastCursorCreatedAt.value;
      params.cursorId = lastCursorId.value;
    }
    if (searchQuery.value) params.titleSearch = searchQuery.value;

    const response = await apiClient.get('/posts', { params });

    const newPosts: Post[] = response.data.posts; // <-- tableau réel
    const more: boolean = response.data.hasMore;   // <-- indicateur de pagination

    if (reset) posts.value = newPosts;
    else posts.value.push(...newPosts);

    // Mettre à jour le curseur pour la prochaine page
    hasMorePosts.value = more;
    if (newPosts.length > 0) {
      const lastPost = newPosts[newPosts.length - 1];
      lastCursorCreatedAt.value = lastPost.created_at;
      lastCursorId.value = lastPost.id;
    }
  } catch (err) {
    error.value = 'Impossible de charger les posts.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await fetchPosts();
});


async function handleSearch() {
  // On reset la pagination
  lastCursorCreatedAt.value = null;
  lastCursorId.value = null;
  hasMorePosts.value = true;
  await fetchPosts(true);
}

function handlePostCreated(newPost: Post) {
  // Ajouter le nouveau post en tête
  posts.value.unshift(newPost);
  isCreating.value = false;
}
</script>

<template>
  <div class="forum-container">
    <!-- Barre de recherche et bouton créer -->
    <div class="forum-header">
      <div class="search-container">
        <input type="text" placeholder="Rechercher un post..." v-model="searchQuery" class="search-bar" />
        <button :disabled="!searchQuery" class="search-button" @click="handleSearch">
          Rechercher
        </button>
      </div>

      <button v-if="authStore.user" class="create-button" @click="isCreating = !isCreating">
        {{ isCreating ? 'Annuler' : 'Créer un post' }}
      </button>
    </div>

    <!-- Formulaire de création -->
    <CreatePostForm v-if="isCreating" @post-created="handlePostCreated" />

    <!-- États -->
    <div v-if="isLoading && posts.length === 0" class="loading-state">Chargement des discussions...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="posts.length === 0" class="empty-state">
      Aucun post n'a été trouvé. Soyez le premier à en créer un !
    </div>

    <!-- Liste de posts -->
    <ul v-else class="post-list">
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
              Le <span class="date">{{ new Date(post.created_at).toLocaleDateString('fr-FR') }}</span>
              Par <span class="author">{{ post.author_username }}</span>
            </div>
          </div>
          <div class = 'tag-name'>{{ post.tag_name }}</div>
        </li>
      </RouterLink>
    </ul>

    <!-- Bouton "Charger plus" -->
    <div v-if="hasMorePosts && !isLoading" class="load-more-container">
      <button @click="fetchPosts()" class="load-more-button">Charger plus</button>
    </div>

    <!-- Loading lors du "Charger plus" -->
    <div v-if="isLoading && posts.length > 0" class="loading-more">
      Chargement...
    </div>
  </div>
</template>

<style scoped>
.forum-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  min-height: 100vh;
}

.forum-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  height: 150px;
}

.search-container {
  display: flex;
  gap: 0.5rem;
}

.search-bar {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  flex: 1;
}

.search-button, .create-button, .load-more-button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
}

.search-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.post-item-link {
  text-decoration: none;
  color: inherit;
}

.post-item {
  border: 1px solid #e5e7eb;
  padding: 1rem;
  background-color: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
}

.post-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.post-title {
  margin: 0;
}

.post-meta {
  font-size: 0.85rem;
  color: #6b7280;
}

.author {
  font-weight: 600;
}
.tag-name {
  display: flex;
  background: #000000b8;
  width: fit-content;
  color: white;
  padding: 2px 8px;
  font-weight: bold;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
}
.load-more-container {
  text-align: center;
  margin: 1rem 0;
}

.loading-state, .loading-more, .error-message, .empty-state {
  text-align: center;
  margin: 1rem 0;
  color: #6b7280;
}
</style>