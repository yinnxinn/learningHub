---
title: "《动手学深度学习》BPTT 推导"
description: "动手学深度学习中对循环神经网络的反向传播算法（BPTT）做了公式推导与示例演示。"
url: "https://zh.d2l.ai/chapter_recurrent-neural-networks/bptt.html"
tags: ["深度学习", "RNN", "D2L"]
contributor: "@learning-share"
recommendation: 4
---

## 推荐理由
- 详细推导时间反向传播（BPTT）的计算流程，帮助理解梯度展开。
- 使用动画示意直观展示梯度在时间轴上的流动。
- 配套代码可直接运行，验证梯度与损失的变化。

## 学习步骤
1. 阅读公式推导，理解隐藏状态展开后的链式法则。
2. 在 Notebook 中修改时间步数、激活函数，观察梯度消失或爆炸现象。
3. 将 BPTT 与 LSTM/GRU 的门机制对照学习，加深对序列建模的认识。
