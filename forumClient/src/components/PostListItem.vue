<script setup lang="ts">
import type { Post } from '@/types';

defineProps<{
  post: Post;
}>();
</script>

<template>
  <li class="post-item">
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
</template>

<style scoped>
/* TOUT le style spécifique à un item est maintenant ici, parfaitement isolé. */
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

.post-item:active {
  filter: brightness(0.95);
}

.post-item:last-child {
  border-radius: 0px 0px 30px 30px;
}

.post-item-link {
  text-decoration: none;
  color: inherit;
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
</style>