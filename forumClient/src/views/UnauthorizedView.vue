<!-- src/views/UnauthorizedView.vue -->
<template>
  <div class="error-page">
    <!-- On utilise la classe .card de notre layout pour la base -->
    <div class="card error-container">
      <h1>403 - Accès Refusé</h1>
      <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      <RouterLink to="/" class="home-link">Retourner à l'accueil</RouterLink>
    </div>
  </div>
</template>

<style scoped>
/* Le CSS est maintenant beaucoup plus léger et utilise nos variables de design */

.error-page {
  display: grid;
  place-items: center;
  min-height: 80vh;
  padding: var(--space-md);
  /* Le fond est déjà géré par le style global du body, pas besoin de le redéfinir */
}

.error-container {
  max-width: 500px;
  text-align: center;
  /* La classe .card gère déjà le fond, le padding, l'ombre et le border-radius. */
  /* On ajoute seulement ce qui est spécifique à cette carte : */
  border-top: 4px solid var(--color-warning);
}

h1 {
  /* La police est déjà gérée par le style global */
  font-size: 1.75rem;
  color: var(--color-text-headings);
  margin-bottom: var(--space-md);
}

p {
  color: var(--color-text-muted);
  margin-bottom: var(--space-lg);
}

.home-link {
  font-weight: 600;
  color: var(--color-secondary); /* Utilise la couleur bleue de notre système */
  text-decoration: none;
  transition: var(--transition-smooth);
}

.home-link:hover {
  text-decoration: underline; /* Plus accessible et standard qu'un changement d'opacité */
}
</style>