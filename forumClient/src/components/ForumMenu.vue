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
        <img class = 'icon' src="https://cdn-icons-png.flaticon.com/512/7079/7079548.png" alt="icône" />
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
         <button 
            v-if="props.isAuthenticated"
            class="create-button" 
            @click="emit('toggle-create')"
          >
            {{ props.isCreating ? 'Annuler' : 'Créer un post' }}
          </button>
      </div>
    </div>
   
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
  margin-bottom: 0.5rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 30px 30px 0px 0px;
}
.search-and-filters {
  width: 100%;
}
.search-container {
  display: flex;
  position: relative;
}

.search-bar {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 4rem;
  font-size: 1rem;
  width: -moz-available;
  width: -webkit-fill-available;
  height: 60px;
  background: var(--md-sys-color-surface-container-low);
}
.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

/* --- STYLES POUR LES BOUTONS NATIFS --- */
.search-button,
.create-button {
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.search-button {
  background-color: #cacaca;
  color: #d7d7d9;
  border-radius: 0 15rem 15rem 0;
  width:60px;
  height:60px;
  flex: 0 0 auto;
  position: absolute;
  right: 0;
}

.search-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.create-button {
  background-color: #34749f;
  color: white;
  font: inherit;
  flex: 1 1 150px;
}
.icon{
  height: 40px;
  aspect-ratio: 1/1;
}

</style>