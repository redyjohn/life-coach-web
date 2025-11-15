# API 測試報告

## 📋 測試範圍

本報告檢查所有頁面的 API 請求是否順暢，包括：

### 1. 基礎 API 端點
- ✅ `/api/health` - 健康檢查
- ✅ `/api/hello` - Hello API
- ✅ `/api/gpt` - GPT API（GET 和 POST）

### 2. 功能頁面 API 使用

#### 八字命理 (ResultView.vue)
- ✅ `getBaZi()` - 獲取八字
- ✅ `getDayMasterAnalysis()` - 日主分析
- ✅ `getChartAnalysis()` - 命盤分析
- ✅ `getSuggestions()` - 建議
- ✅ `getLuckCycle()` - 大運流年
- ✅ `getCurrentLuckAnalysis()` - 流年分析
- ✅ `getCurrentYearAdvice()` - 流年建議
- ✅ `askGPT()` - GPT 問答

#### 紫微斗數 (ZiWeiResult.vue)
- ✅ `getZiWeiChart()` - 紫微命盤
- ✅ `getZiWeiAnalysis()` - 命盤分析
- ✅ `getZiWeiAnnualLuck()` - 流年運勢
- ✅ `getZiWeiDecadeLuck()` - 大限運勢
- ✅ `askZiWeiGPT()` - GPT 問答

#### 占卜系統
- ✅ `getTarotDivination()` - 塔羅占卜 (TarotDivination.vue)
- ✅ `getIChingDivination()` - 易經占卜 (IChingDivination.vue)
- ✅ `getCrystalDivination()` - 水晶占卜
- ✅ `getNumerologyDivination()` - 數字占卜
- ✅ `getAstrologyDivination()` - 星座占卜
- ✅ `getOracleDivination()` - 靈签占卜
- ✅ `askDivinationGPT()` - 占卜問答

#### 其他功能
- ✅ `callGPT()` - 通用 GPT 調用 (FreeAITestView.vue)
- ✅ `getQuotaStatus()` - 配額狀態 (quotaMonitor.ts)

## 🔧 測試方法

### 方法 1: 使用測試腳本
```bash
npm run test:all
```

### 方法 2: 在瀏覽器控制台
```javascript
// 打開瀏覽器控制台（F12）
testAllAPIs()
```

### 方法 3: 使用診斷工具
```bash
npm run diagnose
```

### 方法 4: 使用 API 測試頁面
訪問：`http://localhost:5173/api-test` 或 `/diagnostic`

## ✅ 檢查清單

### API 端點檢查
- [ ] `/api/health` 返回 200 OK
- [ ] `/api/hello` 返回 200 OK
- [ ] `/api/gpt` GET 返回 200 OK
- [ ] `/api/gpt` POST 返回 200 OK（有效請求）
- [ ] `/api/gpt` POST 返回 400（缺少 prompt）
- [ ] `/api/gpt` POST 返回 405（無效方法）

### 功能頁面檢查
- [ ] 八字命理頁面可以正常加載數據
- [ ] 紫微斗數頁面可以正常加載數據
- [ ] 占卜系統可以正常使用
- [ ] GPT 問答功能正常
- [ ] 錯誤處理正常（顯示友好錯誤信息）

### 錯誤處理檢查
- [ ] 401 錯誤（無效 API key）顯示友好提示
- [ ] 429 錯誤（請求過於頻繁）顯示友好提示
- [ ] 500 錯誤（服務器錯誤）顯示友好提示
- [ ] 網絡錯誤顯示友好提示

### 性能檢查
- [ ] API 響應時間 < 5秒（正常）
- [ ] API 響應時間 < 10秒（可接受）
- [ ] 請求頻率控制正常（2秒間隔）
- [ ] 重試機制正常

## 🐛 常見問題

### 1. API 返回 401 錯誤
**原因**：OpenAI API key 無效或未配置
**解決**：檢查 Vercel 環境變數中的 `OPENAI_API_KEY`

### 2. API 返回 500 錯誤
**原因**：
- API key 未配置
- API key 格式錯誤
- OpenAI 服務問題

**解決**：
1. 檢查 Vercel 環境變數
2. 運行 `npm run diagnose` 診斷
3. 查看 Vercel 函數日誌

### 3. 網絡錯誤 (ERR_CONNECTION_REFUSED)
**原因**：後端服務器未運行
**解決**：
- 本地開發：運行 `npm run server` 或 `npm run dev:full`
- 生產環境：檢查 Vercel 部署狀態

### 4. 請求過於頻繁 (429)
**原因**：請求頻率超過限制
**解決**：系統會自動重試，等待即可

## 📊 測試結果範例

```
========================================
開始測試所有 API 端點
API 基礎網址: http://localhost:5173
========================================

測試: Health Check
  GET http://localhost:5173/api/health
  ✅ 通過 (45ms)

測試: GPT API POST (Simple)
  POST http://localhost:5173/api/gpt
  ✅ 通過 (2341ms)

========================================
測試結果統計
========================================
總測試數: 10
通過: 9
失敗: 1
成功率: 90.0%
```

## 🎯 優化建議

1. **API 響應時間**
   - 考慮使用緩存機制
   - 優化 prompt 長度
   - 使用更快的模型（如 gpt-3.5-turbo）

2. **錯誤處理**
   - 所有 API 調用都有錯誤處理
   - 顯示用戶友好的錯誤信息
   - 自動重試機制

3. **請求頻率控制**
   - 已實現 2 秒間隔控制
   - 請求隊列機制
   - 避免過度請求

4. **監控和日誌**
   - 記錄所有 API 請求
   - 追蹤錯誤率
   - 監控響應時間

## 📝 維護建議

1. **定期測試**
   - 每次部署後運行 `npm run test:all`
   - 檢查所有功能頁面
   - 驗證錯誤處理

2. **監控 API 狀態**
   - 使用 Vercel 函數日誌
   - 監控 OpenAI API 使用情況
   - 追蹤錯誤率

3. **更新測試**
   - 添加新功能時更新測試
   - 保持測試腳本最新
   - 文檔同步更新

---

**最後更新**：2024年
**測試工具**：`test-all-apis.js`
**診斷工具**：`diagnose-vercel.js`

