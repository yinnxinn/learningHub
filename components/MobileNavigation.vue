<script setup lang="ts">
const props = defineProps<{
  open: boolean
  navigation: any[]
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const router = useRouter()

const close = () => {
  emit('close')
}

const handleNavigate = (path: string) => {
  close()
  router.push(path)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close()
  }
}

watch(
  () => props.open,
  (value) => {
    if (value) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeydown)
    } else {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeydown)
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    class="fixed inset-0 z-40 flex flex-col bg-slate-900/50 backdrop-blur-sm lg:hidden"
    role="dialog"
    aria-modal="true"
  >
    <div class="ml-auto flex h-full w-80 flex-col gap-4 bg-white px-6 py-6 shadow-xl">
      <div class="flex items-center justify-between">
        <span class="text-base font-semibold text-slate-900">导航</span>
        <button
          type="button"
          class="rounded-full border border-transparent bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          @click="close"
        >
          <span class="sr-only">关闭</span>
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto pb-6">
        <ul class="space-y-2">
          <li v-for="item in navigation" :key="item._path || item.title">
            <button
              v-if="item._path"
              type="button"
              class="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
              @click="handleNavigate(item._path)"
            >
              {{ item.title || item._path }}
            </button>
            <ul v-if="item.children?.length" class="ml-3 mt-1 space-y-1 border-l border-slate-100 pl-3">
              <li v-for="child in item.children" :key="child._path || child.title">
                <button
                  v-if="child._path"
                  type="button"
                  class="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                  @click="handleNavigate(child._path)"
                >
                  {{ child.title || child._path }}
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
