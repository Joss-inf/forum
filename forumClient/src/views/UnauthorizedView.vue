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

.error-page {
  display: grid;
  place-items: center;
  min-height: 80vh;
  padding: var(--space-md);
}

.error-container {
  max-width: 500px;
  text-align: center;
  border-top: 4px solid var(--color-warning);
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