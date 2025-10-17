<!-- CTAButton.vue -->
<template>
  <RouterLink 
    :to="to" 
    :class="linkClasses"
  >
    <slot></slot>
  </RouterLink>
</template>

<script setup lang = "ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router'; 

const props = defineProps({
  // La destination du RouterLink
  to: {
    type: [String, Object],
    required: true,
  },
  // La prop qui va contrôler le style (le "switch")
  variant: {
    type: String,
    default: 'primary',
    validator: (value:string) => ['primary', 'secondary', 'tertiary'].includes(value),
  }
});

// Calcule les classes à appliquer dynamiquement
const linkClasses = computed(() => {
  return [
    'btn',           
    'cta-btn',       
    `btn-${props.variant}`, 
  ];
});
</script>

<style scoped>
/* Définition des styles communs */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  border: none;
}

.btn-primary {
  padding: 15px 30px;
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  border-radius: 10px;
  display: block;
  border: 0px;
  font-weight: 700;
  box-shadow: 0px 0px 14px -7px #57C785;
  background-image: linear-gradient(45deg, #2A7B9B 0%, #57C785  51%, #2A7B9B  100%);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.btn-primary:hover {
  background-position: right center;
  color: #fff;
  text-decoration: none;
}

.btn-primary:active
.btn-tertiary:active
 {
  transform: scale(0.95);
}

.btn-secondary {
  background-color: transparent;
  color: var(--text-color-dark);
  border: 2px solid var(--text-color-dark);
}

.btn-tertiary {
  background-color: transparent;
  border: 2px solid rgba(0, 0, 0, 0.5);
  transition: color 0.3s ease;
}
.btn-tertiary:hover {
  background-color: black;
  color: white;
  transition: color 0.3s ease;
}
</style>