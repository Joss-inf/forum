// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false } 
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/forum',
      name: 'forum',
      component: () => import('../views/ForumView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/posts/:id',
      name: 'post-detail',
      component: () => import('../views/PostDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('../views/UnauthorizedView.vue'),
    meta: { requiresAuth: true }
    }
  ]
});

/**
 * Garde de navigation globale.
 * Elle s'exécute avant chaque changement de route.
 * IMPORTANT : Cette garde suppose que l'état d'authentification a déjà été initialisé
 * dans `main.ts` avant que l'application ne soit montée.
 */

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth;
  const allowedRoles = to.meta.roles;
  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.user?.role; // Assure-toi que `authStore.user` contient un `role`

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } 
  else if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
    next({ name: 'forum' });
  } 
  else if (
    requiresAuth &&
    Array.isArray(allowedRoles) &&
    !allowedRoles.includes(userRole)
  ) {
    next({ name: 'unauthorized' }); // Rediriger vers une page 403
  } 
  else {
    next();
  }
});

export default router;