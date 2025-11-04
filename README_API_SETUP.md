# API 服務器設置指南

## 🔧 開發環境設置

### 方式一：同時啟動前端和後端（推薦）

```bash
npm run dev:full
```

這會同時啟動：
- 前端開發服務器（Vite）：http://localhost:5173
- 後端 API 服務器（Express）：http://localhost:3000

### 方式二：分別啟動

**終端 1 - 啟動後端：**
```bash
npm run server
```

**終端 2 - 啟動前端：**
```bash
npm run dev
```

## 📋 環境變量設置

在項目根目錄創建 `.env` 文件：

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
```

## 🚀 部署到 Vercel

### 自動部署

1. 將代碼推送到 GitHub
2. 在 Vercel 中導入項目
3. 設置環境變量 `OPENAI_API_KEY`
4. Vercel 會自動識別 `api/` 目錄中的 serverless functions

### 手動部署

```bash
vercel --prod
```

## ✅ 驗證 API 是否運行

### 本地開發
訪問：http://localhost:3000/api/health

應該返回：
```json
{
  "status": "ok",
  "timestamp": "...",
  "hasOpenAIKey": true
}
```

### Vercel 部署
訪問：https://your-app.vercel.app/api/health

## 🔍 故障排除

### 錯誤：ERR_CONNECTION_REFUSED

**原因：** 後端服務器未運行

**解決方案：**
1. 確保執行 `npm run server` 或 `npm run dev:full`
2. 檢查端口 3000 是否被占用
3. 檢查 `.env` 文件中的 `OPENAI_API_KEY` 是否設置

### 錯誤：Failed to fetch

**原因：** 前端無法連接到後端

**解決方案：**
1. 確認後端服務器正在運行
2. 檢查 Vite proxy 配置（`vite.config.ts`）
3. 如果使用 Vercel，確保 `VITE_API_BASE_URL` 環境變量正確設置

### 錯誤：OpenAI API key not configured

**原因：** 環境變量未設置

**解決方案：**
1. 創建 `.env` 文件
2. 添加 `OPENAI_API_KEY=your_key_here`
3. 重啟服務器

## 📝 注意事項

- 開發環境下，Vite 會自動代理 `/api` 請求到 `localhost:3000`
- 生產環境下，需要設置 `VITE_API_BASE_URL` 環境變量
- Vercel 部署時，`api/` 目錄中的文件會自動成為 serverless functions

