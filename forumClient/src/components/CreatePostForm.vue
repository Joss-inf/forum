<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import apiClient from '@/services/apiClient';
import type { Post, Tag } from '@/types';
import { useAuthStore } from '@/stores/auth'; // Ajout de l'import du store d'authentification

const emit = defineEmits<{
  (e: 'post-created', post: Post): void
}>()

const authStore = useAuthStore(); // Initialisation du store d'authentification

const newPost = ref({
  title: '',
  content: '',
  tag_id: null as number | null,
  tag_name: ''
});

const tags: Ref<Tag[]> = ref([]);
const isLoading: Ref<boolean> = ref(false);
const error: Ref<string | null> = ref(null);

// Récupération des tags à l'initialisation
onMounted(async () => {
  try {
    const response = await apiClient.get<Tag[]>('/tags');
    tags.value = response.data;
  } catch (err) {
    console.error('Impossible de charger les tags', err);
  }
});

async function handleSubmit() {
  if (!newPost.value.title || !newPost.value.content || !newPost.value.tag_id) {
    error.value = "Le titre, le contenu et le tag sont obligatoires.";
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    const response = await apiClient.post<Post>('/posts', newPost.value);

    // Construire un objet enrichi avec tag_name
    const createdPost = {
      ...response.data,
      tag_name: tags.value.find(t => t.id === newPost.value.tag_id)?.name || '',
      author_username: authStore.user?.username || ''
    };

    emit('post-created', createdPost);

    // Reset du formulaire
    newPost.value.title = '';
    newPost.value.content = '';
    newPost.value.tag_id = null;
  } catch (err: any) {
    error.value = err.response?.data?.message || "Une erreur est survenue lors de la création du post.";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="create-post-form">
    <h3>Créer une nouvelle discussion</h3>

    <div class="form-group">
      <label for="title">Titre</label>
      <input type="text" id="title" v-model="newPost.title" placeholder="Le titre de votre sujet" required>
    </div>

    <div class="form-group">
      <label for="content">Contenu</label>
      <textarea id="content" v-model="newPost.content" rows="5" placeholder="Écrivez votre message ici..." required></textarea>
    </div>

    <div class="form-group">
      <label for="tag">Tag</label>
      <select id="tag" v-model="newPost.tag_id" required >
        <option :value="null"  >-- Choisir un tag --</option>
        <option v-for="tag in tags" 
        :key="tag.id" 
        :value="tag.id"
        >{{ tag.name }}</option>
      </select>
    </div>

    <p v-if="error" class="error-message">{{ error }}</p>
    <button type="submit" :disabled="isLoading" class="submit-button">
      {{ isLoading ? 'Publication...' : 'Publier' }}
    </button>
  </form>
</template>

<style scoped>
.create-post-form {
  background-color: #f8f9fa;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 50px;
  position: absolute;
  left: 0;
  right: 0;
  margin-inline: auto;
  z-index: 1;
  max-width: 900px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: white;
  font-family: inherit;
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
}
.post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.post-tags span {
  padding: 0.2rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
  background-color: var(--primary-color);
  color: white;
}
.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-sizing: border-box;
  font-family: inherit;
  width: 100%;
  max-width: 100%;
}

.submit-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: var(--primary-color);
  color: white;
  font-size: 1rem;
  cursor: pointer;
}

.submit-button:disabled {
  background-color: var(--secondary-color);
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-bottom: 1rem;
}
</style>