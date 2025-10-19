<script setup lang="ts">
import { ref } from 'vue';
import { usePosts } from '@/composables/usePosts';
import type { Post } from '@/types';
import { useAuthStore } from '@/stores/auth';
import PostList from '@/components/PostList.vue';
import CreatePostForm from '@/components/CreatePostForm.vue';
import ForumMenu from '@/components/ForumMenu.vue';
import BaseMessageAlert from '@/components/BaseMessageAlert.vue';

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
    <div v-else-if="!isLoading && posts.length === 0" class="empty-state">
      Aucun post n'a été trouvé. Soyez le premier à en créer un !
    </div>

    <!-- La liste de posts est maintenant gérée par son propre composant -->
    <PostList v-else :posts="posts" />

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
/* Le CSS de ForumView ne concerne plus que la mise en page générale et les états. */
.forum-container {
  max-width: 1200px;
  margin: 0.5rem auto;
  padding: 0 10px;
  min-height: 100vh;
}

.load-more-container {
  text-align: center;
  margin: 1rem 0;
}

button.load-more-button {
  padding: 1rem;
  /* Ajoutez d'autres styles pour votre bouton ici */
}

.loading-state, .loading-more, .empty-state {
  text-align: center;
  margin: 1rem 0;
  color: var(--md-sys-color-on-surface-variant);
  padding: 20px;
}
</style>