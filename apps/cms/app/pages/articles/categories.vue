<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Kategori & Tag | ETH Cargo CMS' })
</script>

<template>
  <div class="mx-auto w-full max-w-[1400px] space-y-6">
    <header>
      <p class="text-[11px] font-semibold tracking-[0.16em] text-primary-500">STRUKTUR KONTEN</p>
      <h1 class="mt-2 text-[28px] leading-tight font-semibold tracking-[-0.04em] text-text-secondary sm:text-[32px]">Kategori &amp; Tag</h1>
      <p class="mt-2 text-[13px] leading-6 text-text-tertiary">Kelompokkan artikel agar topik lebih mudah ditemukan.</p>
    </header>

    <div class="grid items-start gap-5 lg:grid-cols-2">
      <CmsArticleTaxonomyPanel
        resource="categories"
        label="kategori"
        description="Kelompok utama untuk mengatur artikel."
        placeholder="Contoh: Panduan Impor"
        show-form-initially
      />
      <CmsArticleTaxonomyPanel
        id="tag-artikel"
        class="scroll-mt-24"
        resource="tags"
        label="tag"
        description="Label topik yang dapat dipakai lintas kategori."
        placeholder="Contoh: Dokumen Pengiriman"
      />
    </div>
  </div>
</template>
