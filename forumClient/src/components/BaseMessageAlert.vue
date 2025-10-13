<template>
  <div v-if="text" :class="['message-alert', `alert--${type}`]">
    {{ text }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string | null;
  type: 'success' | 'error' | 'warning';
}>();
</script>

<style scoped>
.message-alert {
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  margin-bottom: var(--space-lg);
  border: 1px solid transparent;
}

.alert--success {
  background-color: hsl(145, 63%, 95%); /* Fond pastel */
  color: hsl(145, 63%, 30%);
  border-color: hsl(145, 63%, 80%);
}

.alert--error {
  background-color: hsl(0, 72%, 95%);
  color: hsl(0, 72%, 40%);
  border-color: hsl(0, 72%, 80%);
}

.alert--warning {
  background-color: hsl(38, 92%, 95%);
  color: hsl(38, 92%, 40%);
  border-color: hsl(38, 92%, 80%);
}
</style>