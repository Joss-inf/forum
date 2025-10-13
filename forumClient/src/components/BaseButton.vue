<!-- src/components/BaseButton.vue -->
<template>
  <component
    :is="tag"
    :type="tag === 'button' ? type : undefined"
    :to="to"
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <div v-if="loading" class="spinner" aria-hidden="true"></div>
    <span :class="{ 'content-hidden': loading }">
      <slot />
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router'; // Nécessaire pour le binding dynamique avec :is

// 1. Définition des Props
const props = withDefaults(defineProps<{
  /**
   * Le style visuel du bouton.
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  /**
   * Le type natif du bouton, utile pour les formulaires.
   */
  type?: 'button' | 'submit' | 'reset';
  /**
   * Désactive le bouton.
   */
  disabled?: boolean;
  /**
   * Affiche un spinner et désactive le bouton.
   */
  loading?: boolean;
  /**
   * Si une route est fournie, le bouton se comportera comme un RouterLink.
   */
  to?: string | object;
}>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
  loading: false,
  to: undefined,
});

// 2. Définition des Événements
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

// 3. Logique du Composant
/**
 * Détermine si le composant doit être rendu comme un <button> ou un <RouterLink>.
 */
const tag = computed(() => (props.to ? RouterLink : 'button'));

/**
 * Construit dynamiquement la liste des classes CSS en fonction des props.
 */
const buttonClasses = computed(() => [
  'base-btn',
  `btn--${props.variant}`,
  { 'is-loading': props.loading },
]);

/**
 * Gère l'événement de clic, en empêchant l'action si le bouton est désactivé ou en chargement.
 */
const handleClick = (event: MouseEvent) => {
  if (props.loading || props.disabled) {
    event.preventDefault();
    return;
  }
  emit('click', event);
};
</script>

<style scoped>
/* --- Style de Base --- */
.base-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.95rem;
  font-family: var(--font-family-sans);
  border: 1px solid transparent;
  cursor: pointer;
  text-decoration: none;
  transition: var(--transition-smooth);
  white-space: nowrap;
}

.base-btn:disabled,
.base-btn.is-loading {
  cursor: not-allowed;
  opacity: 0.65;
}

.base-btn:focus-visible {
  outline: 2px solid var(--color-secondary);
  outline-offset: 2px;
}

/* --- Variantes --- */

/* Primaire (action principale) */
.btn--primary {
  background-color: var(--color-secondary);
  color: var(--color-text-light);
}
.btn--primary:not(:disabled):hover {
  background-color: hsl(207, 54%, 40%); /* Version plus foncée */
  transform: translateY(-2px);
}

/* Secondaire (action alternative) */
.btn--secondary {
  background-color: var(--color-background-alt);
  color: var(--color-text-body);
  border-color: var(--color-border);
}
.btn--secondary:not(:disabled):hover {
  background-color: hsl(210, 20%, 90%);
  border-color: hsl(210, 20%, 80%);
}

/* Danger (action destructive) */
.btn--danger {
  background-color: var(--color-danger);
  color: var(--color-text-light);
}
.btn--danger:not(:disabled):hover {
  background-color: hsl(0, 72%, 45%);
}

/* Ghost (discret, pour "Annuler" par exemple) */
.btn--ghost {
  background-color: transparent;
  color: var(--color-text-muted);
}
.btn--ghost:not(:disabled):hover {
  background-color: var(--color-background-alt);
}

/* --- État de Chargement --- */
.content-hidden {
  visibility: hidden;
}

.spinner {
  position: absolute;
  width: 1.25em; /* Taille relative à la police */
  height: 1.25em;
  border: 3px solid currentColor;
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>