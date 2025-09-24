<template>
  <div class="container">
    <div class="form-box">
      <h1>Connexion </h1>
      <p>Connecte-toi à ton compte</p>

      <form @submit.prevent="login">
        <input
          v-model="form.email"
          type="email"
          placeholder="Adresse email"
          required
        />
        <input
          v-model="form.password"
          type="password"
          placeholder="Mot de passe"
          required
        />
        <p v-if="error" class="error">{{ error }}</p>
        <button type="submit">Se connecter</button>
      </form>

      <p class="footer-text">
        Pas encore de compte ? <a href="/register">Inscription</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const form = reactive({
  email: '',
  password: ''
})

const error = ref('')

const login = () => {
  error.value = ''
  // Validation très simple
  if (!form.email.includes('@')) {
    error.value = "Email invalide"
    return
  }
  if (form.password.length < 6) {
    error.value = "Mot de passe trop court (6 caractères minimum)"
    return
  }

  // Simule une connexion réussie
  console.log('Connexion en cours avec :', form)
  alert('Connexion réussie (simulée)')
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #d4fc79, #96e6a1);
  padding: 1rem;
}

.form-box {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  margin-bottom: 0.5rem;
  font-size: 2rem;
  color: #333;
}

p {
  margin-bottom: 1rem;
  color: #555;
}

input {
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #34a853;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

button:hover {
  background: #2c8e45;
}

.footer-text {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.footer-text a {
  color: #34a853;
  text-decoration: none;
}

.footer-text a:hover {
  text-decoration: underline;
}

.error {
  color: red;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}
</style>
