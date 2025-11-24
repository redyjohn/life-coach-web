<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import {
  getBaZi,
  getDayMasterAnalysis,
  getChartAnalysis,
  getSuggestions,
  getLuckCycle,
  getCurrentLuckAnalysis,
  getCurrentYearAdvice,
  askGPT
} from '@/services/gptService'
import { useAdGating } from '@/composables/useAdGating'

// 接口定義
interface UserData {
  [key: string]: string | number | boolean | undefined
}

interface QuestionHistoryItem {
  question: string
  answer: string
}

interface SectionContent {
  title: string
  text: string
  formattedText?: string
  show: boolean
  loading?: boolean
}

const route = useRoute()
const router = useRouter()
const userData = route.query as UserData

// 數據狀態
const baZi = ref('')
const dayMaster = ref('')
const chartAnalysis = ref('')
const suggestion = ref('')
const luckCycle = ref('')
const currentLuck = ref('')
const yearAdvice = ref('')

// UI 狀態
const isLoading = ref(true)
const errorMessages = ref<string[]>([])

// 載入狀態追蹤 - 初始化時所有區塊都設為載入中
const loadingStates = ref({
  baZi: true,
  dayMaster: true,
  chartAnalysis: true,
  suggestion: true,
  luckCycle: true,
  currentLuck: true,
  yearAdvice: true
})

// 區塊顯示狀態 - 控制區塊的出現動畫
const sectionVisibility = ref({
  baZi: false,
  dayMaster: false,
  chartAnalysis: false,
  suggestion: false,
  luckCycle: false,
  currentLuck: false,
  yearAdvice: false
})

// GPT 相關狀態
const promptHint = ref('')
const questionHistory = ref<QuestionHistoryItem[]>([])
const userQuestion = ref('')
const isAsking = ref(false)

// 使用統一的廣告 gating
const {
  askCount,
  adClicked,
  needsAd,
  canAsk,
  getStatusText,
  getButtonText,
  handleAdClick,
  handleQuestionAsked
} = useAdGating()

// 離開頁面相關
const showLeavePrompt = ref(false)
const allowLeave = ref(false)

// 計算屬性
const canAskGPT = computed(() => canAsk.value && !isAsking.value)

const defaultFallbackReply = '🙇‍♂️ 非常抱歉，您所提的問題無法用八字解析，您要不要試試看我們其他 AI 老師的服務？'

// 響應式的內容數組 - 控制區塊顯示和載入狀態
const sectionContents = computed<SectionContent[]>(() => [
  { title: '一、個人八字（四柱）', text: baZi.value, show: sectionVisibility.value.baZi, loading: loadingStates.value.baZi },
  { title: '二、日主分析', text: dayMaster.value, formattedText: formattedDayMaster.value, show: sectionVisibility.value.dayMaster, loading: loadingStates.value.dayMaster },
  { title: '三、命盤分析', text: chartAnalysis.value, show: sectionVisibility.value.chartAnalysis, loading: loadingStates.value.chartAnalysis },
  { title: '四、命理建議', text: suggestion.value, formattedText: formattedSuggestion.value, show: sectionVisibility.value.suggestion, loading: loadingStates.value.suggestion },
  { title: '五、大運列表', text: luckCycle.value, show: sectionVisibility.value.luckCycle, loading: loadingStates.value.luckCycle },
  { title: '六、今年流年分析', text: currentLuck.value, formattedText: formattedCurrentLuck.value, show: sectionVisibility.value.currentLuck, loading: loadingStates.value.currentLuck },
  { title: '七、流年建議', text: yearAdvice.value, formattedText: formattedYearAdvice.value, show: sectionVisibility.value.yearAdvice, loading: loadingStates.value.yearAdvice }
])

// 需要使用 pre 標籤的索引
const preTagIndexes = [0, 2, 4]

