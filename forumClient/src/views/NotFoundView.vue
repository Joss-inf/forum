<!-- src/views/NotFoundView.vue -->
<template>
  <div class="error-page">
    <div class="card error-container">
      <h1>404 - Page Introuvable</h1>
      <p>Oups ! La page que vous cherchez n'existe pas ou a été déplacée.</p>
      <RouterLink to="/" class="home-link">Retourner à l'accueil</RouterLink>
    </div>
  </div>
</template>

<style scoped>
/*
 * ==========================================================================
 *  CSS SYSTÈME DE DESIGN
 * ==========================================================================
 */

.error-page {
  display: grid;
  place-items: center;
  min-height: 80vh;
  padding: var(--space-md);
}

.error-container {
  max-width: 500px;
  text-align: center;

  border-top: 4px solid var(--color-danger);
}

h1 {

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
  color: var(--color-secondary); 
  text-decoration: none;
  transition: var(--transition-smooth);
}

.home-link:hover {
  text-decoration: underline;
}
</style>