<!-- src/views/NotFoundView.vue -->
<template>
  <div class="error-page">
    <div class="error-container">
      <h1>404 - Page Introuvable</h1>
      <p>Oups ! La page que vous cherchez n'existe pas ou a été déplacée.</p>
      <RouterLink to="/" class="home-link">Retourner à l'accueil</RouterLink>
    </div>
  </div>
</template>

<style scoped>
/* On utilise les mêmes styles que la page 403 pour la cohérence */
.error-page {
  display: grid;
  place-items: center;
  min-height: 80vh;
  text-align: center;
  background-color: #f8fafc;
  padding: 1rem;
}

.error-container {
  max-width: 500px;
  padding: 3rem 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  border-top: 4px solid #f43f5e; /* Rouge pour une erreur 404 */
}

h1 {
  font-family: 'Poppins', sans-serif;
  font-size: 2rem;
  color: #1e293b;
  margin-bottom: 1rem;
}

p {
  color: #64748b;
  margin-bottom: 2rem;
}

.home-link {
  display: inline-block;
  font-weight: 600;
  color: #0ea5e9;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.home-link:hover {
  opacity: 0.8;
}
</style>