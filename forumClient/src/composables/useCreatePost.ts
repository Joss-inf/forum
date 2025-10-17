import { ref, onMounted, type Ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useApi } from '@/composables/useApi'
import type { NewPost, Post, Tag } from '@/types'

export const TITLE_MAX_LENGTH = 100
export const CONTENT_MAX_LENGTH = 2000

export function useCreatePost() {
  const authStore = useAuthStore()

  // State
  const newPost = ref<NewPost>({ title: '', content: '', tag_id: null })
  const tags: Ref<Tag[]> = ref<Tag[]>([])
  const createdPost = ref<Post | null>(null)

  // useApi pour la création de post
  const {
  data: createdPostData,
  loading: createLoading,
  error: createError,
  execute: createPost
} = useApi<Post>('/posts', { method: 'POST', data: newPost.value })

// GET pour les tags
const {
  data: tagsData,
  loading: tagsLoading,
  error: tagsError,
  execute: fetchTags
} = useApi<Tag[]>('/tags', { method: 'GET' })

onMounted(async () => {
  await fetchTags()
  tagsLoading.value = false
  if (!tagsError.value && tagsData.value) {
    tags.value = tagsData.value
    tagsLoading.value = true
  } else if (tagsError.value) {
    tagsLoading.value = true
    console.error('Impossible de charger les tags', tagsError.value)
  }
})
  async function handleSubmit() {
    await createPost({ data: newPost.value })


    // Validation
    if (!newPost.value.title || !newPost.value.content || newPost.value.tag_id === null) {
      createError.value = new Error('Veuillez remplir tous les champs.')
      return
    }
    if (newPost.value.title.length > TITLE_MAX_LENGTH) {
      createError.value = new Error(`Le titre ne doit pas dépasser ${TITLE_MAX_LENGTH} caractères.`)
      return
    }
    if (newPost.value.content.length > CONTENT_MAX_LENGTH) {
      createError.value = new Error(`Le contenu ne doit pas dépasser ${CONTENT_MAX_LENGTH} caractères.`)
      return
    }

    // Exécuter le POST avec useApi
    await createPost({ data: newPost.value })

    if (!createError.value && createdPostData.value) {
      // Enrichir le post avec tag_name et author_username
      createdPost.value = {
        ...createdPostData.value,
        tag_name: tags.value.find(t => t.id === newPost.value.tag_id)?.name || '',
        author_username: authStore.user?.username || ''
      }

      // Reset du formulaire
      newPost.value = { title: '', content: '', tag_id: null }
    }
  }

  return {
    newPost,
    tags,
    isLoading: tagsLoading || createLoading,
    createError,
    createdPost,
    handleSubmit
  }
}
