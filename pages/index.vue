<script setup lang="ts">
const { page } = useContent()
const hero = computed(() => page.value?.hero)
</script>

<template>
  <ContentDoc path="/">
    <template #default="{ doc }">
      <section
        v-if="hero"
        class="mb-12 rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-white p-10 shadow-sm"
      >
        <p class="text-sm font-semibold uppercase tracking-widest text-blue-500">
          {{ doc.title }}
        </p>
        <h1 class="mt-2 text-4xl font-black tracking-tight text-slate-900">
          {{ hero.title }}
        </h1>
        <p class="mt-4 text-lg text-slate-600">
          {{ hero.subtitle }}
        </p>
      </section>

      <div class="prose prose-slate max-w-none">
        <ContentRenderer :value="doc" />
      </div>
    </template>
  </ContentDoc>
</template>
