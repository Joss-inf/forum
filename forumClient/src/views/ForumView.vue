<!-- src/views/ForumView.vue -->
<script setup lang="ts"> 
import { ref } from 'vue';
import { usePosts } from '@/composables/usePosts';
import type { Post } from '@/types';
import { useAuthStore } from '@/stores/auth';
import CreatePostForm from '@/components/CreatePostForm.vue';
import ForumMenu from '@/components/ForumMenu.vue';
import BaseMessageAlert from '@/components/BaseMessageAlert.vue'


const authStore = useAuthStore();
const isCreating = ref(false);

const {
  posts,
  isLoading,
  error,
  searchQuery,
  selectedTag, // <-- Récupérer les nouvelles refs
  sortOrder,
  availableTags,
  hasMorePosts,
  fetchPosts,
  handleSearch
} = usePosts();

function handlePostCreated(newPost: Post) {
  posts.value.unshift(newPost);
  isCreating.value = false;
} 
</script>

<template>
  <div class="forum-container">
    <!-- Barre de recherche et bouton créer -->
     <ForumMenu
      v-model:searchQuery="searchQuery"
      v-model:selectedTag="selectedTag"
      v-model:sortOrder="sortOrder"
      :available-tags="availableTags"
      :is-authenticated="authStore.isAuthenticated"
      :is-creating="isCreating"
      @search="handleSearch"
      @toggle-create="isCreating = !isCreating"
    />


    <!-- Formulaire de création -->
    <CreatePostForm v-if="isCreating" @post-created="handlePostCreated" />

    <!-- États -->
    <div v-if="isLoading && posts.length === 0" class="loading-state">Chargement des discussions...</div>
     <BaseMessageAlert v-if="error" :text="error" type="error" />
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
      <button @click="() => fetchPosts()" class="load-more-button">Charger plus</button>
    </div>

    <!-- Loading lors du "Charger plus" -->
    <div v-if="isLoading && posts.length > 0" class="loading-more">
      Chargement...
    </div>
  </div>
</template>

<style scoped>

.forum-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-and-filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow: 1;
}

.search-container {
  display: flex;
  gap: 0.5rem;
}

.search-bar {
  flex-grow: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

.filter-container {
  display: flex;
  gap: 1rem;
}

.forum-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  min-height: 100vh;
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
  overflow-wrap: break-word;
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

.loading-state, .loading-more, .empty-state {
  text-align: center;
  margin: 1rem 0;
  color: #6b7280;
}
</style>