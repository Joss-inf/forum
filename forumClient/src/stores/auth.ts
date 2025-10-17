// src/store/auth.ts
import { defineStore } from 'pinia'
import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '@/composables/useApi'
import type { User, LoginCredentials, RegisterData } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  // --- STATE ---
  const user: Ref<User | null> = ref(null)
  const isAuthenticated: ComputedRef<boolean> = computed(() => !!user.value)
  const userRole: ComputedRef<string | null> = computed(() => user.value?.role ?? null)

  // --- FETCH CURRENT USER ---
  async function fetchUser() {
    const { data, error, execute } = useApi<User>('/users/me', { method: 'GET' })
    await execute()
    if (data.value) user.value = data.value
    else if (error.value) user.value = null
  }

  // --- LOGIN ---
  async function login(credentials: LoginCredentials) {
    const { error, execute } = useApi<{ user: User }>('/auth/login', {
      method: 'POST',
      data: credentials
    })
    await execute()
    if (!error.value) await fetchUser()
    else throw error.value
  }

  // --- REGISTER ---
  async function register(userData: RegisterData) {
    const { error, execute } = useApi('/auth/register', {
      method: 'POST',
      data: userData
    })
    await execute()
    if (error.value) throw error.value
  }

  // --- LOGOUT ---
  async function logout() {
    try {
      const { error, execute } = useApi('/auth/logout', {
        method: 'POST',
        data: { userId: user.value?.id }
      })
      await execute()
      if (error.value) console.warn('Erreur côté serveur:', error.value)
    } finally {
      user.value = null
      await router.push('/login')
    }
  }

  // --- INITIALIZATION ---
  async function initializeAuth() {
    try {
      await fetchUser()
    } catch (err) {
      console.error('Erreur lors de l\'initialisation de l\'auth:', err)
    }
  }

  // --- UPDATE PROFILE ---
  async function updateProfile(profileData: { username: string; email: string }) {
    const { data, error, execute } = useApi<User>('/users/profile', {
      method: 'PUT',
      data: profileData
    })
    await execute()
    if (data.value) user.value = data.value
    else if (error.value) throw error.value
  }

  // --- CHANGE PASSWORD ---
  async function changePassword(passwordData: { currentPassword: string; newPassword: string }) {
    const { error, execute } = useApi('/users/change-password', {
      method: 'PUT',
      data: passwordData
    })
    await execute()
    if (error.value) throw error.value
  }

  // --- RETURN ---
  return {
    user,
    isAuthenticated,
    userRole,
    fetchUser,
    login,
    register,
    logout,
    initializeAuth,
    updateProfile,
    changePassword
  }
})
