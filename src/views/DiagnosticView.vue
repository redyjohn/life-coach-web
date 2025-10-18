<template>
  <div class="diagnostic">
    <h1>🔧 API 診斷工具</h1>
    
    <div class="test-section">
      <h2>1. 基本 API 測試</h2>
      <button @click="testBasicAPI" :disabled="isLoading">
        {{ isLoading ? '測試中...' : '測試 API 連線' }}
      </button>
      <div v-if="testResult" class="result">
        <h3>測試結果：</h3>
        <pre>{{ testResult }}</pre>
      </div>
    </div>

    <div class="test-section">
      <h2>2. OpenAI API 測試</h2>
      <button @click="testOpenAI" :disabled="isLoading">
        {{ isLoading ? '測試中...' : '測試 OpenAI 整合' }}
      </button>
      <div v-if="openAIResult" class="result">
        <h3>OpenAI 測試結果：</h3>
        <pre>{{ openAIResult }}</pre>
      </div>
    </div>

    <div class="test-section">
      <h2>3. 環境資訊</h2>
      <div class="env-info">
        <p><strong>當前網址：</strong> {{ currentUrl }}</p>
        <p><strong>API 端點：</strong> {{ apiEndpoint }}</p>
        <p><strong>時間：</strong> {{ currentTime }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isLoading = ref(false)
const testResult = ref('')
const openAIResult = ref('')
const currentUrl = ref('')
const apiEndpoint = ref('')

onMounted(() => {
  currentUrl.value = window.location.href
  apiEndpoint.value = `${window.location.origin}/api/gpt`
})

const testBasicAPI = async () => {
  isLoading.value = true
  testResult.value = ''
  
  try {
    const response = await fetch('/api/gpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Hello, this is a test.',
        systemPrompt: 'You are a helpful assistant.'
      })
    })

    const data = await response.json()
    testResult.value = JSON.stringify({
      status: response.status,
      statusText: response.statusText,
      data: data
    }, null, 2)
  } catch (error) {
    testResult.value = `錯誤: ${error.message}`
  } finally {
    isLoading.value = false
  }
}

const testOpenAI = async () => {
  isLoading.value = true
  openAIResult.value = ''
  
  try {
    const response = await fetch('/api/gpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: '請簡單介紹一下八字命理',
        systemPrompt: '你是一位八字命理老師，請用簡潔的方式回答。'
      })
    })

    const data = await response.json()
    openAIResult.value = JSON.stringify({
      status: response.status,
      statusText: response.statusText,
      data: data
    }, null, 2)
  } catch (error) {
    openAIResult.value = `錯誤: ${error.message}`
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.diagnostic {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  font-family: 'Microsoft JhengHei', sans-serif;
}

.test-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 15px;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.result {
  background: white;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.result pre {
  white-space: pre-wrap;
  word-break: break-word;
}

.env-info {
  background: white;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.env-info p {
  margin: 5px 0;
}
</style>
