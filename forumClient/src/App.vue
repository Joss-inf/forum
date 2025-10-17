<script setup lang="ts"  >
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
