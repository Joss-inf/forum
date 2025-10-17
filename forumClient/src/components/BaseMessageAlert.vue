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
  padding: 0.75rem 1rem;
  border-radius: var(--md-sys-shape-corner-medium);
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  border: 1px solid transparent;
}

.alert--success {
  background-color: hsl(145, 63%, 95%); 
  color: hsl(145, 63%, 30%);
  border-color: hsl(145, 63%, 80%);
}

.alert--error {
  background-color: var(--md-sys-color-error-container);
  color: var(--md-sys-color-on-error-container);
  border-color: var(--md-sys-color-error); 
}

.alert--warning {
  background-color: hsl(38, 92%, 95%);
  color: hsl(38, 92%, 40%);
  border-color: hsl(38, 92%, 80%);
}
</style>