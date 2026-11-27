<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Artikel | ETH Cargo CMS' })
</script>

<template>
  <div class="mx-auto w-full max-w-[1400px] space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-500">KONTEN / ARTIKEL</p>
        <h1 class="mt-2 text-[28px] font-semibold leading-tight tracking-[-0.04em] text-text-secondary sm:text-[32px]">Artikel</h1>
        <p class="mt-2 text-[13px] leading-6 text-text-tertiary">Tempat menyiapkan dan mengelola tulisan ETH Cargo.</p>
      </div>
      <NuxtLink to="/articles/create" class="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500">
        <span aria-hidden="true" class="text-lg leading-none">+</span> Buat artikel
      </NuxtLink>
    </header>

    <section class="overflow-hidden rounded-xl border border-border-200 bg-bg-0" aria-labelledby="article-list-title">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-border-200 px-5 py-5 sm:px-6">
        <div>
          <h2 id="article-list-title" class="text-[16px] font-semibold text-text-secondary">Daftar artikel</h2>
          <p class="mt-1 text-[12px] text-text-tertiary">Artikel akan tampil di sini setelah CMS terhubung ke API.</p>
        </div>
        <span class="rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-[11px] font-semibold text-primary-500">Segera tersedia</span>
      </div>
      <div class="px-5 py-12 text-center sm:px-6 sm:py-16">
        <div class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-500" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" class="size-7"><path stroke-linecap="round" stroke-linejoin="round" d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 0v5h5M9 12h6M9 16h6" /></svg>
        </div>
        <h3 class="mt-5 text-[18px] font-semibold text-text-secondary">Ruang artikel siap digunakan</h3>
        <p class="mx-auto mt-2 max-w-md text-[12px] leading-6 text-text-tertiary">Anda sudah dapat menyusun dan melihat pratinjau artikel. Penyimpanan serta daftar artikel akan tersedia setelah integrasi API.</p>
        <NuxtLink to="/articles/create" class="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg border border-primary-500 px-5 text-[12px] font-semibold text-primary-500 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500">Mulai menulis →</NuxtLink>
      </div>
    </section>
  </div>
</template>
