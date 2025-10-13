// src/store/auth.ts
import { defineStore } from 'pinia';
import { ref, computed, nextTick } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import apiClient from '@/services/apiClient'; // Assurez-vous que ce chemin est correct
import router from '@/router'; // Assurez-vous que ce chemin est correct
import type { User, LoginCredentials, RegisterData } from '@/types'; // Assurez-vous que ces types sont définis

export const useAuthStore = defineStore('auth', () => {
  // --- STATE ---
  const user: Ref<User | null> = ref(null);

  // --- GETTERS ---
  const isAuthenticated: ComputedRef<boolean> = computed(() => !!user.value);
  const userRole: ComputedRef<string | null> = computed(() => user.value?.role ?? null);

  // --- ACTIONS ---

  /**
   * Tente de récupérer les informations de l'utilisateur connecté.
   * Le navigateur enverra automatiquement le cookie d'authentification.
   */
  async function fetchUser() {
    try {
      const response = await apiClient.get<User>('/users/me'); // Endpoint pour récupérer le profil de l'utilisateur connecté
      user.value = response.data;
      console.log('User fetched:', user.value)

    } catch (err: any){
      user.value = null;
      // Les route guards ou d'autres logiques peuvent gérer la redirection si nécessaire.
    }
  }

  /**
   * Gère la connexion de l'utilisateur.
   */
  async function login(credentials: LoginCredentials) {
    try {
      await apiClient.post<{ user: User }>('/auth/login', credentials);
      await fetchUser();
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Gère l'enregistrement de l'utilisateur.
   */
  async function register(userData: RegisterData) {
    try {
      await apiClient.post('/auth/register', userData);
      // Après l'inscription, tu peux choisir de connecter l'utilisateur automatiquement
      // ou le laisser se connecter manuellement. Ici, on ne fait rien de plus.
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Gère la déconnexion de l'utilisateur.
   */
  async function logout() {
  try {
    await apiClient.post('/auth/logout', { userId: user.value });
  } catch (err) {
    console.warn('Erreur lors du logout côté serveur :', err);
  } finally {
    user.value = null;
    await router.push('/login');
  }
}

  /**
   * Initialise l'état d'authentification au démarrage de l'application.
   */
  async function initializeAuth() {
    try {
      await fetchUser();
    } catch (err: any) {
      // Gérer l'erreur si initializeAuth échoue (par ex. le serveur n'est pas accessible)
      console.error("Erreur lors de l'initialisation de l'authentification:", err);
      // Ne pas propager l'erreur ici pour ne pas bloquer le démarrage de l'app
    }
  }

  /**
   * Met à jour le profil de l'utilisateur.
   * @param profileData Les données du profil à mettre à jour (username, email).
   */
  async function updateProfile(profileData: { username: string; email: string }) {
    try {
      // Envoie les données mises à jour au backend
      const response = await apiClient.put<User>('/users/profile', profileData); // Endpoint de mise à jour du profil
      user.value = response.data; // Met à jour l'état de l'utilisateur dans le store avec les nouvelles données
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du profil:', err);
      throw err; // Propage l'erreur au composant pour affichage
    }
  }

  /**
   * Change le mot de passe de l'utilisateur.
   * @param passwordData Les données du mot de passe (currentPassword, newPassword).
   */
  async function changePassword(passwordData: { currentPassword: string; newPassword: string }) {
    try {
      // Envoie les données du mot de passe au backend
      await apiClient.put('/users/change-password', passwordData); // Endpoint de changement de mot de passe
      // Pas de mise à jour de l'état 'user' ici, car le mot de passe n'est pas dans l'objet user public.
    } catch (err: any) {
      console.error('Erreur lors du changement de mot de passe:', err);
      throw err; // Propage l'erreur au composant pour affichage
    }
  }

  return {

    user,
    isAuthenticated,
    userRole,

    login,
    register,
    logout,
    initializeAuth,
    fetchUser,
    updateProfile, 
    changePassword, 
  };
});