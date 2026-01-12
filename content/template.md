---
title: "提交新资源"
description: "Fork 仓库、提交 PR 的快速指南，并可一键跳转到 GitHub 项目。"
url: "https://github.com/yinnxinn/learningHub"
tags: ["贡献指南"]
contributor: "@learning-share"
recommendation: 5
---

## 提交步骤
1. Fork 项目仓库并 clone 至本地：`https://github.com/yinnxinn/learningHub`。
2. 在 `content/` 对应分类下创建新的 Markdown 文件（建议复制下方模板）。
3. 填写 Frontmatter 与正文说明，运行 `pnpm dev` 自检页面效果。
4. 提交 Pull Request，等待合并即可上线。

## Frontmatter 模板
```yaml
---
title: "这里写资源名称"
description: "一两句话说明亮点或适用情境。"
url: "https://example.com"
tags: ["标签1", "标签2"]
contributor: "@你的 GitHub ID"
recommendation: 4
---
```

## 撰写建议
- 正文可按照“推荐理由 / 使用建议 / 延伸阅读”分段，方便读者快速理解。
- 如有配套代码或数据集，建议附上链接。
- 若资源来自 GitHub，记得注明开源协议或版本号。
