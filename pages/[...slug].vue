<script setup lang="ts">
import { ExternalLink, Tag, User } from 'lucide-vue-next'

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

const tags = computed(() => page.value?.tags ?? [])
const contributor = computed(() => page.value?.contributor ?? '')
const cover = computed(() => page.value?.cover)
const recommendation = computed(() => page.value?.recommendation ?? null)
const currentPath = computed(() => page.value?._path ?? '')

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const normalizedSiteUrl = computed(() =>
  siteUrl.value ? siteUrl.value.replace(/\/+$/, '') : ''
)

const canonicalUrl = computed(() => {
  if (!normalizedSiteUrl.value || !currentPath.value) {
    return ''
  }
  return `${normalizedSiteUrl.value}${currentPath.value === '/' ? '' : currentPath.value}`
})

const metaTitle = computed(() => {
  if (page.value?.title) {
    return `${page.value.title} - ${siteName.value}`
  }
  return `${siteName.value} - ${siteTagline.value}`
})

const metaDescription = computed(
  () => page.value?.description || siteDescription.value
)

const ogImage = computed(() => {
  if (typeof cover.value === 'string' && cover.value.length > 0) {
    return cover.value
  }
  return logoPath.value
})

const ogType = computed(() =>
  currentPath.value === '/' ? 'website' : 'article'
)

