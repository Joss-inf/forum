<script setup lang="ts">

import { useScrollEffects } from '@/composables/useScrollEffects';
import CTAButton from '@/components/buttons/CTAButton.vue';
useScrollEffects();
</script>

<template>
  <div class="vue-sphere-landing">
    <main class="content-wrapper">
      <!-- Hero Section -->
      <section class="hero-section split-layout">
        <div class="hero-content-wrapper container">
          <div class="hero-text-content reveal-item">
            <h1 class="hero-title">VueSphere : Votre Écosystème <span class="gradient-text">Vue.js</span></h1>
            <p class="hero-subtitle">Connectez-vous, Apprenez, Créez. Le forum nouvelle génération pour les développeurs Vue.</p>
            <div class="hero-actions">
              <CTAButton to="/register" variant="primary">Rejoindre VueSphere</CTAButton>
              <a href="#features" class=" hero-btn">Découvrir les Fonctionnalités</a>
            </div>
          </div>
          <div class="hero-illustration reveal-item">
            <!-- Placeholder pour une illustration SVG/Animation complexe -->
            <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" class="sphere-bg">
              <circle cx="200" cy="150" r="120" fill="url(#paint0_linear)"/>
              <circle cx="250" cy="100" r="40" fill="url(#paint1_linear)" opacity="0.6"/>
              <circle cx="100" cy="200" r="60" fill="url(#paint2_linear)" opacity="0.7"/>
              <path d="M150 150C150 150 180 100 220 120C260 140 250 200 200 180C150 160 150 150 150 150Z" fill="url(#paint3_linear)" opacity="0.8"/>
              <defs>
                <linearGradient id="paint0_linear" x1="200" y1="30" x2="200" y2="270" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#4CAF50"/>
                  <stop offset="1" stop-color="#8E24AA"/>
                </linearGradient>
                <linearGradient id="paint1_linear" x1="250" y1="60" x2="250" y2="140" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#AEEA00"/>
                  <stop offset="1" stop-color="#1DE9B6"/>
                </linearGradient>
                <linearGradient id="paint2_linear" x1="100" y1="140" x2="100" y2="260" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#2962FF"/>
                  <stop offset="1" stop-color="#FF1744"/>
                </linearGradient>
                <linearGradient id="paint3_linear" x1="200" y1="120" x2="200" y2="180" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#FFD740"/>
                  <stop offset="1" stop-color="#FF6E40"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </section>

      <!-- Features Section (New expressive version) -->
      <section id="features" class="features-section">
        <div class="container">
          <h2 class="section-title reveal-item">Pourquoi Choisir VueSphere ?</h2>

          <!-- Feature 1: Vue.js 3 & TypeScript -->
          <div class="feature-pillar reverse reveal-item">
            <div class="pillar-content">
              <span class="pillar-number gradient-text">01</span>
              <h3 class="pillar-title">Vue.js 3 & TypeScript</h3>
              <p class="pillar-description">
                Plongez au cœur des dernières innovations front-end. <strong>Vue.js 3</strong>
                offre une réactivité inégalée, et <strong>TypeScript</strong> garantit une robustesse
                et une maintenabilité de votre code. Une base solide pour l'excellence.
              </p>
            </div>
            <div class="pillar-visual">
              <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="feature-icon-lg">
                <defs>
                  <linearGradient id="gradient-vue" x1="120" y1="0" x2="120" y2="240" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#4CAF50"/>
                    <stop offset="1" stop-color="#2E7D32"/>
                  </linearGradient>
                  <linearGradient id="gradient-ts" x1="120" y1="0" x2="120" y2="240" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#3178C6"/>
                    <stop offset="1" stop-color="#1976D2"/>
                  </linearGradient>
                </defs>
                <!-- Forme abstraite Vue -->
                <path d="M120 0L20 200L120 240L220 200L120 0Z" fill="url(#gradient-vue)" opacity="0.8"/>
                <!-- Forme abstraite TypeScript -->
                <circle cx="170" cy="70" r="40" fill="url(#gradient-ts)" opacity="0.6"/>
                <!-- Pseudo V -->
                <path d="M120 60L160 180H80L120 60Z" fill="#FFF" opacity="0.1"/>
              </svg>
            </div>
          </div>

          <!-- Feature 2: Pinia State Management -->
          <div class="feature-pillar reveal-item">
            <div class="pillar-visual">
              <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="feature-icon-lg">
                <defs>
                  <linearGradient id="gradient-pinia" x1="120" y1="0" x2="120" y2="240" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FFC107"/>
                    <stop offset="1" stop-color="#FF8F00"/>
                  </linearGradient>
                </defs>
                <!-- Forme abstraite Pinia (puzzle piece or interconnected nodes) -->
                <path d="M120 20C70 20 20 70 20 120C20 170 70 220 120 220C170 220 220 170 220 120C220 70 170 20 120 20ZM120 60C147.614 60 170 82.3858 170 110C170 121.731 166.703 132.844 160.84 142.246L130 112V80H110V112L80 142.246C73.1891 131.751 70 120 70 110C70 82.3858 92.3858 60 120 60Z" fill="url(#gradient-pinia)" opacity="0.8"/>
                <circle cx="120" cy="120" r="30" fill="#FFF" opacity="0.1"/>
              </svg>
            </div>
            <div class="pillar-content">
              <span class="pillar-number gradient-text">02</span>
              <h3 class="pillar-title">Pinia State Management</h3>
              <p class="pillar-description">
                Simplifiez la gestion de l'état de votre application avec <strong>Pinia</strong>.
                Léger, intuitif et entièrement typé, il offre une expérience développeur
                exceptionnelle pour des applications Vue.js performantes et faciles à maintenir.
              </p>
            </div>
          </div>

          <!-- Feature 3: Vue Router -->
          <div class="feature-pillar reverse reveal-item">
            <div class="pillar-content">
              <span class="pillar-number gradient-text">03</span>
              <h3 class="pillar-title">Navigation Intelligente</h3>
              <p class="pillar-description">
                Avec <strong>Vue Router</strong>, la navigation devient une évidence. Créez des
                expériences utilisateur fluides et intuitives grâce à un routage
                déclaratif et une gestion puissante des routes dynamiques.
              </p>
            </div>
            <div class="pillar-visual">
              <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="feature-icon-lg">
                <defs>
                  <linearGradient id="gradient-router" x1="120" y1="0" x2="120" y2="240" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FF1744"/>
                    <stop offset="1" stop-color="#D50000"/>
                  </linearGradient>
                </defs>
                <!-- Forme abstraite Router (flèches de navigation) -->
                <path d="M120 20L170 120L120 220L70 120L120 20Z" fill="url(#gradient-router)" opacity="0.8"/>
                <path d="M120 40L155 120L120 200L85 120L120 40Z" fill="#FFF" opacity="0.1"/>
                <path d="M120 120L180 120L150 150L180 120L150 90L180 120Z" fill="#FFF" opacity="0.2"/>
                <path d="M120 120L60 120L90 90L60 120L90 150L60 120Z" fill="#33FFF" opacity="0.2"/>
              </svg>
            </div>
          </div>

          <!-- Feature 4: Node.js & Express API -->
          <div class="feature-pillar reveal-item">
            <div class="pillar-visual">
              <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="feature-icon-lg">
                <defs>
                  <linearGradient id="gradient-nodejs" x1="120" y1="0" x2="120" y2="240" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#68A063"/>
                    <stop offset="1" stop-color="#4CAF50"/>
                  </linearGradient>
                  <linearGradient id="gradient-express" x1="120" y1="0" x2="120" y2="240" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#303030"/>
                    <stop offset="1" stop-color="#000000"/>
                  </linearGradient>
                </defs>
                <!-- Forme abstraite Node.js / Express (engrenages, blocs de construction) -->
                <circle cx="120" cy="120" r="100" fill="url(#gradient-nodejs)" opacity="0.8"/>
                <rect x="70" y="70" width="100" height="100" rx="20" fill="url(#gradient-express)" opacity="0.6"/>
                <path d="M100 100L140 100L140 140L100 140L100 100Z" fill="#FFF" opacity="0.1"/>
                <circle cx="120" cy="120" r="20" fill="#FFF" opacity="0.2"/>
              </svg>
            </div>
            <div class="pillar-content">
              <span class="pillar-number gradient-text">04</span>
              <h3 class="pillar-title">Backend Robuste et Rapide</h3>
              <p class="pillar-description">
                Notre API est construite avec <strong>Node.js</strong> et <strong>Ultimate-Express</strong>,
                garantissant une expérience fluide, sécurisée et ultra-rapide.
                Un backend fiable pour une application front-end réactive.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Call to Action Section (Final) -->
      <section id="cta-final" class="cta-final-section">
        <div class="cta-container reveal-item">
          <h2 class="cta-title">Prêt à Plonger dans l'Univers Vue.js ?</h2>
          <p class="cta-subtitle">Participez aux discussions, partagez vos connaissances et élevez votre niveau de développement.</p>
          <div class="cta-actions">
            <CTAButton to="/register" variant="primary">S'inscrire Maintenant</CTAButton>
            <CTAButton to="/login" variant="tertiary">Se Connecter</CTAButton>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>


