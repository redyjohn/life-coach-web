# 生命教練網 - AI 命理平台

一個基於 Vue 3 + TypeScript + Vite 的現代化命理分析平台，提供八字命理、紫微斗數、占卜系統、姓名學和擇日系統等服務。

## 功能特色

- 🔮 **八字命理分析** - 完整的四柱八字分析與 AI 問答
- ⭐ **紫微斗數** - 十二宮命盤分析與運勢預測
- 🎯 **AI 問答系統** - 基於 GPT-4 的智能命理諮詢
- 📱 **響應式設計** - 支援桌面與行動裝置
- 🎬 **廣告整合** - 智能的問答 gating 機制

## 技術架構

- **前端**: Vue 3 + TypeScript + Vite
- **路由**: Vue Router 4
- **後端**: Vercel Serverless Functions
- **AI 服務**: OpenAI GPT-4 API
- **農曆轉換**: solarlunar 套件

## 環境設定

### 必要環境變數

```bash
# OpenAI API 金鑰 (在 Vercel 環境中設定)
OPENAI_API_KEY=your_openai_api_key_here
```

### 本地開發

```bash
# 安裝相依套件
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build
```

## 專案結構

```
src/
├── components/          # 共用元件
│   ├── AdBanner.vue    # 廣告橫幅
│   └── Navbar.vue      # 導航列
├── composables/        # Vue 3 組合式函式
│   └── useAdGating.ts  # 廣告 gating 邏輯
├── services/           # API 服務
│   └── gptService.ts   # 統一的 GPT 服務
├── views/              # 頁面元件
│   ├── HomeView.vue    # 首頁
│   ├── FormView.vue    # 八字表單
│   ├── ResultView.vue  # 八字結果
│   ├── ZiWeiView.vue   # 紫微表單
│   └── ZiWeiResult.vue # 紫微結果
└── router/             # 路由設定
    └── index.ts
```

## 部署

### Vercel 部署

1. 將專案推送到 GitHub
2. 在 Vercel 中匯入專案
3. 設定環境變數 `OPENAI_API_KEY`
4. 部署完成

### 其他平台

專案使用標準的 Vite 建置流程，可部署到任何支援 Node.js 的平台。

## 安全考量

- ✅ OpenAI API 金鑰已移至後端代理
- ✅ 前端不再直接暴露 API 金鑰
- ✅ 實作速率限制與錯誤處理
- ✅ 統一的廣告 gating 機制

## 開發注意事項

- 使用 TypeScript 確保型別安全
- 遵循 Vue 3 Composition API 最佳實踐
- 統一的錯誤處理與使用者體驗
- 響應式設計支援多種裝置

## 授權

MIT License
