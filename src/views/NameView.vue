<template>
  <div class="name-analysis">
    <!-- 頁面標題 -->
    <div class="page-header">
      <h1>✍️ 姓名學分析</h1>
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

    <!-- 需求提問區塊 -->
    <div class="need-question-section" v-if="hasAnalyzed && analysisResult && !userNeedSelected">
      <div class="question-card">
        <h3>💭 您現在有遇到什麼困擾嗎？</h3>
        <p class="question-description">
          讓老師根據您的需求，為您提供更適合的改名建議
        </p>
        <div class="need-options">
          <label 
            v-for="(label, key) in needLabels" 
            :key="key"
            class="need-option"
            :class="{ 'selected': selectedNeed === key }"
            @click="selectNeed(key as UserNeed)"
          >
            <input 
              type="radio" 
              :value="key" 
              v-model="selectedNeed"
              :name="'userNeed'"
            >
            <span class="need-label-text">{{ label }}</span>
          </label>
        </div>
        <button 
          @click="submitNeed" 
          class="submit-need-btn"
          :disabled="!selectedNeed"
        >
          ✨ 提交需求，獲取改名建議
        </button>
      </div>
    </div>

    <!-- 替代姓名建議 -->
    <div class="alternative-section" v-if="hasAnalyzed && analysisResult && userNeedSelected && canViewAlternatives">
      <div class="alternative-card">
        <h3>✨ 改名建議</h3>
        <p class="alternative-description">
          根據您的需求「<strong>{{ needLabels[selectedNeed as UserNeed] }}</strong>」，我們為您推薦以下三個更適合的姓名：
        </p>
        
        <!-- 替代姓名列表 -->
        <div class="alternative-names">
          <div 
            v-for="(name, index) in alternativeNames" 
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

        <!-- 更多姓名選項詢問 -->
        <div v-if="alternativeNames.length > 0 && canViewAlternatives" class="more-names-section">
          <div class="more-names-card">
            <h4>💡 還需要更多姓名選項嗎？</h4>
            <p class="more-names-hint">
              點擊下方按鈕，我們將根據您的需求為您推薦更多適合的姓名
            </p>
            <button 
              @click="requestMoreNames" 
              class="more-names-btn"
              :disabled="isGeneratingMore || needsAd"
              :class="{ 'needs-ad': needsAd }"
            >
              <span v-if="needsAd">🎬 觀看廣告後獲取更多改名建議</span>
              <span v-else-if="!isGeneratingMore">✨ 獲取更多改名建議</span>
              <span v-else>生成中...</span>
            </button>
            <p class="ad-hint" v-if="needsAd">
              💡 獲取更多改名建議需要觀看廣告，這有助於我們提供更精準的姓名分析服務
            </p>
          </div>
        </div>

        <!-- 更多姓名選項的廣告橫幅 -->
        <div v-if="alternativeNames.length > 0 && needsAd && !canViewAlternatives" class="ad-banner">
          <div class="ad-content">
            <h4>🎬 觀看廣告解鎖更多改名建議</h4>
            <p>為了提供更多精準的改名建議，請觀看廣告後查看推薦</p>
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
            <button @click="handleAdClickAndGenerate" class="watch-ad-btn">
              🎬 我已觀看廣告
            </button>
          </div>
        </div>

        <!-- 廣告橫幅 -->
        <div v-if="userNeedSelected && needsAd && !canViewAlternatives" class="ad-banner">
          <div class="ad-content">
            <h4>🎬 觀看廣告解鎖改名建議</h4>
            <p>為了提供更精準的改名建議，請觀看廣告後查看推薦</p>
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
            <button @click="handleAdClickAndGenerate" class="watch-ad-btn">
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
import { analyzeName as analyzeNameUtil, calculateTotalStrokes, getFiveElements, generateAlternativeNames, type NameAnalysis, type UserNeed, needLabels } from '@/utils/nameAnalysis'
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
const selectedNeed = ref<UserNeed | ''>('')
const userNeedSelected = ref(false)
const alternativeNames = ref<string[]>([])
const isGeneratingMore = ref(false)

// 分析姓名
async function analyzeName() {
  if (!userData.value.name || !userData.value.birthDate || !userData.value.birthPlace) {
    return
  }

  isAnalyzing.value = true

  try {
    // 模擬分析過程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 進行姓名分析（先不帶需求）
    analysisResult.value = analyzeNameUtil(
      userData.value.name, 
      userData.value.birthDate, 
      userData.value.birthPlace
    )
    
    hasAnalyzed.value = true
    // 重置需求選擇狀態
    selectedNeed.value = ''
    userNeedSelected.value = false
    alternativeNames.value = []
  } catch (error) {
    console.error('姓名分析失敗:', error)
  } finally {
    isAnalyzing.value = false
  }
}

// 選擇需求
function selectNeed(need: UserNeed) {
  selectedNeed.value = need
}

// 提交需求
function submitNeed() {
  if (!selectedNeed.value || !analysisResult.value) return
  
  userNeedSelected.value = true
  
  // 總是觸發廣告機制
  // 如果不需要廣告，直接生成姓名建議
  if (!needsAd.value) {
    generateAlternativeNamesByNeed()
  }
  // 如果需要廣告，會顯示廣告橫幅，用戶點擊後才生成
}

