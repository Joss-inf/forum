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
  selectedTag, 
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
    <ul class="post-list">
  <li v-for="post in posts" :key="post.id" class="post-item">
    <RouterLink
      :to="{ name: 'post-detail', params: { id: post.id } }"
      class="post-item-link"
    >
      <div class="post-header">
        <h2 class="post-title">{{ post.title }}</h2>
        <div class="post-meta">
          Le <span class="date">{{ new Date(post.created_at).toLocaleDateString('fr-FR') }}</span>
          Par <span class="author">{{ post.author_username }}</span>
        </div>
      </div>
      <div class="tag-name">{{ post.tag_name }}</div>
    </RouterLink>
  </li>
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
.post-item:last-child {
  border-radius: 0px 0px 30px 30px;
}

.forum-container {
  max-width: 1200px;
  margin: 0.5rem auto;
  padding: 0 10px;
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
  padding: 1rem;
  background-color: var(--md-sys-color-surface-bright);
  transition: transform 0.2s, box-shadow 0.2s;
  overflow-wrap: break-word;
  margin-bottom: 2px;
}

.post-item:hover {
  transform: translateY(-2px);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
}
.post-item:active{
  filter: brightness(0.95);
}
.post-title {
  margin: 0;
}

.post-meta {
  font-size: 0.85rem;
  color: var(--md-sys-color-on-surface-variant);
}

.author {
  font-weight: 600;
}
.tag-name {
  display: flex;
  background: #0000000d;
  width: fit-content;
  color: var(--md-sys-color-on-surface); 
  padding: 2px 8px;
  font-weight: bold;
  border-radius: 50px 50px 50px 0;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  color: var(--md-sys-color-on-surface-variant);
}
.load-more-container {
  text-align: center;
  margin: 1rem 0;
}
button{

  padding: 1rem;
}
.loading-state, .loading-more, .empty-state {
  text-align: center;
  margin: 1rem 0;
  color: var(--md-sys-color-on-surface-variant);
}
</style>