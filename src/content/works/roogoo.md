---
title: Roogoo · 数字货币后台与 H5
description: 数字货币方向的后台管理与移动端 Web 应用,集成资产充提币、用户管理、节点管理、任务管理与 Sumsub KYC 认证。
tech: ['React 19', 'TypeScript', 'Vite 6', 'Ant Design 5', 'Zustand', 'AWS S3', 'Sumsub KYC']
publishDate: 2025-02-15
order: 2
---

## 项目

基于 React + TypeScript 的现代化后台管理与移动端 Web 应用,面向数字货币方向。
集成资产管理、用户管理、节点管理、任务管理、公告、Sumsub KYC 认证、虚拟卡申请、
AWS 文件上传等核心模块。

采用技术:React 19、TypeScript、Vite 6、Ant Design 5、Zustand、React Router v7、
TailwindCSS + 自研 `@roogoo/rg-ui` 组件库、AWS SDK、MFA、@dnd-kit、@uiw/react-codemirror、
dayjs、Big.js、Axios。

## 主要贡献

**后台 + H5 端业务模块全栈开发** —— 用户注册登录、资产充提币、KYC 认证集成(Sumsub)、
Intercom 客服系统、AWS S3 文件上传与 STS 权限获取、MFA 多因素认证。

**自研组件库与拖拽** —— 自研 `@roogoo/rg-ui` 组件库,基于 `@dnd-kit` 实现拖拽排序,
基于 `@uiw/react-codemirror` 实现代码编辑器;使用 `dayjs` 处理日期时间,
`Big.js` 与 `JSON-BigInt` 解决大数字精度。

**HTTP 客户端与状态管理** —— 通过 Axios 封装统一 HTTP 客户端,处理 API 请求与响应拦截;
模块化分层架构设计,实现高内聚低耦合的组件结构;Zustand 设计多 store 模块。

**响应式 + 多语言 + PWA** —— 实现移动端 / PC 端响应式布局(MobileLayout / PcLayout)、
多语言(zh_CN / en_US)、主题切换、PWA 离线缓存与版本更新提示。

**工程化** —— Vite 6 构建 + 多环境配置(开发 / 测试 / 生产)+ Gzip 压缩 + 打包分析;
React Router v7 声明式路由与权限路由控制。
