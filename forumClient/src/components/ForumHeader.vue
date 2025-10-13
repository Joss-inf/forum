<script setup lang="ts" vapor >
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import GlobalLoader from './GlobalLoader.vue';

const authStore = useAuthStore();
const isMenuOpen = ref(false);
</script>


<template>
<header class="app-header">
    <GlobalLoader/>
    <nav class="nav-bar">
      <div class="nav-logo">
        <RouterLink to="/">VueSphere</RouterLink>
      </div>

      <button class="menu-toggle" @click="isMenuOpen = !isMenuOpen">
        ☰
      </button>

      <ul :class="['nav-menu', { open: isMenuOpen }]">
        <li><RouterLink to="/">Accueil</RouterLink></li>
        <li><RouterLink to="/forum">Forum</RouterLink></li>
        <li v-if="authStore.isAuthenticated">
          <RouterLink to="/profile">Profil</RouterLink>
        </li>

        <li v-if="authStore.isAuthenticated">
          <a @click="authStore.logout()" class="nav-button">Déconnexion</a>
        </li>
        <template v-else>
          <li><RouterLink to="/login">Connexion</RouterLink></li>
          <li><RouterLink to="/register">Inscription</RouterLink></li>
        </template>
      </ul>
    </nav>
  </header>
</template>
<style lang="css" scoped>
.app-header {

  width: 100%;
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
}

.nav-bar {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo a {
  font-weight: bold;
  font-size: 1.3rem;
  color: var(--primary-color);
  text-decoration: none;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: var(--primary-color);
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-menu li a,
.nav-button {
  color: var(--text-color);
  text-decoration: none;
  padding: 0.5rem;
  font-weight: 500;
  cursor: pointer;
}

.nav-menu li a.router-link-exact-active {
  font-weight: bold;
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
}

/* Mobile Styles */
@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .nav-menu {
    position: absolute;
    top: 60px;
    right: 0;
    background-color: #fff;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    visibility: hidden;
    padding: 0;
    border-top: 1px solid var(--border-color);
    transition:
      max-height 0.3s ease,
      opacity 0.3s ease,
      padding 0.3s ease,
      visibility 0.3s ease;
}

  .nav-menu.open {
    max-height: 500px; /* Doit être > hauteur réelle du menu */
    opacity: 1;
    visibility: visible;
    padding: 1rem 0;
    z-index: 100;
  }

  .nav-menu li {
    text-align: center;
    padding: 0.5rem 0;
    width: 100%;
  }
}
</style>