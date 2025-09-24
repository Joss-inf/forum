<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import apiClient from '@/services/apiClient';
import type { Post } from '@/types';

// On définit un "emit" pour communiquer avec le composant parent.
// Quand un post est créé, on émettra cet événement avec le nouveau post en donnée.
const emit = defineEmits<{
(e: 'post-created', post: Post): void
}>()

const newPost = ref({
title: '',
content: ''
});
const isLoading: Ref<boolean> = ref(false);
const error: Ref<string | null> = ref(null);

async function handleSubmit() {
if (!newPost.value.title || !newPost.value.content) {
error.value = "Le titre et le contenu ne peuvent pas être vides.";
return;
}

isLoading.value = true;
error.value = null;

try {
const response = await apiClient.post<Post>('/posts', newPost.value);

// Succès ! On émet l'événement vers le parent.
emit('post-created', response.data);

// On vide le formulaire pour la prochaine fois.
newPost.value.title = '';
newPost.value.content = '';

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
<input
type="text"
id="title"
v-model="newPost.title"
placeholder="Le titre de votre sujet"
required
>
</div>
<div class="form-group">
<label for="content">Contenu</label>
<textarea
id="content"
v-model="newPost.content"
rows="5"
placeholder="Écrivez votre message ici..."
required
></textarea>
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
padding: 1.5rem;
margin-bottom: 2rem;
position: absolute;
left: 0;
right: 0;
margin-inline: auto;
z-index: 1;
max-width: 1000px;
}
.form-group {
margin-bottom: 1rem;
}
.form-group label {
display: block;
margin-bottom: 0.5rem;
font-weight: 500;
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