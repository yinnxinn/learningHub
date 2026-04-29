---
title: "Python 环境与包管理基础（venv / pip / uv）"
description: "初学者必备：学会创建隔离环境、安装依赖、导出与复现项目依赖。"
url: "https://docs.python.org/3/library/venv.html"
tags: ["Python", "环境管理", "包管理"]
contributor: "@zhima"
recommendation: 5
---

## 推荐入口

- venv 官方文档: https://docs.python.org/3/library/venv.html
- pip 官方文档: https://pip.pypa.io/en/stable/
- uv 项目: https://github.com/astral-sh/uv

## 最小实践

1. 创建环境：`python -m venv .venv`  
2. 激活环境并安装依赖  
3. 使用 `requirements.txt` 固化版本