// 格式化文本內容，確保清晰分段
function formatTextContent(text: string): string {
  if (!text) return ''
  
  let formatted = text
  
  // 先處理粗體標記（在分段之前）
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  
  // 將 HTML 標籤轉換為純文本進行處理（保留換行）
  if (typeof document !== 'undefined') {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = formatted
    formatted = tempDiv.textContent || tempDiv.innerText || ''
  } else {
    // 服務端渲染時，簡單移除 HTML 標籤
    formatted = formatted.replace(/<[^>]*>/g, '')
  }
  
  // 處理各種編號格式，確保每個編號前都有明顯的分段
  formatted = formatted.replace(/(\n|^)(\d+[\.、]\s+)/g, '\n\n$2')
  formatted = formatted.replace(/(\n|^)([一二三四五六七八九十]+[、：]\s*)/g, '\n\n$2')
  formatted = formatted.replace(/(\n|^)(\(\d+\)\s+)/g, '\n\n$2')
  formatted = formatted.replace(/(\n|^)(\*\s+)/g, '\n\n$2')
  formatted = formatted.replace(/(\n|^)(-\s+)/g, '\n\n$2')
  formatted = formatted.replace(/(\n|^)(\*\*[^*]+\*\*)/g, '\n\n$2')
  formatted = formatted.replace(/\n{3,}/g, '\n\n')
  formatted = formatted.replace(/^\s+/gm, '')
  
  // 將文本分割成段落
  const paragraphs = formatted.split(/\n\n+/).filter(p => p.trim().length > 0)
  
  // 為每個段落添加 HTML 標籤和樣式
  const formattedParagraphs = paragraphs.map(paragraph => {
    const trimmedP = paragraph.trim()
    const isNumbered = /^(\d+[\.、]|[一二三四五六七八九十]+[、：]|\(\d+\)|\*|-|\*\*)/.test(trimmedP)
    let formattedP = trimmedP.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    
    if (isNumbered) {
      return `<p class="bazi-paragraph numbered-paragraph">${formattedP}</p>`
    } else {
      return `<p class="bazi-paragraph">${formattedP}</p>`
    }
  })
  
  return formattedParagraphs.join('')
}

// 為每個部分創建格式化後的計算屬性
const formattedDayMaster = computed(() => formatTextContent(dayMaster.value))
const formattedSuggestion = computed(() => formatTextContent(suggestion.value))
const formattedCurrentLuck = computed(() => formatTextContent(currentLuck.value))
const formattedYearAdvice = computed(() => formatTextContent(yearAdvice.value))

onMounted(async () => {
  window.addEventListener('beforeunload', handleBeforeUnload)
  
  // 檢查必要的用戶數據
  if (!userData || Object.keys(userData).length === 0) {
    errorMessages.value.push('❌ 用戶數據不完整，請重新填寫資料')
    isLoading.value = false
    return
  }

  try {
    // 立即顯示所有區塊框架，開始載入內容
    isLoading.value = false
    
    // 獲取提示語
    try {
      promptHint.value = await askGPT(
        '請用一句親切話語，引導使用者針對命理命盤提問，例如：「你可以問接下來的事業運如何喔」',
        userData
      )
    } catch (error) {
      console.warn('獲取提示語失敗:', error)
      promptHint.value = '你可以問接下來的事業運如何喔'
    }

    // 開始載入各個區塊的內容
    loadAllSections()
    
  } catch (error) {
    console.error('初始化失敗:', error)
    errorMessages.value.push('❌ 系統初始化失敗，請重新整理頁面')
    isLoading.value = false
  }
  
  console.log('✅ ResultView mounted')
})

// 載入所有區塊內容的函數
async function loadAllSections() {
  // 立即顯示所有區塊標題
  showAllSections()
  
  // 同時開始載入基礎數據（八字、日主分析、建議）
  Promise.all([
    loadBaZiData(),
    loadDayMasterData(), 
    loadSuggestionsData()
  ])

  // 延遲載入較複雜的分析（避免同時發送太多請求）
  setTimeout(() => {
    loadChartAnalysisData()
  }, 1000)

  setTimeout(() => {
    loadLuckCycleData()
  }, 2000)

  setTimeout(() => {
    Promise.all([
      loadCurrentLuckData(),
      loadYearAdviceData()
    ])
  }, 3000)
}

