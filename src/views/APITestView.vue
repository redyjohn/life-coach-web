<template>
  <div class="api-test">
    <h1>🧪 API 測試工具</h1>
    
    <div class="test-section">
      <h2>1. 基本 API 測試</h2>
      <button @click="testHelloAPI" :disabled="loading">
        {{ loading ? '測試中...' : '測試 Hello API' }}
      </button>
      <div v-if="helloResult" class="result">
        <h3>Hello API 結果：</h3>
        <pre>{{ helloResult }}</pre>
      </div>
    </div>

    <div class="test-section">
      <h2>2. GPT API 測試 (GET)</h2>
      <button @click="testGPTAPIGet" :disabled="loading">
        {{ loading ? '測試中...' : '測試 GPT API (GET)' }}
      </button>
      <div v-if="gptGetResult" class="result">
        <h3>GPT API (GET) 結果：</h3>
        <pre>{{ gptGetResult }}</pre>
      </div>
    </div>

    <div class="test-section">
      <h2>3. GPT API 測試 (POST)</h2>
      <div class="input-group">
        <textarea 
          v-model="testPrompt" 
          placeholder="輸入測試問題..."
          rows="3"
        ></textarea>
        <button @click="testGPTAPIPost" :disabled="loading || !testPrompt.trim()">
          {{ loading ? '測試中...' : '測試 GPT API (POST)' }}
        </button>
      </div>
      <div v-if="gptPostResult" class="result">
        <h3>GPT API (POST) 結果：</h3>
        <pre>{{ gptPostResult }}</pre>
      </div>
    </div>

    <div class="test-section">
      <h2>4. 環境資訊</h2>
      <div class="env-info">
        <p><strong>當前網址：</strong> {{ currentUrl }}</p>
        <p><strong>API 基礎網址：</strong> {{ apiBaseUrl }}</p>
        <p><strong>測試時間：</strong> {{ currentTime }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const loading = ref(false)
const helloResult = ref('')
const gptGetResult = ref('')
const gptPostResult = ref('')
const testPrompt = ref('請簡單介紹一下八字命理')
const currentUrl = ref('')
const apiBaseUrl = ref('')

onMounted(() => {
  currentUrl.value = window.location.href
  apiBaseUrl.value = `${window.location.origin}/api`
})

const testHelloAPI = async () => {
  loading.value = true
  helloResult.value = ''
  
  try {
    const response = await fetch('/api/hello')
    const data = await response.json()
    helloResult.value = JSON.stringify(data, null, 2)
  } catch (error) {
    helloResult.value = `錯誤: ${error.message}`
  } finally {
    loading.value = false
  }
}

const testGPTAPIGet = async () => {
  loading.value = true
  gptGetResult.value = ''
  
  try {
    const response = await fetch('/api/gpt')
    const data = await response.json()
    gptGetResult.value = JSON.stringify(data, null, 2)
  } catch (error) {
    gptGetResult.value = `錯誤: ${error.message}`
  } finally {
    loading.value = false
  }
}

const testGPTAPIPost = async () => {
  loading.value = true
  gptPostResult.value = ''
  
  try {
    const response = await fetch('/api/gpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: testPrompt.value,
        systemPrompt: '你是一位八字命理老師，請用簡潔的方式回答。'
      })
    })

    const data = await response.json()
    gptPostResult.value = JSON.stringify(data, null, 2)
  } catch (error) {
    gptPostResult.value = `錯誤: ${error.message}`
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.api-test {
  max-width: 900px;
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
  margin: 10px 5px;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.input-group {
  margin-bottom: 15px;
}

.input-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  font-family: inherit;
}

.result {
  background: white;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-top: 10px;
}

.result pre {
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 12px;
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
