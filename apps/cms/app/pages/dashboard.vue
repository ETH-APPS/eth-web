<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Ringkasan | ETH Cargo CMS' })
</script>

<template>
  <div class="mx-auto w-full max-w-[1400px] space-y-6">
    <header>
      <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-500">CONTENT STUDIO</p>
      <h1 class="mt-2 text-[28px] font-semibold leading-tight tracking-[-0.04em] text-text-secondary sm:text-[32px]">Ringkasan</h1>
      <p class="mt-2 max-w-2xl text-[13px] leading-6 text-text-tertiary">Kelola konten ETH Cargo dari satu tempat.</p>
    </header>

    <section class="overflow-hidden rounded-xl border border-primary-100 bg-primary-50" aria-labelledby="welcome-title">
      <div class="border-l-4 border-primary-500 px-5 py-6 sm:px-7 sm:py-7">
        <span class="inline-flex rounded-full bg-primary-500 px-3 py-1 text-[11px] font-semibold text-white">Mulai dari sini</span>
        <h2 id="welcome-title" class="mt-4 text-[20px] font-semibold leading-snug text-text-secondary sm:text-[24px]">Siapkan artikel pertama Anda</h2>
        <p class="mt-2 max-w-2xl text-[13px] leading-6 text-text-tertiary">Tulis konten, tambahkan sampul, lalu lihat pratinjau sebelum proses penerbitan tersedia.</p>
        <NuxtLink to="/articles/create" class="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 text-[13px] font-semibold text-white transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500">
          Tulis artikel <span aria-hidden="true">→</span>
        </NuxtLink>
      </div>
    </section>

    <section aria-labelledby="workspace-title">
      <div class="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="workspace-title" class="text-[17px] font-semibold text-text-secondary">Area kerja</h2>
          <p class="mt-1 text-[12px] text-text-tertiary">Akses cepat ke pengelolaan konten.</p>
        </div>
        <NuxtLink to="/articles" class="text-[12px] font-semibold text-primary-500 hover:underline focus-visible:outline-2 focus-visible:outline-primary-500">Lihat artikel →</NuxtLink>
      </div>
      <div class="grid gap-4 md:grid-cols-2">
        <NuxtLink to="/articles" class="group rounded-xl border border-border-200 bg-bg-0 p-5 transition-colors hover:border-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 sm:p-6">
          <span class="flex size-11 items-center justify-center rounded-lg bg-primary-500 text-white" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="size-5"><path stroke-linecap="round" stroke-linejoin="round" d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 0v5h5M9 12h6M9 16h6" /></svg>
          </span>
          <h3 class="mt-5 text-[16px] font-semibold text-text-secondary">Artikel</h3>
          <p class="mt-1 text-[12px] leading-5 text-text-tertiary">Lihat ruang kerja artikel dan mulai menyiapkan tulisan baru.</p>
          <span class="mt-5 inline-flex text-[12px] font-semibold text-primary-500 group-hover:underline">Buka artikel →</span>
        </NuxtLink>
        <NuxtLink to="/media" class="group rounded-xl border border-border-200 bg-bg-0 p-5 transition-colors hover:border-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 sm:p-6">
          <span class="flex size-11 items-center justify-center rounded-lg bg-primary-50 text-primary-500" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="size-5"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path stroke-linecap="round" stroke-linejoin="round" d="m4 17 5-5 3 3 3-3 5 5" /></svg>
          </span>
          <h3 class="mt-5 text-[16px] font-semibold text-text-secondary">Media</h3>
          <p class="mt-1 text-[12px] leading-5 text-text-tertiary">Area aset gambar untuk kebutuhan konten CMS.</p>
          <span class="mt-5 inline-flex text-[12px] font-semibold text-primary-500 group-hover:underline">Buka media →</span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
