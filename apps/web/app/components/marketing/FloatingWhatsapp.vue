<script setup lang="ts">
import whatsappIcon from '~/assets/images/marketing/whatsapp.png'

const message = 'Halo, saya tertarik untuk import barang dari China, boleh tanya-tanya dulu? ETH-WB'
const whatsappHref = `https://wa.me/6281323459722?text=${encodeURIComponent(message)}`
</script>

<template>
  <a
    :href="whatsappHref"
    class="floating-whatsapp"
    aria-label="Konsultasi Sekarang via WhatsApp"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img :src="whatsappIcon" alt="" aria-hidden="true" width="28" height="28">
    <span aria-hidden="true">Konsultasi Sekarang</span>
  </a>
</template>

<style scoped>
.floating-whatsapp {
  position: fixed;
  right: 24px;
  bottom: max(24px, env(safe-area-inset-bottom));
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 18px;
  box-sizing: border-box;
  width: 60px;
  height: 60px;
  padding: 0 10px 0 16px;
  overflow: hidden;
  border-radius: 9999px;
  background: #10b981;
  color: #fff;
  box-shadow: 0 10px 24px rgb(0 0 0 / 15%);
  text-decoration: none;
  white-space: nowrap;
  transition: width 420ms ease, background-color 420ms ease;
}

.floating-whatsapp img {
  flex: none;
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.floating-whatsapp span {
  opacity: 0;
  font-size: 16px;
  font-weight: 600;
  transition: opacity 160ms ease;
}

@media (hover: hover) {
  .floating-whatsapp:hover {
    width: 240px;
    background: #0eaa75;
  }

  .floating-whatsapp:hover span {
    opacity: 1;
    transition: opacity 280ms ease 120ms;
  }
}

.floating-whatsapp:focus-visible {
  width: 240px;
  outline: 3px solid #064e3b;
  outline-offset: 3px;
}

.floating-whatsapp:focus-visible span {
  opacity: 1;
  transition: opacity 280ms ease 120ms;
}

@media (min-width: 768px) {
  .floating-whatsapp {
    right: 32px;
    bottom: 32px;
  }
}

@media (min-width: 1024px) {
  .floating-whatsapp {
    right: 40px;
    bottom: 40px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .floating-whatsapp,
  .floating-whatsapp span {
    transition: none;
  }
}
</style>
