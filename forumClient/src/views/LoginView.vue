<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const form = ref({ email: '', password: '' });
const error: Ref<string | null> = ref(null);

async function handleLogin() {
  try {
    error.value = null;
    await authStore.login(form.value);
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Email ou mot de passe incorrect.';
  }
}
</script>

<template>
  <div class="auth-form-container">
    <form @submit.prevent="handleLogin" class="auth-form">
      <h1>Connexion</h1>
      <div class="form-group">
        <label for="email">Adresse Email</label>
        <input type="email" id="email" v-model="form.email" required autocomplete="email">
      </div>
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input type="password" id="password" v-model="form.password" required autocomplete="current-password">
      </div>
      <p v-if="error" class="error-message">{{ error }}</p>
      <button type="submit" class="submit-button">Se connecter</button>
    </form>
  </div>
</template>

<style scoped>
.auth-form-container {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
}
.auth-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: #fff;
}
.form-group {
  margin-bottom: 1.5rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-sizing: border-box;
}
.submit-button {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: var(--primary-color);
  color: white;
  font-size: 1rem;
  cursor: pointer;
}
.error-message {
  color: #dc3545;
  margin-top: 1rem;
  text-align: center;
}
</style>