/* --- Styles de base et utilitaires --- */
.vue-sphere-landing {
  color: var(--md-sys-color-on-surface);
  overflow-x: hidden; 
}

p {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: var(--md-sys-color-on-surface-variant); 
}

a {
  text-decoration: none;
  color: inherit;
  transition: color var(--md-sys-motion-duration-medium);
}
strong {
  font-weight: 600;
  color: var(--md-sys-color-on-surface);
}

.container {
  max-width: 1280px; 
  margin: 0 auto;
  padding: 0 1.5rem;
}

.gradient-text {
  background: var(--md-sys-color-primary); 
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* --- Header --- */
.app-header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  background-color: var(--md-sys-color-surface-bright);
  backdrop-filter: blur(8px); 
  border-bottom: 1px solid var(--md-sys-color-outline);
  transition: all var(--md-sys-motion-duration-medium) ease-in-out;
  height: 70px; 
  display: flex;
  align-items: center;
}

.app-header.scrolled {
  background-color: var(--md-sys-color-surface-bright);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
  border-bottom-color: rgba(0, 0, 0, 0.05);
  height: 60px; 
}

.logo-text {
  background: var(--md-sys-color-primary); 
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.8rem; 
  transition: font-size var(--md-sys-motion-duration-medium) ease;
}

