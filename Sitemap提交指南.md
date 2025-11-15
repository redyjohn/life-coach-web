# Sitemap 提交指南

## ✅ 已完成的工作

1. ✅ 创建 `public/sitemap.xml` - 包含所有主要页面
2. ✅ 创建 `public/robots.txt` - 搜索引擎爬虫规则
3. ✅ 更新 `vercel.json` - 添加正确的 Content-Type 头
4. ✅ 提交到 GitHub - 已推送到仓库

## 📍 Sitemap 位置

部署后，Sitemap 将在以下位置可访问：
- **Sitemap URL**: `https://life-coach-web.vercel.app/sitemap.xml`
- **Robots.txt**: `https://life-coach-web.vercel.app/robots.txt`

## 📋 包含的页面

Sitemap 包含以下主要页面：

1. **首页** (`/`) - 优先级 1.0
2. **八字命理** (`/form`) - 优先级 0.9
3. **紫微斗数** (`/ziwei`) - 优先级 0.9
4. **占卜系统** (`/divination`) - 优先级 0.9
5. **塔罗牌占卜** (`/divination/tarot`) - 优先级 0.8
6. **易經占卜** (`/divination/i-ching`) - 优先级 0.8
7. **姓名学** (`/name`) - 优先级 0.8
8. **择日系统** (`/calendar`) - 优先级 0.8

## 🔍 提交到搜索引擎

### 方法 1: Google Search Console

1. **访问 Google Search Console**
   - 网址：https://search.google.com/search-console

2. **添加属性**
   - 点击"添加属性"
   - 选择"网址前缀"
   - 输入：`https://life-coach-web.vercel.app`

3. **验证所有权**
   - 选择验证方法（推荐：HTML 标签或 DNS 记录）
   - 按照提示完成验证

4. **提交 Sitemap**
   - 验证成功后，进入"Sitemap"页面
   - 输入：`sitemap.xml`
   - 点击"提交"

### 方法 2: Bing Webmaster Tools

1. **访问 Bing Webmaster Tools**
   - 网址：https://www.bing.com/webmasters

2. **添加网站**
   - 登录 Microsoft 账户
   - 点击"添加网站"
   - 输入：`https://life-coach-web.vercel.app`

3. **验证所有权**
   - 选择验证方法
   - 完成验证

4. **提交 Sitemap**
   - 进入"Sitemap"页面
   - 输入：`https://life-coach-web.vercel.app/sitemap.xml`
   - 点击"提交"

### 方法 3: 其他搜索引擎

- **百度站长平台**: https://ziyuan.baidu.com/
- **Yandex Webmaster**: https://webmaster.yandex.com/

## ✅ 验证 Sitemap

部署完成后，可以通过以下方式验证：

1. **直接访问**
   ```
   https://life-coach-web.vercel.app/sitemap.xml
   ```

2. **使用 curl 测试**
   ```bash
   curl https://life-coach-web.vercel.app/sitemap.xml
   ```

3. **在浏览器中打开**
   - 应该看到 XML 格式的 sitemap 内容

## 🔄 更新 Sitemap

如果需要更新 Sitemap：

1. **编辑 `public/sitemap.xml`**
   - 更新 `<lastmod>` 日期
   - 添加或删除页面
   - 调整优先级

2. **提交更改**
   ```bash
   git add public/sitemap.xml
   git commit -m "更新 Sitemap"
   git push
   ```

3. **重新提交到搜索引擎**
   - 在 Google Search Console 中重新提交
   - 或在 Bing Webmaster Tools 中重新提交

## 📊 Sitemap 结构说明

```xml
<url>
  <loc>页面URL</loc>           <!-- 页面完整URL -->
  <lastmod>最后修改日期</lastmod>  <!-- YYYY-MM-DD 格式 -->
  <changefreq>更新频率</changefreq> <!-- daily/weekly/monthly -->
  <priority>优先级</priority>      <!-- 0.0-1.0，1.0最高 -->
</url>
```

## 🎯 优先级说明

- **1.0**: 首页（最重要）
- **0.9**: 主要功能页面（八字、紫微、占卜）
- **0.8**: 次要功能页面（具体占卜类型、姓名学、择日）

## 📝 Robots.txt 说明

`robots.txt` 文件：
- ✅ 允许所有搜索引擎爬虫
- ✅ 禁止访问测试页面（`/test/`）
- ✅ ✅ 禁止访问诊断页面（`/diagnostic`）
- ✅ 禁止访问 API 端点（`/api/`）
- ✅ 指向 Sitemap 位置

## ⚠️ 注意事项

1. **等待部署完成**
   - Vercel 部署通常需要 1-3 分钟
   - 部署完成后才能访问 sitemap.xml

2. **验证 Sitemap 格式**
   - 确保 XML 格式正确
   - 可以使用在线工具验证：https://www.xml-sitemaps.com/validate-xml-sitemap.html

3. **定期更新**
   - 建议每月更新一次 `<lastmod>` 日期
   - 添加新页面时记得更新 Sitemap

4. **监控索引状态**
   - 在 Google Search Console 中查看索引状态
   - 检查是否有错误或警告

## 🚀 下一步

1. ✅ 等待 Vercel 部署完成
2. ✅ 访问 `https://life-coach-web.vercel.app/sitemap.xml` 验证
3. ✅ 在 Google Search Console 中提交 Sitemap
4. ✅ 在 Bing Webmaster Tools 中提交 Sitemap
5. ✅ 定期检查索引状态

---

**Sitemap URL**: `https://life-coach-web.vercel.app/sitemap.xml`
**最后更新**: 2024-11-15

