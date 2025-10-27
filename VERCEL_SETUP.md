# Vercel 部署配置指南

## 已完成的设置

✅ Vercel API 路由已配置：
- `api/gpt/index.js` - GPT API 代理
- `api/health/index.js` - 健康检查

## 步骤 1: 部署到 Vercel

1. **推送到 GitHub**
   ```bash
   git add .
   git commit -m "Add Vercel API routes"
   git push origin main
   ```

2. **在 Vercel 导入项目**
   - 访问 https://vercel.com
   - 点击 "New Project"
   - 导入你的 GitHub 仓库

3. **配置环境变量**
   在 Vercel 项目设置中添加：
   ```
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

4. **部署**
   - Vercel 会自动检测并部署
   - 等待部署完成

## 步骤 2: 获取您的 Vercel URL

部署完成后，Vercel 会提供：
- 生产域名：`https://your-app-name.vercel.app`
- 预览域名：`https://your-app-name-git-branch.vercel.app`

## 步骤 3: 配置前端连接到 Vercel

### 方式 1: 在 Vercel 环境变量中设置

在 Vercel 项目设置中添加：
```
VITE_API_BASE_URL=https://your-app-name.vercel.app
```

### 方式 2: 修改 gptService.ts 使用默认逻辑

当前代码已支持通过 `VITE_API_BASE_URL` 环境变量配置。

如果未设置，默认会：
- 开发环境：使用 `/api/gpt`（通过 vite proxy）
- 生产环境：使用完整的 Vercel URL

## 步骤 4: 测试连接

1. **测试健康检查**
   ```bash
   curl https://your-app-name.vercel.app/api/health
   ```
   应该返回：
   ```json
   {
     "status": "ok",
     "timestamp": "2024-01-01T00:00:00.000Z",
     "hasOpenAIKey": true,
     "deployment": "vercel"
   }
   ```

2. **测试 GPT API**
   ```bash
   curl -X POST https://your-app-name.vercel.app/api/gpt \
     -H "Content-Type: application/json" \
     -d '{"prompt": "测试"}'
   ```

3. **在浏览器中测试**
   访问您的网站，尝试使用八字命理或塔罗牌功能

## 步骤 5: 更新代码以使用 Vercel URL

如果需要在代码中硬编码 Vercel URL，可以修改 `src/services/gptService.ts`：

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-app-name.vercel.app'
```

## 故障排查

### 问题 1: API 返回 500 错误

**原因**: 环境变量未正确设置

**解决**:
1. 检查 Vercel 项目设置中的环境变量
2. 确认 `OPENAI_API_KEY` 已添加
3. 重新部署

### 问题 2: CORS 错误

**原因**: Vercel API 路由 CORS 配置问题

**解决**: 已在上面的 API 文件中配置了 CORS，确保设置了正确的 headers

### 问题 3: 前端仍然连接到 localhost

**原因**: 环境变量未正确配置

**解决**:
1. 在 Vercel 项目中设置 `VITE_API_BASE_URL`
2. 重新构建前端

## 当前 API 端点

- `GET /api/health` - 健康检查
- `GET /api/gpt` - GPT API 测试（GET）
- `POST /api/gpt` - GPT API 请求

## 下一步

完成以上步骤后，您的应用将完全运行在 Vercel 上！
- ✅ 前端：自动部署
- ✅ 后端：Serverless Functions
- ✅ OpenAI API：通过 Vercel 代理

