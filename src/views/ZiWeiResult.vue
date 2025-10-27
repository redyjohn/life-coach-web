<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import {
  getZiWeiChart,
  getZiWeiAnalysis,
  getZiWeiAnnualLuck,
  getZiWeiDecadeLuck,
  askZiWeiGPT
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
  show: boolean
  loading?: boolean
}

const route = useRoute()
const router = useRouter()
const userData = route.query as UserData

// 數據狀態
const ziWeiChart = ref('')
const ziWeiAnalysis = ref('')
const annualLuck = ref('')
const decadeLuck = ref('')

// UI 狀態
const isLoading = ref(true)
const errorMessages = ref<string[]>([])
const showQuotaWarning = ref(false)

// 載入狀態追蹤 - 初始化時所有區塊都設為載入中
const loadingStates = ref({
  ziWeiChart: true,
  ziWeiAnalysis: true,
  annualLuck: true,
  decadeLuck: true
})

// 區塊顯示狀態 - 控制區塊的出現動畫
const sectionVisibility = ref({
  ziWeiChart: false,
  ziWeiAnalysis: false,
  annualLuck: false,
  decadeLuck: false
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

const defaultFallbackReply = '🙇‍♂️ 非常抱歉，您所提的問題無法用紫微斗數解析，您要不要試試看我們其他命理老師的服務？'

// 響應式的內容數組 - 控制區塊顯示和載入狀態
const sectionContents = computed<SectionContent[]>(() => [
  { title: '一、紫微命盤', text: ziWeiChart.value, show: sectionVisibility.value.ziWeiChart, loading: loadingStates.value.ziWeiChart },
  { title: '二、命盤分析', text: ziWeiAnalysis.value, show: sectionVisibility.value.ziWeiAnalysis, loading: loadingStates.value.ziWeiAnalysis },
  { title: '三、流年運勢', text: annualLuck.value, show: sectionVisibility.value.annualLuck, loading: loadingStates.value.annualLuck },
  { title: '四、大限運勢', text: decadeLuck.value, show: sectionVisibility.value.decadeLuck, loading: loadingStates.value.decadeLuck }
])

// 需要使用 pre 標籤的索引
const preTagIndexes = [0]

// 農曆資訊解析
const lunarInfo = ref({})
const parseLunarInfo = () => {
  try {
    const lunarParam = route.query.lunarInfo as string
    if (lunarParam) {
      lunarInfo.value = JSON.parse(decodeURIComponent(lunarParam))
    }
  } catch (e) {
    console.error('解析農曆失敗:', e)
    errorMessages.value.push('❌ 農曆數據解析失敗，請重新填寫表單')
  }
}

onMounted(async () => {
  window.addEventListener('beforeunload', handleBeforeUnload)
  
  // 解析農曆資訊
  parseLunarInfo()
  
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
      promptHint.value = await askZiWeiGPT(
        '請用一句親切話語，引導使用者針對紫微斗數命盤提問，例如：「你可以問接下來的愛情運如何喔」',
        userData
      )
    } catch (error) {
      console.warn('獲取提示語失敗:', error)
      promptHint.value = '你可以詢問關於命盤、運勢、感情、事業等問題喔！'
    }

    // 開始載入各個區塊的內容
    loadAllSections()
    
  } catch (error) {
    console.error('初始化失敗:', error)
    errorMessages.value.push('❌ 系統初始化失敗，請重新整理頁面')
    isLoading.value = false
  }
  
  console.log('✅ ZiWeiResult mounted')
})

// 載入所有區塊內容的函數
async function loadAllSections() {
  // 立即顯示所有區塊標題
  showAllSections()
  
  // 同時開始載入基礎數據
  Promise.all([
    loadZiWeiChartData(),
    loadZiWeiAnalysisData()
  ])

  // 延遲載入運勢分析
  setTimeout(() => {
    loadAnnualLuckData()
  }, 1000)

  setTimeout(() => {
    loadDecadeLuckData()
  }, 2000)
}

// 顯示所有區塊標題的函數
function showAllSections() {
  // 立即顯示所有區塊
  sectionVisibility.value.ziWeiChart = true
  sectionVisibility.value.ziWeiAnalysis = true
  sectionVisibility.value.annualLuck = true
  sectionVisibility.value.decadeLuck = true
}

// 個別載入函數
async function loadZiWeiChartData() {
  try {
    const result = await getZiWeiChart(userData, lunarInfo.value)
    ziWeiChart.value = result || '命盤數據獲取失敗'
    console.log('🔥 getZiWeiChart 回傳：', result)
  } catch (error) {
    console.error('獲取紫微命盤失敗:', error)
    if (error instanceof Error) {
      if (error.message.includes('配額') || error.message.includes('quota')) {
        ziWeiChart.value = '⚠️ API 配額已用完，請聯繫管理員或稍後再試'
        showQuotaWarning.value = true
      } else if (error.message.includes('頻繁') || error.message.includes('rate_limit')) {
        ziWeiChart.value = '⚠️ 請求過於頻繁，請稍後再試'
      } else {
        ziWeiChart.value = '⚠️ 紫微命盤數據獲取失敗，請稍後重試'
      }
    } else {
      ziWeiChart.value = '⚠️ 紫微命盤數據獲取失敗，請稍後重試'
    }
  } finally {
    loadingStates.value.ziWeiChart = false
  }
}

