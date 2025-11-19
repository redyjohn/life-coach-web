# Google AdSense 設置指南

本指南將幫助您將 Google AdSense 集成到您的網站中。

## 📋 前置要求

1. **Google AdSense 帳戶**
   - 訪問 https://www.google.com/adsense
   - 註冊並申請 AdSense 帳戶
   - 等待審核通過（通常需要 1-7 天）

2. **獲取 Publisher ID**
   - 登入 AdSense 後台
   - 前往「帳戶」→「帳戶資訊」
   - 找到「發布商 ID」（格式：`ca-pub-xxxxxxxxxxxxxxxx`）

## 🔧 設置步驟

### 方法一：使用環境變數（推薦）

1. **在 Vercel 設置環境變數**
   - 前往 Vercel 專案設置
   - 進入「Environment Variables」
   - 添加以下變數：
     ```
     VITE_ADSENSE_ENABLED=true
     VITE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
     ```
   - 可選：為不同廣告位設置不同的 Slot ID：
     ```
     VITE_ADSENSE_SLOT_ENTRY=1234567890
     VITE_ADSENSE_SLOT_BROWSE=1234567891
     VITE_ADSENSE_SLOT_FUNCTION=1234567892
     VITE_ADSENSE_SLOT_RESULT=1234567893
     VITE_ADSENSE_SLOT_PERSISTENT=1234567894
     ```

2. **更新 `index.html`**
   - 將 `index.html` 中的 `ca-pub-PLACEHOLDER` 替換為您的 Publisher ID
   - 或使用環境變數（需要構建時替換）

3. **重新部署**
   - 提交更改到 GitHub
   - Vercel 會自動重新部署

### 方法二：直接修改配置文件

1. **修改 `src/config.ts`**
   ```typescript
   export const ADSENSE_CONFIG = {
     enabled: true,
     clientId: 'ca-pub-您的發布商ID',
     slots: {
       entry: '您的入口廣告Slot ID',
       browse: '您的瀏覽廣告Slot ID',
       // ... 其他廣告位
     }
   }
   ```

2. **修改 `index.html`**
   - 將 `ca-pub-PLACEHOLDER` 替換為您的 Publisher ID

## 📍 廣告位置

網站已配置以下廣告位置：

1. **入口廣告** (`entry`)
   - 位置：首頁頂部
   - 尺寸：全寬橫幅

2. **瀏覽廣告** (`browse`)
   - 位置：首頁頂部橫幅、底部固定橫幅
   - 尺寸：全寬橫幅（底部為 60px 高度）

3. **功能前廣告** (`function`)
   - 位置：使用功能前（如填寫表單前）
   - 尺寸：全寬橫幅

4. **結果頁廣告** (`result`)
   - 位置：結果頁面中
   - 尺寸：全寬橫幅

5. **持續廣告** (`persistent`)
   - 位置：左側邊欄（桌面版）
   - 尺寸：垂直橫幅

## 🎯 廣告格式

- **自動廣告**：如果不設置 Slot ID，AdSense 會自動選擇最適合的廣告格式
- **響應式廣告**：所有廣告都支持響應式設計，會自動適配不同設備

## ✅ 驗證設置

1. **檢查 AdSense 腳本**
   - 打開網站
   - 按 F12 打開開發者工具
   - 在 Console 中應該看到：`✅ AdSense 廣告已初始化`

2. **檢查廣告顯示**
   - 如果設置正確，應該看到真實的 AdSense 廣告
   - 如果仍顯示占位符，檢查：
     - Publisher ID 是否正確
     - `VITE_ADSENSE_ENABLED` 是否設置為 `true`
     - AdSense 帳戶是否已審核通過

3. **AdSense 後台驗證**
   - 登入 AdSense 後台
   - 前往「網站」→「網站列表」
   - 確認您的網站已添加並驗證

## 🚨 常見問題

### 1. 廣告不顯示
- **原因**：AdSense 帳戶尚未審核通過
- **解決**：等待審核（通常 1-7 天）

### 2. 顯示占位符而非真實廣告
- **原因**：`VITE_ADSENSE_ENABLED` 未設置或為 `false`
- **解決**：在 Vercel 環境變數中設置 `VITE_ADSENSE_ENABLED=true`

### 3. Publisher ID 錯誤
- **原因**：ID 格式不正確或未替換 PLACEHOLDER
- **解決**：確認 ID 格式為 `ca-pub-xxxxxxxxxxxxxxxx`（18 位數字）

### 4. 廣告載入緩慢
- **原因**：AdSense 腳本載入時間較長
- **解決**：這是正常現象，廣告會在腳本載入後自動顯示

## 📊 監控收益

1. **AdSense 後台**
   - 登入 https://www.google.com/adsense
   - 查看「報告」了解收益和點擊率

2. **網站統計**
   - 使用 `useAdRevenue` composable 追蹤廣告展示和點擊
   - 可在 Console 中查看統計信息

## 🔒 隱私政策

使用 AdSense 需要：
1. 在網站上添加隱私政策頁面
2. 說明使用 AdSense 和 Cookie
3. 遵守 GDPR 等隱私法規（如適用）

## 📝 注意事項

1. **不要點擊自己的廣告**：這違反 AdSense 政策，可能導致帳戶被封
2. **遵守 AdSense 政策**：確保網站內容符合 AdSense 政策要求
3. **測試環境**：在開發環境中，廣告可能不會顯示，這是正常的
4. **審核時間**：新網站通常需要等待 1-7 天才能通過審核

## 🎉 完成！

設置完成後，您的網站將開始顯示真實的 AdSense 廣告並產生收益。

如有問題，請參考：
- [Google AdSense 幫助中心](https://support.google.com/adsense)
- [AdSense 政策中心](https://support.google.com/adsense/answer/48182)

