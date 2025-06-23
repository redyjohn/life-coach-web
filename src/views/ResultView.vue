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
} from '@/services/openai'

const route = useRoute()
const router = useRouter()
const userData = route.query

const baZi = ref('')
const dayMaster = ref('')
const chartAnalysis = ref('')
const suggestion = ref('')
const luckCycle = ref('')
const currentLuck = ref('')
const yearAdvice = ref('')

const promptHint = ref('')
const isLoading = ref(true)
const errorMessages = ref<string[]>([])

const questionHistory = ref<{ question: string; answer: string }[]>([])
const userQuestion = ref('')
const askCount = ref(0)
const adClicked = ref(false)
const showLeavePrompt = ref(false)
const allowLeave = ref(false)

const canAskGPT = computed(() => askCount.value % 2 === 0 || adClicked.value)
const defaultFallbackReply = '🙇‍♂️ 非常抱歉，您所提的問題無法用八字解析，您要不要試試看我們其他 AI 老師的服務？'

onMounted(async () => {
  window.addEventListener('beforeunload', handleBeforeUnload)
  try {
    baZi.value = await getBaZi(userData)
    dayMaster.value = await getDayMasterAnalysis(userData)
    chartAnalysis.value = await getChartAnalysis(userData)
    suggestion.value = await getSuggestions(userData)
    luckCycle.value = await getLuckCycle(userData)
    currentLuck.value = await getCurrentLuckAnalysis(userData)
    yearAdvice.value = await getCurrentYearAdvice(userData)

    const introPrompt = '請用一句親切話語，引導使用者針對命理命盤提問，例如：「你可以問接下來的事業運如何喔」'
    promptHint.value = await askGPT(introPrompt, userData)
  } catch (e) {
    errorMessages.value.push('❌ 資料取得失敗，請稍後再試')
  } finally {
    isLoading.value = false
  }
})

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
  e.preventDefault()
  e.returnValue = ''
  showLeavePrompt.value = true
}

function handleExportToPDF() {
  showLeavePrompt.value = false
  window.open('https://your-ad-link.com', '_blank')
  setTimeout(() => {
    window.print()
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
  if (!canAskGPT.value || !userQuestion.value.trim()) return

  const currentQ = userQuestion.value
  questionHistory.value.push({ question: currentQ, answer: '⏳ 回覆中...' })
  userQuestion.value = ''
  adClicked.value = false

  try {
    const reply = await askGPT(currentQ, userData)
    const lastIndex = questionHistory.value.length - 1

    // 判斷回應是否明確表示無法回答（你也可以根據你的 prompt 調整這些判斷條件）
    const lower = reply.toLowerCase()
    const unableKeywords = ['無法回答', '不確定', '無法解釋', '無法解析', '不適合', '不是命理']
    const isFallback = unableKeywords.some(k => lower.includes(k))

    questionHistory.value[lastIndex].answer = isFallback ? defaultFallbackReply : reply
    askCount.value++
  } catch (err) {
    const lastIndex = questionHistory.value.length - 1
    questionHistory.value[lastIndex].answer = '❌ 無法取得回覆，請稍後再試。'
  }
}

function handleAdClick() {
  adClicked.value = true
}
</script>

<template>
  <div class="result">
    <div v-if="isLoading" class="loading">☯️ 正在分析您的命盤，請稍候... ☯️</div>

    <div v-else>
      <div v-if="errorMessages.length" class="error-box">
        <ul><li v-for="msg in errorMessages" :key="msg">{{ msg }}</li></ul>
      </div>

      <div class="result-section" v-for="(content, index) in [
        { title: '一、個人八字（四柱）', text: baZi },
        { title: '二、日主分析', text: dayMaster },
        { title: '三、命盤分析', text: chartAnalysis },
        { title: '四、命理建議', text: suggestion },
        { title: '五、大運列表', text: luckCycle },
        { title: '六、今年流年分析', text: currentLuck },
        { title: '七、流年建議', text: yearAdvice }
      ]" :key="index">
        <h2>{{ content.title }}</h2>
        <pre v-if="index === 0 || index === 2 || index === 4">{{ content.text }}</pre>
        <p v-else>{{ content.text }}</p>
      </div>

      <div class="gpt-question">
        <h3>📩 你可以在下方欄位自由詢問問題喔</h3>
        <p class="gpt-hint" v-if="promptHint">{{ promptHint }}</p>

        <div v-for="(chat, index) in questionHistory" :key="index" class="gpt-response">
          <strong>您的問題是：</strong>
          <p>{{ chat.question }}</p>
          <strong>☯️八老師☯️：</strong>
          <p>{{ chat.answer }}</p>
        </div>

        <textarea v-model="userQuestion" placeholder="請輸入你的命理問題..."></textarea>
        <button @click="handleAskGPT" :disabled="!canAskGPT">
          送出問題（{{ askCount % 2 === 0 ? '免費使用' : '點廣告後可繼續' }}）
        </button>

        <div class="ad-banner" @click="handleAdClick">
          🔁 點擊這裡觀看廣告以解鎖更多提問
        </div>
      </div>

      <dialog v-if="showLeavePrompt" open class="leave-dialog">
        <button class="close-button" @click="cancelLeave">❌</button>
        <p>現在離開的話資料將會消失喔，需要幫您轉成 PDF 嗎？</p>
        <button @click="handleExportToPDF">是，轉成 PDF</button>
        <button @click="handleLeaveAnyway">否，我要離開</button>
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
    font-size: 16px;
  }
  .error-box {
    background: #ffe6e6;
    border: 1px solid #ffcccc;
    border-radius: 8px;
    padding: 16px;
    color: #cc0000;
    margin-bottom: 24px;
  }
  .result-section {
    background: #ffffff;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    margin-bottom: 28px;
  }
  h2 {
    font-size: 20px;
    color: #2c3e50;
    margin-bottom: 12px;
  }
  p, pre {
    font-size: 14px;
    white-space: pre-wrap;
    line-height: 1.8;
    color: #333;
  }
  .gpt-question {
    background: #fff7f0;
    padding: 20px;
    border-radius: 10px;
    margin-top: 40px;
  }
  textarea {
    width: 100%;
    min-height: 80px;
    margin: 12px 0;
    padding: 8px;
    font-family: inherit;
  }
  button {
    background-color: #d03c3c;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 6px;
    cursor: pointer;
    margin-right: 10px;
  }
  button:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
  .ad-banner {
    margin-top: 20px;
    background: #fff0f0;
    text-align: center;
    padding: 12px;
    border-radius: 8px;
    border: 1px dashed #d03c3c;
    cursor: pointer;
    font-size: 14px;
    color: #b20000;
  }
  .gpt-response {
    margin-top: 16px;
    background: #f0f9ff;
    padding: 12px;
    border-left: 4px solid #4a90e2;
    border-radius: 6px;
  }
  .quick-questions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 12px 0;
  }
  .quick-questions button {
    background-color: #fff;
    border: 1px solid #d03c3c;
    color: #d03c3c;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
  }
  .quick-questions button:hover {
    background-color: #ffecec;
  }
  .leave-dialog {
    position: fixed;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    padding: 24px;
    border: 2px solid #ccc;
    border-radius: 10px;
    z-index: 999;
    min-width: 300px;
  }
  .close-button {
    position: absolute;
    top: 8px;
    right: 12px;
    border: none;
    background: none;
    font-size: 20px;
    cursor: pointer;
    color: #666;
  }

  .gpt-hint {
    color: #555;
    margin: 8px 0 12px;
    font-style: italic;
  }
  </style>
