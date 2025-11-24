<template>
  <div class="tarot-divination">
    <!-- 頁面標題 -->
    <div class="page-header">
      <h1>🃏 塔羅牌占卜</h1>
      <p class="subtitle">透過神秘的塔羅牌，探索內心深處的指引</p>
    </div>

    <!-- 用戶資料輸入 -->
    <div class="user-info-section">
      <h2>基本資料</h2>
      <div class="form-wrapper">
        <div class="form-group">
          <label class="form-label">姓名</label>
          <input 
            v-model="userData.name" 
            type="text" 
            class="form-input" 
            placeholder="請輸入您的姓名"
          >
        </div>
        <div class="form-group">
          <label class="form-label">性別</label>
          <select v-model="userData.gender" class="form-select">
            <option value="">請選擇</option>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">出生日期</label>
          <input 
            v-model="userData.birthDate" 
            type="date" 
            class="form-input"
          >
        </div>
      </div>
    </div>

    <!-- 占卜問題輸入 -->
    <div class="question-section">
      <h2>占卜問題</h2>
      <div class="question-wrapper">
        <textarea 
          v-model="question" 
          class="question-textarea"
          placeholder="請在心中專注地思考您想要了解的問題，然後在此輸入..."
          rows="4"
        ></textarea>
        
        <!-- 快捷問題 -->
        <div class="quick-questions">
          <h3>常見問題：</h3>
          <button 
            v-for="quickQ in quickQuestions" 
            :key="quickQ"
            @click="question = quickQ"
            class="quick-question-btn"
          >
            {{ quickQ }}
          </button>
        </div>
      </div>
    </div>

    <!-- 開始占卜按鈕 -->
    <div class="divination-action">
      <button 
        @click="startDivination" 
        :disabled="!canStartDivination"
        class="start-btn"
      >
        <span v-if="isDivining">🔮 占卜師解讀中...</span>
        <span v-else>🔮 開始塔羅牌占卜</span>
      </button>
    </div>

    <!-- 抽牌動畫區域 -->
    <div v-if="isDrawing" class="drawing-section">
      <h2>🔮 正在抽牌...</h2>
      <div class="drawing-animation">
        <div class="mystical-circle">
          <div class="spinning-cards">
            <div v-for="n in 3" :key="n" class="spinning-card">🃏</div>
          </div>
          <div class="drawing-text">占卜師正在為您抽取塔羅牌</div>
        </div>
      </div>
    </div>

    <!-- 抽到的卡牌 -->
    <div v-if="drawnCards.length > 0" class="cards-section">
      <h2>🃏 抽到的卡牌</h2>
      <div class="spread-info">
        <h3>{{ spreadInfo.name }}</h3>
        <p>{{ spreadInfo.description }}</p>
      </div>
      <div class="cards-container">
        <SimpleTarotCard 
          v-for="(card, index) in drawnCards" 
          :key="card.id"
          :card="card"
        />
      </div>
      <div class="cards-actions">
        <button @click="flipAllCards" class="flip-btn">
          🔄 翻開所有卡牌
        </button>
        <button @click="getDivinationResult" class="interpret-btn">
          🔮 開始解讀
        </button>
      </div>
    </div>

    <!-- 占卜結果 -->
    <div v-if="divinationResult" class="result-section">
      <h2>🔮 占卜結果</h2>
      <div class="result-content">
        <div class="result-text">{{ divinationResult }}</div>
      </div>
    </div>

    <!-- 繼續問答 -->
    <div v-if="divinationResult" class="qa-section">
      <h3>🎯 繼續向占卜師提問</h3>
      
      <!-- 問答歷史（答案顯示） -->
      <div v-for="(chat, index) in questionHistory" :key="index" class="qa-history">
        <div class="question-item">
          <strong>🙋‍♀️ 您的問題：</strong>
          <p>{{ chat.question }}</p>
        </div>
        <div class="answer-item">
          <strong>🔮 占卜師解答：</strong>
          <div class="answer-content">
            <div class="formatted-gpt-answer" v-html="formatTextContent(chat.answer)"></div>
          </div>
        </div>
      </div>

      <!-- 廣告橫幅（答案下方，方便點擊） -->
      <div 
        class="ad-banner" 
        @click="handleAdClick"
        :class="{ 'ad-activated': adClicked }"
      >
        {{ adClicked ? '✅ 謝謝支持！您可以繼續免費提問' : '🎁 點擊觀看廣告，支持占卜師繼續為您服務' }}
      </div>

      <!-- 廣告狀態提示 -->
      <div class="ad-status">
        <div class="status-indicator" :class="{ 'needs-ad': needsAd, 'free': !needsAd }">
          {{ getStatusText }}
        </div>
        <div class="question-counter">
          已提問 {{ askCount }} 次
        </div>
      </div>

      <!-- 問題輸入區 -->
      <div class="qa-wrapper">
        <h4>✍️ 請輸入您想了解的問題：</h4>
        <textarea 
          v-model="userQuestion" 
          class="question-textarea"
          :placeholder="isAsking ? '占卜師正在思考中，請稍候...' : '您還有其他問題想要詢問占卜師嗎？'"
          rows="3"
          :disabled="isAsking"
        ></textarea>
        <button 
          @click="askQuestion" 
          :disabled="!canAskQuestion"
          class="ask-btn"
          :class="{ 'needs-ad': needsAd }"
        >
          <span v-if="isAsking">🔄 占卜師思考中...</span>
          <span v-else>{{ getButtonText }}</span>
        </button>
      </div>
    </div>

    <!-- 返回按鈕 -->
    <div class="back-section">
      <button @click="goBack" class="back-btn">← 返回占卜系統</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getTarotDivination, askDivinationGPT } from '@/services/gptService'
