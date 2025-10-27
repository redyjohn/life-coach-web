<template>
  <div class="date-selection">
    <!-- 頁面標題 -->
    <div class="page-header">
      <h1>📅 擇日系統</h1>
      <p class="subtitle">選擇良辰吉日，讓重要事件事半功倍</p>
    </div>

    <!-- 用戶信息輸入 -->
    <div class="input-section" v-if="!hasAnalyzed">
      <div class="input-card">
        <h2>🔍 請提供您的信息</h2>
        <form @submit.prevent="analyzeDate">
          <div class="form-group">
            <label for="name">姓名</label>
            <input 
              type="text" 
              id="name" 
              v-model="userData.name" 
              placeholder="請輸入您的姓名"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="birthDate">出生年月日</label>
            <input 
              type="date" 
              id="birthDate" 
              v-model="userData.birthDate"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="birthPlace">出生地</label>
            <input 
              type="text" 
              id="birthPlace" 
              v-model="userData.birthPlace" 
              placeholder="請輸入您的出生地"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="event">想要執行的事件</label>
            <select id="event" v-model="userData.event" required>
              <option value="">請選擇事件類型</option>
              <option value="搬家">搬家</option>
              <option value="手術">手術</option>
              <option value="生子">生子</option>
              <option value="結婚">結婚</option>
              <option value="開業">開業</option>
              <option value="投資">投資</option>
              <option value="考試">考試</option>
              <option value="求職">求職</option>
              <option value="簽約">簽約</option>
              <option value="旅行">旅行</option>
              <option value="裝修">裝修</option>
              <option value="買房">買房</option>
            </select>
          </div>
          
          <button type="submit" class="analyze-btn" :disabled="isAnalyzing">
            <span v-if="!isAnalyzing">🔮 開始擇日</span>
            <span v-else>分析中...</span>
          </button>
        </form>
      </div>
    </div>

    <!-- 分析進行中 -->
    <div class="analyzing-section" v-if="isAnalyzing">
      <div class="analyzing-card">
        <h2>🔮 擇日老師正在分析中</h2>
        <div class="loading-animation">
          <div class="mystical-circle">
            <div class="calendar-symbols">
              <span class="symbol">📅</span>
              <span class="symbol">📆</span>
              <span class="symbol">🗓️</span>
              <span class="symbol">⏰</span>
              <span class="symbol">🌟</span>
            </div>
            <div class="date-picker">
              <div class="date-item" v-for="n in 7" :key="n"></div>
            </div>
          </div>
          <p class="loading-text">正在計算最佳日期...</p>
        </div>
      </div>
    </div>

    <!-- 分析結果 -->
    <div class="result-section" v-if="hasAnalyzed && analysisResult">
      <div class="result-card">
        <h2>🎯 您的擇日分析結果</h2>
        
        <!-- 基本信息 -->
        <div class="basic-info">
          <div class="info-item">
            <h3>事件</h3>
            <p>{{ analysisResult.event }}</p>
          </div>
          <div class="info-item">
            <h3>推薦日期</h3>
            <p class="recommended-date">{{ formatDate(analysisResult.recommendedDate) }}</p>
          </div>
          <div class="info-item">
            <h3>五行屬性</h3>
            <p class="five-elements" :class="getDateFiveElements(analysisResult.recommendedDate)">
              {{ getDateFiveElements(analysisResult.recommendedDate) }}
            </p>
          </div>
        </div>

        <!-- 詳細分析 -->
        <div class="analysis-details">
          <div class="analysis-item">
            <h3>📋 擇日分析</h3>
            <p>{{ analysisResult.analysis }}</p>
          </div>
        </div>

        <!-- 建議 -->
        <div class="suggestions-section">
          <h3>💡 執行建議</h3>
          <ul class="suggestions-list">
            <li v-for="(suggestion, index) in analysisResult.suggestions" :key="index">
              {{ suggestion }}
            </li>
          </ul>
        </div>

        <!-- 重新分析 -->
        <div class="action-buttons">
          <button @click="resetAnalysis" class="reset-btn">
            🔄 重新分析
          </button>
        </div>
      </div>
    </div>

    <!-- 更多日期選擇 -->
    <div class="alternative-section" v-if="hasAnalyzed && analysisResult">
      <div class="alternative-card">
        <h3>📅 更多日期選擇</h3>
        <p class="alternative-description">
          如果您需要查看其他適合的日期，我們為您提供更多選擇：
        </p>
        
        <!-- 廣告狀態提示 -->
        <div class="ad-status">
          <div class="status-indicator" :class="{ 'needs-ad': needsAd, 'free': !needsAd }">
            {{ getStatusText }}
          </div>
          <div class="date-counter">
            已查看 {{ viewCount }} 次日期
          </div>
        </div>

        <!-- 更多日期按鈕 -->
        <div v-if="!hasViewedAlternatives" class="more-dates-section">
          <button @click="requestMoreDates" class="more-dates-btn" :disabled="isLoadingMoreDates">
            <span v-if="!isLoadingMoreDates">📅 更多日期</span>
            <span v-else>載入中...</span>
          </button>
          <p class="more-dates-hint">點擊按鈕查看三個額外的推薦日期</p>
        </div>

        <!-- 替代日期列表 -->
        <div v-if="canViewAlternatives && hasViewedAlternatives" class="alternative-dates">
          <div 
            v-for="(date, index) in analysisResult.alternativeDates" 
            :key="index"
            class="alternative-date-item"
          >
            <div class="date-display">
              <h4>{{ formatDate(date) }}</h4>
              <p class="date-five-elements" :class="getDateFiveElements(date)">
                五行：{{ getDateFiveElements(date) }}
              </p>
            </div>
            <div class="date-analysis">
              <p class="date-description">
                {{ getDateDescription(date, analysisResult.event) }}
              </p>
              <div class="date-features">
                <span class="feature-tag">吉日</span>
                <span class="feature-tag">適合{{ analysisResult.event }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 查看更多日期按鈕 -->
        <div v-if="!canViewAlternatives" class="view-dates-btn">
          <button 
            @click="viewAlternatives" 
            :disabled="!canViewAlternatives"
            class="dates-btn"
            :class="{ 'needs-ad': needsAd }"
          >
            <span v-if="needsAd">🎬 觀看廣告後查看更多日期</span>
            <span v-else>📅 查看更多日期</span>
          </button>
        </div>

        <!-- 廣告橫幅 -->
        <div v-if="needsAd && hasViewedAlternatives" class="ad-banner">
          <div class="ad-content">
            <h4>🎬 觀看廣告解鎖更多日期</h4>
            <p>為了提供更精準的日期選擇，請觀看廣告後查看推薦</p>
            <div class="ad-placeholder">
              <div class="ad-box">
                <div class="ad-text">🔗 廣告位（可替換成 AdSense）</div>
                <div class="ad-features">
                  <span>📱 手機廣告</span>
                  <span>💻 桌面廣告</span>
                  <span>🎯 精準投放</span>
                </div>
              </div>
            </div>
            <button @click="handleAdClick" class="watch-ad-btn">
              🎬 我已觀看廣告
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { analyzeDateSelection, formatDate, getDateFiveElements, generateAlternativeDates, type DateSelection } from '@/utils/dateSelection'
import { useAdGating } from '@/composables/useAdGating'

// 使用統一的廣告 gating
const {
  askCount: viewCount,
  adClicked,
  needsAd,
  canAsk: canViewAlternatives,
  getStatusText,
  getButtonText,
  handleAdClick,
  handleQuestionAsked: handleViewAlternatives
} = useAdGating()

// 響應式數據
const userData = ref({
  name: '',
  birthDate: '',
  birthPlace: '',
  event: ''
})

const hasAnalyzed = ref(false)
const isAnalyzing = ref(false)
const analysisResult = ref<DateSelection | null>(null)
const hasViewedAlternatives = ref(false)
const isLoadingMoreDates = ref(false)

// 分析日期
async function analyzeDate() {
  if (!userData.value.name || !userData.value.birthDate || !userData.value.birthPlace || !userData.value.event) {
    return
  }

  isAnalyzing.value = true

  try {
    // 模擬分析過程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 進行擇日分析
    analysisResult.value = analyzeDateSelection(
      userData.value.name,
      userData.value.birthDate,
      userData.value.birthPlace,
      userData.value.event
    )
    
    hasAnalyzed.value = true
  } catch (error) {
    console.error('擇日分析失敗:', error)
  } finally {
    isAnalyzing.value = false
  }
}

// 重置分析
function resetAnalysis() {
  hasAnalyzed.value = false
  analysisResult.value = null
  hasViewedAlternatives.value = false
  isLoadingMoreDates.value = false
  userData.value = {
    name: '',
    birthDate: '',
    birthPlace: '',
    event: ''
  }
}

// 請求更多日期
async function requestMoreDates() {
  if (isLoadingMoreDates.value) return
  
  isLoadingMoreDates.value = true
  
  try {
    // 模擬載入過程
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 生成三個額外的日期
    if (analysisResult.value) {
      const newAlternatives = generateAlternativeDates(
        analysisResult.value.event,
        analysisResult.value.birthDate,
        3
      )
      analysisResult.value.alternativeDates = newAlternatives
    }
    
    hasViewedAlternatives.value = true
  } catch (error) {
    console.error('生成更多日期失敗:', error)
  } finally {
    isLoadingMoreDates.value = false
  }
}

// 查看替代日期
function viewAlternatives() {
  if (!canViewAlternatives.value) return
  
  // 生成新的替代日期
  if (analysisResult.value) {
    const newAlternatives = generateAlternativeDates(
      analysisResult.value.event,
      analysisResult.value.birthDate,
      3
    )
    analysisResult.value.alternativeDates = newAlternatives
  }
  
  handleViewAlternatives()
}

// 獲取日期描述
function getDateDescription(date: string, event: string): string {
  const fiveElements = getDateFiveElements(date)
  const descriptions: { [key: string]: string } = {
    '木': `此日期具有木的屬性，代表成長與發展，適合執行「${event}」事件。`,
    '火': `此日期具有火的屬性，代表熱情與活力，適合執行「${event}」事件。`,
    '土': `此日期具有土的屬性，代表穩定與踏實，適合執行「${event}」事件。`,
    '金': `此日期具有金的屬性，代表堅強與正義，適合執行「${event}」事件。`,
    '水': `此日期具有水的屬性，代表智慧與靈活，適合執行「${event}」事件。`
  }
  return descriptions[fiveElements] || `此日期具有良好的五行平衡，適合執行「${event}」事件。`
}
</script>

<style scoped>
.date-selection {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Microsoft JhengHei', sans-serif;
  background: linear-gradient(135deg, #f7f9fc 0%, #e8f4f8 100%);
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  border-radius: 20px;
  color: white;
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
}

.page-header h1 {
  font-size: 2.5rem;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.2rem;
  margin: 0;
  opacity: 0.9;
  font-weight: 300;
}

.input-card, .analyzing-card, .result-card, .alternative-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.input-card h2, .analyzing-card h2, .result-card h2, .alternative-card h3 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-align: center;
  border-bottom: 2px solid #8B5CF6;
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 600;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #8B5CF6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.analyze-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.analyze-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

.analyze-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 分析動畫 */
.loading-animation {
  text-align: center;
  padding: 40px;
}

.mystical-circle {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 30px;
  border: 3px solid #8B5CF6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: rotate 10s linear infinite;
}

.calendar-symbols {
  position: absolute;
  width: 100%;
  height: 100%;
}

.calendar-symbols .symbol {
  position: absolute;
  font-size: 2rem;
  color: #8B5CF6;
  animation: pulse 2s ease-in-out infinite;
}

.calendar-symbols .symbol:nth-child(1) { top: 10px; left: 50%; transform: translateX(-50%); animation-delay: 0s; }
.calendar-symbols .symbol:nth-child(2) { top: 50%; right: 10px; transform: translateY(-50%); animation-delay: 0.4s; }
.calendar-symbols .symbol:nth-child(3) { bottom: 10px; left: 50%; transform: translateX(-50%); animation-delay: 0.8s; }
.calendar-symbols .symbol:nth-child(4) { top: 50%; left: 10px; transform: translateY(-50%); animation-delay: 1.2s; }
.calendar-symbols .symbol:nth-child(5) { top: 50%; left: 50%; transform: translate(-50%, -50%); animation-delay: 1.6s; }

.date-picker {
  position: absolute;
  width: 80px;
  height: 80px;
  border: 2px solid #8B5CF6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(139, 92, 246, 0.1);
  flex-wrap: wrap;
  padding: 10px;
}

.date-item {
  width: 8px;
  height: 8px;
  background: #8B5CF6;
  border-radius: 50%;
  margin: 1px;
  animation: dateAnimation 1.5s ease-in-out infinite;
}

.date-item:nth-child(1) { animation-delay: 0s; }
.date-item:nth-child(2) { animation-delay: 0.1s; }
.date-item:nth-child(3) { animation-delay: 0.2s; }
.date-item:nth-child(4) { animation-delay: 0.3s; }
.date-item:nth-child(5) { animation-delay: 0.4s; }
.date-item:nth-child(6) { animation-delay: 0.5s; }
.date-item:nth-child(7) { animation-delay: 0.6s; }

.loading-text {
  font-size: 1.2rem;
  color: #8B5CF6;
  font-weight: 600;
  animation: pulse 2s ease-in-out infinite;
}

/* 結果顯示 */
.basic-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9ff, #e8f4f8);
  border-radius: 12px;
  border: 2px solid #8B5CF6;
}

.info-item {
  text-align: center;
}

.info-item h3 {
  color: #8B5CF6;
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.info-item p {
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.recommended-date {
  font-size: 1.4rem !important;
  color: #8B5CF6 !important;
  font-weight: bold !important;
}

.five-elements {
  font-size: 2rem !important;
  font-weight: bold !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.five-elements.木 { color: #22c55e; }
.five-elements.火 { color: #ef4444; }
.five-elements.土 { color: #f59e0b; }
.five-elements.金 { color: #6b7280; }
.five-elements.水 { color: #3b82f6; }

.analysis-details {
  margin-bottom: 30px;
}

.analysis-item {
  padding: 20px;
  background: #f8f9ff;
  border-radius: 8px;
  border-left: 4px solid #8B5CF6;
}

.analysis-item h3 {
  color: #8B5CF6;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.analysis-item p {
  color: #2c3e50;
  line-height: 1.6;
  margin: 0;
}

.suggestions-section {
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  border-radius: 12px;
  border: 2px solid #ffc107;
}

.suggestions-section h3 {
  color: #856404;
  font-size: 1.4rem;
  margin-bottom: 15px;
  text-align: center;
}

.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestions-list li {
  color: #856404;
  line-height: 1.8;
  margin-bottom: 10px;
  padding-left: 24px;
  position: relative;
}

.suggestions-list li::before {
  content: "✨";
  position: absolute;
  left: 0;
  top: 0;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.reset-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.3);
}

/* 替代日期建議 */
.alternative-description {
  color: #6b7280;
  text-align: center;
  margin-bottom: 20px;
  line-height: 1.6;
}

/* 更多日期按鈕區域 */
.more-dates-section {
  text-align: center;
  margin: 30px 0;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9ff, #e8f4f8);
  border-radius: 12px;
  border: 2px dashed #8B5CF6;
}

.more-dates-btn {
  padding: 16px 32px;
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  margin-bottom: 15px;
}

.more-dates-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
}

.more-dates-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.more-dates-hint {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
  font-style: italic;
}

.alternative-dates {
  display: grid;
  gap: 20px;
  margin-top: 20px;
}

.alternative-date-item {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #f8f9ff;
  border-radius: 12px;
  border: 2px solid #8B5CF6;
  transition: all 0.3s ease;
}

.alternative-date-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.2);
}

.date-display {
  flex: 1;
  text-align: center;
  margin-right: 20px;
}

.date-display h4 {
  color: #8B5CF6;
  font-size: 1.4rem;
  margin: 0 0 8px 0;
}

.date-five-elements {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.date-five-elements.木 { color: #22c55e; }
.date-five-elements.火 { color: #ef4444; }
.date-five-elements.土 { color: #f59e0b; }
.date-five-elements.金 { color: #6b7280; }
.date-five-elements.水 { color: #3b82f6; }

.date-analysis {
  flex: 2;
}

.date-description {
  color: #2c3e50;
  line-height: 1.6;
  margin: 0 0 10px 0;
}

.date-features {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.feature-tag {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.view-dates-btn {
  text-align: center;
  margin-top: 20px;
}

.dates-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dates-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.3);
}

.dates-btn.needs-ad {
  background: linear-gradient(135deg, #9ca3af, #6b7280);
  cursor: not-allowed;
}

.dates-btn.needs-ad:hover {
  transform: none;
  box-shadow: none;
}

/* 廣告機制樣式 */
.ad-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: linear-gradient(135deg, #f8f9ff, #e8f4f8);
  border-radius: 12px;
  border: 2px solid #8B5CF6;
}

.status-indicator {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.status-indicator.free {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.status-indicator.needs-ad {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.date-counter {
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
}

.ad-banner {
  margin-bottom: 25px;
  padding: 25px;
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  border-radius: 16px;
  border: 2px solid #ffc107;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.2);
}

.ad-content h4 {
  color: #856404;
  font-size: 1.3rem;
  margin-bottom: 10px;
  text-align: center;
}

.ad-content p {
  color: #856404;
  text-align: center;
  margin-bottom: 20px;
  line-height: 1.6;
}

.ad-placeholder {
  margin-bottom: 20px;
}

.ad-box {
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
}

.ad-box:hover {
  border-color: #8B5CF6;
  background: #f8f9ff;
}

.ad-text {
  color: #6b7280;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 15px;
}

.ad-features {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.ad-features span {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.watch-ad-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #ffc107, #ffb300);
  color: #856404;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.watch-ad-btn:hover {
  background: linear-gradient(135deg, #ffb300, #ff8f00);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 193, 7, 0.3);
}

/* 動畫 */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

@keyframes dateAnimation {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.7; }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .date-selection {
    padding: 16px;
  }
  
  .page-header {
    padding: 30px 16px;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .input-card, .analyzing-card, .result-card, .alternative-card {
    padding: 20px;
  }
  
  .mystical-circle {
    width: 150px;
    height: 150px;
  }
  
  .calendar-symbols .symbol {
    font-size: 1.5rem;
  }
  
  .basic-info {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .alternative-date-item {
    flex-direction: column;
    text-align: center;
  }
  
  .date-display {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .ad-status {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}
</style>
