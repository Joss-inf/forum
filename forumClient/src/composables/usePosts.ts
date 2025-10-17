// src/composables/usePosts.ts
import { ref, onMounted, watch, type Ref } from 'vue'
import { useApi } from '@/composables/useApi'
import type { Post, Tag, Params } from '@/types'

export function usePosts() {
  // --- État ---
  const posts: Ref<Post[]> = ref([])
  const searchQuery: Ref<string> = ref('')
  const selectedTag: Ref<number | null> = ref(null)
  const sortOrder: Ref<'ASC' | 'DESC'> = ref('DESC')
  const availableTags: Ref<Tag[]> = ref([])
  const hasMorePosts: Ref<boolean> = ref(true)
  const postsPerPage = 10
  const lastCursorCreatedAt: Ref<string | null> = ref(null)
  const lastCursorId: Ref<number | null> = ref(null)

  // --- useApi pour les posts ---
  const {
    data: postsData,
    loading: postsLoading,
    error: postsError,
    execute: fetchPostsApi
  } = useApi<{ posts: Post[]; hasMore: boolean }>('/posts', { method: 'GET', params: {} })

  // --- useApi pour les tags ---
  const {
    data: tagsData,
    loading: tagsLoading,
    error: tagsError,
    execute: fetchTagsApi
  } = useApi<Tag[]>('/tags', { method: 'GET' })

  // --- computed pour loading / error global ---
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const updateLoadingError = () => {
    isLoading.value = postsLoading.value || tagsLoading.value
    error.value = postsError.value?.message || tagsError.value?.message || null
  }

  // --- Fonction pour récupérer les posts ---
  async function fetchPosts(reset = false) {
    if (isLoading.value && !reset) return

    if (reset) {
      posts.value = []
      lastCursorCreatedAt.value = null
      lastCursorId.value = null
      hasMorePosts.value = true
    }

    const params: Params = {
      limit: postsPerPage,
      order: sortOrder.value
    }
    if (lastCursorCreatedAt.value && lastCursorId.value) {
      params.cursorCreatedAt = lastCursorCreatedAt.value
      params.cursorId = lastCursorId.value
    }
    if (searchQuery.value) params.titleSearch = searchQuery.value
    if (selectedTag.value) params.tag = selectedTag.value

    await fetchPostsApi({ params })
    updateLoadingError()

    if (postsData.value) {
      posts.value.push(...postsData.value.posts)
      hasMorePosts.value = postsData.value.hasMore
      if (postsData.value.posts.length > 0) {
        const lastPost = postsData.value.posts[postsData.value.posts.length - 1]
        lastCursorCreatedAt.value = lastPost.created_at
        lastCursorId.value = lastPost.id
      }
    }
  }

  // --- Fonction pour récupérer les tags ---
  async function fetchTags() {
    await fetchTagsApi()
    updateLoadingError()
    if (tagsData.value) availableTags.value = tagsData.value
  }

  // --- Gestion recherche / filtres ---
  async function handleSearch() {
    await fetchPosts(true)
  }

  watch([selectedTag, sortOrder], () => {
    fetchPosts(true)
  })

  // --- Chargement initial ---
  onMounted(async () => {
    await Promise.all([fetchTags(), fetchPosts()])
  })

  // --- Retour du composable ---
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
  }
}
