# CLIENT_KEY 配置说明

## 📋 常见使用场景

根据您的项目，`CLIENT_KEY` 可能出现在以下场景：

### 1. Google AdSense（如果集成广告）

如果要在网站中集成 Google AdSense，需要：

**CLIENT_KEY 栏位填写：**
- **Google AdSense Publisher ID**（发布商 ID）
- 格式：`ca-pub-XXXXXXXXXXXXXXXX`（16 位数字）
- 示例：`ca-pub-1234567890123456`

**获取方式：**
1. 访问：https://www.google.com/adsense
2. 登录并创建账户
3. 在 "账户" → "账户信息" 中找到发布商 ID
4. 格式为 `ca-pub-XXXXXXXXXXXXXXXX`

**在代码中使用：**
```vue
<!-- src/components/AdBanner.vue -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-您的发布商ID"
     data-ad-slot="您的广告位ID"
     data-ad-format="auto">
</ins>
```

### 2. 其他第三方服务

如果是在配置其他 API 服务时看到 `CLIENT_KEY`，通常是：

- **OAuth 客户端 ID**：用于身份验证的客户端标识
- **API 客户端密钥**：第三方服务的客户端密钥
- **应用密钥**：某些服务需要应用级别的密钥

## 🔍 当前项目需要的环境变量

根据您的项目配置，**当前只需要以下环境变量**：

### Vercel 环境变量

**必须配置：**
- `OPENAI_API_KEY` - OpenAI API 密钥
  - 格式：`sk-...`
  - 获取：https://platform.openai.com/api-keys

**可选配置：**
- `VITE_API_BASE_URL` - API 基础 URL（通常不需要）
  - 如果部署在 Vercel，会自动使用当前域名

### 本地开发环境变量

创建 `.env.local` 文件（不提交到 Git）：

```env
# OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key-here

# 本地开发 API URL（可选）
VITE_API_BASE_URL=http://localhost:3000
```

## ❓ 如何确定 CLIENT_KEY 是什么？

### 方法 1: 查看上下文

- 如果是在 **Google AdSense** 配置中看到 → 填写发布商 ID
- 如果是在 **OAuth** 配置中看到 → 填写客户端 ID
- 如果是在 **API 服务** 配置中看到 → 查看该服务的文档

### 方法 2: 查看项目代码

搜索项目中是否有使用 `CLIENT_KEY`：

```bash
grep -r "CLIENT_KEY" .
```

### 方法 3: 查看文档

- 查看第三方服务的官方文档
- 查看项目的 README 或配置文档

## 🎯 针对您的项目

**当前项目不需要 CLIENT_KEY！**

您的项目只需要：
- ✅ `OPENAI_API_KEY` - 已在 Vercel 配置
- ❌ 不需要 `CLIENT_KEY`

## 📝 如果确实需要配置 CLIENT_KEY

### 场景：集成 Google AdSense

1. **获取发布商 ID**
   - 访问：https://www.google.com/adsense
   - 申请账户并获取发布商 ID

2. **在 Vercel 配置环境变量**
   - Key: `GOOGLE_ADSENSE_CLIENT_ID`
   - Value: `ca-pub-XXXXXXXXXXXXXXXX`
   - Environment: Production, Preview, Development

3. **在代码中使用**
   ```vue
   <ins class="adsbygoogle"
        data-ad-client="ca-pub-您的发布商ID"
        data-ad-slot="您的广告位ID">
   </ins>
   ```

### 场景：其他服务

根据具体服务的文档填写相应的客户端 ID 或密钥。

## 🔧 需要帮助？

如果不确定 `CLIENT_KEY` 应该填写什么，请提供：
1. 您在哪里看到这个栏位？
2. 是在配置什么服务？
3. 是否有相关的文档或说明？

这样我可以提供更准确的帮助。

---

**当前项目状态：**
- ✅ 只需要 `OPENAI_API_KEY`
- ❌ 不需要 `CLIENT_KEY`
- 💡 如果未来需要集成广告服务，才需要配置相关的 CLIENT_KEY


