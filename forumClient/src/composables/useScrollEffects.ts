// src/composables/useScrollEffects.ts
import { onMounted, onUnmounted } from 'vue';

/**
 * Options pour configurer l'Intersection Observer.
 */
interface RevealOptions {
  selector?: string;        // Sélecteur CSS pour les éléments à animer.
  observerOptions?: IntersectionObserverInit; // Options natives de l'IntersectionObserver.
}

/**
 * Composable qui utilise l'Intersection Observer pour ajouter une classe
 * aux éléments lorsqu'ils deviennent visibles dans le viewport.
 * @param options - Options de configuration.
 */
export function useScrollEffects(options: RevealOptions = {}) {
  // Définition des valeurs par défaut pour les options.
  const {
    selector = '.reveal-item',
    observerOptions = { 
      threshold: 0.1,               // Se déclenche quand 10% de l'élément est visible.
      rootMargin: '0px 0px -10% 0px'  // Réduit la zone de déclenchement pour une meilleure UX.
    }
  } = options;

  let observerInstance: IntersectionObserver | null = null;

  /**
   * Initialise l'Intersection Observer et attache les écouteurs.
   */
  const setupIntersectionObserver = () => {
    const revealElements = document.querySelectorAll(selector);
    
    // Si aucun élément à observer n'est trouvé, on ne fait rien.
    if (revealElements.length === 0) {
      return;
    }

    observerInstance = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          // Optionnel: pour n'animer qu'une seule fois, décommenter la ligne suivante.
          // observerInstance?.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observerInstance?.observe(el));
  };

  // Gestion du cycle de vie
  onMounted(setupIntersectionObserver);

  onUnmounted(() => {
    // Nettoyage de l'observateur pour éviter les fuites de mémoire.
    if (observerInstance) {
      observerInstance.disconnect();
    }
  });
}