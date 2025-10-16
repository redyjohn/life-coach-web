<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount, nextTick, defineComponent } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { getZiWeiAll, askZiWeiGPT } from '@/services/gptService'
import { useAdGating } from '@/composables/useAdGating'

const route = useRoute()
const router = useRouter()

const userData = ref(route.query)
const lunarInfo = ref({})
const isLoading = ref(true)
const error = ref('')
const activeTab = ref('chart')

const chartData = ref({
  chart: '',
  analysis: '',
  annualLuck: '',
  decadeLuck: ''
})

const showUserCard = ref(false)
const showChart = ref(false)
const showAnalysis = ref(false)
const showLuck = ref(false)
const showGPT = ref(false)

// 問答系統重新設計
const gptData = ref({
  conversations: [] as Array<{
    id: number,
    question: string,
    answer: string,
    isAnswering: boolean,
    timestamp: Date,
    showInput: boolean
  }>,
  nextId: 1
})

const promptHint = ref('')

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

const defaultFallbackReply = '🙇‍♂️ 非常抱歉，您所提的問題無法用紫微斗數解析，您要不要試試看我們其他 AI 老師的服務？'

const showLeavePrompt = ref(false)
const allowLeave = ref(false)

const parseLunarInfo = () => {
  try {
    const lunarParam = route.query.lunarInfo as string
    if (lunarParam) {
      // 正確的解析方式：先 decodeURIComponent 再 JSON.parse
      lunarInfo.value = JSON.parse(decodeURIComponent(lunarParam))
    }
  } catch (e) {
    console.error('解析農曆失敗:', e)
    error.value = '數據解析失敗，請重新填寫表單'
  }
}

const fetchZiWeiData = async () => {
  try {
    isLoading.value = true
    const result = await getZiWeiAll(userData.value, lunarInfo.value)
    if (!result || !result.chart) throw new Error('命盤數據獲取失敗')

    chartData.value = {
      chart: result.chart,
      analysis: result.analysis || '暫無分析數據',
      annualLuck: result.annualLuck || '暫無流年運勢數據',
      decadeLuck: result.decadeLuck || '暫無大限運勢數據'
    }

    try {
      promptHint.value = await askZiWeiGPT(
        '請用一句親切話語，引導使用者針對紫微斗數命盤提問，例如：「你可以問接下來的愛情運如何喔」',
        userData.value
      )
    } catch {
      promptHint.value = '你可以詢問關於命盤、運勢、感情、事業等問題喔！'
    }

    setTimeout(() => { showUserCard.value = true }, 200)
    setTimeout(() => { showChart.value = true }, 700)
    setTimeout(() => { showAnalysis.value = true }, 1200)
    setTimeout(() => { showLuck.value = true }, 1700)
    setTimeout(() => { 
      showGPT.value = true
      // 初始化第一個提問區塊
      initializeFirstQuestion()
    }, 2200)
  } catch (e: any) {
    error.value = e.message || '獲取資料失敗，請稍後重試'
  } finally {
    isLoading.value = false
  }
}

const initializeFirstQuestion = () => {
  gptData.value.conversations.push({
    id: gptData.value.nextId++,
    question: '',
    answer: '',
    isAnswering: false,
    timestamp: new Date(),
    showInput: true
  })
}

