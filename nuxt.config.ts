// https://nuxt.com/docs/api/configuration/nuxt-config
const siteName = 'AI 圈学习与资讯导航'
const siteTagline = '聚合 AI 资讯、核心学习资料与知名开源项目'
const siteDescription =
  'AI 圈学习与资讯导航聚合高质量 AI 资讯源、核心学习路径与知名开源项目，帮助你快速建立认知并完成实践。'
const siteUrl = 'https://learninghub.example.com'
const logoVersion = '20260112-1'
const logoFilePath = '/logo.png'
const siteLogo = `${logoFilePath}?v=${logoVersion}`

export default defineNuxtConfig({
  app: {
    head: {
      title: siteName,
      titleTemplate: `%s - ${siteName}`,
      htmlAttrs: {
        lang: 'zh-CN'
      },
      meta: [
        { name: 'description', content: siteDescription },
        { name: 'keywords', content: 'AI资讯,AI学习资料,AI开源项目,LLM,Machine Learning,Agent,RAG' },
        { property: 'og:title', content: siteName },
        { property: 'og:description', content: siteDescription },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: siteUrl },
        { property: 'og:image', content: siteLogo },
        { property: 'og:site_name', content: siteName },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: siteName },
        { name: 'twitter:description', content: siteDescription },
        { name: 'twitter:image', content: siteLogo }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: siteLogo },
        { rel: 'apple-touch-icon', href: siteLogo },
        { rel: 'canonical', href: siteUrl }
      ]
    }
  },
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
      siteName,
      siteTagline,
      siteDescription,
      siteUrl,
      logoPath: siteLogo,
      logoFilePath,
      logoVersion,
      githubRepoUrl: 'https://github.com/yinnxinn/learningHub'
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
