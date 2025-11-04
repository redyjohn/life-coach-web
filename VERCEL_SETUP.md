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

**常见原因**:

1. **OpenAI API Key 未配置**（最常见）
   - 症状：浏览器控制台显示 `500 Internal Server Error`
   - 错误信息：`OpenAI API key not configured`
   - 解决：
     1. 登录 Vercel Dashboard
     2. 进入项目设置 → Environment Variables
     3. 添加环境变量：
        - Name: `OPENAI_API_KEY`
        - Value: `sk-...`（您的 OpenAI API Key）
     4. 重新部署项目（在 Deployments 页面点击 "Redeploy"）

2. **API Key 无效或过期**
   - 症状：500 错误，但错误信息显示 API key 相关
   - 解决：
     1. 检查 OpenAI API Key 是否有效
     2. 登录 https://platform.openai.com/api-keys 检查
     3. 确认账户有足够的额度

3. **请求超时或网络问题**
   - 症状：500 错误，但错误信息不明确
   - 解决：
     1. 检查 Vercel 函数日志（Vercel Dashboard → Functions → Logs）
     2. 查看是否有超时错误
     3. 如果 prompt 太长，考虑缩短请求内容

4. **OpenAI API 配额用完**
   - 症状：500 错误，错误信息包含 "quota" 或 "billing"
   - 解决：
     1. 登录 OpenAI 账户检查配额
     2. 充值或升级账户

**调试步骤**:

1. **检查 Vercel 函数日志**:
   - 登录 Vercel Dashboard
   - 进入项目 → Functions → 点击 `api/gpt`
   - 查看最近的日志，寻找错误信息

2. **测试 API 端点**:
   ```bash
   # 测试健康检查
   curl https://your-app-name.vercel.app/api/health
   
   # 测试 GPT API（需要 API Key）
   curl -X POST https://your-app-name.vercel.app/api/gpt \
     -H "Content-Type: application/json" \
     -d '{"prompt": "测试"}'
   ```

3. **检查环境变量**:
   - Vercel Dashboard → Settings → Environment Variables
   - 确认 `OPENAI_API_KEY` 存在且值正确
   - 注意：环境变量区分大小写

4. **查看浏览器控制台**:
   - 打开浏览器开发者工具（F12）
   - 查看 Console 和 Network 标签
   - 查看详细的错误信息

**改进的错误处理**:

最新版本的代码已经改进了错误处理：
- 后端会返回更详细的错误信息
- 前端会显示具体的错误原因
- 如果是 API Key 未配置，会明确提示

如果看到错误信息：
- `OpenAI API 金鑰未配置` → 需要在 Vercel 设置环境变量
- `API 配額已用完` → 需要充值 OpenAI 账户
- `請求過於頻繁` → 等待一段时间后重试

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