// 顯示所有區塊標題的函數
function showAllSections() {
  // 立即顯示所有區塊
  sectionVisibility.value.baZi = true
  sectionVisibility.value.dayMaster = true
  sectionVisibility.value.chartAnalysis = true
  sectionVisibility.value.suggestion = true
  sectionVisibility.value.luckCycle = true
  sectionVisibility.value.currentLuck = true
  sectionVisibility.value.yearAdvice = true
}

// 個別載入函數
async function loadBaZiData() {
  try {
    const result = await getBaZi(userData)
    baZi.value = result || '數據獲取失敗'
    console.log('🔥 getBaZi 回傳：', result)
  } catch (error) {
    console.error('獲取八字失敗:', error)
    baZi.value = '八字數據獲取失敗，請稍後重試'
  } finally {
    loadingStates.value.baZi = false
  }
}

async function loadDayMasterData() {
  try {
    const result = await getDayMasterAnalysis(userData)
    dayMaster.value = result || '數據獲取失敗'
  } catch (error) {
    console.error('獲取日主分析失敗:', error)
    dayMaster.value = '日主分析獲取失敗，請稍後重試'
  } finally {
    loadingStates.value.dayMaster = false
  }
}

async function loadSuggestionsData() {
  try {
    const result = await getSuggestions(userData)
    suggestion.value = result || '數據獲取失敗'
  } catch (error) {
    console.error('獲取建議失敗:', error)
    suggestion.value = '命理建議獲取失敗，請稍後重試'
  } finally {
    loadingStates.value.suggestion = false
  }
}

async function loadChartAnalysisData() {
  try {
    const result = await getChartAnalysis(userData)
    chartAnalysis.value = result || '命盤分析獲取失敗'
  } catch (error) {
    console.error('獲取命盤分析失敗:', error)
    chartAnalysis.value = '命盤分析獲取失敗，請稍後重試'
  } finally {
    loadingStates.value.chartAnalysis = false
  }
}

async function loadLuckCycleData() {
  try {
    const result = await getLuckCycle(userData)
    luckCycle.value = result || '大運列表獲取失敗'
  } catch (error) {
    console.error('獲取大運列表失敗:', error)
    luckCycle.value = '大運列表獲取失敗，請稍後重試'
  } finally {
    loadingStates.value.luckCycle = false
  }
}

async function loadCurrentLuckData() {
  try {
    const result = await getCurrentLuckAnalysis(userData)
    currentLuck.value = result || '流年分析獲取失敗'
  } catch (error) {
    console.error('獲取流年分析失敗:', error)
    currentLuck.value = '流年分析獲取失敗，請稍後重試'
  } finally {
    loadingStates.value.currentLuck = false
  }
}

