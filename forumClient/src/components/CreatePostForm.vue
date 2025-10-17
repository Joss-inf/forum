<!-- src/components/CreatePostForm.vue -->
<script setup lang="ts">
import { watch } from 'vue';
import type { Post } from '@/types';
// 1. Importer les constantes en plus du composable
import { 
  useCreatePost, 
  TITLE_MAX_LENGTH, 
  CONTENT_MAX_LENGTH 
} from '@/composables/useCreatePost';
import BaseMessageAlert from '@/components/BaseMessageAlert.vue';
import BaseInput from '@/components/BaseInput.vue';

const emit = defineEmits<{
  (e: 'post-created', post: Post): void
}>();

const { 
  newPost, 
  tags, 
  isLoading, 
  createError, 
  createdPost, 
  handleSubmit 
} = useCreatePost();

// Surveiller la création d'un post pour émettre l'événement
watch(createdPost, (newVal) => {
  if (newVal) {
    emit('post-created', newVal);
  }
});
</script>

<template>
  <form @submit.prevent="handleSubmit" class="create-post-form">
    <h3 class="form-title">Créer une nouvelle discussion</h3>

    <!-- 2. Utiliser la prop maxlength avec la constante importée -->
    <BaseInput
      id="title"
      label="Titre"
      type="text"
      v-model="newPost.title"
      placeholder="Un titre clair et concis"
      :maxlength="TITLE_MAX_LENGTH"
      required
    />

    <!-- 3. Utiliser la prop maxlength avec la constante importée -->
    <BaseInput
      id="content"
      label="Contenu"
      type="textarea"
      v-model="newPost.content"
      placeholder="Décrivez votre question ou votre idée en détail..."
      :rows="8"
      :maxlength="CONTENT_MAX_LENGTH"
      required
    />

    <BaseInput
      id="tag"
      label="Catégorie"
      type="select"
      v-model.number="newPost.tag_id"
      :options="tags.map(tag => ({ label: tag.name, value: tag.id }))"
      placeholder="Choisissez une catégorie"
      required
    />
    <!-- L'affichage des erreurs est maintenant géré par la ref `error` du composable -->
    <BaseMessageAlert v-if="createError" :text="createError.toString()" type="error" />
    <button type="submit" :disabled="isLoading" class="submit-button">
      {{ isLoading ? 'Publication...' : 'Publier' }}
    </button>
  </form>
</template>

<style scoped>

.create-post-form {
  background-color: var(--md-sys-color-surface-bright);
  border: 1px solid var(--md-sys-color-outline);
  border-radius: var(--md-sys-shape-corner-medium);
  padding: 2.5rem;
  margin: 2rem auto;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
}

.form-title {
  font-size: var(--md-sys-typescale-title-large-size); 
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
  color: var(--md-sys-color-on-surface);
}
button{
  padding:10px;
  margin-top:4px;
  margin-left: auto;
}
</style>
    