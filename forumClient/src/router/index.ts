// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useLoadingStore } from '@/stores/loader';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: false } 
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
      meta: { requiresAuth: false }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true}
    },
    {
      path: '/posts/:id',
      name: 'post-detail',
      component: () => import('../views/PostDetailView.vue'),
      meta: { requiresAuth: false }
    },
    {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('../views/UnauthorizedView.vue'),
    meta: { requiresAuth: false }
    },
    {
      path: '/:pathMatch(.*)*', 
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { requiresAuth: false }
    }
  ]
});

/**
 * Garde de navigation globale.
 * Elle s'exécute avant chaque changement de route.
 * IMPORTANT : Cette garde suppose que l'état d'authentification a déjà été initialisé
 * dans `main.ts` avant que l'application ne soit montée.
 */


const GuestPages = new Set(['login', 'register']);

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth;
  const allowedRoles = to.meta.roles;
  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.user?.role; 
  const name:string = to.name as string;

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } 
  else if (GuestPages.has(name) && isAuthenticated) {
    next({ name: 'forum' });
  } 
  else if (
    requiresAuth &&
    Array.isArray(allowedRoles) &&
    !allowedRoles.includes(userRole)
  ) {
    useLoadingStore().isPageLoading = true;
    next({ name: 'unauthorized' }); 
  } 
  else {
    useLoadingStore().isPageLoading = true;
    next();
  }
});

/**
 * Garde de navigation globale.
 * Elle s'exécute après chaque changement de route.
 */
router.afterEach(() => {
  const loadingStore = useLoadingStore();
    setTimeout(() => {
      loadingStore.isPageLoading = false;
    }, 100);

});

export default router;