<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

onMounted(() => {
  authStore.checkAuthOnLoad();
});
</script>

<template>
  <header class="app-header">
    <nav class="container">
      <div class="nav-links">
        <RouterLink to="/">Accueil</RouterLink>
        <RouterLink to="/forum">Forum</RouterLink>
        <RouterLink v-if="authStore.isAuthenticated" to="/profile">Profil</RouterLink>
      </div>
      <div class="user-actions">
        <template v-if="authStore.isAuthenticated">
          <span>Bonjour, {{ authStore.user?.username }}</span>
          <a @click="authStore.logout()" class="nav-button">Déconnexion</a>
        </template>
        <template v-else>
          <RouterLink to="/login">Connexion</RouterLink>
          <RouterLink to="/register">Inscription</RouterLink>
        </template>
      </div>
    </nav>
  </header>
  <main class="container">
    <RouterView />
  </main>
</template>

<style>
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --background-color: #fff;
  --text-color: #212529;
  --border-color: #dee2e6;
  --container-width: 960px;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  margin: 0;
  background-color: var(--background-color);
  color: var(--text-color);
}
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px; /* fixe une hauteur */
  background-color: #f8f9fa;
  border-bottom: 1px solid var(--border-color);
  z-index: 1000; /* pour rester au-dessus du contenu */
}
.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 1rem;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.nav-links a, .user-actions a {
  color: var(--primary-color);
  text-decoration: none;
  padding: 0.5rem;
  margin-right: 1rem;
}
.nav-links a.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}
.user-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.nav-button {
  cursor: pointer;
}
</style>