<template>
  <div class="forum-header">
    <div class="search-and-filters">
      <div class="search-container">
        <input 
          type="text" 
          placeholder="Rechercher par titre..." 
          v-model="searchQueryModel" 
          class="search-bar" 
          @keyup.enter="emit('search')"
        />
        <!--  UTILISATION D'UN BOUTON NATIF -->
        <button 
          :disabled="!searchQueryModel" 
          class="search-button" 
          @click="emit('search')"
        >
          Rechercher
        </button>
      </div>
      
      <div class="filter-container">
        <BaseInput
          id="filter-tag"
          type="select"
          v-model.number="selectedTagModel"
          :options="props.availableTags.map(tag => ({ label: tag.name, value: tag.id }))"
          placeholder="Tous les tags"
        />
        
        <BaseInput
          id="filter-sort"
          type="select"
          v-model="sortOrderModel"
          :options="sortOptions"
        />
      </div>
    </div>

    <!--  UTILISATION D'UN BOUTON NATIF -->
    <button 
      v-if="props.isAuthenticated"
      class="create-button" 
      @click="emit('toggle-create')"
    >
      {{ props.isCreating ? 'Annuler' : 'Créer un post' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseInput from '@/components/BaseInput.vue';
import type { Tag } from '@/types';

const props = defineProps<{
  searchQuery: string;
  selectedTag: number | null;
  sortOrder: 'ASC' | 'DESC';
  availableTags: Tag[];
  isAuthenticated: boolean;
  isCreating: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void;
  (e: 'update:selectedTag', value: number | null): void;
  (e: 'update:sortOrder', value: 'ASC' | 'DESC'): void;
  (e: 'search'): void;
  (e: 'toggle-create'): void;
}>();

const searchQueryModel = computed({
  get: () => props.searchQuery,
  set: (value) => emit('update:searchQuery', value)
});

const selectedTagModel = computed({
  get: () => props.selectedTag,
  set: (value) => emit('update:selectedTag', value)
});

const sortOrderModel = computed({
  get: () => props.sortOrder,
  set: (value) => emit('update:sortOrder', value)
});

const sortOptions = [
  { label: 'Plus récents', value: 'DESC' },
  { label: 'Plus anciens', value: 'ASC' },
];
</script>

<style scoped>
/* J'ajoute des styles de base pour que les boutons natifs ressemblent à quelque chose */
.forum-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
}
.search-and-filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow: 1;
}
.search-container {
  display: flex;
  gap: 0.5rem;
}
.search-bar {
  flex-grow: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}
.filter-container {
  display: flex;
  gap: 1rem;
}

/* --- STYLES POUR LES BOUTONS NATIFS --- */
.search-button,
.create-button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.search-button {
  background-color: #f1f5f9;
  color: #334155;
}
.search-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.create-button {
  background-color: #34749f;
  color: white;
}
</style>