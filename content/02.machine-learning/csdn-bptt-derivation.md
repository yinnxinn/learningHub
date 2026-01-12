---
title: "反向传播(BPTT)正反向推导详解"
description: "CSDN 作者 Shen Xiaoming 对递归神经网络的正向与反向传播过程进行图文推导。"
url: "https://blog.csdn.net/shenxiaoming77/article/details/50427303"
tags: ["深度学习", "RNN", "推导"]
contributor: "@learning-share"
recommendation: 3
---

## 推荐理由
- 以 LaTeX 公式和图示补充课堂笔记，条理清晰。
- 重点解析误差项沿时间回传的计算方式。
- 与 D2L 章节互为补充，适合需要更细致公式推导的读者。

## 阅读建议
1. 先回顾 RNN 的前向传播公式，再跟随文章推导反向过程。
2. 将关键公式手写推导一遍，验证链式法则各项来源。
3. 阅读后对照实现代码，确保能解释梯度计算的每一步。
