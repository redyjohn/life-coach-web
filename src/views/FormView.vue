<template>
  <div class="bazi-form">
    <!-- 頁面標題 -->
    <div class="page-header">
      <h1>☯️ 八字命理分析</h1>
      <p class="subtitle">輸入您的生辰信息，探索命盤奧秘</p>
    </div>

    <!-- 表單區域 -->
    <div class="form-card">
      <h2>🔍 請提供您的生辰信息</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="nickname">暱稱</label>
          <input 
            type="text" 
            id="nickname" 
            v-model="form.nickname" 
            placeholder="請輸入您的暱稱"
            required 
          />
        </div>

        <div class="form-group">
          <label for="birthdate">出生日期</label>
          <input 
            type="date" 
            id="birthdate" 
            v-model="form.birthdate" 
            required 
          />
        </div>

        <div class="form-group">
          <label for="birthtime">出生時間</label>
          <input 
            type="time" 
            id="birthtime" 
            v-model="form.birthtime" 
            required 
          />
        </div>

        <div class="form-group">
          <label for="birthplace">出生地點</label>
          <input 
            type="text" 
            id="birthplace" 
            v-model="form.birthplace" 
            placeholder="請輸入您的出生地點"
            required 
          />
        </div>

        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          <span v-if="!isSubmitting">🔮 開始分析</span>
          <span v-else>分析中...</span>
        </button>
      </form>
    </div>

    <!-- 功能介紹 -->
    <div class="features-section">
      <h3>✨ 八字命理分析功能</h3>
      <div class="features-grid">
        <div class="feature-item">
          <div class="feature-icon">📊</div>
          <h4>個人八字（四柱）</h4>
          <p>分析您的年柱、月柱、日柱、時柱，了解基本命格</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🧠</div>
          <h4>日主分析</h4>
          <p>深入分析您的日主特性，了解性格與潛能</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">📈</div>
          <h4>命盤分析</h4>
          <p>全面解析您的命盤格局，預測人生走向</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">💡</div>
          <h4>命理建議</h4>
          <p>提供專業的命理建議，助您趨吉避凶</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🔄</div>
          <h4>大運列表</h4>
          <p>分析您的人生大運，把握重要時機</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">📅</div>
          <h4>流年分析</h4>
          <p>預測今年的運勢變化，做好準備</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isSubmitting = ref(false)

const form = reactive({
  nickname: '',
  birthdate: '',
  birthtime: '',
  birthplace: ''
})

const submitForm = async () => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    // 模擬提交延遲
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push({ path: '/result', query: form })
  } catch (error) {
    console.error('提交失敗:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.bazi-form {
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

.form-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-card h2 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 30px;
  text-align: center;
  border-bottom: 2px solid #8B5CF6;
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 600;
  font-size: 1rem;
}

input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  background: #fafafa;
  box-sizing: border-box;
  max-width: 100%;
}

input:focus {
  outline: none;
  border-color: #8B5CF6;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.submit-btn {
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
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.features-section {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.features-section h3 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 30px;
  text-align: center;
  border-bottom: 2px solid #8B5CF6;
  padding-bottom: 10px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.feature-item {
  padding: 20px;
  background: linear-gradient(135deg, #f8f9ff, #e8f4f8);
  border-radius: 12px;
  border: 2px solid #8B5CF6;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.2);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.feature-item h4 {
  color: #8B5CF6;
  font-size: 1.2rem;
  margin-bottom: 10px;
  font-weight: 600;
}

.feature-item p {
  color: #2c3e50;
  line-height: 1.6;
  margin: 0;
  font-size: 0.9rem;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .bazi-form {
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
  
  .form-card, .features-section {
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
  }
  
  .form-group {
    width: 100%;
    box-sizing: border-box;
  }
  
  input {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .feature-item {
    padding: 15px;
    box-sizing: border-box;
  }
}

/* 超小螢幕優化 */
@media (max-width: 480px) {
  .bazi-form {
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
  
  .form-card, .features-section {
    padding: 16px;
  }
  
  input {
    padding: 10px;
    font-size: 16px; /* 防止iOS自動縮放 */
  }
}
</style>