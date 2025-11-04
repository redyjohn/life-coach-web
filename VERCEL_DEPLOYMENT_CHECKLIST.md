# ✅ Vercel 部署完整检查清单

根据您的 Vercel 项目：https://vercel.com/redyjohns-projects/life-coach-web

## 📋 部署前检查清单

### 1. 环境变量配置 ⚠️ **最重要**

**必须配置的环境变量：**

- [ ] `OPENAI_API_KEY`
  - 值：`sk-...`（您的 OpenAI API Key）
  - 环境：Production, Preview, Development（全部勾选）
  - 位置：Vercel Dashboard → Settings → Environment Variables

**检查方法：**
1. 登录 Vercel Dashboard
2. 进入项目 → Settings → Environment Variables
3. 确认 `OPENAI_API_KEY` 存在且值正确
4. 点击眼睛图标验证值（会显示部分内容）

**可选环境变量：**
- `VITE_API_BASE_URL`（如果前端需要指向特定域名）
  - 通常不需要，因为部署在 Vercel 时，API 会自动在同一域名下

### 2. API 路由配置 ✅

**已配置的 API 路由：**

- [x] `/api/gpt` - GPT API 代理（已配置）
- [x] `/api/health` - 健康检查（已配置）
- [x] `/api/hello` - 测试端点（已配置）

**验证方法：**
```bash
# 测试健康检查
curl https://life-coach-web.vercel.app/api/health

# 应该返回：
# {
#   "status": "ok",
#   "hasOpenAIKey": true,
#   "deployment": "vercel"
# }
```

### 3. Vercel 配置 ✅

**`vercel.json` 配置：**
- [x] 构建命令：`npm run build`
- [x] 输出目录：`dist`
- [x] 版本：2

**当前配置：**
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### 4. 前端配置 ✅

**API 调用逻辑：**
- [x] 自动检测环境（开发/生产）
- [x] 开发环境：使用 `/api/gpt`（通过 Vite proxy）
- [x] 生产环境：使用 `/api/gpt`（相对路径，自动使用当前域名）

**配置文件：**
- `src/config.ts` - API 基础 URL 配置
- `src/services/gptService.ts` - GPT 服务调用

### 5. 构建配置 ✅

**`package.json` 脚本：**
- [x] `build`: `vite build` - 构建生产版本
- [x] `dev`: `vite` - 开发服务器
- [x] `preview`: `vite preview` - 预览构建结果

**依赖项：**
- [x] 所有必需的依赖已安装
- [x] Vue 3, Vue Router, TypeScript 配置正确

## 🚀 部署后验证步骤

### 步骤 1: 检查部署状态

1. **访问 Vercel Dashboard**
   - https://vercel.com/redyjohns-projects/life-coach-web
   - 确认最新部署状态为 "Ready"（绿色）

2. **检查部署日志**
   - 点击最新部署
   - 查看 Build Logs
   - 确认没有错误或警告

### 步骤 2: 测试 API 端点

**1. 健康检查：**
```bash
curl https://life-coach-web.vercel.app/api/health
```

**预期响应：**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "hasOpenAIKey": true,
  "deployment": "vercel"
}
```

**2. GPT API 测试（GET）：**
```bash
curl https://life-coach-web.vercel.app/api/gpt
```

**预期响应：**
```json
{
  "message": "GPT API is working!",
  "method": "GET",
  "hasOpenAIKey": true,
  "usage": "Send POST request with { \"prompt\": \"your question\" }"
}
```

**3. GPT API 测试（POST）：**
```bash
curl -X POST https://life-coach-web.vercel.app/api/gpt \
  -H "Content-Type: application/json" \
  -d '{"prompt": "测试"}'
```

**如果 `hasOpenAIKey: false`，说明环境变量未配置！**

### 步骤 3: 测试网站功能

1. **访问网站**
   - https://life-coach-web.vercel.app
   - 确认页面正常加载

2. **测试 AI 功能**
   - 八字命理
   - 紫微斗数
   - 塔罗牌占卜
   - 姓名分析

3. **检查浏览器控制台**
   - 打开开发者工具（F12）
   - 查看 Console 标签
   - 确认没有错误

4. **检查网络请求**
   - 打开 Network 标签
   - 测试 AI 功能
   - 确认 API 请求成功（状态码 200）

### 步骤 4: 检查 Vercel 函数日志

1. **查看函数日志**
   - Vercel Dashboard → Functions → `api/gpt` → Logs
   - 查看最近的请求日志

2. **正常日志应该显示：**
   ```
   📤 Sending request to OpenAI: { model: 'gpt-3.5-turbo', ... }
   ✅ Successfully received response from OpenAI (XXX characters)
   ```

3. **错误日志可能显示：**
   ```
   ❌ OpenAI API key not configured
   ❌ OpenAI API error: { ... }
   ```

## 🔧 常见问题排查

### 问题 1: API 返回 500 错误

**原因：** `OPENAI_API_KEY` 未配置

**解决：**
1. Vercel Dashboard → Settings → Environment Variables
2. 添加 `OPENAI_API_KEY`
3. 重新部署

### 问题 2: 前端无法连接 API

**检查：**
1. 确认 API 路由存在（`/api/gpt`, `/api/health`）
2. 检查浏览器控制台的网络请求
3. 确认没有 CORS 错误

### 问题 3: 构建失败

**检查：**
1. 查看 Vercel 构建日志
2. 确认 `package.json` 配置正确
3. 确认所有依赖已安装

### 问题 4: 环境变量未生效

**解决：**
1. 确认环境变量名称正确（`OPENAI_API_KEY`）
2. 确认选择了所有环境（Production, Preview, Development）
3. **重新部署**（环境变量修改后必须重新部署）

## 📊 性能优化建议

### 1. 函数超时设置

Vercel 免费计划的函数超时为 10 秒。如果请求较长，可能需要：
- 优化 prompt 长度
- 减少 `max_tokens`
- 考虑升级到付费计划

### 2. 请求频率控制

代码中已实现请求频率控制（最小间隔 2 秒），避免 API 限流。

### 3. 错误重试机制

代码中已实现自动重试机制（最多 3 次），提高成功率。

## ✅ 最终检查清单

部署前：
- [ ] 环境变量 `OPENAI_API_KEY` 已配置
- [ ] 代码已推送到 GitHub
- [ ] Vercel 已连接到 GitHub 仓库

部署后：
- [ ] 部署状态为 "Ready"
- [ ] `/api/health` 返回 `hasOpenAIKey: true`
- [ ] 网站正常加载
- [ ] AI 功能正常工作
- [ ] 浏览器控制台无错误

## 🆘 需要帮助？

如果遇到问题：

1. **查看 Vercel 函数日志**
   - Functions → Logs
   - 查看详细错误信息

2. **查看构建日志**
   - Deployments → 点击部署 → Build Logs

3. **参考文档**
   - `QUICK_FIX_API_KEY.md` - API Key 配置指南
   - `VERCEL_SETUP.md` - 详细部署指南

4. **测试命令**
   ```bash
   # 健康检查
   curl https://life-coach-web.vercel.app/api/health
   
   # GPT API 测试
   curl https://life-coach-web.vercel.app/api/gpt
   ```

---

**最后更新：** 根据您的 Vercel 项目配置生成
**项目地址：** https://vercel.com/redyjohns-projects/life-coach-web

