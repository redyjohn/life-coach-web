# 环境配置说明

## 问题诊断

当前在 GitHub Pages 上出现 500 错误的原因是：
- GitHub Pages 只能托管静态 HTML/CSS/JS 文件
- 需要 Node.js 后端服务器来访问 OpenAI API
- 前端代码默认连接到 `localhost:3000`，在 GitHub Pages 上无法访问

## 解决方案

### 方案 1: 使用 Vercel 部署（最简单）

1. **将代码推送到 GitHub**
2. **访问 https://vercel.com** 并登录
3. **导入 GitHub 仓库**
4. **配置环境变量**：
   - `OPENAI_API_KEY`: 你的 OpenAI API 密钥
5. **部署**：Vercel 会自动部署前端和后端

✅ Vercel 会自动识别 `server.js` 并部署为 Serverless 函数

### 方案 2: 使用 Netlify 部署

1. 访问 https://netlify.com
2. 导入项目
3. 配置环境变量
4. 添加构建命令和后端设置

### 方案 3: 使用 Render 部署

1. 访问 https://render.com
2. 创建 Web Service
3. 连接 GitHub 仓库
4. 设置环境变量和启动命令

## 环境变量配置

创建 `.env.local` 文件（不会提交到 GitHub）：

```env
# OpenAI API Key
OPENAI_API_KEY=sk-your-key-here

# 如果部署到其他平台，设置后端 URL
VITE_API_BASE_URL=https://your-backend.vercel.app
```

## 本地开发

```bash
# 安装依赖
npm install

# 创建 .env.local 文件并添加 OPENAI_API_KEY

# 同时运行前后端
npm run dev:full

# 或者分别运行
npm run server  # 后端
npm run dev     # 前端
```

## 代码修改说明

已经修改了以下内容：
1. ✅ `gptService.ts` - 支持环境变量 `VITE_API_BASE_URL`
2. ✅ `vite-env.d.ts` - 添加环境变量类型定义
3. ✅ 创建了部署说明文档

## 当前状态

- ✅ 代码已支持环境变量配置
- ⚠️ 需要实际的后端服务器运行
- ⚠️ 需要配置 OpenAI API 密钥

## 下一步

1. 选择部署平台（推荐 Vercel）
2. 部署应用
3. 配置环境变量
4. 更新前端 API 地址（如果需要）

