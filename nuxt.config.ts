// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxtjs/tailwindcss'],
  css: ['~/assets/css/tailwind.css'],
  content: {
    documentDriven: true,
    highlight: {
      theme: 'github-dark'
    },
    navigation: {
      fields: ['title', 'order']
    }
  },
  tailwindcss: {
    configPath: 'tailwind.config.js'
  },
  runtimeConfig: {
    public: {
      siteName: 'Learning Hub',
      githubRepoUrl: 'https://github.com/www19/learning-hub'
    }
  },
  nitro: {
    prerender: {
      crawlLinks: true
    }
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ['@types/node']
      }
    }
  }
})
