<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
</script>

<template>
  <div class="profile-view">
    <h1>Mon Profil</h1>
    <div v-if="authStore.user" class="profile-card">
      <div class="profile-info">
        <span class="label">ID Utilisateur :</span>
        <span class="value">{{ authStore.user.id }}</span>
      </div>
      <div class="profile-info">
        <span class="label">Nom d'utilisateur :</span>
        <span class="value">{{ authStore.user.username }}</span>
      </div>
      <!-- <div class="profile-info">
        <span class="label">Email :</span>
        <span class="value">{{ authStore.user.email }}</span>
      </div> -->
    </div>
    <div v-else>
      <p>Chargement des informations du profil...</p>
    </div>
  </div>
</template>

<style scoped>
.profile-card {
  background-color: #f8f9fa;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  margin: 2rem auto;
}
.profile-info {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
}
.profile-info:last-child {
  border-bottom: none;
}
.label {
  font-weight: bold;
  color: var(--secondary-color);
}
.value {
  font-family: monospace;
}
</style>