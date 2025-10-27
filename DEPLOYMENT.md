# 部署说明

## 当前问题

GitHub Pages 只能托管静态文件，不支持 Node.js 后端服务器。当前前端代码依赖本地后端服务器 (`localhost:3000`)，因此在 GitHub Pages 上会出现 500 错误。

## 解决方案

### 方案 1: 部署完整应用（推荐）

将整个应用部署到支持前后端的环境：

#### 使用 Vercel
1. 将代码推送到 GitHub
2. 访问 https://vercel.com
3. 导入项目
4. Vercel 会自动检测并部署前端和后端

#### 使用 Netlify
1. 将代码推送到 GitHub
2. 访问 https://netlify.com
3. 导入项目并配置构建
4. 添加环境变量 `OPENAI_API_KEY`

### 方案 2: 分离前后端

1. **前端**: 继续使用 GitHub Pages
2. **后端**: 部署到 Vercel/Netlify Functions/Render
3. 修改前端 API 端点配置

### 方案 3: 使用替代 API

修改代码以使用免费的 AI API 服务或直接使用前端的免费 AI 功能。

## 当前配置

- 开发环境: `localhost:3000`
- 生产环境: 需要配置为实际部署的后端 URL

## 环境变量

在部署平台设置以下环境变量：

```
OPENAI_API_KEY=your_api_key
PORT=3000
```

## 本地开发

```bash
# 安装依赖
npm install

# 设置环境变量（创建 .env.local 文件）
# 添加 OPENAI_API_KEY=your_key

# 同时运行前端和后端
npm run dev:full

# 或者分别运行
npm run server  # 后端（端口 3000）
npm run dev     # 前端（端口 5173）
```