import { drawCards, getRecommendedSpread, type TarotCard } from '@/utils/simpleTarotCards'
import SimpleTarotCard from '@/components/SimpleTarotCard.vue'
import { useAdGating } from '@/composables/useAdGating'

const router = useRouter()

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

// 用戶資料
const userData = ref({
  name: '',
  gender: '',
  birthDate: ''
})

// 占卜問題
const question = ref('')

// 狀態管理
const isDivining = ref(false)
const isAsking = ref(false)
const isDrawing = ref(false)
const divinationResult = ref('')
const userQuestion = ref('')
const questionHistory = ref<Array<{question: string, answer: string}>>([])

// 抽牌相關
const drawnCards = ref<TarotCard[]>([])
const spreadInfo = ref({ name: '', count: 0, description: '' })
const allCardsFlipped = ref(false)

// 快捷問題
const quickQuestions = [
  '今日運勢',
  '我最近的愛情運勢如何？',
  '我的事業發展前景如何？',
  '我應該如何改善目前的狀況？',
  '我的人生方向是什麼？',
  '我需要注意什麼重要事項？',
  '我的財運如何？',
  '我的人際關係會如何發展？',
  '我最近的健康狀況如何？'
]

// 計算屬性
const canStartDivination = computed(() => {
  return userData.value.name.trim() && question.value.trim() && !isDivining.value
})

const canAskQuestion = computed(() => {
  return userQuestion.value.trim() && !isAsking.value && canAsk.value
})

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
  // 1. 處理數字編號（1. 2. 3. 或 1、2、3、）
  formatted = formatted.replace(/(\n|^)(\d+[\.、]\s+)/g, '\n\n$2')
  
  // 2. 處理中文編號（一、二、三、）
  formatted = formatted.replace(/(\n|^)([一二三四五六七八九十]+[、：]\s*)/g, '\n\n$2')
  
  // 3. 處理括號編號（(1) (2) (3)）
  formatted = formatted.replace(/(\n|^)(\(\d+\)\s+)/g, '\n\n$2')
  
  // 4. 處理星號編號（* * *）
  formatted = formatted.replace(/(\n|^)(\*\s+)/g, '\n\n$2')
  
  // 5. 處理破折號編號（- - -）
  formatted = formatted.replace(/(\n|^)(-\s+)/g, '\n\n$2')
  
  // 6. 處理特殊標題格式（**標題**）
  formatted = formatted.replace(/(\n|^)(\*\*[^*]+\*\*)/g, '\n\n$2')
  
  // 7. 處理多個連續換行，統一為兩個換行
  formatted = formatted.replace(/\n{3,}/g, '\n\n')
  
  // 8. 處理段落開頭的空白
  formatted = formatted.replace(/^\s+/gm, '')
  
  // 將文本分割成段落
  const paragraphs = formatted.split(/\n\n+/).filter(p => p.trim().length > 0)
  
  // 為每個段落添加 HTML 標籤和樣式
  const formattedParagraphs = paragraphs.map(paragraph => {
    const trimmedP = paragraph.trim()
    
    // 檢查是否為編號段落（包含數字、中文編號、括號編號、星號、破折號等）
    const isNumbered = /^(\d+[\.、]|[一二三四五六七八九十]+[、：]|\(\d+\)|\*|-|\*\*)/.test(trimmedP)
    
    // 重新添加粗體標記（因為之前被移除了）
    let formattedP = trimmedP.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    
    if (isNumbered) {
      return `<p class="formatted-paragraph numbered-paragraph">${formattedP}</p>`
    } else {
      return `<p class="formatted-paragraph">${formattedP}</p>`
    }
  })
  
  return formattedParagraphs.join('')
}

