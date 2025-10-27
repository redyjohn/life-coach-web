# 設置指南

## 問題修復

網站出現 500 錯誤是因為缺少 OpenAI API Key 和本地 API 服務器。

## 解決步驟

### 1. 安裝依賴
```bash
npm install
```

### 2. 設置環境變數
創建 `.env` 文件並添加您的 OpenAI API Key：

```env
# OpenAI API Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Development Configuration
VITE_API_BASE_URL=http://localhost:3000
```

### 3. 取得 OpenAI API Key
1. 前往 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 登入您的帳戶
3. 創建新的 API Key
4. 將 API Key 複製到 `.env` 文件中

### 4. 啟動服務
有三種方式啟動：

#### 方式一：使用啟動腳本（最簡單）
**Windows:**
```bash
start-dev.bat
```

**macOS/Linux:**
```bash
./start-dev.sh
```

#### 方式二：分別啟動（推薦）
```bash
# 終端機 1：啟動 API 服務器
npm run server

# 終端機 2：啟動前端開發服務器
npm run dev
```

#### 方式三：同時啟動
```bash
npm run dev:full
```

### 5. 測試 API
訪問 http://localhost:3000/api/health 檢查 API 服務器是否正常運行。

## 修復內容

1. ✅ 添加了 Express API 服務器 (`server.js`)
2. ✅ 配置了 Vite 代理設定
3. ✅ 添加了必要的依賴包
4. ✅ 創建了環境變數範本
5. ✅ 添加了健康檢查端點
6. ✅ 改善了前端錯誤處理機制
7. ✅ 添加了重試機制
8. ✅ 創建了啟動腳本

## 錯誤處理改善

- 修復了 "Unexpected end of JSON input" 錯誤
- 添加了更好的錯誤訊息顯示
- 實現了自動重試機制
- 改善了網路連線錯誤處理

## 注意事項

- 確保 OpenAI API Key 有效且有足夠的額度
- API 服務器運行在 port 3000
- 前端開發服務器運行在 port 5173
- 如果仍有問題，請檢查控制台錯誤訊息
- 使用 `start-dev.bat` (Windows) 或 `./start-dev.sh` (macOS/Linux) 可以同時啟動兩個服務器


