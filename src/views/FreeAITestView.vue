<template>
  <div class="free-ai-test">
    <div class="container">
      <h1>🆓 免費 AI 服務測試</h1>
      
      <!-- 配額狀態 -->
      <div class="quota-status">
        <h2>📊 配額狀態</h2>
        <div class="status-card" :class="quotaStatus.service">
          <div class="status-header">
            <span class="status-icon">{{ quotaStatus.service === 'openai' ? '🤖' : '🆓' }}</span>
            <span class="status-title">{{ quotaStatus.service === 'openai' ? 'OpenAI' : '免費服務' }}</span>
          </div>
          <div class="status-details">
            <p><strong>配額狀態:</strong> {{ quotaStatus.hasQuota ? '✅ 有配額' : '❌ 無配額' }}</p>
            <p><strong>最後檢查:</strong> {{ formatDate(quotaStatus.lastCheck) }}</p>
          </div>
        </div>
      </div>

      <!-- 測試區域 -->
      <div class="test-section">
        <h2>🧪 AI 服務測試</h2>
        
        <div class="test-form">
          <div class="form-group">
            <label>測試問題:</label>
            <textarea 
              v-model="testQuestion" 
              placeholder="輸入您想要測試的問題..."
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>系統提示:</label>
            <textarea 
              v-model="systemPrompt" 
              placeholder="輸入系統提示..."
              rows="2"
            ></textarea>
          </div>
          
          <div class="test-buttons">
            <button @click="testFreeAI" :disabled="isTesting" class="test-btn free">
              🆓 測試免費 AI
            </button>
            <button @click="testOpenAI" :disabled="isTesting" class="test-btn openai">
              🤖 測試 OpenAI
            </button>
            <button @click="testAuto" :disabled="isTesting" class="test-btn auto">
              🎯 自動選擇
            </button>
          </div>
        </div>
      </div>

      <!-- 測試結果 -->
      <div v-if="testResult" class="test-result">
        <h2>📝 測試結果</h2>
        <div class="result-card">
          <div class="result-header">
            <span class="result-service">{{ testResult.service }}</span>
            <span class="result-time">{{ formatDate(testResult.timestamp) }}</span>
          </div>
          <div class="result-content">
            <p><strong>回應:</strong></p>
            <div class="result-text">{{ testResult.response }}</div>
          </div>
        </div>
      </div>

      <!-- 使用統計 -->
      <div class="usage-stats">
        <h2>📈 使用統計</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">{{ usageStats.openai }}</div>
            <div class="stat-label">OpenAI 調用</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ usageStats.free }}</div>
            <div class="stat-label">免費服務調用</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ usageStats.total }}</div>
            <div class="stat-label">總調用次數</div>
          </div>
        </div>
      </div>

      <!-- 快捷測試 -->
      <div class="quick-tests">
        <h2>⚡ 快捷測試</h2>
        <div class="quick-buttons">
          <button 
            v-for="question in quickQuestions" 
            :key="question"
            @click="setQuickQuestion(question)"
            class="quick-btn"
          >
            {{ question }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { callFreeAI } from '@/services/freeAIService'
import { callGPT } from '@/services/gptService'
import { getQuotaStatus, recordAPIUsage } from '@/services/quotaMonitor'

// 響應式數據
const quotaStatus = ref({
  hasQuota: true,
  service: 'openai' as 'openai' | 'free',
  lastCheck: new Date()
})

const testQuestion = ref('請簡單介紹一下塔羅牌占卜')
const systemPrompt = ref('你是一位專業的占卜師，請用神秘而專業的語氣回答問題。')
const isTesting = ref(false)
const testResult = ref<any>(null)

const usageStats = ref({
  openai: 0,
  free: 0,
  total: 0
})

const quickQuestions = [
  '請簡單介紹一下塔羅牌占卜',
  '我的愛情運勢如何？',
  '我應該如何選擇職業？',
  '今天適合做什麼？',
  '請給我一些人生建議'
]

// 生命週期
onMounted(() => {
  loadQuotaStatus()
  loadUsageStats()
})

// 載入配額狀態
async function loadQuotaStatus() {
  try {
    quotaStatus.value = getQuotaStatus()
  } catch (error) {
    console.error('載入配額狀態失敗:', error)
  }
}

// 載入使用統計
function loadUsageStats() {
  // 從 localStorage 載入統計數據
  const stats = localStorage.getItem('ai-usage-stats')
  if (stats) {
    usageStats.value = JSON.parse(stats)
  }
}

// 保存使用統計
function saveUsageStats() {
  localStorage.setItem('ai-usage-stats', JSON.stringify(usageStats.value))
}

// 測試免費 AI
async function testFreeAI() {
  if (!testQuestion.value.trim()) return
  
  isTesting.value = true
  try {
    const response = await callFreeAI(testQuestion.value, systemPrompt.value)
    
    testResult.value = {
      service: '🆓 免費 AI 服務',
      response: response,
      timestamp: new Date()
    }
    
    usageStats.value.free++
    usageStats.value.total++
    saveUsageStats()
    recordAPIUsage('free', true)
  } catch (error) {
    testResult.value = {
      service: '🆓 免費 AI 服務',
      response: `錯誤: ${error}`,
      timestamp: new Date()
    }
    recordAPIUsage('free', false)
  } finally {
    isTesting.value = false
  }
}

// 測試 OpenAI
async function testOpenAI() {
  if (!testQuestion.value.trim()) return
  
  isTesting.value = true
  try {
    const response = await callGPT({
      prompt: testQuestion.value,
      systemPrompt: systemPrompt.value,
      model: 'gpt-3.5-turbo'
    })
    
    testResult.value = {
      service: '🤖 OpenAI',
      response: response,
      timestamp: new Date()
    }
    
    usageStats.value.openai++
    usageStats.value.total++
    saveUsageStats()
    recordAPIUsage('openai', true)
  } catch (error) {
    testResult.value = {
      service: '🤖 OpenAI',
      response: `錯誤: ${error}`,
      timestamp: new Date()
    }
    recordAPIUsage('openai', false)
  } finally {
    isTesting.value = false
  }
}

// 自動選擇服務
async function testAuto() {
  if (!testQuestion.value.trim()) return
  
  isTesting.value = true
  try {
    const response = await callGPT({
      prompt: testQuestion.value,
      systemPrompt: systemPrompt.value,
      model: 'gpt-3.5-turbo'
    })
    
    testResult.value = {
      service: '🎯 自動選擇',
      response: response,
      timestamp: new Date()
    }
    
    // 根據實際使用的服務更新統計
    if (response.includes('免費')) {
      usageStats.value.free++
    } else {
      usageStats.value.openai++
    }
    usageStats.value.total++
    saveUsageStats()
  } catch (error) {
    testResult.value = {
      service: '🎯 自動選擇',
      response: `錯誤: ${error}`,
      timestamp: new Date()
    }
  } finally {
    isTesting.value = false
  }
}

// 設置快捷問題
function setQuickQuestion(question: string) {
  testQuestion.value = question
}

// 格式化日期
function formatDate(date: Date): string {
  return date.toLocaleString('zh-TW')
}
</script>

<style scoped>
.free-ai-test {
  min-height: 100vh;
  background: linear-gradient(135deg, #f7f9fc 0%, #e8f4f8 100%);
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2rem;
}

h2 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 20px;
  border-left: 4px solid #8B5CF6;
  padding-left: 12px;
}

/* 配額狀態 */
.quota-status {
  margin-bottom: 30px;
}

.status-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-left: 5px solid #8B5CF6;
}