const handleAskGPT = async (conversationId: number, question: string) => {
  if (!canAsk.value || !question.trim()) return

  const conversation = gptData.value.conversations.find(c => c.id === conversationId)
  if (!conversation) return

  // 設置當前對話
  conversation.question = question.trim()
  conversation.isAnswering = true
  conversation.answer = '⏳ AI 老師思考中...'
  conversation.showInput = false
  handleQuestionAsked()

  try {
    const context = {
      ...userData.value,
      lunarInfo: lunarInfo.value,
      history: gptData.value.conversations
        .filter(c => c.question && c.answer && !c.answer.startsWith('⏳'))
        .map(c => ({ q: c.question, a: c.answer }))
    }

    const reply = await askZiWeiGPT(question, context)
    
    const fallback = ['無法回答', '不確定', '無法解析', '不適合', '不是命理']
    const isFallback = fallback.some(k => reply.toLowerCase().includes(k))
    
    conversation.answer = isFallback ? defaultFallbackReply : reply
    
    // 等待DOM更新後滾動到答案
    await nextTick()
    setTimeout(() => {
      const answerElement = document.querySelector(`[data-answer-id="${conversationId}"]`)
      if (answerElement) {
        answerElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 300)
    
    // 生成新的提問區塊
    setTimeout(() => {
      gptData.value.conversations.push({
        id: gptData.value.nextId++,
        question: '',
        answer: '',
        isAnswering: false,
        timestamp: new Date(),
        showInput: true
      })
      
      // 滾動到新的提問區塊
      setTimeout(() => {
        const newInputElement = document.querySelector('.question-input:last-of-type textarea')
        if (newInputElement) {
          newInputElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    }, 1000)
    
  } catch (error) {
    conversation.answer = '❌ 無法取得回覆，請稍後再試。'
  } finally {
    conversation.isAnswering = false
  }
}

// handleAdClick 已從 useAdGating 導入

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
  parseLunarInfo()
  fetchZiWeiData()
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

onBeforeRouteLeave((to, from, next) => {
  if (allowLeave.value) next()
  else {
    showLeavePrompt.value = true
    next(false)
  }
})

function handleBeforeUnload(e: BeforeUnloadEvent) {
  e.preventDefault()
  e.returnValue = ''
  showLeavePrompt.value = true
}

function handleExportToPDF() {
  showLeavePrompt.value = false
  window.open('https://your-ad-link.com', '_blank')
  setTimeout(() => window.print(), 1000)
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

const formattedUserInfo = computed(() => {
  const info = userData.value
  return {
    name: info.name || '未知',
    gender: info.gender || '未知',
    birthDate: info.birthDate || '未知',
    birthTime: info.birthTime || '未知',
    birthPlace: info.birthPlace || '未知'
  }
})

const hasValidData = computed(() => chartData.value.chart && !error.value)

// 定義 props 類型
interface QuestionInputProps {
  conversationId: number
  canAsk: boolean
  isAnswering: boolean
}

// 定義 emit 類型
interface QuestionInputEmits {
  ask: (conversationId: number, question: string) => void
}

const QuestionInput = defineComponent({
  props: {
    conversationId: {
      type: Number,
      required: true
    },
    canAsk: {
      type: Boolean,
      required: true
    },
    isAnswering: {
      type: Boolean,
      required: true
    }
  },
  emits: ['ask'],
  setup(props: QuestionInputProps, { emit }: { emit: (event: 'ask', conversationId: number, question: string) => void }) {
    const question = ref('')
    
    const handleSubmit = () => {
      if (props.canAsk && question.value.trim() && !props.isAnswering) {
        emit('ask', props.conversationId, question.value)
        question.value = ''
      }
    }
    
    return {
      question,
      handleSubmit
    }
  },
  template: `
    <div class="question-input-component">
      <textarea 
        v-model="question"
        placeholder="請輸入你的紫微命理問題..."
        :disabled="!canAsk || isAnswering"
        @keydown.ctrl.enter="handleSubmit"
        rows="3"
      ></textarea>
      <button 
        @click="handleSubmit"
        :disabled="!canAsk || !question.trim() || isAnswering"
        class="submit-button"
      >
        <span v-if="isAnswering">⏳ AI 老師思考中...</span>
        <span v-else>{{ getButtonText }}</span>
      </button>
      <div class="input-hint">💡 按 Ctrl + Enter 快速送出</div>
    </div>
  `
})
</script>

<template>
  <div class="ziwei-result">
    <div v-if="isLoading">🔮 正在為您生成紫微命盤，請稍候... 🔮</div>

    <div v-else>
      <div v-if="error">
        <h3>⚠️ {{ error }}</h3>
        <button @click="fetchZiWeiData">重試</button>
      </div>

      <div v-else-if="hasValidData">
        <div v-if="showUserCard">
          <h2>{{ formattedUserInfo.name }} 的紫微命盤</h2>
        </div>

        <div v-if="showChart" class="tab-buttons">
          <button @click="activeTab = 'chart'" :class="{ active: activeTab === 'chart' }">📊 命盤</button>
          <button @click="activeTab = 'analysis'" :class="{ active: activeTab === 'analysis' }">🔍 分析</button>
          <button @click="activeTab = 'luck'" :class="{ active: activeTab === 'luck' }">🌟 運勢</button>
          <button @click="activeTab = 'gpt'" :class="{ active: activeTab === 'gpt' }">💬 問答</button>
        </div>

        <div class="tab-content">
          <div v-if="activeTab === 'chart'" class="chart-content">
            <pre>{{ chartData.chart }}</pre>
          </div>
          
          <div v-if="activeTab === 'analysis'" class="analysis-content">
            <p>{{ chartData.analysis }}</p>
          </div>
          
          <div v-if="activeTab === 'luck'" class="luck-content">
            <h3>流年運勢</h3>
            <p>{{ chartData.annualLuck }}</p>
            <h3>大限運勢</h3>
            <p>{{ chartData.decadeLuck }}</p>
          </div>

          <div v-if="activeTab === 'gpt'" class="gpt-container">
            <!-- 提示語 -->
            <div v-if="promptHint && gptData.conversations.length <= 1" class="gpt-hint">
              <div class="hint-content">
                <span class="hint-icon">💫</span>
                <div class="hint-text">{{ promptHint }}</div>
              </div>
            </div>

            <!-- 問答序列 -->
            <div class="conversation-flow">
              <template v-for="(conversation, index) in gptData.conversations" :key="conversation.id">
                
                <!-- 提問區塊 -->
                <div v-if="conversation.showInput" class="question-input" :data-question-id="conversation.id">
                  <div class="input-header">
                    <span class="question-number">第 {{ index + 1 }} 個問題</span>
                    <span class="question-status">{{ getStatusText }}</span>
                  </div>

                  <!-- 廣告區塊 -->
                  <div v-if="needsAd && index === gptData.conversations.length - 1" class="ad-section">
                    <div class="ad-banner" @click="handleAdClick">
                      <div class="ad-content">
                        <span class="ad-icon">🎬</span>
                        <div class="ad-text">
                          <div class="ad-title">點擊觀看廣告解鎖提問</div>
                          <div class="ad-subtitle">支持我們繼續為您服務</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="input-container">
                    <QuestionInput 
                      :conversation-id="conversation.id"
                      :can-ask="canAsk && index === gptData.conversations.length - 1"
                      :is-answering="conversation.isAnswering"
                      @ask="handleAskGPT"
                    />
                  </div>
                </div>

                <!-- 答案區塊 -->
                <div v-if="conversation.question" class="answer-block" :data-answer-id="conversation.id">
                  <div class="answer-header">
                    <div class="question-display">
                      <span class="question-label">❓ 你的問題：</span>
                      <div class="question-text">{{ conversation.question }}</div>
                    </div>
                    <div class="answer-time">{{ conversation.timestamp.toLocaleTimeString() }}</div>
                  </div>
                  
                  <div class="answer-content">
                    <div class="answer-label">💬 AI 老師回覆：</div>
                    <div class="answer-text" :class="{ loading: conversation.isAnswering }">
                      <div v-if="conversation.answer.startsWith('⏳')" class="loading-answer">
                        {{ conversation.answer }}
                      </div>
                      <div v-else class="formatted-answer">{{ conversation.answer }}</div>
                    </div>
                  </div>
                </div>

              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <dialog v-if="showLeavePrompt" open>
      <p>現在離開資料將會消失，轉成 PDF 嗎？</p>
      <button @click="handleExportToPDF">是，轉 PDF</button>
      <button @click="handleLeaveAnyway">否，我要離開</button>
      <button @click="cancelLeave">取消</button>
    </dialog>
  </div>
</template>

<style scoped>
.ziwei-result { 
  padding: 20px; 
  font-family: 'Microsoft JhengHei'; 
  max-width: 900px; 
  margin: auto; 
  background: #f7f9fc; 
}

.tab-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
}

.tab-buttons button {
  padding: 10px 16px;
  background: #f0f0f0;
  color: #666;
  border: none;
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-buttons button.active {
  background: #764ba2;
  color: white;
}

.tab-buttons button:hover {
  background: #9575cd;
  color: white;
}

.tab-content {
  min-height: 400px;
}

/* GPT 問答區域 */
.gpt-container {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.gpt-hint {
  margin-bottom: 30px;
  background: linear-gradient(135deg, #fff9c4, #fff3a0);
  border-radius: 15px;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(251, 192, 45, 0.2);
}

.hint-content {
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 15px;
}

.hint-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.hint-text {
  flex: 1;
  color: #856404;
  font-weight: 500;
  line-height: 1.5;
}

.conversation-flow {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* 提問區塊 */
.question-input {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 20px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.question-input:hover {
  border-color: #764ba2;
  box-shadow: 0 4px 12px rgba(118, 75, 162, 0.1);
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.question-number {
  font-weight: 600;
  color: #495057;
  font-size: 16px;
}

.question-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.question-status:has-text("免費") {
  background: #d4edda;
  color: #155724;
}

.question-status:has-text("廣告") {
  background: #f8d7da;
  color: #721c24;
}

/* 廣告區塊 */
.ad-section {
  margin-bottom: 20px;
}

.ad-banner {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  border-radius: 12px;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.ad-banner:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.ad-content {
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 15px;
}

.ad-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.ad-text {
  flex: 1;
  color: white;
}

.ad-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.ad-subtitle {
  font-size: 14px;
  opacity: 0.9;
}

/* 輸入組件 */
.question-input-component textarea {
  width: 100%;
  min-height: 80px;
  padding: 15px;
  border: 2px solid #dee2e6;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s ease;
}

.question-input-component textarea:focus {
  outline: none;
  border-color: #764ba2;
  box-shadow: 0 0 0 3px rgba(118, 75, 162, 0.1);
}

.question-input-component textarea:disabled {
  background: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

.submit-button {
  width: 100%;
  padding: 15px;
  background: #764ba2;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
  transition: all 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  background: #9575cd;
  transform: translateY(-1px);
}

.submit-button:disabled {
  background: #adb5bd;
  cursor: not-allowed;
  transform: none;
}

.input-hint {
  text-align: center;
  font-size: 12px;
  color: #6c757d;
  margin-top: 8px;
}

/* 答案區塊 */
.answer-block {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-left: 5px solid #764ba2;
}

.answer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 20px;
}

.question-display {
  flex: 1;
}

.question-label {
  color: #6c757d;
  font-size: 14px;
  font-weight: 500;
  display: block;
  margin-bottom: 8px;
}

.question-text {
  color: #495057;
  font-weight: 500;
  line-height: 1.5;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
}

.answer-time {
  color: #adb5bd;
  font-size: 12px;
  flex-shrink: 0;
}

.answer-content {
  border-top: 1px solid #e9ecef;
  padding-top: 20px;
}

.answer-label {
  color: #764ba2;
  font-weight: 600;
  margin-bottom: 15px;
  display: block;
}

.answer-text {
  background: #fafbfc;
  border-radius: 10px;
  padding: 20px;
  border-left: 4px solid #764ba2;
}

.loading-answer {
  color: #6c757d;
  font-style: italic;
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 10px;
}

.formatted-answer {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.8;
  color: #333;
  font-size: 15px;
}

/* 其他內容區域樣式 */
.chart-content, .analysis-content, .luck-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.luck-content h3 {
  color: #764ba2;
  margin-top: 20px;
  margin-bottom: 10px;
}

.luck-content h3:first-child {
  margin-top: 0;
}

pre { 
  white-space: pre-wrap; 
  word-break: break-word; 
  font-size: 14px; 
  line-height: 1.6; 
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  margin: 0;
}

button { 
  padding: 10px 16px; 
  background: #764ba2; 
  color: white; 
  border: none; 
  border-radius: 6px; 
  margin-top: 8px; 
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background: #9575cd;
}

button:disabled { 
  background: #aaa; 
  cursor: not-allowed; 
}

dialog { 
  padding: 20px; 
  border-radius: 10px; 
  border: 1px solid #ccc; 
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .ziwei-result {
    padding: 15px;
  }
  
  .tab-buttons {
    flex-wrap: wrap;
  }
  
  .tab-buttons button {
    flex: 1;
    min-width: 80px;
  }
  
  .answer-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .ad-content {
    padding: 15px;
  }
  
  .hint-content {
    padding: 15px;
  }
}
</style>