async function loadZiWeiAnalysisData() {
  try {
    const result = await getZiWeiAnalysis(userData)
    ziWeiAnalysis.value = result || '命盤分析獲取失敗'
  } catch (error) {
    console.error('獲取命盤分析失敗:', error)
    if (error instanceof Error) {
      if (error.message.includes('配額') || error.message.includes('quota')) {
        ziWeiAnalysis.value = '⚠️ API 配額已用完，請聯繫管理員或稍後再試'
      } else if (error.message.includes('頻繁') || error.message.includes('rate_limit')) {
        ziWeiAnalysis.value = '⚠️ 請求過於頻繁，請稍後再試'
      } else {
        ziWeiAnalysis.value = '⚠️ 命盤分析獲取失敗，請稍後重試'
      }
    } else {
      ziWeiAnalysis.value = '⚠️ 命盤分析獲取失敗，請稍後重試'
    }
  } finally {
    loadingStates.value.ziWeiAnalysis = false
  }
}

async function loadAnnualLuckData() {
  try {
    const result = await getZiWeiAnnualLuck(userData)
    annualLuck.value = result || '流年運勢獲取失敗'
  } catch (error) {
    console.error('獲取流年運勢失敗:', error)
    if (error instanceof Error) {
      if (error.message.includes('配額') || error.message.includes('quota')) {
        annualLuck.value = '⚠️ API 配額已用完，請聯繫管理員或稍後再試'
      } else if (error.message.includes('頻繁') || error.message.includes('rate_limit')) {
        annualLuck.value = '⚠️ 請求過於頻繁，請稍後再試'
      } else {
        annualLuck.value = '⚠️ 流年運勢獲取失敗，請稍後重試'
      }
    } else {
      annualLuck.value = '⚠️ 流年運勢獲取失敗，請稍後重試'
    }
  } finally {
    loadingStates.value.annualLuck = false
  }
}

async function loadDecadeLuckData() {
  try {
    const result = await getZiWeiDecadeLuck(userData)
    decadeLuck.value = result || '大限運勢獲取失敗'
  } catch (error) {
    console.error('獲取大限運勢失敗:', error)
    if (error instanceof Error) {
      if (error.message.includes('配額') || error.message.includes('quota')) {
        decadeLuck.value = '⚠️ API 配額已用完，請聯繫管理員或稍後再試'
      } else if (error.message.includes('頻繁') || error.message.includes('rate_limit')) {
        decadeLuck.value = '⚠️ 請求過於頻繁，請稍後再試'
      } else {
        decadeLuck.value = '⚠️ 大限運勢獲取失敗，請稍後重試'
      }
    } else {
      decadeLuck.value = '⚠️ 大限運勢獲取失敗，請稍後重試'
    }
  } finally {
    loadingStates.value.decadeLuck = false
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
    answer: '⏳ 紫薇老師思考中...' 
  })
  
  userQuestion.value = ''

  try {
    let reply = await askZiWeiGPT(currentQ, userData)
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
      questionHistory.value[lastIndex].answer = '❌ 紫薇老師暫時無法回應，請稍後再試。'
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
    return `🙇‍♂️ 您的問題超出了紫微斗數的範疇，但別擔心！我們網站還有其他專業的命理系統可以為您解答：

📿 **八字命理** - 適合分析個性特質、人生格局
🔮 **占卜系統** - 適合詢問具體事件的發展
✨ **姓名學** - 適合分析姓名對運勢的影響  
📅 **擇日系統** - 適合選擇良辰吉日

您可以嘗試其他命理方式，或者換個角度用紫微斗數的觀點重新提問喔！`
  }
  
  return reply
}

