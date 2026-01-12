<script setup lang="ts">
const { data: navigation } = await useAsyncData('navigation', () =>
  fetchContentNavigation()
)

const config = useRuntimeConfig()
const siteName = computed(() => config.public.siteName || 'Learning Hub')
const logoPath = computed(() => config.public.logoPath || '/logo.png')
const githubRepoUrl = computed(
  () => config.public.githubRepoUrl || 'https://github.com'
)
const searchOpen = useState('global-search-open', () => false)
const mobileNavOpen = useState('mobile-nav-open', () => false)

const openSearch = () => {
  searchOpen.value = true
}

const handleShortcut = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    openSearch()
  }
}

const openMobileNav = () => {
  mobileNavOpen.value = true
}

const closeMobileNav = () => {
  mobileNavOpen.value = false
}

onMounted(() => {
  window.addEventListener('keydown', handleShortcut)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleShortcut)
})
</script>

<template>
  <div class="flex min-h-screen bg-slate-50 text-slate-900">
    <aside
      class="hidden w-72 border-r border-slate-200 bg-white/80 p-6 backdrop-blur lg:block"
    >
      <NuxtLink
        to="/"
        class="mb-10 flex flex-col items-center text-center transition-opacity hover:opacity-90"
      >
        <img
          :src="logoPath"
          :alt="`${siteName} logo`"
          class="h-24 w-24 shrink-0 rounded-2xl border border-slate-200 bg-white object-contain p-2 shadow-sm"
        />
        <span class="mt-3 text-base font-medium text-slate-400">
          {{ siteName }}
        </span>
      </NuxtLink>

      <div class="space-y-4">
        <NavigationTree v-if="navigation?.length" :items="navigation" />
        <p v-else class="text-sm text-slate-500">
          暂无导航内容。请在
          <code class="rounded bg-slate-100 px-1 py-0.5 text-xs">content/</code>
          中新增 Markdown 文件。
        </p>
      </div>
    </aside>

    <div class="flex flex-1 flex-col">
      <header
        class="flex items-center justify-between border-b border-slate-200 bg-white/70 px-6 py-5 backdrop-blur"
      >
        <div class="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            @click="openMobileNav"
          >
            <span class="sr-only">打开导航</span>
            <svg
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>

          <NuxtLink
            to="/"
            class="flex flex-col items-center text-center text-slate-400"
          >
            <img
              :src="logoPath"
              :alt="`${siteName} logo`"
              class="h-16 w-16 shrink-0 rounded-2xl border border-slate-200 bg-white object-contain p-1.5 shadow-sm"
            />
            <span class="mt-1 text-sm font-medium">{{ siteName }}</span>
          </NuxtLink>
        </div>
        <div class="flex flex-1 items-center justify-end gap-3">
          <a
            :href="githubRepoUrl"
            target="_blank"
            rel="noopener"
            class="hidden rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:inline-flex"
          >
            提交资源
          </a>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            @click="openSearch"
          >
            <span class="hidden sm:inline">全站搜索</span>
            <span class="inline sm:hidden">搜索</span>
            <kbd
              class="ml-1 hidden rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-500 sm:inline-block"
            >
              Ctrl + K
            </kbd>
          </button>
        </div>
      </header>

      <main class="relative mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10">
        <slot />
      </main>
    </div>

    <ClientOnly>
      <GlobalSearch
        v-if="searchOpen"
        :open="searchOpen"
        @close="searchOpen = false"
      />
      <MobileNavigation
        v-if="mobileNavOpen"
        :open="mobileNavOpen"
        :navigation="navigation || []"
        @close="closeMobileNav"
      />
    </ClientOnly>
  </div>
</template>
