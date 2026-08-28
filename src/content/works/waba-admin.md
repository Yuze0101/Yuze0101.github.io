---
title: WABA Admin · WhatsApp 商业客户运营平台
description: 面向海外企业的 WhatsApp Business API 商业客户运营平台,覆盖实时聊天、群发营销、模板话术、账号接入与支付充值。
tech: ['React 19', 'TypeScript', 'Vite 8', 'Ant Design 6', 'Zustand 5', 'SSE', 'Web Worker', 'IndexedDB']
publishDate: 2025-11-15
order: 1
---

## 项目

WABA Admin(yiawa-admin)是面向海外企业的 **WhatsApp Business API 商业客户运营平台**,
覆盖实时会话聊天、客户管理、群发营销、模板/话术、账号接入、支付充值与数据分析等核心场景,
支持管理员、客服、运营多角色协作,中英文 i18n,多 Tab 实时同步。

**主导整体前端架构、实时聊天内核与 WhatsApp 模板编辑器设计与开发。**

采用技术:React 19.2、TypeScript 5.9、Vite 8、Ant Design 6、antd-style、TailwindCSS 4、Zustand 5、
React Router 7、AG Grid 35、TipTap、ECharts 6、@dnd-kit、TanStack Virtual、Web Worker + BroadcastChannel、
SSE、Dexie(IndexedDB)、MiniSearch + jieba-wasm、react-intl、Sentry、ali-oss、axios、dayjs、big.js、decimal.js。

## 实时聊天内核(核心 · 主导)

**多 Tab 实时协作架构** —— 基于 `BroadcastChannel + Leader Election` 在多 Tab 间选举唯一的 leader 标签页,
统一承载 WhatsApp 业务 SSE 长连接、消息分发与心跳补偿;
leader 切换时平滑交接 SSE 状态、IndexedDB 缓存与未读计数,避免重复连接与消息重复处理。

**聊天状态层** —— 用 Zustand 设计多视图会话状态机(全部 / 未读 / 最近 / 已静音 / 自定义),
构建 `messagesCacheMap` / `messagePaginationMap` / `searchContextMap` 等多维缓存;
切换会话时通过 `AbortController` 阻断竞态。

**双向消息分页 + 合并去重** —— 实现基于游标的双向加载(上/下)、消息状态机(已发送/已送达/已读/失败)、
本地与远端消息合并去重,支持任意消息跳定位。

**虚拟列表 + 滚动恢复** —— 基于 TanStack Virtual 自研虚拟列表组件,支持首屏秒开、跳转到任意消息、
滚动位置记忆、未读消息跳转、自动滚到底部检测;
**实测可承载 3000 个会话 × 每会话 500 条消息,前端无卡顿。**

**SSE 实时推送 + 断线补偿** —— 封装 `EventSource` 客户端,集成心跳检测、缺口补齐(gap fill)、
重复事件去重、断线重连指数退避;通过 Web Worker 中继 SSE 至主线程,避免业务渲染阻塞。

**富媒体消息与会话交互** —— 文本 / 图片 / 视频 / 音频 / 文件 / 贴纸 / 模板 / 话术等消息类型统一渲染层;
集成 TipTap 富文本、`emoji-picker-react`、`react-hotkeys-hook` 实现快捷键、草稿自动保存与附件预览。

**AI 智能能力(基于 LangChain + BFF)** —— 基于 LangChain 编排多模型(OpenAI / Claude / 国产模型),
在 BFF 层实现模型路由、流式响应(SSE)、上下文管理与多轮对话记忆;
前端侧实现会话内消息实时翻译、目标语言切换、AI 润色;
同时基于聊天上下文做用户画像分析、意图识别与自动打标签,结果回流会话与客户档案,辅助客服精准运营。

**全文搜索** —— 基于 `MiniSearch + jieba-wasm` 实现中英文混合消息历史秒级搜索,
支持会话内上下文视图(timeline / search-context 双模式)。

**离线缓存与数据持久化** —— 基于 `Dexie(IndexedDB)` 缓存会话 / 消息 / 客户资料,
登录后增量同步,断网时仍可浏览历史。

**客户信息侧栏** —— 标签管理、备忘录、转接历史、模板/话术库、社交账号绑定多 Tab 一体化展示;
支持一键转接、批量打标签。

## WhatsApp 模板编辑器(主导)

从 0 到 1 设计并实现模板可视化创建/编辑器,左侧表单 + 右侧实时预览,
支持 Header 媒体上传、按钮拖拽排序(`@dnd-kit`)、模板家族规则、按钮策略校验、
认证语言配置、模板变量管理、模板复制等核心能力;
同时负责模板列表、筛选、个性化列视图保存与认证语言下拉。

## 其他参与

首页工作台(角色化首页、关键指标看板、账号预警)、
客户管理(列表 / 详情抽屉 / 标签 / 表单)、
账号与渠道接入(WhatsApp Cloud API、Chat App 接入、授权号、迁移 / 转移 / 回收)、
群发计划、支付充值、标签 / 话术管理、系统日志、运营日志等业务模块迭代。
