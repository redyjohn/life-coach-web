<template>
  <div class="iching-divination">
    <!-- 頁面標題 -->
    <div class="page-header">
      <h1>☯️ 易經占卜</h1>
      <p class="subtitle">古老的智慧，揭示變化的規律與時機</p>
    </div>

    <!-- 用戶信息輸入 -->
    <div class="user-info-section" v-if="!hasStarted">
      <div class="info-card">
        <h2>📝 請提供您的信息</h2>
        <form @submit.prevent="startDivination">
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
            <label for="birthDate">出生日期</label>
            <input 
              type="date" 
              id="birthDate" 
              v-model="userData.birthDate"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="question">您的問題</label>
            
            <!-- 常見問題快捷選擇 -->
            <div class="quick-questions-form">
              <h4>💡 常見問題：</h4>
              <div class="question-buttons-form">
                <button 
                  v-for="q in commonQuestions" 
                  :key="q"
                  @click.prevent="userData.question = q"
                  type="button"
                  class="quick-question-btn-form"
                >
                  {{ q }}
                </button>
              </div>
            </div>
            
            <textarea 
              id="question" 
              v-model="userData.question" 
              placeholder="請專注地思考您想要了解的問題..."
              rows="4"
              required
            ></textarea>
          </div>
          
          <button type="submit" class="start-btn" :disabled="isLoading">
            <span v-if="!isLoading">開始占卜</span>
            <span v-else>準備中...</span>
          </button>
        </form>
      </div>
    </div>

    <!-- 抽籤動畫區域 -->
    <div v-if="isDrawing" class="drawing-section">
      <h2>☯️ 正在抽籤...</h2>
      <div class="drawing-animation">
        <div class="mystical-circle">
          <div class="yin-yang">
            <div class="yin"></div>
            <div class="yang"></div>
          </div>
          <div class="hexagram-symbols">
            <span class="symbol">☰</span>
            <span class="symbol">☷</span>
            <span class="symbol">☳</span>
            <span class="symbol">☴</span>
            <span class="symbol">☵</span>
            <span class="symbol">☲</span>
            <span class="symbol">☶</span>
            <span class="symbol">☱</span>
          </div>
        </div>
        <div class="drawing-text">占卜師正在為您抽取卦象</div>
      </div>
    </div>

    <!-- 抽到的卦象 -->
    <div v-if="drawnHexagram && !divinationComplete" class="hexagram-section">
      <h2>☯️ 抽到的卦象</h2>
      <div class="hexagram-display">
        <div class="hexagram-info">
          <h3>第{{ drawnHexagram.number }}卦：{{ drawnHexagram.chineseName }}卦</h3>
          <p class="hexagram-name">{{ drawnHexagram.name }}</p>
          <div class="hexagram-symbol-large">{{ drawnHexagram.symbol }}</div>
          <p class="hexagram-description">{{ drawnHexagram.description }}</p>
          <div class="hexagram-preview">
            <div class="preview-item">
              <h4>含義</h4>
              <p>{{ drawnHexagram.meaning }}</p>
            </div>
            <div class="preview-item">
              <h4>關鍵詞</h4>
              <div class="keywords">
                <span v-for="keyword in drawnHexagram.keywords" :key="keyword" class="keyword-tag">
                  {{ keyword }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="hexagram-actions">
        <button @click="getDivinationResult" class="interpret-btn" :disabled="isInterpreting">
          <span v-if="isInterpreting">🔮 占卜師解讀中...</span>
          <span v-else>🔮 開始解卦</span>
        </button>
      </div>
    </div>

    <!-- 占卜結果 -->
    <div class="result-section" v-if="divinationComplete">
      <div class="result-card">
        <h2>🎯 您的易經占卜結果</h2>
        
        <!-- 卦象顯示 -->
        <div class="hexagram-display">
          <div class="hexagram-info">
            <h3>第{{ drawnHexagram.number }}卦：{{ drawnHexagram.chineseName }}卦</h3>
            <p class="hexagram-name">{{ drawnHexagram.name }}</p>
            <div class="hexagram-symbol-large">{{ drawnHexagram.symbol }}</div>
            <p class="hexagram-description">{{ drawnHexagram.description }}</p>
          </div>
        </div>

        <!-- 占卜解讀 -->
        <div class="interpretation-section">
          <h3>🔍 卦象解讀</h3>
          <div class="interpretation-content">
            <div class="interpretation-item">
              <h4>含義</h4>
              <p>{{ drawnHexagram.meaning }}</p>
            </div>
            <div class="interpretation-item">
              <h4>建議</h4>
              <p>{{ drawnHexagram.advice }}</p>
            </div>
            <div class="interpretation-item">
              <h4>關鍵詞</h4>
              <div class="keywords">
                <span v-for="keyword in drawnHexagram.keywords" :key="keyword" class="keyword-tag">
                  {{ keyword }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- AI 解讀 -->
        <div class="ai-interpretation" v-if="aiInterpretation">
          <h3>🧙‍♂️ 占卜師解讀</h3>
          <div class="interpretation-text" v-html="formattedInterpretation"></div>
        </div>
      </div>
    </div>

    <!-- 繼續問答 -->
    <div v-if="divinationComplete" class="qa-section">
      <h3>🎯 繼續向占卜師提問</h3>
      
      <!-- 快捷問題 -->
      <div class="quick-questions">
        <h4>🔥 熱門問題推薦：</h4>
        <button 
          v-for="q in quickQuestions.value" 
          :key="q"
          @click="userQuestion = q"
          class="quick-question-btn"
        >
          {{ q }}
        </button>
      </div>

      <!-- 問答歷史（先顯示答案，方便閱讀） -->
      <div v-for="(chat, index) in questionHistory" :key="index" class="qa-history">
        <div class="question-item">
          <strong>🙋‍♀️ 您的問題：</strong>
          <p>{{ chat.question }}</p>
        </div>
        <div class="answer-item">
          <strong>🔮 占卜師解答：</strong>
          <div class="answer-content">
            <pre>{{ chat.answer }}</pre>
          </div>
        </div>
      </div>

      <!-- 問題輸入區 -->
      <div class="qa-wrapper">
        <h4>✍️ 請輸入您想了解的問題：</h4>
        <textarea 
          v-model="userQuestion" 
          class="question-textarea"
          :placeholder="isAsking ? '占卜師正在思考中，請稍候...' : '例如：今日該注意什麼？這件事的發展如何？'"
          rows="3"
          :disabled="isAsking"
          @keydown.enter.ctrl="askQuestion"
        ></textarea>
        
        <div class="input-footer">
          <button 
            @click="askQuestion" 
            :disabled="!canAskQuestion"
            class="ask-btn"
            :class="{ 'needs-ad': needsAd }"
          >
            <span v-if="isAsking">🔄 占卜師思考中...</span>
            <span v-else>{{ getButtonText }}</span>
          </button>
          
          <small class="input-tip">💡 按 Ctrl + Enter 可快速送出問題</small>
        </div>
      </div>

      <!-- 專業提醒 -->
      <div class="professional-note">
        <p>📋 <strong>專業提醒：</strong>本站提供專業易經占卜服務，如需其他命理諮詢，歡迎使用我們的八字命理、紫微斗數、占卜系統、姓名學或擇日系統服務。</p>
      </div>

      <!-- 廣告橫幅（在最後，方便點擊） -->
      <div 
        class="ad-banner" 
        @click="handleAdClick"
        :class="{ 'ad-activated': adClicked }"
      >
        {{ adClicked ? '✅ 謝謝支持！您可以繼續免費提問' : '🎁 點擊觀看廣告，支持占卜師繼續為您服務' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getIChingDivination, askDivinationGPT } from '@/services/gptService'
import { drawHexagram, getRecommendedHexagram, getHexagramInterpretation, type IChingHexagram } from '@/utils/ichingHexagrams'
import { useAdGating } from '@/composables/useAdGating'

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

// 響應式數據
const userData = ref({
  name: '',
  birthDate: '',
  question: ''
})

const hasStarted = ref(false)
const isLoading = ref(false)
const isDrawing = ref(false)
const isInterpreting = ref(false)
const divinationComplete = ref(false)
const drawnHexagram = ref<IChingHexagram | null>(null)
const aiInterpretation = ref('')
const conversationHistory = ref<Array<{question: string, answer: string}>>([])

// 問答相關狀態
const userQuestion = ref('')
const questionHistory = ref<Array<{question: string, answer: string}>>([])
const isAsking = ref(false)

// 表單中的常見問題
const commonQuestions = [
  '今日運勢如何？',
  '最近的事業發展如何？',
  '感情運勢如何？',
  '財運如何？',
  '健康方面需要注意什麼？',
  '應該如何做重要的決定？',
  '這段時間適合做什麼？',
  '人際關係會如何發展？'
]

// 快速問題
const quickQuestions = ref([
  '我的愛情運勢如何？',
  '事業發展方向是什麼？',
  '最近的財運如何？',
  '健康方面需要注意什麼？',
  '我應該如何做決定？'
])

// 計算屬性
const canAskQuestion = computed(() => {
  return userQuestion.value.trim() && !isAsking.value && canAsk.value
})

// 格式化解讀文本，確保每個編號分段清楚
const formattedInterpretation = computed(() => {
  if (!aiInterpretation.value) return ''
  
  let text = aiInterpretation.value
  
  // 先處理粗體標記（在分段之前）
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  
  // 將 HTML 標籤轉換為純文本進行處理（保留換行）
  if (typeof document !== 'undefined') {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = text
    text = tempDiv.textContent || tempDiv.innerText || ''
  } else {
    // 服務端渲染時，簡單移除 HTML 標籤
    text = text.replace(/<[^>]*>/g, '')
  }
  
  // 處理各種編號格式，確保每個編號前都有明顯的分段
  // 1. 處理數字編號（1. 2. 3. 或 1、2、3、）
  text = text.replace(/(\n|^)(\d+[\.、]\s+)/g, '\n\n$2')
  
  // 2. 處理中文編號（一、二、三、）
  text = text.replace(/(\n|^)([一二三四五六七八九十]+[、：]\s*)/g, '\n\n$2')
  
  // 3. 處理括號編號（(1) (2) (3)）
  text = text.replace(/(\n|^)(\(\d+\)\s+)/g, '\n\n$2')
  
  // 4. 處理星號編號（* * *）
  text = text.replace(/(\n|^)(\*\s+)/g, '\n\n$2')
  
  // 5. 處理破折號（- - -）
  text = text.replace(/(\n|^)(-\s+)/g, '\n\n$2')
  
  // 6. 處理多個連續換行，統一為兩個換行（段落分隔）
  text = text.replace(/\n{3,}/g, '\n\n')
  
  // 7. 移除開頭和結尾的多餘換行
  text = text.trim()
  
  // 8. 將雙換行轉換為段落標籤
  const paragraphs = text.split(/\n\n+/)
  const formattedParagraphs = paragraphs
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => {
      // 檢查是否以編號開頭（支持各種格式）
      const trimmed = p.trim()
      const isNumbered = /^(\d+[\.、]|[一二三四五六七八九十]+[、：]|\(\d+\)|\*\s+|-\s+)/.test(trimmed)
      
      // 重新處理粗體標記
      let formattedP = p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      
      if (isNumbered) {
        // 編號段落添加特殊樣式
        // 確保編號部分使用粗體
        formattedP = formattedP.replace(/^(\d+[\.、]|[一二三四五六七八九十]+[、：]|\(\d+\)|\*\s+|-\s+)(.+)/, '<strong>$1</strong>$2')
        return `<p class="interpretation-paragraph numbered-paragraph">${formattedP}</p>`
      } else {
        return `<p class="interpretation-paragraph">${formattedP}</p>`
      }
    })
  
  return formattedParagraphs.join('')
})

// 開始占卜
async function startDivination() {
  if (!userData.value.name || !userData.value.birthDate || !userData.value.question) {
    return
  }

  // 重置狀態
  hasStarted.value = true
  isLoading.value = false
  isDrawing.value = true
  divinationComplete.value = false
  drawnHexagram.value = null
  aiInterpretation.value = ''
  conversationHistory.value = []

  // 開始抽籤動畫
  setTimeout(() => {
    // 抽取卦象
    drawnHexagram.value = getRecommendedHexagram(userData.value.question)
    isDrawing.value = false
  }, 3000)
}

// 獲取占卜結果（解卦）
async function getDivinationResult() {
  if (!drawnHexagram.value) return
  
  isInterpreting.value = true
  
  try {
    // 獲取 AI 解讀
    const interpretation = await getIChingDivination(
      userData.value.name,
      userData.value.birthDate,
      userData.value.question,
      drawnHexagram.value
    )
    
    aiInterpretation.value = interpretation
    
    // 添加到對話歷史
    conversationHistory.value.push({
      question: userData.value.question,
      answer: interpretation
    })
    
    // 初始占卜不計入提問次數，只有在後續提問時才計算廣告次數
    divinationComplete.value = true
  } catch (error) {
    console.error('解卦過程出錯:', error)
    // 即使 AI 失敗，也顯示基本解讀
    if (drawnHexagram.value) {
      aiInterpretation.value = getHexagramInterpretation(drawnHexagram.value, userData.value.question)
      divinationComplete.value = true
    }
  } finally {
    isInterpreting.value = false
  }
}

// 重置占卜
function resetDivination() {
  hasStarted.value = false
  divinationComplete.value = false
  drawnHexagram.value = null
  aiInterpretation.value = ''
  userData.value = {
    name: '',
    birthDate: '',
    question: ''
  }
}

// 提問時抽的新卦象
const questionHexagram = ref<IChingHexagram | null>(null)

// 提問時重新卜卦
async function askQuestion() {
  if (!canAskQuestion.value) return
  
  const currentQuestion = userQuestion.value.trim()
  isAsking.value = true
  
  questionHistory.value.push({
    question: currentQuestion,
    answer: '🔮 正在為您重新卜卦...'
  })
  
  userQuestion.value = ''
  
  try {
    const lastIndex = questionHistory.value.length - 1
    
    // 更新狀態：正在抽卦
    if (lastIndex >= 0) {
      questionHistory.value[lastIndex].answer = '🔮 正在為您抽取卦象...'
    }
    
    // 等待動畫效果
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 重新抽一個與問題相關的卦象
    const newHexagram = getRecommendedHexagram(currentQuestion)
    questionHexagram.value = newHexagram
    
    // 更新狀態：正在抽卦
    const hexagramInfo = `抽到：第${newHexagram.number}卦 - ${newHexagram.chineseName} (${newHexagram.name})\n\n${newHexagram.meaning}`
    
    if (lastIndex >= 0) {
      questionHistory.value[lastIndex].answer = `☯️ ${hexagramInfo}\n\n⏳ 正在為您解讀...`
    }
    
    // 等待動畫效果
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 基於新抽的卦象來解釋問題
    const enhancedQuestion = `問題：${currentQuestion}\n\n易經卦象提示：${hexagramInfo}\n\n請基於這個易經卦象來回答用戶的問題，提供專業的易經占卜解讀。`
    
    const answer = await askDivinationGPT(enhancedQuestion, userData.value)
    
    // 將答案和卦象信息結合
    const finalAnswer = `☯️ ${hexagramInfo}\n\n${answer}`
    
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

// 快速問題
async function askQuickQuestion(question: string) {
  userData.value.question = question
  await startDivination()
}

onMounted(() => {
  console.log('✅ IChingDivination mounted')
})
</script>

<style scoped>
.iching-divination {
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

.info-card, .divination-card, .result-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.info-card h2, .divination-card h2, .result-card h2 {
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
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #8B5CF6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

/* 常見問題快捷選擇樣式 */
.quick-questions-form {
  margin-bottom: 16px;
}

.quick-questions-form h4 {
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 10px;
}

.question-buttons-form {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-question-btn-form {
  padding: 6px 14px;
  background: linear-gradient(135deg, #fff, #f8f9fa);
  border: 2px solid #8B5CF6;
  color: #8B5CF6;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(139, 92, 246, 0.1);
}

.quick-question-btn-form:hover {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.start-btn {
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

.start-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

.start-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 抽籤動畫樣式 */
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
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
  animation: rotate 3s linear infinite;
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.3);
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
  white-space: nowrap;
}

.yin-yang {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(90deg, #000 50%, #fff 50%);
  position: relative;
  animation: rotate 5s linear infinite reverse;
}

.yin, .yang {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: absolute;
  top: 25px;
}

.yin {
  left: 0;
  background: #fff;
  border: 25px solid #000;
}

.yang {
  right: 0;
  background: #000;
  border: 25px solid #fff;
}

.hexagram-symbols {
  position: absolute;
  width: 100%;
  height: 100%;
}

.hexagram-symbols .symbol {
  position: absolute;
  font-size: 1.5rem;
  color: #8B5CF6;
  animation: pulse 2s ease-in-out infinite;
}

.hexagram-symbols .symbol:nth-child(1) { top: 10px; left: 50%; transform: translateX(-50%); animation-delay: 0s; }
.hexagram-symbols .symbol:nth-child(2) { top: 50%; right: 10px; transform: translateY(-50%); animation-delay: 0.25s; }
.hexagram-symbols .symbol:nth-child(3) { bottom: 10px; left: 50%; transform: translateX(-50%); animation-delay: 0.5s; }
.hexagram-symbols .symbol:nth-child(4) { top: 50%; left: 10px; transform: translateY(-50%); animation-delay: 0.75s; }
.hexagram-symbols .symbol:nth-child(5) { top: 25%; right: 25%; animation-delay: 1s; }
.hexagram-symbols .symbol:nth-child(6) { bottom: 25%; right: 25%; animation-delay: 1.25s; }
.hexagram-symbols .symbol:nth-child(7) { bottom: 25%; left: 25%; animation-delay: 1.5s; }
.hexagram-symbols .symbol:nth-child(8) { top: 25%; left: 25%; animation-delay: 1.75s; }

.loading-text {
  font-size: 1.2rem;
  color: #8B5CF6;
  font-weight: 600;
  animation: pulse 2s ease-in-out infinite;
}

/* 卦象區域樣式 */
.hexagram-section {
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.hexagram-section h2 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin: 0 0 20px 0;
  border-left: 4px solid #8B5CF6;
  padding-left: 12px;
}

/* 結果顯示 */
.hexagram-display {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px;
  background: linear-gradient(135deg, #f8f9ff, #e8f4f8);
  border-radius: 12px;
  border: 2px solid #8B5CF6;
}

.hexagram-preview {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  text-align: left;
}

.preview-item {
  padding: 15px;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #8B5CF6;
}

.preview-item h4 {
  color: #8B5CF6;
  font-size: 1rem;
  margin: 0 0 8px 0;
}

.preview-item p {
  color: #2c3e50;
  line-height: 1.6;
  margin: 0;
  font-size: 0.9rem;
}

.hexagram-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.interpret-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.interpret-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #7C3AED, #6D28D9);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.3);
}

.interpret-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.hexagram-info h3 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.hexagram-name {
  color: #8B5CF6;
  font-size: 1.2rem;
  font-style: italic;
  margin-bottom: 20px;
}

.hexagram-symbol-large {
  font-size: 4rem;
  color: #8B5CF6;
  margin: 20px 0;
  text-shadow: 0 2px 4px rgba(139, 92, 246, 0.3);
}

.hexagram-description {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
}

.interpretation-section {
  margin-bottom: 30px;
}

.interpretation-section h3 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 20px;
  border-bottom: 2px solid #8B5CF6;
  padding-bottom: 8px;
}

.interpretation-content {
  display: grid;
  gap: 20px;
}

.interpretation-item {
  padding: 20px;
  background: #f8f9ff;
  border-radius: 8px;
  border-left: 4px solid #8B5CF6;
}

.interpretation-item h4 {
  color: #8B5CF6;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.interpretation-item p {
  color: #2c3e50;
  line-height: 1.6;
  margin: 0;
}

.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword-tag {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.ai-interpretation {
  margin-bottom: 30px;
  padding: 25px;
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  border-radius: 12px;
  border: 2px solid #ffc107;
}

.ai-interpretation h3 {
  color: #856404;
  font-size: 1.5rem;
  margin-bottom: 15px;
  text-align: center;
}

.interpretation-text {
  color: #856404;
  line-height: 1.8;
  font-size: 1.1rem;
}

.interpretation-text .interpretation-paragraph {
  margin: 0 0 24px 0;
  padding: 0;
  line-height: 1.8;
  color: #856404;
}

.interpretation-text .interpretation-paragraph:last-child {
  margin-bottom: 0;
}

.interpretation-text .interpretation-paragraph:first-child {
  margin-top: 0;
}

/* 編號段落樣式 - 每個編號都有明顯分隔 */
.interpretation-text .numbered-paragraph {
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

.interpretation-text .numbered-paragraph:first-child {
  margin-top: 0;
  padding-top: 16px;
  border-top: none;
}

/* 編號樣式 */
.interpretation-text .interpretation-paragraph strong {
  color: #8B5CF6;
  font-size: 1.1em;
  font-weight: 700;
  display: inline-block;
  margin-bottom: 12px;
  margin-right: 8px;
}

.interpretation-text .numbered-paragraph strong {
  color: #7C3AED;
  font-size: 1.15em;
  font-weight: 700;
  display: block;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
}

.interpretation-text .interpretation-paragraph em {
  color: #7C3AED;
  font-style: italic;
  font-weight: 500;
}

/* 確保編號後的內容有適當間距 */
.interpretation-text .numbered-paragraph > strong + * {
  margin-top: 12px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 30px;
}

.reset-btn, .question-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
}

.question-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.reset-btn:hover, .question-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
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

.quick-questions h4 {
  color: #2c3e50;
  margin-bottom: 12px;
  font-size: 15px;
  width: 100%;
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

.quick-question-btn:hover {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.conversation-history {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.conversation-history h3 {
  color: #2c3e50;
  font-size: 1.4rem;
  margin-bottom: 20px;
  text-align: center;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.history-item {
  padding: 15px;
  background: #f8f9ff;
  border-radius: 8px;
  border-left: 4px solid #8B5CF6;
}

.history-item .question {
  color: #8B5CF6;
  font-weight: 600;
  margin-bottom: 8px;
}

.history-item .answer {
  color: #2c3e50;
  line-height: 1.6;
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

/* 問答區域樣式 */
.qa-section {
  background: white;
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.qa-section h3 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-align: center;
  border-bottom: 2px solid #8B5CF6;
  padding-bottom: 8px;
}

.qa-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.qa-wrapper h4 {
  color: #2c3e50;
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.question-textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.3s ease;
}

.question-textarea:focus {
  outline: none;
  border-color: #8B5CF6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.question-textarea:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.input-footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ask-btn {
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

.ask-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.3);
}

.ask-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.qa-history {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9ff;
  border-radius: 8px;
  border-left: 4px solid #8B5CF6;
}

.question-item, .answer-item {
  margin-bottom: 10px;
}

.question-item strong, .answer-item strong {
  color: #8B5CF6;
  display: block;
  margin-bottom: 5px;
}

.question-item p, .answer-item p {
  color: #2c3e50;
  line-height: 1.6;
  margin: 0;
}

.answer-content {
  margin-top: 8px;
}

.answer-content pre {
  white-space: pre-wrap;
  font-family: 'Microsoft JhengHei', sans-serif;
  background: #fafafa;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  color: #2c3e50;
  line-height: 1.6;
  margin: 0;
}

.input-tip {
  color: #6b7280;
  font-size: 0.85rem;
  text-align: center;
}

.professional-note {
  background: linear-gradient(135deg, #e0f2fe, #f0f9ff);
  border: 2px solid #4a90e2;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.professional-note p {
  color: #1e40af;
  line-height: 1.6;
  margin: 0;
}

.professional-note strong {
  color: #1e3a8a;
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

/* 響應式設計 */
@media (max-width: 768px) {
  .iching-divination {
    padding: 16px;
  }
  
  .page-header {
    padding: 30px 16px;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .info-card, .divination-card, .result-card {
    padding: 20px;
  }
  
  .mystical-circle {
    width: 150px;
    height: 150px;
  }
  
  .yin-yang {
    width: 75px;
    height: 75px;
  }
  
  .yin, .yang {
    width: 37.5px;
    height: 37.5px;
    top: 18.75px;
    border-width: 18.75px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .question-buttons {
    flex-direction: column;
  }
  
  .question-buttons-form {
    justify-content: center;
  }
  
  .quick-question-btn-form {
    font-size: 0.8rem;
    padding: 6px 12px;
    flex: 1 1 auto;
    min-width: auto;
  }
}
</style>