useSeoMeta(() => ({
  title: metaTitle.value,
  description: metaDescription.value,
  ogTitle: metaTitle.value,
  ogDescription: metaDescription.value,
  ogType: ogType.value,
  ogUrl: canonicalUrl.value || undefined,
  ogImage: ogImage.value,
  twitterCard: 'summary_large_image',
  twitterTitle: metaTitle.value,
  twitterDescription: metaDescription.value,
  twitterImage: ogImage.value
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

const { data: sectionEntries } = await useAsyncData(
  'section-entries',
  async () => {
    if (!currentPath.value) {
      return []
    }

    const isRoot = currentPath.value === '/'
    const pattern = isRoot
      ? '^/[^/]+$'
      : `^${escapeRegExp(currentPath.value)}/[^/]+$`

    const docs = await queryContent()
      .where({
        _path: {
          $regex: pattern
        }
      })
      .sort({ order: 1, title: 1 })
      .find()

    return docs.filter((doc) => doc._path !== currentPath.value)
  },
  {
    watch: [currentPath]
  }
)

const sectionChildren = computed(() => sectionEntries.value ?? [])

const sectionRoot = computed(() => {
  const value = currentPath.value
  const parts = value.split('/').filter(Boolean)
  if (!parts.length) {
    return ''
  }
  return `/${parts[0]}`
})

const sectionLabelMap: Record<string, string> = {
  '/01.ai-news': 'AI圈资讯头部',
  '/02.ai-core-learning': 'AI圈核心学习资料',
  '/03.ai-open-source': 'AI相关知名开源项目'
}
const sectionHomePathMap: Record<string, string> = {
  '/01.ai-news': '/ai-news',
  '/02.ai-core-learning': '/ai-core-learning',
  '/03.ai-open-source': '/ai-open-source'
}

const sectionLabel = computed(() => sectionLabelMap[sectionRoot.value] || '资源')
const sectionHomePath = computed(
  () => sectionHomePathMap[sectionRoot.value] || sectionRoot.value || '/'
)

const estimatedReadMinutes = computed(() => {
  const bodyLength = JSON.stringify(page.value?.body || '').length
  return Math.max(1, Math.round(bodyLength / 1200))
})

const { data: relatedByTag } = await useAsyncData(
  'related-by-tag',
  async () => {
    const root = sectionRoot.value
    const tag = tags.value?.[0]

    if (!root || !tag) {
      return []
    }

    const docs = await queryContent()
      .where({
        _path: {
          $regex: `^${escapeRegExp(root)}/[^/]+$`
        },
        tags: {
          $contains: tag
        }
      })
      .sort({ recommendation: -1, title: 1 })
      .limit(4)
      .find()

    return docs.filter((doc) => doc._path !== currentPath.value)
  },
  {
    watch: [currentPath, tags]
  }
)
</script>

<template>
  <ContentDoc>
    <template #default="{ doc }">
      <article class="flex flex-col gap-10">
        <header class="space-y-6">
          <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <NuxtLink to="/" class="hover:text-blue-600">首页</NuxtLink>
            <span>/</span>
            <NuxtLink :to="sectionHomePath" class="hover:text-blue-600">
              {{ sectionLabel }}
            </NuxtLink>
            <span>/</span>
            <span class="text-slate-700">{{ doc.title || '未命名文档' }}</span>
          </div>

          <div class="space-y-2">
            <p class="text-sm font-semibold uppercase tracking-widest text-blue-500">
              {{ doc.collection || 'Resource' }}
            </p>
            <h1 class="text-4xl font-black tracking-tight text-slate-900">
              {{ doc.title || '未命名文档' }}
            </h1>
            <p v-if="doc.description" class="text-lg text-slate-600">
              {{ doc.description }}
            </p>
          </div>

          <div v-if="cover" class="overflow-hidden rounded-2xl border border-slate-200">
            <img
              v-if="typeof cover === 'string'"
              :src="cover"
              alt=""
              class="h-64 w-full object-cover"
              loading="lazy"
            />
          </div>

          <div class="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span v-if="contributor" class="inline-flex items-center gap-2">
              <User class="h-4 w-4 text-slate-400" />
              <span class="font-medium text-slate-700">
                贡献者 {{ contributor }}
              </span>
            </span>
            <span
              v-if="recommendation"
              class="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-amber-700"
            >
              推荐指数 {{ recommendation }}/5
            </span>
            <span class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
              预计阅读 {{ estimatedReadMinutes }} 分钟
            </span>
            <div
              v-if="tags?.length"
              class="flex flex-wrap items-center gap-2 text-slate-500"
            >
              <Tag class="h-4 w-4 text-slate-400" />
              <span
                v-for="tag in tags"
                :key="tag"
                class="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <div v-if="doc.url" class="flex flex-wrap gap-3">
            <NuxtLink
              :to="doc.url"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              访问资源链接
              <ExternalLink class="h-4 w-4" />
            </NuxtLink>
          </div>
        </header>

        <div class="prose prose-slate max-w-none prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl">
          <ContentRenderer :value="doc" />
        </div>

        <section v-if="sectionChildren.length" class="space-y-5">
          <h2 class="text-2xl font-semibold text-slate-900">本目录资源</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <NuxtLink
              v-for="child in sectionChildren"
              :key="child._path"
              :to="child._path"
              class="group flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
            >
              <span class="text-lg font-semibold text-slate-900 group-hover:text-blue-700">
                {{ child.title || child._path }}
              </span>
              <span v-if="child.description" class="text-sm text-slate-600 line-clamp-3">
                {{ child.description }}
              </span>
              <div v-if="child.tags?.length" class="flex flex-wrap gap-2 pt-1">
                <span
                  v-for="tag in child.tags"
                  :key="tag"
                  class="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-blue-700"
                >
                  {{ tag }}
                </span>
              </div>
            </NuxtLink>
          </div>
        </section>

        <section v-if="relatedByTag?.length" class="space-y-4">
          <h2 class="text-2xl font-semibold text-slate-900">同标签推荐</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <NuxtLink
              v-for="item in relatedByTag"
              :key="item._path"
              :to="item._path"
              class="rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <p class="font-semibold text-slate-900">{{ item.title || item._path }}</p>
              <p v-if="item.description" class="mt-1 line-clamp-2 text-sm text-slate-600">
                {{ item.description }}
              </p>
            </NuxtLink>
          </div>
        </section>

        <footer class="border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            最后更新 · {{ doc.updatedAt ? new Date(doc.updatedAt).toLocaleString() : '未知' }}
          </p>
        </footer>
      </article>
    </template>

    <template #not-found>
      <div class="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
        <h1 class="text-3xl font-bold text-slate-900">未找到对应内容</h1>
        <p class="text-slate-500">
          请检查网址是否正确，或返回首页浏览其他内容。
        </p>
        <NuxtLink
          to="/"
          class="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
        >
          返回首页
        </NuxtLink>
      </div>
    </template>
  </ContentDoc>
</template>
