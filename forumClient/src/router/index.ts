import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Notez que nous n'importons plus les composants de vue directement en haut du fichier.
// C'est la clé du lazy loading.
// import HomeView from '../views/HomeView.vue'; // <- Ligne supprimée

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // La syntaxe `() => import(...)` dit à Vite/Webpack de créer un fichier JS séparé ("chunk")
      // pour cette vue, qui ne sera téléchargé que lorsque l'utilisateur naviguera vers '/'.
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/forum',
      name: 'forum',
      component: () => import('../views/ForumView.vue'),
      meta: { requiresAuth: true } // La méta-information pour notre garde de navigation
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/posts/:id', // Le :id est un paramètre dynamique
      name: 'post-detail',
      component: () => import('../views/PostDetailView.vue'),
      meta: { requiresAuth: true }
    },
    // Vous pouvez continuer à ajouter d'autres routes ici en suivant le même modèle.
    // Par exemple, pour la page de détail d'un post :
    // {
    //   path: '/posts/:id',
    //   name: 'post-detail',
    //   component: () => import('../views/PostDetailView.vue'),
    //   meta: { requiresAuth: true }
    // }
  ]
});

// La garde de navigation reste exactement la même.
// Elle est indépendante de la manière dont les composants sont chargés.
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // On initialise le store ici pour s'assurer qu'il est prêt avant la vérification
  // C'est une sécurité supplémentaire si l'utilisateur recharge la page sur une route protégée.
  if (!authStore.token) {
    authStore.token = localStorage.getItem('token');
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Si la route requiert une authentification et que l'utilisateur n'est pas connecté,
    // on le redirige vers la page de connexion.
    next({ name: 'login' });
  } else {
    // Sinon, on autorise la navigation.
    next();
  }
});

export default router;