<template>
    <div class="promo-panel">
        <div class="promo-message">
        <p>Un petit pas pour vous, un grand pas pour votre progression.</p>
      </div>
    </div>
</template>

<style scoped>
/* Panneau graphique */
.promo-panel {
  background: linear-gradient(135deg, #19bf74d8 0%, #7bbcfe 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  flex: 1;
  min-width: 330px;
  order: 2;
}

.promo-message {
  max-width: 350px;
  text-align: center;
}

.promo-message p {
  font-size: clamp(18px, 1vw, 55px);
  margin-bottom: 20px;
  font-style: italic;
  letter-spacing: 1px;
  font-weight: 600;
}

.promo-message img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}
</style>
