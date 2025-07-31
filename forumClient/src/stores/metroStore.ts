import { defineStore } from 'pinia';

export const useMetroStore = defineStore('metro', {
  state: () => ({
    metros: [] as { id: string; lat: number; lng: number }[],
  }),
  actions: {
    updateMetro(id: string, lat: number, lng: number) {
      const metro = this.metros.find((m) => m.id === id);
      if (metro) {
        metro.lat = lat;
        metro.lng = lng;
      } else {
        this.metros.push({ id, lat, lng });
      }
    },
  },
});
