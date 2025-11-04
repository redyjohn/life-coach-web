# 🔧 快速修复：OpenAI API Key 未配置

## 问题症状

浏览器控制台显示：
```
GPT API error: {error: 'OpenAI API key not configured', message: 'Please configure OPENAI_API_KEY in Vercel environment variables'}
```

页面显示：
```
⚠️ OpenAI API 金鑰未配置。請在 Vercel 環境變數中設置 OPENAI_API_KEY。
```

## ✅ 解决方案（5分钟完成）

### 步骤 1: 获取 OpenAI API Key

1. 访问 https://platform.openai.com/api-keys
2. 登录您的 OpenAI 账户
3. 点击 "Create new secret key"
4. **复制生成的 API Key**（格式：`sk-...`）
   - ⚠️ **重要**：API Key 只会显示一次，请立即复制保存

### 步骤 2: 在 Vercel 配置环境变量

1. **登录 Vercel Dashboard**
   - 访问 https://vercel.com
   - 使用 GitHub 账户登录

2. **进入项目设置**
   - 点击您的项目 `life-coach-web`
   - 点击顶部菜单的 **Settings**
   - 在左侧菜单选择 **Environment Variables**

3. **添加环境变量**
   - 点击 **Add New** 按钮
   - 填写以下信息：
     - **Key**: `OPENAI_API_KEY`
     - **Value**: `sk-...`（粘贴您刚才复制的 API Key）
     - **Environment**: 选择 **Production, Preview, Development**（全部勾选）
   - 点击 **Save**

4. **重新部署**
   - 方法 1：进入 **Deployments** 页面
     - 找到最新的部署记录
     - 点击右侧的 **...** 菜单
     - 选择 **Redeploy**
   - 方法 2：推送一个空的提交（推荐）
     ```bash
     git commit --allow-empty -m "Trigger Vercel redeploy"
     git push origin main
     ```

### 步骤 3: 验证配置

1. **等待部署完成**（通常 1-2 分钟）
   - 在 Vercel Dashboard 查看部署状态
   - 等待状态变为 "Ready"

2. **测试 API**
   - 访问您的网站：https://life-coach-web.vercel.app
   - 尝试使用任何 AI 功能（八字、紫微、占卜等）
   - 如果配置成功，应该能正常使用

3. **检查健康状态**（可选）
   ```bash
   curl https://life-coach-web.vercel.app/api/health
   ```
   应该返回：
   ```json
   {
     "status": "ok",
     "hasOpenAIKey": true
   }
   ```

## 🔍 常见问题

### Q1: 我已经添加了环境变量，但还是报错？

**A**: 请确保：
- ✅ 环境变量名称是 `OPENAI_API_KEY`（完全匹配，区分大小写）
- ✅ 值是正确的 API Key（以 `sk-` 开头）
- ✅ 选择了所有环境（Production, Preview, Development）
- ✅ **已经重新部署**（环境变量添加后必须重新部署才生效）

### Q2: 如何确认环境变量已正确配置？

**A**: 
1. 在 Vercel Dashboard → Settings → Environment Variables
2. 确认能看到 `OPENAI_API_KEY` 这一行
3. 点击眼睛图标可以查看值（会显示部分内容）
4. 或者查看函数日志：
   - Functions → `api/gpt` → Logs
   - 应该看到 `📤 Sending request to OpenAI` 而不是 `❌ OpenAI API key not configured`

### Q3: 重新部署后还是不行？

**A**: 检查以下事项：
1. **API Key 是否有效**：
   - 登录 https://platform.openai.com/api-keys
   - 确认 API Key 存在且未被删除
   
2. **账户是否有额度**：
   - 登录 https://platform.openai.com/account/usage
   - 确认账户有足够的余额或信用额度

3. **查看 Vercel 函数日志**：
   - Vercel Dashboard → Functions → `api/gpt` → Logs
   - 查看最新的错误信息

### Q4: 我不小心删除了 API Key，怎么办？

**A**: 
1. 访问 https://platform.openai.com/api-keys
2. 创建新的 API Key
3. 在 Vercel 中更新环境变量
4. 重新部署

## 📝 快速检查清单

- [ ] 已获取 OpenAI API Key
- [ ] 已在 Vercel 添加 `OPENAI_API_KEY` 环境变量
- [ ] 环境变量值正确（以 `sk-` 开头）
- [ ] 已选择所有环境（Production, Preview, Development）
- [ ] 已重新部署项目
- [ ] 部署已完成（状态为 "Ready"）
- [ ] 测试功能正常工作

## 🆘 仍然无法解决？

如果按照以上步骤操作后仍然无法解决，请：

1. **查看 Vercel 函数日志**：
   - Vercel Dashboard → Functions → `api/gpt` → Logs
   - 复制最新的错误日志

2. **检查 OpenAI 账户状态**：
   - 确认账户未被封禁
   - 确认有足够的额度

3. **联系支持**：
   - 提供 Vercel 函数日志
   - 提供错误截图
   - 说明已完成的步骤

---

**提示**：配置完成后，通常需要等待 1-2 分钟让 Vercel 完成部署。部署完成后刷新页面即可正常使用。

