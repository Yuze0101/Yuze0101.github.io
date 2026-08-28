// 简体中文 UI 字典。从 ja.ts 复制并翻译。
// `UIStrings` 类型会保证所有键都被实现,缺一个键就是编译错误。
//
// 范围:UI 文案(导航、分页、按钮、aria、404),不包含首页 / About 页面里的正文
// (那些文案留在 .astro 文件里,你直接改就行)。
import type { UIStrings } from './en';

export const zhCN: UIStrings = {
  // 顶栏、底栏、其它 UI 元素
  'nav.home': '首页',
  'nav.about': '关于',
  'nav.works': '作品',
  'nav.blog': '笔记',
  'nav.search': '搜索',
  'nav.label': '主导航',
  'nav.brandHome': '回到 {site} 首页',
  'theme.toggle': '切换明暗主题',
  'footer.notes': '笔记',
  'social.label': '社交链接',

  // 分页
  'pagination.label': '分页',
  'pagination.newer': '← 较新',
  'pagination.older': '较旧 →',
  'pagination.status': '第 {current} / {total} 页',

  // 首页
  'home.primaryLinks': '主要链接',
  'home.viewWorks': '查看作品',
  'home.readNotes': '阅读笔记',
  'home.overviewLabel': '关注方向',
  'home.latestWorksEyebrow': '近期作品',
  'home.allWorks': '所有作品',
  'home.workTech': '{title} 使用技术',
  'home.worksEmpty': '在 <code>src/content/works</code> 添加作品,即可在此处展示最新项目。',
  'home.latestBlogEyebrow': '最近在写',
  'home.allPosts': '所有文章',
  'home.postsEmpty': '在 <code>src/content/blog</code> 添加文章,即可在此处展示最新笔记。',

  // 博客索引
  'blog.title': '笔记',
  'blog.titlePaged': '笔记 · 第 {page} 页',
  'blog.eyebrow': '笔记',
  'blog.listLabel': '笔记列表',
  'blog.tagsEyebrow': '标签',
  'blog.tagsNavLabel': '笔记标签',

  // 标签归档
  'tag.title': '标签为「{tag}」的文章',
  'tag.titlePaged': '标签为「{tag}」的文章 · 第 {page} 页',
  'tag.description': '{site} 上标签为「{tag}」的笔记。',
  'tag.eyebrow': '标签',
  'tag.lead': '收集在「{tag}」标签下的笔记。',
  'tag.listLabel': '「{tag}」标签下的文章',
  'tag.moreTagsEyebrow': '其他标签',
  'tag.otherTagsNavLabel': '其他笔记标签',
  'tag.allPosts': '所有文章',

  // 博客文章
  'post.eyebrow': '笔记',
  'post.readingTime': '约 {minutes} 分钟',
  'post.tocLabel': '目录',
  'post.contentsEyebrow': '目录',
  'post.adjacentLabel': '相邻文章',
  'post.previous': '上一篇',
  'post.next': '下一篇',
  'post.relatedEyebrow': '相关文章',
  'post.breadcrumbHome': '首页',
  'post.breadcrumbBlog': '笔记',

  // 评论(仅 GISCUS.enabled 时渲染)
  'comments.eyebrow': '评论',
  'comments.failed': '评论加载失败。请到 {link} 查看讨论。',
  'comments.failedLink': 'GitHub Discussions ↗',
  'comments.noscript': '评论需要 JavaScript。讨论托管在 GitHub Discussions。',

  // 作品
  'works.title': '作品',
  'works.eyebrow': '作品',
  'works.listLabel': '精选作品',
  'work.eyebrow': '作品',
  'work.visit': '访问项目',
  'work.repository': '查看仓库',
  'work.stackEyebrow': '技术栈',

  // 关于
  'about.title': '关于',
  'about.eyebrow': '关于',
  'about.ledgerLabel': '经历概要',

  // 搜索
  'search.title': '搜索',
  'search.eyebrow': '搜索',
  'search.sectionLabel': '站内搜索',
  'search.fallback': '搜索索引在构建时生成。运行 <code>npm run build</code> 并预览站点即可使用,开发服务器上不提供。',

  // 404
  'notFound.title': '页面未找到',
  'notFound.description': '你访问的页面不存在。',
  'notFound.eyebrow': '404 — 未找到',
  'notFound.heading': '这页跑偏了航线。',
  'notFound.lead': '地址可能已变更,或从未存在。下方导航可以带你回到主线。',
  'notFound.linksLabel': '返回链接',
  'notFound.home': '回到首页',
  'notFound.blog': '阅读笔记',
  'notFound.works': '浏览作品',
};
