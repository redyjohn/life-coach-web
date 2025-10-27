# 获取并配置您的 Vercel URL

## 当前状态

您的应用现在无法连接到 Vercel API，返回 404 错误。

## 如何获取您的 Vercel URL

### 步骤 1: 登录 Vercel

1. 访问 https://vercel.com
2. 用 GitHub 账户登录

### 步骤 2: 找到您的项目

1. 点击左侧 "Dashboard"
2. 找到项目 `life-coach-web`

### 步骤 3: 复制生产域名

项目页面会显示类似这样的域名：
- **Production**: `https://life-coach-web.vercel.app`
- 这就是您的 Vercel URL

## 配置 API 连接（3种方式）

### 方式 1: 直接在代码中配置（最简单）

编辑 `src/config.ts`，将第 7 行改为：

```typescript
export const API_BASE_URL = 'https://your-actual-vercel-url.vercel.app'
```

替换为您实际的 Vercel URL

### 方式 2: 在 Vercel 设置环境变量

1. 在 Vercel 项目页面
2. 点击 "Settings"
3. 选择 "Environment Variables"
4. 添加：
   - Key: `VITE_API_BASE_URL`
   - Value: `https://your-actual-vercel-url.vercel.app`
5. 点击 "Redeploy"

### 方式 3: 告诉我您的 URL

只需告诉我您的 Vercel URL，我可以帮您配置！

## 测试配置

配置完成后，访问：
```
https://your-vercel-url.vercel.app/api/health
```

应该返回：
```json
{
  "status": "ok",
  "hasOpenAIKey": true
}
```

## 需要配置的内容

在 Vercel 项目设置中确保以下环境变量已设置：

```
OPENAI_API_KEY=sk-your-key-here
VITE_API_BASE_URL=https://your-vercel-url.vercel.app
```

## 当前使用的服务

由于 API 连接失败，当前正在使用免费的 Mock AI 服务。
配置好 Vercel URL 后，将使用真实的 OpenAI API。

