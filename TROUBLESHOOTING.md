# 故障排除指南

## 常見問題與解決方案

### 1. 500 Internal Server Error

**症狀：**
- 瀏覽器控制台顯示 "Failed to load resource: the server responded with a status of 500"
- 出現 "Unexpected end of JSON input" 錯誤

**可能原因：**
- 後端服務器未啟動
- OpenAI API Key 未設置或無效
- 網路連線問題

**解決方案：**
1. 確認後端服務器正在運行：
   ```bash
   # 檢查 port 3000 是否被佔用
   netstat -an | findstr :3000
   ```

2. 檢查 API 健康狀態：
   ```bash
   # 訪問健康檢查端點
   curl http://localhost:3000/api/health
   ```

3. 確認環境變數設置：
   ```bash
   # 檢查 .env 文件是否存在且包含有效的 API Key
   type .env
   ```

4. 重新啟動服務：
   ```bash
   # 停止所有服務，然後重新啟動
   npm run dev:full
   ```

### 2. 無法連接到伺服器

**症狀：**
- 出現 "無法連接到伺服器" 錯誤訊息
- 網路請求失敗

**解決方案：**
1. 確認兩個服務器都在運行：
   - 後端：http://localhost:3000
   - 前端：http://localhost:5173

2. 檢查防火牆設置
3. 確認沒有其他程序佔用這些端口

### 3. OpenAI API 錯誤

**症狀：**
- 出現 "OpenAI API key not configured" 錯誤
- API 回應包含錯誤訊息

**解決方案：**
1. 檢查 API Key 是否正確設置在 `.env` 文件中
2. 確認 API Key 有效且有足夠額度
3. 檢查 OpenAI 服務狀態

### 4. 前端載入問題

**症狀：**
- 頁面無法載入
- 靜態資源載入失敗

**解決方案：**
1. 清除瀏覽器快取
2. 重新安裝依賴：
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. 重新啟動開發服務器

## 調試步驟

### 1. 檢查服務器狀態
```bash
# 檢查後端服務器
curl http://localhost:3000/api/health

# 檢查前端代理
curl http://localhost:5173/api/health
```

### 2. 查看日誌
- 後端服務器日誌：檢查運行 `npm run server` 的終端機
- 前端日誌：檢查瀏覽器開發者工具的控制台

### 3. 測試 API 端點
```bash
# 測試 GPT API
curl -X POST http://localhost:3000/api/gpt \
  -H "Content-Type: application/json" \
  -d '{"prompt":"測試"}'
```

## 聯繫支援

如果以上步驟都無法解決問題，請提供以下資訊：
1. 錯誤訊息的完整內容
2. 瀏覽器控制台的錯誤日誌
3. 後端服務器的日誌輸出
4. 您的操作系統和 Node.js 版本

