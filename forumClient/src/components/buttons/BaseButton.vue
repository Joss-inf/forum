
    
<template>
  <button :class="buttonClasses" @click="$emit('click', $event)">
    <!-- Le slot permet d'y insérer le texte ou l'icône du bouton -->
    <slot></slot>
  </button>
</template>

<script setup lang = 'ts'>
import { computed } from 'vue';

defineEmits(['click']);

// La classe de base qui s'appliquera toujours
const baseClass = 'base-btn'; 

// Classe spécifique du style que vous avez demandé pour le bouton de création
const createClass = 'create-button-style'; 

// Calcul des classes finales
const buttonClasses = computed(() => {
  // Ici, nous incluons la classe de base et votre classe spécifique
  // Nous pourrions conditionner 'create-button-style' avec un 'v-if' si nécessaire,
  // mais ici nous l'appliquons pour qu'il ait ce style par défaut.
  return [
    baseClass, 
    createClass
    // Vous pourriez ajouter 'button--' + props.variant ici si vous ajoutez des thèmes
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

/* Votre Style Spécifique (Classe 'create-button-style') */
.create-button-style {
  background-color: #34749f;
  color: white;
  font: inherit; /* Utilise la police définie globalement */
}

/* Exemple d'un style simple d'hover */
.create-button-style:hover {
  background-color: #2a5f7f;
}
</style>

  