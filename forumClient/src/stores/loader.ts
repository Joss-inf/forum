import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLoadingStore = defineStore('loading', () => {
  const isPageLoading = ref(false);
  return { isPageLoading };
});
