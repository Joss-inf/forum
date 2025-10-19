<script setup lang="ts">
import type { Post } from '@/types';
import PostListItem from './PostListItem.vue';


defineProps<{
  posts: Post[];
}>();
</script>

<template>
  <ul class="post-list">
    <PostListItem 
      v-for="post in posts" 
      :key="post.id" 
      :post="post" 
    />
  </ul>
</template>

<style scoped>
/* Le style du conteneur de la liste est isolé ici. */
.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>