async function loadYearAdviceData() {
  try {
    const result = await getCurrentYearAdvice(userData)
    yearAdvice.value = result || '流年建議獲取失敗'
  } catch (error) {
    console.error('獲取流年建議失敗:', error)
    yearAdvice.value = '流年建議獲取失敗，請稍後重試'
  } finally {
    loadingStates.value.yearAdvice = false
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

onBeforeRouteLeave((to, from, next) => {
  if (allowLeave.value) {
    next()
  } else {
    showLeavePrompt.value = true
    next(false)
  }
})

function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (!allowLeave.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

function handleExportToPDF() {
  showLeavePrompt.value = false
  window.open('https://your-ad-link.com', '_blank')
  setTimeout(() => {
    try {
      window.print()
    } catch (error) {
      console.error('打印失敗:', error)
    }
  }, 1000)
}

function handleLeaveAnyway() {
  allowLeave.value = true
  showLeavePrompt.value = false
  window.removeEventListener('beforeunload', handleBeforeUnload)
  router.push('/')
}

function cancelLeave() {
  showLeavePrompt.value = false
}

async function handleAskGPT() {
  if (!canAskGPT.value || !userQuestion.value.trim()) {
    return
  }
  
  const currentQ = userQuestion.value.trim()
  isAsking.value = true
  
  questionHistory.value.push({ 
    question: currentQ, 
    answer: '⏳ 八老師解盤中...' 
  })
  
  userQuestion.value = ''

  try {
    let reply = await askGPT(currentQ, userData)
    const lastIndex = questionHistory.value.length - 1
    
    if (lastIndex >= 0) {
      // 檢查並過濾不當回應
      reply = filterInappropriateResponses(reply)
      questionHistory.value[lastIndex].answer = reply
    }
    
    handleQuestionAsked()
  } catch (error) {
    console.error('GPT 回覆失敗:', error)
    const lastIndex = questionHistory.value.length - 1
    if (lastIndex >= 0) {
      questionHistory.value[lastIndex].answer = '❌ 八老師暫時無法回應，請稍後再試。'
    }
  } finally {
    isAsking.value = false
  }
}

// 過濾不當回應的函數
function filterInappropriateResponses(reply: string): string {
  const inappropriatePatterns = [
    /我不是專業老師/gi,
    /無法回答/gi,
    /不確定/gi,
    /無法解釋/gi,
    /無法解析/gi,
    /不適合/gi,
    /不是命理/gi,
    /我無法提供/gi,
    /作為.*AI/gi
  ]
  
  const hasInappropriateContent = inappropriatePatterns.some(pattern => pattern.test(reply))
  
  if (hasInappropriateContent) {
    return `🙇‍♂️ 您的問題超出了八字命理的範疇，但別擔心！我們網站還有其他專業的命理系統可以為您解答：

📿 **紫微斗數** - 適合分析個性特質、人生格局
🔮 **占卜系統** - 適合詢問具體事件的發展
✨ **姓名學** - 適合分析姓名對運勢的影響  
📅 **擇日系統** - 適合選擇良辰吉日

您可以嘗試其他命理方式，或者換個角度用八字的觀點重新提問喔！`
  }
  
  return reply
}

// handleAdClick 已從 useAdGating 導入

// 快捷問題功能
const quickQuestions = [
  '我今年的事業運勢如何？有升遷機會嗎？',
  '從八字看我的財運走向？什麼時候財運最好？',
  '我的感情運如何？什麼時候會遇到正緣？',
  '從命盤看我適合什麼行業發展？',
  '我的健康需要注意什麼？有什麼養生建議？',
  '今年適合投資理財嗎？要注意什麼？'
]

// 引導用戶繼續提問的提示
const continuousQuestionHints = [
  '💡 您還可以問更深入的問題，比如：「我適合在哪個方位發展事業？」',
  '🔍 想了解更多細節嗎？可以問：「我的桃花何時出現？需要注意什麼？」',
  '⭐ 對運勢還有疑問？試試問：「我命中的貴人是什麼樣的人？」',
  '🌟 想知道更多開運方法？可以問：「我該如何提升自己的財運？」',
  '🎯 對未來發展好奇？不妨問：「我40歲後的運勢走向如何？」',
  '💫 想了解人際關係？可以問：「我在職場上需要防範哪些小人？」'
]

function askQuickQuestion(question: string) {
  if (canAskGPT.value) {
    userQuestion.value = question
    handleAskGPT()
  }
}

// 隨機獲取引導提示
function getRandomHint(): string {
  const randomIndex = Math.floor(Math.random() * continuousQuestionHints.length)
  return continuousQuestionHints[randomIndex]
}
</script>

<template>
  <div class="bazi-analysis">
    <!-- 頁面標題 -->
    <div class="page-header">
      <h1>☯️ 八字命理分析</h1>
      <p class="subtitle">透過生辰八字，探索您的命格奧秘</p>
    </div>

    <div v-if="isLoading" class="loading-section">
      <div class="loading-card">
        <h2>🔮 八老師正在分析中</h2>
        <div class="loading-animation">
          <div class="mystical-circle">
            <div class="bazi-symbols">
              <span class="symbol">☯️</span>
              <span class="symbol">☰</span>
              <span class="symbol">☱</span>
              <span class="symbol">☲</span>
              <span class="symbol">☳</span>
            </div>
            <div class="bazi-counter">
              <div class="bazi-item" v-for="n in 8" :key="n"></div>
            </div>
          </div>
          <p class="loading-text">正在分析您的命盤...</p>
        </div>
      </div>
    </div>

    <div v-else>
      <!-- 錯誤信息 -->
      <div v-if="errorMessages.length" class="error-box">
        <ul>
          <li v-for="msg in errorMessages" :key="msg">{{ msg }}</li>
        </ul>
      </div>

      <!-- 主要內容區域 -->
      <transition-group name="fade" tag="div">
        <div 
          v-for="(content, index) in sectionContents" 
          :key="content.title"
          v-show="content.show"
          class="result-section"
          :class="{ 'loading-section': content.loading }"
        >
          <h2>{{ content.title }}</h2>
          
          <!-- 載入動畫 -->
          <div v-if="content.loading" class="loading-animation">
            <div class="spinner"></div>
            <span>八老師解盤中</span>
          </div>
          
          <!-- 內容顯示 -->
          <template v-else>
            <pre v-if="preTagIndexes.includes(index)" class="pre-content">{{ content.text }}</pre>
            <div v-else-if="content.formattedText" class="formatted-content" v-html="content.formattedText"></div>
            <p v-else class="paragraph-content">{{ content.text }}</p>
          </template>
        </div>
      </transition-group>

      <!-- GPT 問答區域 -->
      <div class="gpt-question">
        <h3>🎯 繼續向八老師提問</h3>
        <p v-if="promptHint" class="gpt-hint">{{ promptHint }}</p>
        
        <!-- 動態引導提示 -->
        <div class="continuous-hint">
          <p>{{ getRandomHint() }}</p>
        </div>

        <!-- 快捷問題 -->
        <div class="quick-questions">
          <h4>🔥 熱門問題推薦：</h4>
          <button 
            v-for="question in quickQuestions" 
            :key="question"
            @click="askQuickQuestion(question)"
            :disabled="!canAskGPT"
            class="quick-question-btn"
          >
            {{ question }}
          </button>
        </div>

        <!-- 問答歷史 -->
        <div v-for="(chat, index) in questionHistory" :key="index" class="gpt-response">
          <strong>🙋‍♀️ 您的問題：</strong>
          <p>{{ chat.question }}</p>
          <strong>☯️ 八老師解答：</strong>
          <div class="formatted-gpt-answer" v-html="formatTextContent(chat.answer)"></div>
        </div>

        <!-- 問題輸入區 -->
        <div class="input-section">
          <h4>✍️ 請輸入您想了解的問題：</h4>
          <textarea 
            v-model="userQuestion" 
            :placeholder="isAsking ? '八老師正在思考中，請稍候...' : '例如：我明年適合轉職嗎？從八字看有什麼建議？'"
            :disabled="isAsking"
            @keydown.enter.ctrl="handleAskGPT"
            class="question-textarea"
          ></textarea>
          
          <div class="input-footer">
            <button 
              @click="handleAskGPT" 
              :disabled="!canAskGPT || !userQuestion.trim()"
              class="ask-btn"
            >
              <span v-if="isAsking">🔄 八老師解析中...</span>
              <span v-else>{{ getButtonText }}</span>
            </button>
            
            <small class="input-tip">💡 按 Ctrl + Enter 可快速送出問題</small>
          </div>
        </div>

        <!-- 專業提醒 -->
        <div class="professional-note">
          <p>📋 <strong>專業提醒：</strong>本站提供專業八字命理分析，如需其他命理諮詢，歡迎使用我們的紫微斗數、占卜系統、姓名學或擇日系統服務。</p>
        </div>

        <!-- 廣告橫幅 -->
        <div 
          class="ad-banner" 
          @click="handleAdClick"
          :class="{ 'ad-activated': adClicked }"
        >
          {{ adClicked ? '✅ 謝謝支持！您可以繼續免費提問' : '🎁 點擊觀看廣告，支持八老師繼續為您服務' }}
        </div>
      </div>

      <!-- 離開提醒對話框 -->
      <dialog v-if="showLeavePrompt" open class="leave-dialog">
        <button class="close-button" @click="cancelLeave" aria-label="關閉">❌</button>
        <h4>確認離開</h4>
        <p>現在離開的話資料將會消失喔，需要幫您轉成 PDF 嗎？</p>
        <div class="dialog-buttons">
          <button @click="handleExportToPDF" class="export-btn">是，轉成 PDF</button>
          <button @click="handleLeaveAnyway" class="leave-btn">否，我要離開</button>
          <button @click="cancelLeave" class="cancel-btn">取消</button>
        </div>
      </dialog>
    </div>
  </div>
</template>

<style scoped>
.bazi-analysis {
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

.loading-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.loading-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.loading-card h2 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 30px;
  border-bottom: 2px solid #8B5CF6;
  padding-bottom: 10px;
}

.loading {
  text-align: center;
  font-size: 18px;
  padding: 40px;
  color: #666;
}

.error-box {
  background: #ffe6e6;
  border: 1px solid #ffcccc;
  border-radius: 8px;
  padding: 16px;
  color: #cc0000;
  margin-bottom: 24px;
}

.error-box ul {
  margin: 0;
  padding-left: 20px;
}

/* 淡入動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.result-section {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  transition: all 0.3s ease;
  border-left: 4px solid #8B5CF6;
}

.result-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.2);
}

.result-section h2 {
  font-size: 1.4rem;
  color: #2c3e50;
  margin-bottom: 20px;
  border-left: 4px solid #8B5CF6;
  padding-left: 12px;
}

.pre-content,
.paragraph-content {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  margin: 0;
}

.pre-content {
  white-space: pre-wrap;
  font-family: 'Courier New', monospace;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

/* 格式化內容樣式 */
.formatted-content {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
}

.formatted-content .bazi-paragraph {
  margin: 16px 0;
  line-height: 1.8;
  color: #333;
}

.formatted-content .numbered-paragraph {
  margin-top: 28px;
  margin-bottom: 24px;
  padding-top: 20px;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
  border-top: 2px solid rgba(139, 92, 246, 0.3);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(248, 249, 255, 0.8));
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.1);
}

.formatted-content .numbered-paragraph:first-child {
  margin-top: 0;
  padding-top: 16px;
  border-top: none;
}

.formatted-content .bazi-paragraph strong {
  color: #8B5CF6;
  font-size: 1.1em;
  font-weight: 700;
  display: inline-block;
  margin-bottom: 8px;
  margin-right: 8px;
}

.formatted-content .numbered-paragraph strong {
  color: #7C3AED;
  font-size: 1.15em;
  font-weight: 700;
  display: block;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
}

.formatted-content .bazi-paragraph em {
  color: #7C3AED;
  font-style: italic;
  font-weight: 500;
}

.formatted-content .numbered-paragraph > strong + * {
  margin-top: 12px;
}

.qa-section {
  background: white;
  padding: 30px;
  border-radius: 16px;
  margin-top: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.qa-section h3 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-align: center;
  border-bottom: 2px solid #8B5CF6;
  padding-bottom: 10px;
}

.gpt-hint {
  color: #666;
  margin: 8px 0 16px;
  font-style: italic;
  background: #f0f9ff;
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 3px solid #4a90e2;
}

.quick-questions h4 {
  color: #2c3e50;
  margin-bottom: 12px;
  font-size: 15px;
}

.quick-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 20px 0;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 10px;
  border: 1px solid #eee;
}

