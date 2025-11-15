# 檢查所有頁面 API 請求是否順暢

## 🔍 快速檢查方法

### 方法 1: 使用測試腳本（推薦）

```bash
# 測試本地服務器（需要先運行 npm run server）
npm run test:api:local

# 測試前端開發服務器（需要配置代理）
npm run test:api

# 全面測試所有 API
npm run test:all
```

### 方法 2: 在瀏覽器中測試

1. 打開瀏覽器開發者工具（F12）
2. 訪問網站：`http://localhost:5173`
3. 切換到 **Network** 標籤
4. 測試各個功能頁面，觀察 API 請求

### 方法 3: 使用診斷工具

```bash
npm run diagnose
```

## 📋 需要檢查的頁面

### 1. 八字命理頁面 (`/form` → `/result`)
**API 調用：**
- ✅ `getBaZi()` - 獲取八字
- ✅ `getDayMasterAnalysis()` - 日主分析
- ✅ `getChartAnalysis()` - 命盤分析
- ✅ `getSuggestions()` - 建議
- ✅ `getLuckCycle()` - 大運流年
- ✅ `getCurrentLuckAnalysis()` - 流年分析
- ✅ `getCurrentYearAdvice()` - 流年建議
- ✅ `askGPT()` - GPT 問答

**檢查點：**
- [ ] 所有 API 請求成功（200 OK）
- [ ] 數據正確顯示
- [ ] 錯誤處理正常
- [ ] 加載狀態正常

### 2. 紫微斗數頁面 (`/ziwei` → `/ziwei-result`)
**API 調用：**
- ✅ `getZiWeiChart()` - 紫微命盤
- ✅ `getZiWeiAnalysis()` - 命盤分析
- ✅ `getZiWeiAnnualLuck()` - 流年運勢
- ✅ `getZiWeiDecadeLuck()` - 大限運勢
- ✅ `askZiWeiGPT()` - GPT 問答

**檢查點：**
- [ ] 所有 API 請求成功
- [ ] 命盤正確顯示
- [ ] 分析內容完整
- [ ] 問答功能正常

### 3. 占卜系統 (`/divination`)
**API 調用：**
- ✅ `getTarotDivination()` - 塔羅占卜
- ✅ `getIChingDivination()` - 易經占卜
- ✅ `getCrystalDivination()` - 水晶占卜
- ✅ `getNumerologyDivination()` - 數字占卜
- ✅ `getAstrologyDivination()` - 星座占卜
- ✅ `getOracleDivination()` - 靈签占卜
- ✅ `askDivinationGPT()` - 占卜問答

**檢查點：**
- [ ] 各種占卜類型都能正常工作
- [ ] 占卜結果正確顯示
- [ ] 問答功能正常

### 4. 姓名學頁面 (`/name`)
**檢查點：**
- [ ] 姓名分析功能正常
- [ ] 無 API 請求（本地計算）

### 5. 擇日系統 (`/calendar`)
**檢查點：**
- [ ] 日期選擇功能正常
- [ ] 無 API 請求（本地計算）

## 🐛 常見問題排查

### 問題 1: API 返回 401 錯誤
**症狀：** 所有 API 請求返回 401 Unauthorized
**原因：** OpenAI API key 無效或未配置
**解決：**
1. 檢查 Vercel 環境變數中的 `OPENAI_API_KEY`
2. 運行 `npm run diagnose` 診斷
3. 參考 `修复401错误-无效API密钥.md`

### 問題 2: API 返回 500 錯誤
**症狀：** API 請求返回 500 Internal Server Error
**原因：**
- API key 未配置
- API key 格式錯誤
- OpenAI 服務問題

**解決：**
1. 檢查 Vercel 環境變數
2. 查看 Vercel 函數日誌
3. 運行 `npm run diagnose`

### 問題 3: 網絡錯誤 (ERR_CONNECTION_REFUSED)
**症狀：** 無法連接到 API
**原因：** 後端服務器未運行
**解決：**
- **本地開發：** 運行 `npm run server` 或 `npm run dev:full`
- **生產環境：** 檢查 Vercel 部署狀態

### 問題 4: 請求過於頻繁 (429)
**症狀：** API 返回 429 Too Many Requests
**原因：** 請求頻率超過限制
**解決：** 系統會自動重試，等待即可

### 問題 5: 響應時間過長
**症狀：** API 請求需要很長時間
**原因：**
- OpenAI API 響應慢
- 網絡問題
- Prompt 過長

**解決：**
- 檢查網絡連接
- 優化 prompt 長度
- 考慮使用更快的模型

## ✅ 檢查清單

### API 端點
- [ ] `/api/health` - 健康檢查正常
- [ ] `/api/hello` - Hello API 正常
- [ ] `/api/gpt` - GPT API 正常（GET 和 POST）

### 功能頁面
- [ ] 八字命理頁面所有 API 正常
- [ ] 紫微斗數頁面所有 API 正常
- [ ] 占卜系統所有 API 正常
- [ ] GPT 問答功能正常

### 錯誤處理
- [ ] 401 錯誤顯示友好提示
- [ ] 429 錯誤自動重試
- [ ] 500 錯誤顯示友好提示
- [ ] 網絡錯誤顯示友好提示

### 性能
- [ ] API 響應時間 < 5秒（正常）
- [ ] API 響應時間 < 10秒（可接受）
- [ ] 請求頻率控制正常
- [ ] 重試機制正常

## 📊 測試結果範例

### 成功案例
```
✅ Health Check: 200 OK (45ms)
✅ GPT API POST: 200 OK (2341ms)
✅ 所有功能頁面 API 正常
```

### 失敗案例
```
❌ Health Check: 500 Internal Server Error
❌ GPT API POST: 401 Unauthorized
❌ 錯誤: OpenAI API key not configured
```

## 🎯 下一步

1. **如果所有測試通過：** ✅ API 請求順暢，可以正常使用
2. **如果有錯誤：** 參考上面的常見問題排查
3. **如果需要優化：** 參考 `API測試報告.md` 中的優化建議

---

**提示：** 在本地開發時，確保後端服務器正在運行（`npm run server`）

