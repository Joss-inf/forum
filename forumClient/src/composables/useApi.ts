import { ref, type Ref } from 'vue'
import apiClient from '@/services/apiClient';
import axios, { type AxiosRequestConfig } from 'axios'
import type { UseApiReturn } from '@/types'

export function useApi<T>(url: string, config?: AxiosRequestConfig): UseApiReturn<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const execute = async (overrideConfig?: AxiosRequestConfig) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.request<T>({
        url,
        ...config,
        ...overrideConfig,
      })
      data.value = response.data
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {

        error.value = new Error(err.response?.data?.message || err.message)
      } else if (err instanceof Error) {

        error.value = err
      } else if (typeof err === 'string') {
 
        error.value = new Error(err)
      } else {
        error.value = new Error('Erreur inconnue')
      }
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, execute }
}