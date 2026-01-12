<script setup lang="ts">
import { Search, X } from 'lucide-vue-next'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const query = ref('')
const debouncedQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const router = useRouter()
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const { data: results, status, refresh } = await useAsyncData(
  'global-search',
  () => {
    if (!debouncedQuery.value) {
      return []
    }
    return queryContent()
      .search(debouncedQuery.value)
      .limit(12)
      .find()
  },
  {
    immediate: false,
    watch: [debouncedQuery]
  }
)

const close = () => {
  emit('close')
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close()
  }
}

const handleNavigate = (path: string) => {
  close()
  router.push(path)
}

watch(
  () => props.open,
  (value) => {
    if (value) {
      query.value = ''
      refresh()
      nextTick(() => {
        searchInput.value?.focus()
      })
      document.addEventListener('keydown', handleKeydown)
    } else {
      document.removeEventListener('keydown', handleKeydown)
    }
  },
  { immediate: true }
)

watch(
  query,
  (value) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    debounceTimer = setTimeout(() => {
      debouncedQuery.value = value.trim()
    }, 200)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 px-4 py-12 backdrop-blur"
    role="dialog"
    aria-modal="true"
  >
    <div class="w-full max-w-2xl rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
      <div class="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
        <Search class="h-5 w-5 text-slate-400" aria-hidden="true" />
        <input
          ref="searchInput"
          v-model="query"
          type="search"
          placeholder="搜索全站内容…"
          class="flex-1 border-0 bg-transparent text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0"
        />
        <button
          type="button"
          class="inline-flex items-center rounded-lg border border-transparent bg-slate-100 p-1 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          @click="close"
        >
          <X class="h-5 w-5" aria-hidden="true" />
          <span class="sr-only">关闭</span>
        </button>
      </div>

      <div class="max-h-[60vh] overflow-y-auto px-3 py-4">
        <p v-if="!query" class="px-2 py-3 text-sm text-slate-500">
          输入关键字开始搜索。支持标题、标签与正文匹配。
        </p>

        <p v-else-if="status === 'pending'" class="px-2 py-3 text-sm text-slate-500">
          正在检索 "{{ query }}" …
        </p>

        <ul v-else-if="results?.length" class="space-y-2">
          <li
            v-for="item in results"
            :key="item._id"
            class="rounded-xl border border-transparent transition hover:border-blue-200 hover:bg-blue-50"
          >
            <button
              type="button"
              class="flex w-full flex-col items-start gap-1 px-4 py-3 text-left"
              @click="handleNavigate(item._path)"
            >
              <span class="text-sm font-semibold text-slate-900">
                {{ item.title || item._path }}
              </span>
              <span class="text-xs uppercase tracking-wide text-blue-500">
                {{ item._path }}
              </span>
              <span
                v-if="item.description"
                class="line-clamp-2 text-sm text-slate-600"
              >
                {{ item.description }}
              </span>
            </button>
          </li>
        </ul>

        <p v-else class="px-2 py-3 text-sm text-slate-500">
          暂无结果。尝试其他关键词或检查内容是否已发布。
        </p>
      </div>
    </div>
  </div>
</template>
