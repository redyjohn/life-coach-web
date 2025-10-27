# 连接到您的 Vercel 部署

## 如何获取您的 Vercel URL

1. **登录 Vercel**
   - 访问 https://vercel.com
   - 登录您的账户

2. **找到您的项目**
   - 点击 "Dashboard"
   - 找到您的 `life-coach-web` 项目

3. **获取生产域名**
   - 项目页面会显示生产域名
   - 格式：`https://your-app-name.vercel.app`

## 配置方式（3选1）

### 方式 1: 在 Vercel 设置环境变量（推荐）

1. 在 Vercel 项目设置中添加：
   ```
   VITE_API_BASE_URL = https://your-app-name.vercel.app
   ```

2. 重新部署：
   ```bash
   # 在本地触发部署
   git commit --allow-empty -m "Trigger deployment"
   git push origin main
   ```

### 方式 2: 在本地修改代码（开发用）

编辑 `vite.config.ts`：

```typescript
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://your-app-name.vercel.app',  // 改为您的 Vercel URL
        changeOrigin: true,
        secure: false
      }
    }
  },
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('https://your-app-name.vercel.app')
  }
})
```

### 方式 3: 直接修改 gptService.ts（最简单）

编辑 `src/services/gptService.ts`，找到：

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
```

改为：

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-app-name.vercel.app'
```

## 测试连接

1. **测试健康检查**
   ```bash
   curl https://your-app-name.vercel.app/api/health
   ```

2. **测试 GPT API**
   ```bash
   curl -X POST https://your-app-name.vercel.app/api/gpt \
     -H "Content-Type: application/json" \
     -d '{"prompt": "测试"}'
   ```

## 当前文件

- ✅ `api/gpt/index.js` - 已配置
- ✅ `api/health/index.js` - 已配置
- ✅ `src/services/gptService.ts` - 已支持环境变量

## 下一步

1. 将 `your-app-name.vercel.app` 替换为您的实际 Vercel 域名
2. 按照上述方式之一配置
3. 测试连接

完成！

