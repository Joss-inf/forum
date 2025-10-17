<script setup lang="ts">
import { useLoadingStore } from '@/stores/loader';
const loadingStore = useLoadingStore();
</script>

<template>
  <div v-if="loadingStore.isPageLoading" class="loading-bar"></div>
</template>

<style scoped>
.loading-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 100%;
  background: linear-gradient(
    to right, 
    var(--md-sys-color-primary), 
    hsl(210, 80%, 45%) 
  );
  animation: loading 1.5s linear infinite;
  z-index: 9999;
}

@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