.quick-question-btn {
  background: linear-gradient(135deg, #fff, #f8f9fa);
  border: 2px solid #8B5CF6;
  color: #8B5CF6;
  padding: 10px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(139, 92, 246, 0.1);
}

.quick-question-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.quick-question-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

textarea {
  width: 100%;
  min-height: 100px;
  margin: 16px 0;
  padding: 12px;
  font-family: inherit;
  border: 2px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

textarea:focus {
  outline: none;
  border-color: #8B5CF6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.ask-btn {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-right: 12px;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.ask-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
}

.ask-btn:disabled {
  background-color: #aaa;
  cursor: not-allowed;
  transform: none;
}

.ad-banner {
  margin-top: 24px;
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  text-align: center;
  padding: 20px;
  border-radius: 12px;
  border: 2px dashed #ffc107;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: #856404;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(255, 193, 7, 0.1);
}

.ad-banner:hover {
  background: linear-gradient(135deg, #ffeaa7, #ffd93d);
  transform: scale(1.02);
  box-shadow: 0 5px 15px rgba(255, 193, 7, 0.2);
}

.ad-banner.ad-activated {
  background: linear-gradient(135deg, #e8f5e8, #d4edda);
  border-color: #28a745;
  color: #155724;
  box-shadow: 0 3px 10px rgba(40, 167, 69, 0.2);
}

.qa-history {
  margin: 24px 0;
  background: linear-gradient(135deg, #f8f9ff, #e8f4f8);
  padding: 20px;
  border-left: 5px solid #8B5CF6;
  border-radius: 12px;
  animation: slideIn 0.5s ease;
  box-shadow: 0 3px 10px rgba(139, 92, 246, 0.1);
}

.question-item, .answer-item {
  margin-bottom: 15px;
}

.question-item strong, .answer-item strong {
  color: #2c3e50;
  font-size: 15px;
  display: block;
  margin-bottom: 8px;
}

.question-item p, .answer-item p {
  margin: 8px 0;
  white-space: pre-wrap;
  line-height: 1.6;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.gpt-response strong {
  color: #2c3e50;
  font-size: 15px;
  display: block;
  margin-bottom: 8px;
}

.gpt-response p {
  margin: 8px 0;
  white-space: pre-wrap;
}

.formatted-gpt-answer {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
}

.formatted-gpt-answer .formatted-paragraph {
  margin: 12px 0;
  line-height: 1.8;
  color: #333;
}

.formatted-gpt-answer .numbered-paragraph {
  margin-top: 20px;
  margin-bottom: 16px;
  padding: 12px 16px;
  border-left: 3px solid #8B5CF6;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(248, 249, 255, 0.8));
  border-radius: 6px;
}

.formatted-gpt-answer .formatted-paragraph strong {
  color: #8B5CF6;
  font-weight: 600;
}

.leave-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 32px;
  border: none;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  min-width: 360px;
  max-width: 500px;
}

.leave-dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
}

.close-button {
  position: absolute;
  top: 12px;
  right: 16px;
  border: none;
  background: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  padding: 4px;
}

.leave-dialog h4 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 18px;
}

.dialog-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.dialog-buttons button {
  flex: 1;
  min-width: 100px;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.export-btn {
  background-color: #28a745;
  color: white;
}

.export-btn:hover {
  background-color: #218838;
}

.leave-btn {
  background-color: #dc3545;
  color: white;
}

.leave-btn:hover {
  background-color: #c82333;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background-color: #5a6268;
}

/* 載入動畫樣式 */
.loading-section {
  position: relative;
  min-height: 120px;
}

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

.bazi-symbols {
  position: absolute;
  width: 100%;
  height: 100%;
}

.bazi-symbols .symbol {
  position: absolute;
  font-size: 2rem;
  color: #8B5CF6;
  animation: pulse 2s ease-in-out infinite;
}

.bazi-symbols .symbol:nth-child(1) { top: 10px; left: 50%; transform: translateX(-50%); animation-delay: 0s; }
.bazi-symbols .symbol:nth-child(2) { top: 50%; right: 10px; transform: translateY(-50%); animation-delay: 0.4s; }
.bazi-symbols .symbol:nth-child(3) { bottom: 10px; left: 50%; transform: translateX(-50%); animation-delay: 0.8s; }
.bazi-symbols .symbol:nth-child(4) { top: 50%; left: 10px; transform: translateY(-50%); animation-delay: 1.2s; }
.bazi-symbols .symbol:nth-child(5) { top: 50%; left: 50%; transform: translate(-50%, -50%); animation-delay: 1.6s; }

.bazi-counter {
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

.bazi-item {
  width: 8px;
  height: 8px;
  background: #8B5CF6;
  border-radius: 50%;
  margin: 1px;
  animation: baziAnimation 1.5s ease-in-out infinite;
}

.bazi-item:nth-child(1) { animation-delay: 0s; }
.bazi-item:nth-child(2) { animation-delay: 0.1s; }
.bazi-item:nth-child(3) { animation-delay: 0.2s; }
.bazi-item:nth-child(4) { animation-delay: 0.3s; }
.bazi-item:nth-child(5) { animation-delay: 0.4s; }
.bazi-item:nth-child(6) { animation-delay: 0.5s; }
.bazi-item:nth-child(7) { animation-delay: 0.6s; }
.bazi-item:nth-child(8) { animation-delay: 0.7s; }

.loading-text {
  font-size: 1.2rem;
  color: #8B5CF6;
  font-weight: 600;
  animation: pulse 2s ease-in-out infinite;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #f8f9ff;
  border-top: 3px solid #8B5CF6;
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
  margin-right: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

@keyframes baziAnimation {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.7; }
}

/* 引導提示樣式 */
.continuous-hint {
  background: linear-gradient(135deg, #fff9e6, #f0f9ff);
  border: 1px solid #ffd700;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 16px 0;
  font-size: 14px;
  color: #8b4513;
  box-shadow: 0 2px 4px rgba(255, 215, 0, 0.2);
}

.continuous-hint p {
  margin: 0;
  font-weight: 500;
}

/* 問題輸入區樣式 */
.input-section {
  margin-top: 24px;
}

.input-section h4 {
  color: #2c3e50;
  margin-bottom: 12px;
  font-size: 16px;
}

.question-textarea {
  width: 100%;
  min-height: 100px;
  margin: 12px 0;
  padding: 16px;
  font-family: inherit;
  border: 2px solid #ddd;
  border-radius: 12px;
  resize: vertical;
  font-size: 14px;
  line-height: 1.6;
  transition: all 0.3s ease;
  background: #fafafa;
}

.question-textarea:focus {
  outline: none;
  border-color: #8B5CF6;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.question-textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.7;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.ask-btn {
  background: linear-gradient(135deg, #d03c3c, #b83333);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(208, 60, 60, 0.3);
  min-width: 180px;
}

.ask-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #b83333, #a02929);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(208, 60, 60, 0.4);
}

.ask-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.input-tip {
  color: #888;
  font-style: italic;
}

/* 專業提醒樣式 */
.professional-note {
  margin-top: 24px;
  background: #f8f9fa;
  border-left: 4px solid #28a745;
  padding: 16px;
  border-radius: 6px;
  font-size: 13px;
  color: #495057;
}

.professional-note p {
  margin: 0;
  line-height: 1.6;
}
@media (max-width: 768px) {
  .bazi-analysis {
    padding: 16px;
  }
  
  .page-header {
    padding: 30px 16px;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .result-section, .qa-section {
    padding: 20px;
  }
  
  .mystical-circle {
    width: 150px;
    height: 150px;
  }
  
  .bazi-symbols .symbol {
    font-size: 1.5rem;
  }
  
  .quick-questions {
    flex-direction: column;
  }
  
  .quick-question-btn {
    width: 100%;
    margin-bottom: 8px;
  }
  
  .dialog-buttons {
    flex-direction: column;
  }
  
  .leave-dialog {
    min-width: 300px;
    margin: 20px;
  }
}
</style>