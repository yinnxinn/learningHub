<script setup lang="ts">
defineOptions({ name: 'NavigationTree' })

interface NavigationItem {
  _path?: string
  title?: string
  children?: NavigationItem[]
}

const props = defineProps<{
  items?: NavigationItem[]
  depth?: number
}>()

const depth = computed(() => props.depth ?? 0)
const route = useRoute()

const normalizePath = (value?: string) => {
  if (!value) {
    return ''
  }
  return value.endsWith('/') && value.length > 1 ? value.slice(0, -1) : value
}

const isActive = (item: NavigationItem) => {
  const current = normalizePath(route.path) || '/'
  const target = normalizePath(item._path) || '/'
  return current === target
}

const itemClasses = computed(() =>
  depth.value === 0
    ? 'text-sm font-medium'
    : 'text-sm text-slate-600 hover:text-slate-900'
)
</script>

<template>
  <ul class="space-y-1">
    <li
      v-for="item in props.items"
      :key="item._path || item.title"
      class="space-y-1"
    >
      <NuxtLink
        v-if="item._path"
        :to="item._path"
        class="group flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-blue-50 hover:text-blue-700"
        :class="[
          itemClasses,
          {
            'bg-blue-100 text-blue-700 font-semibold shadow-sm': isActive(item)
          }
        ]"
      >
        <span>{{ item.title || item._path }}</span>
        <span
          class="ml-3 hidden text-xs font-semibold uppercase tracking-wide text-blue-500 group-hover:inline"
        >
          ↗
        </span>
      </NuxtLink>

      <NavigationTree
        v-if="item.children?.length"
        :items="item.children"
        :depth="depth + 1"
        class="ml-3 border-l border-slate-200 pl-3"
      />
    </li>
  </ul>
</template>