// 開始占卜
async function startDivination() {
  if (!canStartDivination.value) return
  
  // 重置狀態
  divinationResult.value = ''
  drawnCards.value = []
  allCardsFlipped.value = false
  questionHistory.value = []
  
  // 獲取推薦牌陣
  spreadInfo.value = getRecommendedSpread(question.value)
  
  // 開始抽牌動畫
  isDrawing.value = true
  
  // 模擬抽牌過程
  setTimeout(() => {
    // 抽取卡牌
    drawnCards.value = drawCards(spreadInfo.value.count)
    isDrawing.value = false
  }, 3000)
}

// 翻開所有卡牌
function flipAllCards() {
  allCardsFlipped.value = true
  // 這裡可以觸發所有卡牌的翻牌動畫
}

// 獲取占卜結果
async function getDivinationResult() {
  if (drawnCards.value.length === 0) return
  
  isDivining.value = true
  
  try {
    // 構建包含卡牌信息的問題
    const cardInfo = drawnCards.value.map((card, index) => 
      `${index + 1}. ${card.name}${card.reversed ? '(逆位)' : ''} - ${card.meaning}`
    ).join('\n')
    
    const enhancedQuestion = `${question.value}\n\n抽到的卡牌：\n${cardInfo}`
    
    const result = await getTarotDivination(userData.value, enhancedQuestion)
    divinationResult.value = result
    
    // 初始占卜不計入提問次數，只有在後續提問時才計算廣告次數
  } catch (error) {
    console.error('占卜失敗:', error)
    divinationResult.value = '⚠️ 占卜過程中發生錯誤，請稍後再試。'
  } finally {
    isDivining.value = false
  }
}

// 提問時抽的新卡
const questionCard = ref<TarotCard | null>(null)

// 詢問問題
async function askQuestion() {
  if (!canAskQuestion.value) return
  
  const currentQuestion = userQuestion.value.trim()
  isAsking.value = true
  
  questionHistory.value.push({
    question: currentQuestion,
    answer: '🔮 正在為您抽取塔羅牌...'
  })
  
  userQuestion.value = ''
  
  try {
    const lastIndex = questionHistory.value.length - 1
    
    // 抽一張新卡
    const newCard = drawCards(1)[0]
    questionCard.value = newCard
    
    // 更新狀態：正在抽卡
    const cardInfo = `抽到：${newCard.name}${newCard.reversed ? '(逆位)' : ''}\n含義：${newCard.meaning}\n描述：${newCard.description}`
    
    if (lastIndex >= 0) {
      questionHistory.value[lastIndex].answer = `🃏 ${cardInfo}\n\n⏳ 正在為您解讀...`
    }
    
    // 等待動畫效果
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 基於新抽的卡來解釋問題
    const enhancedQuestion = `問題：${currentQuestion}\n\n塔羅牌提示：${cardInfo}\n\n請基於這張塔羅牌來回答用戶的問題，提供專業的占卜解讀。`
    
    const answer = await askDivinationGPT(enhancedQuestion, userData.value)
    
    // 將答案和卡牌信息結合
    const finalAnswer = `🃏 ${cardInfo}\n\n${answer}`
    
    if (lastIndex >= 0) {
      questionHistory.value[lastIndex].answer = finalAnswer
    }
    
    // 記錄問題已提問
    handleQuestionAsked()
  } catch (error) {
    console.error('問答失敗:', error)
    const lastIndex = questionHistory.value.length - 1
    if (lastIndex >= 0) {
      questionHistory.value[lastIndex].answer = '⚠️ 占卜師暫時無法回應，請稍後再試。'
    }
  } finally {
    isAsking.value = false
  }
}

// 返回
function goBack() {
  router.push({ name: 'Divination' })
}
</script>

