// src/composables/useCreatePost.ts
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import apiClient from '@/services/apiClient';
import type { Post, Tag } from '@/types';
import { useAuthStore } from '@/stores/auth';

// 1. DÉFINIR ET EXPORTER LES CONSTANTES DE LIMITES
// L'export permet à la vue de les importer directement pour les utiliser dans les props.
export const TITLE_MAX_LENGTH = 100;
export const CONTENT_MAX_LENGTH = 5000;

interface NewPost {
  title: string;
  content: string;
  tag_id: number | null;
}

export function useCreatePost() {
  const authStore = useAuthStore();

  // State
  const newPost = ref<NewPost>({ title: '', content: '', tag_id: null });
  const tags: Ref<Tag[]> = ref([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const createdPost = ref<Post | null>(null);

  // Fetch tags on mount
  onMounted(async () => {
    try {
      const response = await apiClient.get<Tag[]>('/tags');
      tags.value = response.data;
    } catch (err) {
      console.error('Impossible de charger les tags', err);
      error.value = 'Impossible de charger les tags.';
    }
  });

  // Handle form submission
  async function handleSubmit() {
    error.value = null;

    // 2. AJOUTER LA VALIDATION DE LA LONGUEUR DES CHAMPS
    // On vérifie les champs vides en premier
    if (!newPost.value.title || !newPost.value.content || newPost.value.tag_id === null) {
      error.value = 'Veuillez remplir tous les champs.';
      return;
    }
    // Ensuite, on vérifie la longueur du titre
    if (newPost.value.title.length > TITLE_MAX_LENGTH) {
      error.value = `Le titre ne doit pas dépasser ${TITLE_MAX_LENGTH} caractères.`;
      return;
    }
    // Enfin, on vérifie la longueur du contenu
    if (newPost.value.content.length > CONTENT_MAX_LENGTH) {
      error.value = `Le contenu ne doit pas dépasser ${CONTENT_MAX_LENGTH} caractères.`;
      return;
    }

    isLoading.value = true;
    try {
      const response = await apiClient.post<Post>('/posts', newPost.value);
      const post: Post = {
        ...response.data,
        tag_name: tags.value.find(t => t.id === newPost.value.tag_id)?.name || '',
        author_username: authStore.user?.username || ''
      };
      createdPost.value = post;
      newPost.value = { title: '', content: '', tag_id: null };
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la création du post.';
    } finally {
      isLoading.value = false;
    }
  }

  return {
    newPost,
    tags,
    isLoading,
    error,
    createdPost,
    handleSubmit
    // Note: Les constantes sont exportées directement depuis le fichier,
    // pas besoin de les retourner ici car elles ne sont pas réactives.
  };
}