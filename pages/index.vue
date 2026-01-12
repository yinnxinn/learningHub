<script setup lang="ts">
const { page } = useContent()
const config = useRuntimeConfig()
const siteName = computed(() => config.public.siteName || 'Learning Hub')
const defaultTagline = 'Curated resources for Python, machine learning, and AI'
const defaultDescription =
  'Learning Hub curates trusted resources covering Python fundamentals, machine learning, and large language models.'
const siteTagline = computed(() => config.public.siteTagline || defaultTagline)
const siteDescription = computed(
  () => config.public.siteDescription || defaultDescription
)
const siteUrl = computed(() => config.public.siteUrl || '')
const logoPath = computed(() => config.public.logoPath || '/logo.png')
const hero = computed(() => page.value?.hero)

const normalizedSiteUrl = computed(() =>
  siteUrl.value ? siteUrl.value.replace(/\/+$/, '') : ''
)

const canonicalUrl = computed(() =>
  normalizedSiteUrl.value ? normalizedSiteUrl.value : ''
)

const metaTitle = computed(() => {
  if (hero.value?.title) {
    return `${hero.value.title} - ${siteName.value}`
  }
  return `${siteName.value} - ${siteTagline.value}`
})

const metaDescription = computed(
  () => hero.value?.subtitle || page.value?.description || siteDescription.value
)

useSeoMeta(() => ({
  title: metaTitle.value,
  description: metaDescription.value,
  ogTitle: metaTitle.value,
  ogDescription: metaDescription.value,
  ogType: 'website',
  ogUrl: canonicalUrl.value || undefined,
  ogImage: logoPath.value,
  twitterCard: 'summary_large_image',
  twitterTitle: metaTitle.value,
  twitterDescription: metaDescription.value,
  twitterImage: logoPath.value
}))

useHead(() => ({
  link: canonicalUrl.value
    ? [
        {
          rel: 'canonical',
          href: canonicalUrl.value
        }
      ]
    : []
}))
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
