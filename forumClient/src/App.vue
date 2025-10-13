<script setup lang="ts" vapor >
import { RouterView } from 'vue-router';
import FooterEnd from './components/FooterEnd.vue';
import HeaderStart from './components/ForumHeader.vue';
</script>

<template>
  <HeaderStart/>
  <main class="container">
    <RouterView />
  </main>
  <FooterEnd/>
</template>


<style>
:root {
  --primary-color: #007bff;
  --background-color: #f8f9fa;
  --text-color: #212529;
  --border-color: #dee2e6;
}
html{
  scroll-behavior: smooth;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  margin: 0;
  background-color: var(--background-color);
  color: var(--text-color);
}

</style>