/* --- Hero Section --- */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 8rem; 
  padding-bottom: 4rem;
  background: linear-gradient(135deg, #bdf0fe, #e1ffdf);; 
  position: relative;
  overflow: hidden;
}
.hero-text-content{
  position: absolute;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 25%;
}
.hero-content-wrapper {
  position: relative;
  z-index: 2; 
}

.hero-title {
  font-size: 4.5rem;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: 1.3rem;
  color:   var(--color-text-headings);
  margin-bottom: 2.5rem;
  background: var(--md-sys-color-primary);
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
}

.hero-btn {
  padding: 1.2rem 2.5rem;
}

/* --- Features Section --- */
.features-section {
  padding: 8rem 0;
  background: linear-gradient(65deg, #bdf0fe, #e1ffdf);; 
  position: relative;
  overflow: hidden;
}

.features-section .container {
  max-width: 1100px; 
}

.section-title {
  text-align: center;
  font-size: 3rem;
  margin-bottom: 5rem;
  position: relative;
  display: inline-block; 
  color: var(--md-sys-color-on-surface);
}

.section-title::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -15px;
  transform: translateX(-50%);
  width: 100px;
  height: 5px;
  background: var(--md-sys-color-primary); 
  border-radius: 3px;
}

.feature-pillar {
  display: flex;
  align-items: center;
  gap: 4rem; 
  margin-bottom: 7rem;
  padding: 3rem;
  border-radius: var(--md-sys-shape-corner-large);
  transition: transform 0.4s ease-out, box-shadow 0.4s ease-out;
}

.feature-pillar:hover {
  transform: translateY(-8px);
}

.pillar-number {
  font-size: 4.5rem; 
  font-weight: 800;
  opacity: 0.8;
  line-height: 1;
  margin-bottom: 1.5rem;
  display: block; 
}

.pillar-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--md-sys-color-on-surface);
}

.pillar-description {
  font-size: 1.15rem;
  line-height: 1.7;
}

.feature-icon-lg {
  width: 280px;
  height: 280px;
  filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.1)); 
}

.cta-final-section {
  padding: 8rem 0;
  background: linear-gradient(138deg, #bdf0fe, #e1ffdf);
  text-align: center;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cta-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  
}
.cta-title {
  font-size: 3rem;
  /* CORRECTION: Utilisation d'une valeur fixe pour 1.5rem */
  margin-bottom: 1.5rem;
  /* CORRECTION: Remplacé --text-color-light par --md-sys-color-on-surface */
  color: var(--md-sys-color-on-surface);
}

/* Animations au scroll (conservées) */
.reveal-item {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}

.cta-subtitle {
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto 3rem auto;
  opacity: 0.9;
}

.cta-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
}

/* Animations au scroll (Intersection Observer) */
.reveal-item {
  opacity: 0;
  transform: translateY(30px); /* Plus grand mouvement initial */
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}

