# 🔧 配置 Vercel 环境变量 - 详细步骤（带截图指引）

## ⚠️ 当前错误

您的网站显示：
```
⚠️ OpenAI API 金鑰未配置。請在 Vercel 環境變數中設置 OPENAI_API_KEY。
```

这表示 Vercel 上**尚未配置** `OPENAI_API_KEY` 环境变量。

## ✅ 解决步骤（5分钟完成）

### 步骤 1: 获取 OpenAI API Key

1. **访问 OpenAI 平台**
   - 打开：https://platform.openai.com/api-keys
   - 使用您的 OpenAI 账户登录

2. **创建 API Key**
   - 点击 **"+ Create new secret key"** 按钮
   - 输入一个名称（可选，如 "life-coach-web"）
   - 点击 **"Create secret key"**

3. **复制 API Key**
   - ⚠️ **重要**：API Key 只会显示一次！
   - 立即复制完整的 Key（格式：`sk-...`）
   - 保存到安全的地方（如记事本）

### 步骤 2: 在 Vercel 配置环境变量

1. **登录 Vercel Dashboard**
   - 访问：https://vercel.com
   - 使用 GitHub 账户登录

2. **进入项目设置**
   - 在左侧菜单点击 **"life-coach-web"** 项目
   - 或者直接访问：https://vercel.com/redyjohns-projects/life-coach-web

3. **打开环境变量设置**
   - 点击顶部菜单的 **"Settings"**
   - 在左侧菜单选择 **"Environment Variables"**

4. **添加环境变量**
   - 点击 **"Add New"** 按钮
   - 填写以下信息：
     ```
     Key: OPENAI_API_KEY
     Value: sk-...（粘贴您刚才复制的 API Key）
     ```
   - **Environment**: 勾选以下所有选项：
     - ☑️ Production（生产环境）
     - ☑️ Preview（预览环境）
     - ☑️ Development（开发环境）
   - 点击 **"Save"** 按钮

5. **验证配置**
   - 在环境变量列表中，您应该能看到 `OPENAI_API_KEY`
   - 点击眼睛图标 👁️ 可以查看值（会显示部分内容，如 `sk-proj-...`）

### 步骤 3: 重新部署（必须！）

**重要**：添加环境变量后，**必须重新部署**才会生效！

#### 方法 1: 在 Vercel Dashboard 重新部署（推荐）

1. 点击顶部菜单的 **"Deployments"**
2. 找到最新的部署记录（最上面）
3. 点击右侧的 **"..."** 菜单（三个点）
4. 选择 **"Redeploy"**
5. 确认重新部署
6. 等待部署完成（通常 1-2 分钟）

#### 方法 2: 推送空提交触发部署

在终端执行：
```bash
git commit --allow-empty -m "Trigger Vercel redeploy after adding API key"
git push origin main
```

### 步骤 4: 验证配置成功

等待部署完成后：

1. **测试健康检查**
   ```bash
   curl https://life-coach-web.vercel.app/api/health
   ```
   
   应该返回：
   ```json
   {
     "status": "ok",
     "hasOpenAIKey": true,
     "deployment": "vercel"
   }
   ```
   
   ⚠️ 如果 `hasOpenAIKey: false`，说明配置未生效，需要重新部署。

2. **在浏览器中测试**
   - 访问：https://life-coach-web.vercel.app
   - 刷新页面
   - 尝试使用任何 AI 功能
   - 打开开发者工具（F12）查看 Console
   - 应该不再出现 500 错误

3. **查看 Vercel 函数日志**
   - Vercel Dashboard → Functions → `api/gpt` → Logs
   - 应该看到：
     ```
     📤 Sending request to OpenAI: { model: 'gpt-3.5-turbo', ... }
     ✅ Successfully received response from OpenAI (XXX characters)
     ```
   - 而不是：
     ```
     ❌ OpenAI API key not configured
     ```

## 🔍 常见问题

### Q1: 我已经添加了环境变量，但还是报错？

**检查清单：**
- [ ] 环境变量名称是 `OPENAI_API_KEY`（完全匹配，区分大小写）
- [ ] 值是正确的 API Key（以 `sk-` 开头）
- [ ] 选择了所有环境（Production, Preview, Development）
- [ ] **已经重新部署**（这是最容易忘记的步骤！）

### Q2: 如何确认环境变量已正确配置？

**方法 1: 使用健康检查 API**
```bash
curl https://life-coach-web.vercel.app/api/health
```
查看返回的 `hasOpenAIKey` 值。

**方法 2: 查看 Vercel 环境变量列表**
- Settings → Environment Variables
- 确认 `OPENAI_API_KEY` 存在
- 点击眼睛图标查看值

**方法 3: 查看 Vercel 函数日志**
- Functions → `api/gpt` → Logs
- 最新的日志应该显示请求成功，而不是错误

### Q3: 重新部署后还是不行？

**可能的原因：**

1. **API Key 无效**
   - 检查 OpenAI 账户：https://platform.openai.com/api-keys
   - 确认 API Key 存在且未被删除
   - 如果被删除，创建新的 API Key 并更新 Vercel

2. **账户额度不足**
   - 检查 OpenAI 账户余额：https://platform.openai.com/account/billing
   - 确认账户有足够的信用额度

3. **环境变量作用域问题**
   - 确认选择了所有环境（Production, Preview, Development）
   - 如果只选择了 Preview，生产环境仍然无法使用

### Q4: 如何查看详细的错误日志？

1. **Vercel Dashboard**
   - Functions → `api/gpt` → Logs
   - 查看最新的错误日志

2. **浏览器控制台**
   - 打开开发者工具（F12）
   - Console 标签查看详细错误
   - Network 标签查看 API 请求详情

## 📝 快速检查清单

完成以下所有步骤：

- [ ] 已获取 OpenAI API Key
- [ ] 已在 Vercel 添加 `OPENAI_API_KEY` 环境变量
- [ ] 环境变量值正确（以 `sk-` 开头）
- [ ] 已选择所有环境（Production, Preview, Development）
- [ ] 已重新部署项目
- [ ] 部署已完成（状态为 "Ready"）
- [ ] `/api/health` 返回 `hasOpenAIKey: true`
- [ ] 网站功能正常，无 500 错误

## 🆘 仍然无法解决？

如果按照以上步骤操作后仍然无法解决：

1. **查看 Vercel 函数日志**
   - 复制最新的错误日志
   - 检查是否有其他错误信息

2. **检查 OpenAI 账户**
   - 确认账户未被封禁
   - 确认有足够的额度

3. **联系支持**
   - 提供 Vercel 函数日志
   - 提供错误截图
   - 说明已完成的步骤

---

**提示**：
- 环境变量配置后，**必须重新部署**才会生效
- 部署通常需要 1-2 分钟
- 部署完成后，刷新网站即可正常使用

**项目地址**：https://vercel.com/redyjohns-projects/life-coach-web