<style scoped>
.tarot-divination {
  max-width: 800px;
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

.user-info-section,
.question-section,
.result-section,
.qa-section {
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-info-section h2,
.question-section h2,
.result-section h2,
.qa-section h3 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin: 0 0 20px 0;
  border-left: 4px solid #8B5CF6;
  padding-left: 12px;
}

.form-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-input,
.form-select {
  padding: 12px 16px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #8B5CF6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.question-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.question-textarea {
  width: 100%;
  padding: 16px;
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  transition: all 0.3s ease;
  background: #fafafa;
  font-family: inherit;
  resize: vertical;
}

.question-textarea:focus {
  outline: none;
  border-color: #8B5CF6;
  background: white;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.quick-questions {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e9ecef;
}

.quick-questions h3 {
  color: #2c3e50;
  font-size: 1.1rem;
  margin: 0 0 16px 0;
  border: none;
  padding: 0;
}

.quick-question-btn {
  background: linear-gradient(135deg, #fff, #f8f9fa);
  border: 2px solid #8B5CF6;
  color: #8B5CF6;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
  margin: 4px 8px 4px 0;
  white-space: nowrap;
}

.quick-question-btn:hover {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
  transform: translateY(-2px);
}

.divination-action {
  text-align: center;
  margin: 40px 0;
}

.start-btn {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.start-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #7C3AED, #6D28D9);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
}

.start-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.result-content {
  background: linear-gradient(135deg, #f0f9ff, #e6f3ff);
  border-radius: 12px;
  padding: 24px;
  border-left: 5px solid #8B5CF6;
  box-shadow: 0 3px 10px rgba(139, 92, 246, 0.1);
}

.result-text {
  color: #333;
  line-height: 1.8;
  white-space: pre-wrap;
  font-size: 15px;
}

.qa-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.ask-btn {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.ask-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #7C3AED, #6D28D9);
  transform: translateY(-1px);
}

.ask-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.qa-history {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid #e9ecef;
}

.question-item,
.answer-item {
  margin-bottom: 16px;
}

.question-item:last-child,
.answer-item:last-child {
  margin-bottom: 0;
}

.question-item strong,
.answer-item strong {
  color: #2c3e50;
  font-size: 14px;
  display: block;
  margin-bottom: 8px;
}

.question-item p,
.answer-item p {
  color: #333;
  line-height: 1.6;
  margin: 0;
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

.back-section {
  text-align: center;
  margin-top: 40px;
}

.back-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

/* 抽牌動畫樣式 */
.drawing-section {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 30px;
  text-align: center;
  color: white;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.drawing-section h2 {
  color: #8B5CF6;
  margin-bottom: 30px;
  font-size: 1.8rem;
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
}

.drawing-animation {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.mystical-circle {
  position: relative;
  width: 200px;
  height: 200px;
  border: 3px solid #8B5CF6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: rotate 3s linear infinite;
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.3);
}

.spinning-cards {
  position: absolute;
  width: 100%;
  height: 100%;
}

.spinning-card {
  position: absolute;
  font-size: 2rem;
  animation: float 2s ease-in-out infinite;
}

.spinning-card:nth-child(1) {
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 0s;
}

.spinning-card:nth-child(2) {
  top: 50%;
  right: 20%;
  transform: translateY(-50%);
  animation-delay: 0.7s;
}

.spinning-card:nth-child(3) {
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 1.4s;
}

.drawing-text {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  color: #8B5CF6;
  font-size: 1.1rem;
  font-weight: 500;
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
}

/* 卡牌區域樣式 */
.cards-section {
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cards-section h2 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin: 0 0 20px 0;
  border-left: 4px solid #8B5CF6;
  padding-left: 12px;
}

.spread-info {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #f0f9ff, #e6f3ff);
  border-radius: 12px;
  border-left: 5px solid #8B5CF6;
}

.spread-info h3 {
  color: #2c3e50;
  font-size: 1.3rem;
  margin: 0 0 8px 0;
}

.spread-info p {
  color: #666;
  margin: 0;
  line-height: 1.6;
}

.cards-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.cards-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.flip-btn,
.interpret-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.flip-btn {
  background: linear-gradient(135deg, #6c757d, #5a6268);
  color: white;
}

.flip-btn:hover {
  background: linear-gradient(135deg, #5a6268, #495057);
  transform: translateY(-2px);
}

.interpret-btn {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
}

.interpret-btn:hover {
  background: linear-gradient(135deg, #7C3AED, #6D28D9);
  transform: translateY(-2px);
}

/* 動畫效果 */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.1);
  }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .tarot-divination {
    padding: 16px;
  }
  
  .page-header {
    padding: 30px 16px;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .form-wrapper {
    grid-template-columns: 1fr;
  }
  
  .user-info-section,
  .question-section,
  .result-section,
  .qa-section {
    padding: 20px;
  }
  
  .quick-question-btn {
    display: block;
    width: 100%;
    margin: 4px 0;
  }
  
  .mystical-circle {
    width: 150px;
    height: 150px;
  }
  
  .spinning-card {
    font-size: 1.5rem;
  }
  
  .cards-container {
    gap: 16px;
  }
  
  .cards-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .flip-btn,
  .interpret-btn {
    width: 100%;
    max-width: 200px;
  }
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

.question-counter {
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
}

.ad-banner {
  margin-top: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  border: 2px solid #ffc107;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: #856404;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.2);
}

.ad-banner:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 193, 7, 0.3);
}

.ad-banner.ad-activated {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  border-color: #10b981;
  color: #059669;
}

.ask-btn.needs-ad {
  background: linear-gradient(135deg, #9ca3af, #6b7280);
  cursor: not-allowed;
}

.ask-btn.needs-ad:hover {
  transform: none;
  box-shadow: none;
}
</style>