// 快捷問題功能
const quickQuestions = [
  '我今年的愛情運勢如何？什麼時候會遇到正緣？',
  '從紫微命盤看我的事業發展？什麼時候適合轉職？',
  '我的財運走向如何？什麼時候財運最好？',
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
  <div class="result">
    <div v-if="isLoading" class="loading">
      🔮 正在分析您的紫微命盤，請稍候... 🔮
    </div>

    <div v-else>
      <!-- 錯誤信息 -->
      <div v-if="errorMessages.length" class="error-box">
        <ul>
          <li v-for="msg in errorMessages" :key="msg">{{ msg }}</li>
        </ul>
      </div>

      <!-- API 配額警告 -->
      <div v-if="showQuotaWarning" class="quota-warning">
        <h3>⚠️ API 配額不足</h3>
        <p>目前 OpenAI API 配額已用完，部分功能可能無法正常使用。</p>
        <p>請聯繫管理員或稍後再試。您仍可以查看已載入的內容。</p>
        <button @click="showQuotaWarning = false" class="close-warning">知道了</button>
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
            <span>紫薇老師解盤中</span>
        </div>

          <!-- 內容顯示 -->
          <template v-else>
            <pre v-if="preTagIndexes.includes(index)" class="pre-content">{{ content.text }}</pre>
            <p v-else class="paragraph-content">{{ content.text }}</p>
          </template>
          </div>
      </transition-group>

      <!-- GPT 問答區域 -->
      <div class="gpt-question">
        <h3>🎯 繼續向紫薇老師提問</h3>
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
          <strong>🔮 紫薇老師解答：</strong>
          <p>{{ chat.answer }}</p>
            </div>

        <!-- 問題輸入區 -->
        <div class="input-section">
          <h4>✍️ 請輸入您想了解的問題：</h4>
          <textarea 
            v-model="userQuestion" 
            :placeholder="isAsking ? '紫薇老師正在思考中，請稍候...' : '例如：我明年適合轉職嗎？從紫微命盤看有什麼建議？'"
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
              <span v-if="isAsking">🔄 紫薇老師解析中...</span>
              <span v-else>{{ getButtonText }}</span>
            </button>
            
            <small class="input-tip">💡 按 Ctrl + Enter 可快速送出問題</small>
                    </div>
                  </div>

        <!-- 專業提醒 -->
        <div class="professional-note">
          <p>📋 <strong>專業提醒：</strong>本站提供專業紫微斗數分析，如需其他命理諮詢，歡迎使用我們的八字命理、占卜系統、姓名學或擇日系統服務。</p>
        </div>

        <!-- 廣告橫幅 -->
        <div 
          class="ad-banner" 
          @click="handleAdClick"
          :class="{ 'ad-activated': adClicked }"
        >
          {{ adClicked ? '✅ 謝謝支持！您可以繼續免費提問' : '🎁 點擊觀看廣告，支持紫薇老師繼續為您服務' }}
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
.result {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px; 
  font-family: 'Microsoft JhengHei', sans-serif;
  background-color: #f7f9fc;
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

.quota-warning {
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  border: 2px solid #ffc107;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.2);
}

.quota-warning h3 {
  margin: 0 0 12px 0;
  color: #856404;
  font-size: 18px;
}

.quota-warning p {
  margin: 8px 0;
  color: #856404;
  line-height: 1.6;
}

.close-warning {
  background: #ffc107;
  color: #856404;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 12px;
  transition: all 0.2s ease;
}

.close-warning:hover {
  background: #e0a800;
  transform: translateY(-1px);
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
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 28px;
  transition: all 0.3s ease;
}

.result-section:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

h2 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 16px;
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

.gpt-question {
  background: #fff7f0;
  padding: 24px;
  border-radius: 12px;
  margin-top: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.gpt-question h3 {
  margin-top: 0;
  color: #2c3e50;
}

.gpt-hint {
  color: #666;
  margin: 8px 0 16px;
  font-style: italic;
  background: #f0f9ff;
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 3px solid #8B5CF6;
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
}

textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.ask-btn {
  background-color: #8B5CF6;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-right: 12px;
}

.ask-btn:hover:not(:disabled) {
  background-color: #7C3AED;
  transform: translateY(-1px);
}

.ask-btn:disabled {
  background-color: #aaa;
  cursor: not-allowed;
  transform: none;
}

.ad-banner {
  margin-top: 24px;
  background: linear-gradient(135deg, #fff0f0, #ffe6e6);
  text-align: center;
  padding: 20px;
  border-radius: 12px;
  border: 2px dashed #8B5CF6;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: #7C3AED;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(139, 92, 246, 0.1);
}

.ad-banner:hover {
  background: linear-gradient(135deg, #ffe6e6, #ffd6d6);
  transform: scale(1.02);
  box-shadow: 0 5px 15px rgba(139, 92, 246, 0.2);
}

.ad-banner.ad-activated {
  background: linear-gradient(135deg, #e8f5e8, #d4edda);
  border-color: #28a745;
  color: #155724;
  box-shadow: 0 3px 10px rgba(40, 167, 69, 0.2);
}

.gpt-response {
  margin: 24px 0;
  background: linear-gradient(135deg, #f0f9ff, #e6f3ff);
  padding: 20px;
  border-left: 5px solid #8B5CF6;
  border-radius: 12px;
  animation: slideIn 0.5s ease;
  box-shadow: 0 3px 10px rgba(139, 92, 246, 0.1);
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
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #8B5CF6;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(135deg, #f3f0ff, #ede9fe);
  border-radius: 8px;
  border: 2px dashed #8B5CF6;
  margin: 16px 0;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #ede9fe;
  border-top: 3px solid #8B5CF6;
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
  margin-right: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white; 
  border: none; 
  padding: 14px 24px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  min-width: 180px;
}

.ask-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #7C3AED, #6D28D9);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
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
  .result {
    margin: 20px auto;
    padding: 16px;
  }
  
  .result-section {
    padding: 16px;
  }
  
  .gpt-question {
    padding: 16px;
  }
  
  .quick-questions {
    flex-direction: column;
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