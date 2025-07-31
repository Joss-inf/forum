<template>
  <div class="container">
    <div class="form-box">
      <h1>Bienvenue</h1>
      <p>Crée ton compte pour commencer</p>

      <form @submit.prevent="register">
        <input v-model="form.name" type="text" placeholder="Nom complet" required />
        <input v-model="form.email" type="email" placeholder="Adresse email" required />
        <input v-model="form.password" type="password" placeholder="Mot de passe" required />
        <button type="submit">S’inscrire</button>
      </form>

      <p class="footer-text">
        Tu as déjà un compte ? <a href="/login">Connecte-toi</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  password: '',
})

const register = () => {
  console.log('Infos du formulaire :', form)
  // À remplacer par un appel à ton backend (ex: fetch ou axios)
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #c2e9fb, #a1c4fd);
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
  background: #4a90e2;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

button:hover {
  background: #357ab8;
}

.footer-text {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.footer-text a {
  color: #4a90e2;
  text-decoration: none;
}

.footer-text a:hover {
  text-decoration: underline;
}
</style>