.reveal-item.is-revealed {
  opacity: 1;
  transform: translateY(0);

}

/* Délais d'animation pour les éléments de la Hero Section */
.hero-text-content.reveal-item { transition-delay: 0.1s; }
.hero-illustration.reveal-item { transition-delay: 0.3s; }

/* Délais d'animation pour les titres de section */
.section-title.reveal-item { transition-delay: 0.1s; }

/* Délais d'animation pour les piliers de fonctionnalités */
.feature-pillar:nth-child(1).reveal-item { transition-delay: 0.1s; }
.feature-pillar:nth-child(2).reveal-item { transition-delay: 0.2s; }
.feature-pillar:nth-child(3).reveal-item { transition-delay: 0.3s; }
.feature-pillar:nth-child(4).reveal-item { transition-delay: 0.4s; }


/* Media Queries pour la responsivité */
@media (max-width: 992px) {
 

  /* Hero Section */
  .hero-content-wrapper {
    text-align: center;
    gap: 3rem;
  }

  .hero-text-content {
    max-width: none;
  }

  .hero-title {
    font-size: 3.5rem;
  }

  .hero-illustration {
    order: -1; /* Place l'illustration au-dessus sur mobile */
    margin-bottom: 2rem;
  }

  /* Features Section */
  .features-section {
    padding: 6rem 0;
  }

  .section-title {
    font-size: 2.5rem;
    margin-bottom: 4rem;
  }

  .feature-pillar {
    flex-direction: column; /* Empile les éléments verticalement */
    text-align: center;
    gap: 2.5rem;
    margin-bottom: 5rem;
    padding: 2.5rem;
  }

  .feature-pillar.reverse {
    flex-direction: column; /* Même ordre pour tout le monde en mobile */
  }

  .pillar-content {
    max-width: 100%;
  }

  .pillar-visual {
    order: -1; /* Place le visuel au-dessus du texte */
    max-width: 80%; /* Ajuste la taille du visuel */
    margin-bottom: 1.5rem;
  }
  .feature-icon-lg {
    width: 220px;
    height: 220px;
  }

  .pillar-number {
    font-size: 3.8rem;
    margin-bottom: 1rem;
  }

  .pillar-title {
    font-size: 2rem;
    margin-bottom: 0.8rem;
  }

  .pillar-description {
    font-size: 1rem;
  }

  /* CTA Section */
  .cta-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  h1 { font-size: 2.8rem; }
  h2 { font-size: 2rem; }
  h3 { font-size: 1.5rem; }
  p { font-size: 1rem; }

  .content-wrapper {
    padding-top: 0px; /* Ajuster le padding pour mobile */
  }

  /* Hero Section */
  .hero-title {
    font-size: 2.8rem;
  }

  .hero-actions {
    flex-direction: column;
    gap: 1rem;
  }

  .btn {
    width: 100%;
  }

  /* Features Section */
  .features-section {
    padding: 4rem 0;
  }

  .section-title {
    font-size: 2rem;
    margin-bottom: 3rem;
  }

  .feature-pillar {
    padding: 2rem;
    margin-bottom: 3.5rem;
  }

  .pillar-number {
    font-size: 3rem;
  }
  .pillar-title {
    font-size: 1.8rem;
  }
  .pillar-description {
    font-size: 0.95rem;
  }
  .feature-icon-lg {
    width: 180px;
    height: 180px;
  }

  /* CTA Section */
  .cta-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  /* Header */
  .nav-logo a {
    font-size: 1.2rem;
  }
  .nav-logo svg {
    height: 1.8rem;
    width: 1.8rem;
  }
  .logo-text {
    font-size: 1.3rem;
  }
  .app-header.scrolled .logo-text {
    font-size: 1.3rem;
  }

  .nav-menu li {
    width: 90%;
  }

  .nav-menu li a,
  .nav-button {
    font-size: 1.3rem;
  }

  /* Hero Section */
  .hero-title {
    font-size: 2.2rem;
  }
  .hero-subtitle {
    font-size: 1rem;
  }

  /* Features Section */
  .section-title {
    font-size: 1.8rem;
  }

  .feature-pillar {
    padding: 1.5rem;
    gap: 2rem;
    margin-bottom: 2.5rem;
  }

  .pillar-number {
    font-size: 2.8rem;
  }
  .pillar-title {
    font-size: 1.6rem;
  }
  .pillar-description {
    font-size: 0.9rem;
  }
  .feature-icon-lg {
    width: 150px;
    height: 150px;
  }
}
</style>