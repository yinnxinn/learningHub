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
interface HomeSection {
  key: string
  title: string
  path: string
  contentPath: string
  description: string
  tone: string
}

interface SectionDocPreview {
  _id: string
  _path: string
  title?: string
  description?: string
  recommendation?: number
  tags?: string[]
}

interface HomeSectionCard extends HomeSection {
  items: SectionDocPreview[]
  total: number
  avgRecommendation: number
}

const featuredSections: HomeSection[] = [
  {
    key: 'news',
    title: 'AI圈资讯头部',
    path: '/ai-news',
    contentPath: '/01.ai-news',
    description: '聚焦官方发布、头部媒体与研究动态入口。',
    tone: 'from-indigo-50 to-blue-50'
  },
  {
    key: 'learning',
    title: 'AI圈核心学习资料',
    path: '/ai-core-learning',
    contentPath: '/02.ai-core-learning',
    description: '覆盖基础理论、实战路线与体系化学习路径。',
    tone: 'from-emerald-50 to-cyan-50'
  },
  {
    key: 'open-source',
    title: 'AI相关知名开源项目',
    path: '/ai-open-source',
    contentPath: '/03.ai-open-source',
    description: '精选高影响力开源项目，帮助快速建立技术版图。',
    tone: 'from-amber-50 to-orange-50'
  }
]

const pathEscape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const { data: sectionCards } = await useAsyncData<HomeSectionCard[]>(
  'home-featured-sections',
  async () => {
  const payload = await Promise.all(
    featuredSections.map(async (section) => {
      const pattern = `^${pathEscape(section.contentPath)}/[^/]+$`
      const docs = await queryContent()
        .where({
          _path: {
            $regex: pattern
          }
        })
        .sort({ recommendation: -1, title: 1 })
        .limit(6)
        .find()

      return {
        ...section,
        items: docs as SectionDocPreview[],
        total: docs.length,
        avgRecommendation:
          docs.length > 0
            ? Number(
                (
                  docs.reduce((sum, item) => sum + (item.recommendation || 0), 0) / docs.length
                ).toFixed(1)
              )
            : 0
      }
    })
  )

  return payload
  }
)

const topStats = computed(() => {
  const sections = sectionCards.value || []
  const totalResources = sections.reduce((sum, section) => sum + section.total, 0)
  const averageScore =
    sections.length > 0
      ? (
          sections.reduce((sum, section) => sum + section.avgRecommendation, 0) / sections.length
        ).toFixed(1)
      : '0.0'

  return {
    sectionCount: sections.length,
    totalResources,
    averageScore
  }
})

const recommendationStars = (value?: number) => {
  if (!value || value < 1) {
    return ''
  }
  return '★'.repeat(Math.min(5, Math.max(1, Math.round(value))))
}

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
        <div class="mt-6 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl border border-blue-100 bg-white/80 px-4 py-3">
            <p class="text-xs text-slate-500">栏目数量</p>
            <p class="text-xl font-bold text-slate-900">{{ topStats.sectionCount }}</p>
          </div>
          <div class="rounded-xl border border-blue-100 bg-white/80 px-4 py-3">
            <p class="text-xs text-slate-500">精选资源</p>
            <p class="text-xl font-bold text-slate-900">{{ topStats.totalResources }}</p>
          </div>
          <div class="rounded-xl border border-blue-100 bg-white/80 px-4 py-3">
            <p class="text-xs text-slate-500">平均推荐</p>
            <p class="text-xl font-bold text-slate-900">{{ topStats.averageScore }}/5</p>
          </div>
        </div>
      </section>

      <div class="prose prose-slate max-w-none">
        <ContentRenderer :value="doc" />
      </div>

      <section class="mt-12 space-y-6">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 class="text-2xl font-bold tracking-tight text-slate-900">三大栏目精选</h2>
            <p class="mt-1 text-sm text-slate-600">
              每个栏目优先展示可直接上手的高价值资源。
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <NuxtLink
              v-for="section in sectionCards || []"
              :key="`quick-${section.key}`"
              :to="section.path"
              class="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
            >
              {{ section.title }}
            </NuxtLink>
          </div>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
          <article
            v-for="section in sectionCards || []"
            :key="section.key"
            class="flex flex-col rounded-2xl border border-slate-200 bg-gradient-to-b p-5 shadow-sm"
            :class="section.tone"
          >
            <div class="flex items-start justify-between gap-3">
              <h3 class="text-lg font-semibold text-slate-900">
                {{ section.title }}
              </h3>
              <span class="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-600">
                {{ section.total }} 条
              </span>
            </div>
            <p class="mt-1 text-sm text-slate-600">
              {{ section.description }}
            </p>
            <p class="mt-1 text-xs text-slate-500">平均推荐 {{ section.avgRecommendation }}/5</p>

            <ul class="mt-4 flex flex-1 flex-col gap-3">
              <li
                v-for="item in section.items.slice(0, 4)"
                :key="item._id"
                class="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
              >
                <div class="flex items-start justify-between gap-2">
                  <NuxtLink :to="item._path" class="text-sm font-medium text-slate-800 hover:text-blue-700">
                    {{ item.title || item._path }}
                  </NuxtLink>
                  <span
                    v-if="item.recommendation"
                    class="rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700"
                  >
                    {{ recommendationStars(item.recommendation) }}
                  </span>
                </div>
                <p v-if="item.description" class="mt-1 line-clamp-2 text-xs text-slate-600">
                  {{ item.description }}
                </p>
                <div v-if="item.tags?.length" class="mt-1 flex flex-wrap gap-1">
                  <span
                    v-for="tag in item.tags.slice(0, 2)"
                    :key="tag"
                    class="rounded bg-white px-1.5 py-0.5 text-[11px] text-slate-500"
                  >
                    {{ tag }}
                  </span>
                </div>
              </li>
            </ul>

            <NuxtLink
              :to="section.path"
              class="mt-4 inline-flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              查看本栏目
            </NuxtLink>
          </article>
        </div>
      </section>
    </template>
  </ContentDoc>
</template>
