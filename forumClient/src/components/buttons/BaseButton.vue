
    
<template>
  <button :class="buttonClasses" @click="$emit('click', $event)">
    <slot></slot>
  </button>
</template>

<script setup lang = 'ts'>
import { computed } from 'vue';

defineEmits(['click']);

const baseClass = 'base-btn'; 

const createClass = 'create-button-style'; 

// Calcul des classes finales
const buttonClasses = computed(() => {

  return [
    baseClass, 
    createClass
  ];
});
</script>

<style scoped>
/* Styles de Base (appliqués à tous les boutons qui utilisent 'base-btn') */
.base-btn {
  padding: 10px 15px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-button-style {
  background-color: #34749f;
  color: white;
  font: inherit; 
}

.create-button-style:hover {
  background-color: #2a5f7f;
}
</style>

  