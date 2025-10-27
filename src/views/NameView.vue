<template>
  <div class="name-analysis">
    <!-- 頁面標題 -->
    <div class="page-header">
      <h1>📝 姓名學分析</h1>
      <p class="subtitle">透過姓名筆畫與五行，探索您的命格奧秘</p>
    </div>

    <!-- 用戶信息輸入 -->
    <div class="input-section" v-if="!hasAnalyzed">
      <div class="input-card">
        <h2>🔍 請提供您的信息</h2>
        <form @submit.prevent="analyzeName">
          <div class="form-group">
            <label for="name">姓名</label>
            <input 
              type="text" 
              id="name" 
              v-model="userData.name" 
              placeholder="請輸入您的姓名（如：王小明）"
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
              placeholder="請輸入您的出生地（如：台北市）"
              required
            >
          </div>
          
          <button type="submit" class="analyze-btn" :disabled="isAnalyzing">
            <span v-if="!isAnalyzing">🔮 開始分析</span>
            <span v-else>分析中...</span>
          </button>
        </form>
      </div>
    </div>

    <!-- 分析進行中 -->
    <div class="analyzing-section" v-if="isAnalyzing">
      <div class="analyzing-card">
        <h2>🔮 姓名學老師正在分析中</h2>
        <div class="loading-animation">
          <div class="mystical-circle">
            <div class="chinese-characters">
              <span class="char">金</span>
              <span class="char">木</span>
              <span class="char">水</span>
              <span class="char">火</span>
              <span class="char">土</span>
            </div>
            <div class="strokes-counter">
              <div class="stroke" v-for="n in 8" :key="n"></div>
            </div>
          </div>
          <p class="loading-text">正在計算筆畫數與五行...</p>
        </div>
      </div>
    </div>

    <!-- 分析結果 -->
    <div class="result-section" v-if="hasAnalyzed && analysisResult">
      <div class="result-card">
        <h2>🎯 您的姓名學分析結果</h2>
        
        <!-- 基本信息 -->
        <div class="basic-info">
          <div class="info-item">
            <h3>姓名</h3>
            <p>{{ analysisResult.name }}</p>
          </div>
          <div class="info-item">
            <h3>總筆畫數</h3>
            <p>{{ analysisResult.totalStrokes }} 畫</p>
          </div>
          <div class="info-item">
            <h3>五行屬性</h3>
            <p class="five-elements" :class="analysisResult.fiveElements">{{ analysisResult.fiveElements }}</p>
          </div>
        </div>

        <!-- 詳細分析 -->
        <div class="analysis-details">
          <div class="analysis-item">
            <h3>🧠 性格分析</h3>
            <p>{{ analysisResult.personality }}</p>
          </div>
          
          <div class="analysis-item">
            <h3>💼 事業分析</h3>
            <p>{{ analysisResult.career }}</p>
          </div>
          
          <div class="analysis-item">
            <h3>🏥 健康分析</h3>
            <p>{{ analysisResult.health }}</p>
          </div>
          
          <div class="analysis-item">
            <h3>👥 人際關係</h3>
            <p>{{ analysisResult.relationships }}</p>
          </div>
          
          <div class="analysis-item">
            <h3>🍀 運勢分析</h3>
            <p>{{ analysisResult.luck }}</p>
          </div>
        </div>

        <!-- 建議 -->
        <div class="suggestions-section">
          <h3>💡 姓名學建議</h3>
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

    <!-- 替代姓名建議 -->
    <div class="alternative-section" v-if="hasAnalyzed && analysisResult">
      <div class="alternative-card">
        <h3>✨ 替代姓名建議</h3>
        <p class="alternative-description">
          根據您的五行屬性，我們為您推薦以下更適合的姓名：
        </p>
        
        <!-- 廣告狀態提示 -->
        <div class="ad-status">
          <div class="status-indicator" :class="{ 'needs-ad': needsAd, 'free': !needsAd }">
            {{ getStatusText }}
          </div>
          <div class="suggestion-counter">
            已查看 {{ viewCount }} 次建議
          </div>
        </div>

        <!-- 替代姓名列表 -->
        <div v-if="canViewAlternatives" class="alternative-names">
          <div 
            v-for="(name, index) in analysisResult.alternativeNames" 
            :key="index"
            class="alternative-name-item"
          >
            <div class="name-display">
              <h4>{{ name }}</h4>
              <p class="name-strokes">{{ calculateTotalStrokes(name) }} 畫</p>
            </div>
            <div class="name-analysis">
              <p class="name-five-elements" :class="getFiveElements(calculateTotalStrokes(name))">
                五行：{{ getFiveElements(calculateTotalStrokes(name)) }}
              </p>
              <p class="name-description">
                {{ getNameDescription(name) }}
              </p>
            </div>
          </div>
        </div>

        <!-- 查看建議按鈕 -->
        <div v-if="!canViewAlternatives" class="view-suggestions-btn">
          <button 
            @click="viewAlternatives" 
            :disabled="!canViewAlternatives"
            class="suggestions-btn"
            :class="{ 'needs-ad': needsAd }"
          >
            <span v-if="needsAd">🎬 觀看廣告後查看建議</span>
            <span v-else>✨ 查看姓名建議</span>
          </button>
        </div>

        <!-- 廣告橫幅 -->
        <div v-if="needsAd" class="ad-banner">
          <div class="ad-content">
            <h4>🎬 觀看廣告解鎖姓名建議</h4>
            <p>為了提供更精準的姓名建議，請觀看廣告後查看推薦</p>
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
import { ref, computed } from 'vue'
import { analyzeName, calculateTotalStrokes, getFiveElements, type NameAnalysis } from '@/utils/nameAnalysis'
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
  birthPlace: ''
})

