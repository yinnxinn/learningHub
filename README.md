# Learning Hub

一个基于 Nuxt 3 与 Nuxt Content 的开源学习资源导航站。通过 GitHub Pull Request 即可新增或更新内容，无需传统后台即可完成提审、发布与版本留存。

## 核心特性
- 目录结构即导航：自动读取 `content/` 中的分类与文档生成侧边栏。
- 元数据驱动展示：支持标题、描述、标签、推荐指数、封面等 YAML Frontmatter 字段。
- 全站即时搜索：`Ctrl + K` 呼出命令面板，毫秒级检索站内全文。
- 自动化发布：配合 GitHub Actions，可零成本完成构建与部署闭环。
- 移动端适配：内置移动端抽屉导航，随时查找内容。

## 快速开始
1. 安装 Node.js 18+。
2. 安装依赖：
   ```bash
   npm install
   ```
3. 启动本地开发：
   ```bash
   npm run dev
   ```
4. 生成静态站点（用于 GitHub Pages / Vercel 部署）：
   ```bash
   npm run generate
   ```

## 目录结构
```text
.
├── assets/                 # 全局样式（Tailwind）
├── components/             # 导航、搜索等可复用组件
├── content/                # 文档内容，子目录前缀可控制排序
│   ├── 01.Frontend/
│   ├── 02.Backend/
│   ├── index.md            # 首页内容
│   └── template.md         # 贡献模版
├── layouts/default.vue     # 全局布局（侧边导航 + 搜索）
├── pages/                  # 动态路由与首页
├── nuxt.config.ts
├── tailwind.config.js
└── package.json
```

## Markdown 编写规范
`content/template.md` 提供了完整模版，字段示例：

```markdown
---
title: "Vue.js 官方文档"
description: "Vue 框架学习的首选起步资料"
url: "https://vuejs.org"
tags: ["Frontend", "Vue", "Official"]
contributor: "@username"
recommendation: 4
cover: "https://your-cover-image"
---

正文支持所有 Markdown 语法，可自由加入章节、代码块或扩展组件。
```

> 提示：目录前缀（如 `01.`、`02.`）便于控制导航顺序，推荐保留两位数字以便后续扩展。

## 分享流程
1. Fork 本仓库。
2. 在 `content/` 中找到或新建合适的分类文件夹。
3. 复制 `template.md`，改名为你的资源文件（例如 `awesome-tool.md`）。
4. 填写 Frontmatter 与正文，提交 Pull Request。
5. 审核通过后，GitHub Actions 将自动构建并部署，1 分钟内即可在站点看到最新内容。

## 自动化部署建议
使用 GitHub Actions 自动生成静态站点并推送至 GitHub Pages 或其他托管平台：

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: npm
      - run: npm ci
      - run: npm run generate
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .output/public
```

若使用 Vercel、Netlify，则可直接关联仓库，拉取 PR 时自动生成预览地址。