// 處理廣告點擊並生成姓名
async function handleAdClickAndGenerate() {
  handleAdClick()
  
  // 設置生成狀態
  isGeneratingMore.value = true
  
  try {
    // 模擬生成過程
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 點擊廣告後生成姓名建議
    if (alternativeNames.value.length === 0) {
      // 第一次生成
      generateAlternativeNamesByNeed()
    } else {
      // 生成更多
      generateAlternativeNamesByNeed()
    }
  } catch (error) {
    console.error('生成姓名失敗:', error)
  } finally {
    isGeneratingMore.value = false
  }
}

// 根據需求生成姓名建議
function generateAlternativeNamesByNeed() {
  if (!analysisResult.value || !selectedNeed.value) return
  
  const fiveElements = analysisResult.value.fiveElements
  const originalName = analysisResult.value.name
  
  // 使用工具函數生成替代姓名（3個）
  const newNames = generateAlternativeNames(
    originalName,
    fiveElements,
    selectedNeed.value as UserNeed
  )
  
  // 如果是第一次生成，替換；如果是獲取更多，追加
  if (alternativeNames.value.length === 0) {
    alternativeNames.value = newNames
  } else {
    alternativeNames.value = [...alternativeNames.value, ...newNames]
  }
}

// 請求更多姓名
async function requestMoreNames() {
  if (isGeneratingMore.value) return
  
  // 觸發廣告機制檢查
  if (needsAd.value) {
    // 如果需要廣告，顯示廣告橫幅（會自動顯示）
    // 廣告橫幅會顯示，用戶點擊後調用 handleAdClickAndGenerate
    return
  }
  
  // 如果不需要廣告，直接生成
  isGeneratingMore.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模擬生成過程
    generateAlternativeNamesByNeed()
  } catch (error) {
    console.error('生成更多姓名失敗:', error)
  } finally {
    isGeneratingMore.value = false
  }
}

// 查看替代姓名建議
function viewAlternatives() {
  if (!canViewAlternatives.value) return
  
  handleViewAlternatives()
  // 生成姓名建議
  generateAlternativeNamesByNeed()
}

// 重置分析
function resetAnalysis() {
  hasAnalyzed.value = false
  analysisResult.value = null
  selectedNeed.value = ''
  userNeedSelected.value = false
  alternativeNames.value = []
  userData.value = {
    name: '',
    birthDate: '',
    birthPlace: ''
  }
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
  box-sizing: border-box;
  max-width: 100%;
}

.form-group input:focus {
  outline: none;
  border-color: #8B5CF6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.required-hint {
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: normal;
}

.need-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 8px;
}

.need-option {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.need-option:hover {
  border-color: #8B5CF6;
  background: #f8f9ff;
}

.need-option.selected {
  border-color: #8B5CF6;
  background: #e7f3ff;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.need-option input[type="radio"] {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  cursor: pointer;
  accent-color: #8B5CF6;
}

.need-label-text {
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
  cursor: pointer;
}

.ad-hint {
  color: #6b7280;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 10px;
  line-height: 1.5;
}

/* 需求提問區塊 */
.need-question-section {
  margin-top: 30px;
}

.question-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid #8B5CF6;
}

.question-card h3 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 12px;
  text-align: center;
  border-bottom: 2px solid #8B5CF6;
  padding-bottom: 10px;
}

.question-description {
  color: #6b7280;
  text-align: center;
  margin-bottom: 24px;
  line-height: 1.6;
  font-size: 1rem;
}

.submit-need-btn {
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
  margin-top: 20px;
}

.submit-need-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

.submit-need-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 更多姓名選項區塊 */
.more-names-section {
  margin-top: 30px;
}

.more-names-card {
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.2);
  border: 2px solid #ffc107;
  text-align: center;
}

.more-names-card h4 {
  color: #856404;
  font-size: 1.4rem;
  margin-bottom: 12px;
}

.more-names-hint {
  color: #856404;
  font-size: 1rem;
  margin-bottom: 20px;
  line-height: 1.6;
}

.more-names-btn {
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

.more-names-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

.more-names-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.more-names-btn.needs-ad {
  background: linear-gradient(135deg, #9ca3af, #6b7280);
}

.more-names-btn.needs-ad:hover {
  transform: none;
  box-shadow: none;
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
    box-sizing: border-box;
  }
  
  .page-header {
    padding: 30px 16px;
    box-sizing: border-box;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .input-card, .analyzing-card, .result-card, .alternative-card {
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
  }
  
  .form-group {
    width: 100%;
    box-sizing: border-box;
  }
  
  .form-group input {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    padding: 12px;
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
    box-sizing: border-box;
  }
  
  .alternative-name-item {
    flex-direction: column;
    text-align: center;
    box-sizing: border-box;
  }
  
  .name-display {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .ad-status {
    flex-direction: column;
    gap: 10px;
    text-align: center;
    box-sizing: border-box;
  }
}

/* 超小螢幕優化 */
@media (max-width: 480px) {
  .name-analysis {
    padding: 12px;
  }
  
  .page-header {
    padding: 20px 12px;
  }
  
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .input-card, .analyzing-card, .result-card, .alternative-card {
    padding: 16px;
  }
  
  .form-group input {
    padding: 10px;
    font-size: 16px; /* 防止iOS自動縮放 */
  }

  .need-options {
    grid-template-columns: 1fr;
  }

  .question-card {
    padding: 20px;
  }

  .question-card h3 {
    font-size: 1.5rem;
  }
}
</style>
