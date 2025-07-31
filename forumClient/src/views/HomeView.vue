<template>
  <div class="home-view">
    <h1>Bienvenue sur le Forum Vue.js</h1>
    <p>Un espace de discussion moderne construit avec les meilleures technologies.</p>
    <div class="features">
      <div class="feature-item">Vue.js 3 & TypeScript</div>
      <div class="feature-item">Pinia State Management</div>
      <div class="feature-item">Vue Router</div>
      <div class="feature-item">Node.js & Express API</div>
    </div>
    <p>Veuillez vous <RouterLink to="/login">connecter</RouterLink> ou vous <RouterLink to="/register">inscrire</RouterLink> pour participer.</p>
  </div>
</template>

<style scoped>
.home-view {
  text-align: center;
  padding-top: 2rem;
}
.features {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
}
.feature-item {
  background-color: #e9ecef;
  padding: 0.5rem 1rem;
  border-radius: 5px;
}
</style>