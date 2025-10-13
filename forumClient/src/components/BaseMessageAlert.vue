<template>
  <p v-if="text" :class="['message', typeClass]">{{ text }}</p>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  text?: string | null;
  type?: 'success' | 'error';
}

const props = defineProps<Props>();

const typeClass = computed(() => {
  return props.type === 'success' ? 'success' : 'error';
});
</script>

<style scoped>
.message {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.message.success {
  color: #188038;
}

.message.error {
  color: red;
  border-radius: 8px;
  margin-top: 0.1rem;
  font-size: 0.9rem;
  font-weight: 500;
  animation: shake 0.5s ease-in-out;
}

/* Animation d’erreur */
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  20%, 60% {
    transform: translateX(-5px);
  }
  40%, 80% {
    transform: translateX(5px);
  }
}
</style>
