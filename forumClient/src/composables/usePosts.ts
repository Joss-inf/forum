// src/composables/usePosts.ts
import { ref, onMounted, watch } from 'vue'; // <-- Importer watch
import type { Ref } from 'vue';
import apiClient from '@/services/apiClient';
import type { Post, Tag, Params } from '@/types'; // <-- S'assurer que Tag est importé

export function usePosts() {
  // --- État ---
  const posts: Ref<Post[]> = ref([]);
  const isLoading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);
  
  // --- NOUVEL ÉTAT POUR LES FILTRES ---
  const searchQuery: Ref<string> = ref('');
  const selectedTag: Ref<number | null> = ref(null); // Pour le filtre par tag
  const sortOrder: Ref<'ASC' | 'DESC'> = ref('DESC'); // Pour le tri
  const availableTags: Ref<Tag[]> = ref([]); // Pour peupler la liste déroulante

  // --- Pagination ---
  const postsPerPage = 10;
  const lastCursorCreatedAt: Ref<string | null> = ref(null);
  const lastCursorId: Ref<number | null> = ref(null);
  const hasMorePosts: Ref<boolean> = ref(true);

  // --- NOUVELLE FONCTION POUR RÉCUPÉRER LES TAGS ---
  async function fetchTags() {
    try {
      const response = await apiClient.get<Tag[]>('/tags');
      availableTags.value = response.data;
    } catch (err) {
      console.error("Impossible de charger les tags.", err);
    }
  }

  // --- FONCTION fetchPosts MISE À JOUR ---
  async function fetchPosts(reset = false) {
    if (isLoading.value && !reset) return;

    isLoading.value = true;
    error.value = null;

    if (reset) {
      posts.value = [];
      lastCursorCreatedAt.value = null;
      lastCursorId.value = null;
      hasMorePosts.value = true;
    }

    try {
      const params: Params = { 
        limit: postsPerPage,
        order: sortOrder.value // Toujours envoyer l'ordre de tri
      };
      
      if (lastCursorCreatedAt.value && lastCursorId.value) {
        params.cursorCreatedAt = lastCursorCreatedAt.value;
        params.cursorId = lastCursorId.value;
      }
      if (searchQuery.value) params.titleSearch = searchQuery.value;
      if (selectedTag.value) params.tag = selectedTag.value; // Ajouter le tag si sélectionné

      const response = await apiClient.get('/posts', { params });
      const newPosts: Post[] = response.data.posts;
      
      posts.value.push(...newPosts);

      hasMorePosts.value = response.data.hasMore;
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

  // --- Gère la recherche par titre ---
  async function handleSearch() {
    await fetchPosts(true);
  }

  // --- NOUVEAU : DÉCLENCHER UNE RECHERCHE QUAND LES FILTRES CHANGENT ---
  watch([selectedTag, sortOrder], () => {
    fetchPosts(true);
  });

  // --- Chargement initial ---
  onMounted(async () => {
    // On charge les tags et les posts en parallèle pour plus d'efficacité
    await Promise.all([
      fetchTags(),
      fetchPosts()
    ]);
  });

  // --- Exposition des nouvelles variables ---
  return {
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
  };
}