const hasAnalyzed = ref(false)
const isAnalyzing = ref(false)
const analysisResult = ref<NameAnalysis | null>(null)

// 分析姓名
async function analyzeName() {
  if (!userData.value.name || !userData.value.birthDate || !userData.value.birthPlace) {
    return
  }

  isAnalyzing.value = true

  try {
    // 模擬分析過程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 進行姓名分析
    analysisResult.value = analyzeName(userData.value.name, userData.value.birthDate, userData.value.birthPlace)
    
    hasAnalyzed.value = true
  } catch (error) {
    console.error('姓名分析失敗:', error)
  } finally {
    isAnalyzing.value = false
  }
}

// 重置分析
function resetAnalysis() {
  hasAnalyzed.value = false
  analysisResult.value = null
  userData.value = {
    name: '',
    birthDate: '',
    birthPlace: ''
  }
}

// 查看替代姓名建議
function viewAlternatives() {
  if (!canViewAlternatives.value) return
  handleViewAlternatives()
}

// 獲取姓名描述
function getNameDescription(name: string): string {
  const fiveElements = getFiveElements(calculateTotalStrokes(name))
  const descriptions: { [key: string]: string } = {
    '木': '此姓名具有木的屬性，代表成長與發展，適合追求進步的人。',
    '火': '此姓名具有火的屬性，代表熱情與活力，適合積極進取的人。',
    '土': '此姓名具有土的屬性，代表穩定與踏實，適合追求安定的人。',
    '金': '此姓名具有金的屬性，代表堅強與正義，適合追求成功的人。',
    '水': '此姓名具有水的屬性，代表智慧與靈活，適合追求智慧的人。'
  }
  return descriptions[fiveElements] || '此姓名具有良好的五行平衡。'
}
</script>

<style scoped>
.name-analysis {
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

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
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

.chinese-characters {
  position: absolute;
  width: 100%;
  height: 100%;
}

.chinese-characters .char {
  position: absolute;
  font-size: 2rem;
  color: #8B5CF6;
  font-weight: bold;
  animation: pulse 2s ease-in-out infinite;
}

.chinese-characters .char:nth-child(1) { top: 10px; left: 50%; transform: translateX(-50%); animation-delay: 0s; }
.chinese-characters .char:nth-child(2) { top: 50%; right: 10px; transform: translateY(-50%); animation-delay: 0.4s; }
.chinese-characters .char:nth-child(3) { bottom: 10px; left: 50%; transform: translateX(-50%); animation-delay: 0.8s; }
.chinese-characters .char:nth-child(4) { top: 50%; left: 10px; transform: translateY(-50%); animation-delay: 1.2s; }
.chinese-characters .char:nth-child(5) { top: 50%; left: 50%; transform: translate(-50%, -50%); animation-delay: 1.6s; }

.strokes-counter {
  position: absolute;
  width: 80px;
  height: 80px;
  border: 2px solid #8B5CF6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(139, 92, 246, 0.1);
}

.stroke {
  width: 4px;
  height: 20px;
  background: #8B5CF6;
  margin: 0 2px;
  animation: strokeAnimation 1.5s ease-in-out infinite;
}

.stroke:nth-child(1) { animation-delay: 0s; }
.stroke:nth-child(2) { animation-delay: 0.1s; }
.stroke:nth-child(3) { animation-delay: 0.2s; }
.stroke:nth-child(4) { animation-delay: 0.3s; }
.stroke:nth-child(5) { animation-delay: 0.4s; }
.stroke:nth-child(6) { animation-delay: 0.5s; }
.stroke:nth-child(7) { animation-delay: 0.6s; }
.stroke:nth-child(8) { animation-delay: 0.7s; }

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
  display: grid;
  gap: 20px;
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

/* 替代姓名建議 */
.alternative-description {
  color: #6b7280;
  text-align: center;
  margin-bottom: 20px;
  line-height: 1.6;
}

.alternative-names {
  display: grid;
  gap: 20px;
  margin-top: 20px;
}

.alternative-name-item {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #f8f9ff;
  border-radius: 12px;
  border: 2px solid #8B5CF6;
  transition: all 0.3s ease;
}

.alternative-name-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.2);
}

.name-display {
  flex: 1;
  text-align: center;
  margin-right: 20px;
}

.name-display h4 {
  color: #8B5CF6;
  font-size: 1.8rem;
  margin: 0 0 8px 0;
}

.name-strokes {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

.name-analysis {
  flex: 2;
}

.name-five-elements {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.name-five-elements.木 { color: #22c55e; }
.name-five-elements.火 { color: #ef4444; }
.name-five-elements.土 { color: #f59e0b; }
.name-five-elements.金 { color: #6b7280; }
.name-five-elements.水 { color: #3b82f6; }

.name-description {
  color: #2c3e50;
  line-height: 1.6;
  margin: 0;
}

.view-suggestions-btn {
  text-align: center;
  margin-top: 20px;
}

.suggestions-btn {
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

.suggestions-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.3);
}

.suggestions-btn.needs-ad {
  background: linear-gradient(135deg, #9ca3af, #6b7280);
  cursor: not-allowed;
}

.suggestions-btn.needs-ad:hover {
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

.suggestion-counter {
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

@keyframes strokeAnimation {
  0%, 100% { height: 20px; }
  50% { height: 30px; }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .name-analysis {
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
  
  .chinese-characters .char {
    font-size: 1.5rem;
  }
  
  .basic-info {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .alternative-name-item {
    flex-direction: column;
    text-align: center;
  }
  
  .name-display {
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