.status-card.free {
  border-left-color: #28a745;
}

.status-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.status-icon {
  font-size: 1.5rem;
  margin-right: 8px;
}

.status-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
}

.status-details p {
  margin: 4px 0;
  color: #666;
}

/* 測試區域 */
.test-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
}

.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  transition: border-color 0.3s ease;
}

.form-group textarea:focus {
  outline: none;
  border-color: #8B5CF6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.test-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.test-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.test-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.test-btn.free {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
}

.test-btn.openai {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
}

.test-btn.auto {
  background: linear-gradient(135deg, #ffc107, #fd7e14);
  color: white;
}

.test-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 測試結果 */
.test-result {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.result-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.result-header {
  background: #f8f9fa;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e9ecef;
}

.result-service {
  font-weight: 600;
  color: #2c3e50;
}

.result-time {
  font-size: 0.9rem;
  color: #666;
}

.result-content {
  padding: 16px;
}

.result-text {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  line-height: 1.6;
  color: #2c3e50;
}

/* 使用統計 */
.usage-stats {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 8px;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #8B5CF6;
  margin-bottom: 8px;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

/* 快捷測試 */
.quick-tests {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.quick-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.quick-btn {
  padding: 8px 16px;
  border: 2px solid #8B5CF6;
  background: transparent;
  color: #8B5CF6;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-btn:hover {
  background: #8B5CF6;
  color: white;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
  
  .test-buttons {
    flex-direction: column;
  }
  
  .test-btn {
    width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-buttons {
    flex-direction: column;
  }
  
  .quick-btn {
    text-align: center;
  }
}
</style>

