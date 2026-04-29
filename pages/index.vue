<script setup lang="ts">
const { page } = useContent()
const config = useRuntimeConfig()
const siteName = computed(() => config.public.siteName || 'Learning Hub')
const defaultTagline = 'Curated resources for Python and machine learning'
const defaultDescription =
  'Learning Hub curates trusted resources covering Python fundamentals, machine learning, and practical tooling.'
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
  contentPath: string
}

interface SectionDocPreview {
  _id: string
  _path: string
  title?: string
  description?: string
  url?: string
  recommendation?: number
  tags?: string[]
}

const featuredSections: HomeSection[] = [
  {
    key: 'news',
    title: '资讯头部',
    contentPath: '/01.ai-news'
  },
  {
    key: 'learning',
    title: '核心学习资料',
    contentPath: '/02.ai-core-learning'
  },
  {
    key: 'open-source',
    title: '知名开源项目',
    contentPath: '/03.ai-open-source'
  }
]

const pathEscape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const { data: sectionCards } = await useAsyncData(
  'home-dense-sections',
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
          .limit(300)
          .find()

        return {
          ...section,
          items: docs as SectionDocPreview[]
        }
      })
    )

    return payload
  }
)

const topStats = computed(() => {
  const sections = sectionCards.value || []
  const totalResources = sections.reduce((sum, section) => sum + section.items.length, 0)
  const allItems = sections.flatMap((section) => section.items)
  const averageScore = allItems.length
    ? (
        allItems.reduce((sum, item) => sum + (item.recommendation || 0), 0) / allItems.length
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

const loadBatchSize = 12
const visibleCount = ref(loadBatchSize)
const loadMoreAnchor = ref<HTMLElement | null>(null)

const channelForm = ref<Record<string, { name: string; url: string; note: string }>>({
  news: { name: '', url: '', note: '' },
  learning: { name: '', url: '', note: '' },
  'open-source': { name: '', url: '', note: '' }
})

const sectionLabelByKey: Record<string, string> = {
  news: '资讯头部',
  learning: '核心学习资料',
  'open-source': '知名开源项目'
}

const getUploadIssueLink = (sectionKey: string) => {
  const form = channelForm.value[sectionKey] || { name: '', url: '', note: '' }
  const title = encodeURIComponent(`[资源提交] ${sectionLabelByKey[sectionKey] || '栏目资源'}`)
  const body = encodeURIComponent(
    [
      `栏目：${sectionLabelByKey[sectionKey] || sectionKey}`,
      `资源标题：${form.name || '请填写'}`,
      `资源地址：${form.url || '请填写'}`,
      '',
      '补充说明：',
      form.note || '请填写推荐理由、适用人群、学习路径等。'
    ].join('\n')
  )

  return `https://github.com/yinnxinn/learningHub/issues/new?title=${title}&body=${body}`
}

onMounted(() => {
  const anchor = loadMoreAnchor.value
  if (!anchor || typeof IntersectionObserver === 'undefined') {
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0]?.isIntersecting) {
        return
      }
      visibleCount.value += loadBatchSize
    },
    { rootMargin: '300px 0px' }
  )

  observer.observe(anchor)
  onBeforeUnmount(() => observer.disconnect())
})

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
        <div class="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h2 class="text-2xl font-bold tracking-tight text-slate-900">全部内容平铺展示</h2>
            <p class="mt-1 text-sm text-slate-600">
              每个栏目按卡片平铺，展示标题、简介和地址。下滑自动加载更多内容。
            </p>
          </div>
        </div>

        <section
          v-for="section in sectionCards || []"
          :key="section.key"
          class="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-slate-900">{{ section.title }}</h3>
            <span class="text-sm text-slate-500">共 {{ section.items.length }} 条</span>
          </div>

          <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <article class="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p class="text-sm font-semibold text-blue-800">自定义上传信息通道</p>
              <p class="mt-1 text-xs text-blue-700">填写后可直接打开提交页面，内容会自动带入。</p>
              <input
                v-model="channelForm[section.key].name"
                type="text"
                placeholder="资源标题"
                class="mt-3 w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              <input
                v-model="channelForm[section.key].url"
                type="text"
                placeholder="资源地址"
                class="mt-2 w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              <textarea
                v-model="channelForm[section.key].note"
                rows="2"
                placeholder="补充说明"
                class="mt-2 w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              <a
                :href="getUploadIssueLink(section.key)"
                target="_blank"
                rel="noopener"
                class="mt-3 inline-flex rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                打开上传通道
              </a>
            </article>

            <article
              v-for="item in section.items.slice(0, visibleCount)"
              :key="item._id"
              class="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div class="flex items-start justify-between gap-2">
                <NuxtLink :to="item._path" class="text-sm font-semibold text-slate-900 hover:text-blue-700">
                  {{ item.title || item._path }}
                </NuxtLink>
                <span
                  v-if="item.recommendation"
                  class="rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700"
                >
                  {{ recommendationStars(item.recommendation) }}
                </span>
              </div>
              <p class="mt-2 text-xs text-slate-600">
                {{ item.description || '暂无描述' }}
              </p>
              <p class="mt-2 text-xs text-slate-500">
                地址：
                <a
                  v-if="item.url"
                  :href="item.url"
                  target="_blank"
                  rel="noopener"
                  class="break-all text-blue-600 hover:text-blue-700"
                >
                  {{ item.url }}
                </a>
                <span v-else class="break-all">{{ item._path }}</span>
              </p>
            </article>
          </div>

          <div
            v-if="section.items.length > visibleCount"
            class="rounded-lg border border-dashed border-slate-300 px-4 py-3 text-center text-xs text-slate-500"
          >
            下滑自动加载更多内容...
          </div>
        </section>

        <div ref="loadMoreAnchor" class="h-6" />

        <section class="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-bold text-slate-900">初学者入门推荐</h2>
          <p class="mt-1 text-sm text-slate-600">
            如果你刚开始学习，建议先完成下面两份基础清单。
          </p>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <NuxtLink
              to="/02.ai-core-learning/python-third-party-starter"
              class="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <p class="font-semibold text-slate-900">Python 三方包入门清单</p>
              <p class="mt-1 text-sm text-slate-600">整理初学者最常用的 10 个经典包和学习顺序。</p>
            </NuxtLink>
            <NuxtLink
              to="/02.ai-core-learning/python-web-toolkit"
              class="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <p class="font-semibold text-slate-900">Python 工程开发常用包</p>
              <p class="mt-1 text-sm text-slate-600">覆盖 Web 开发与工程化常用工具包。</p>
            </NuxtLink>
          </div>
        </section>
      </section>
    </template>
  </ContentDoc>
</template>
