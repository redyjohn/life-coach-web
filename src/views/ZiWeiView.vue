<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import solarlunar from 'solarlunar'

const router = useRouter()

// 表單數據
const formData = ref({
  name: '',
  gender: '男',
  birthDate: '',
  birthTime: '',
  birthPlace: ''
})

// 狀態管理
const isLoading = ref(false)
const errors = ref<Record<string, string>>({})
const showSuccess = ref(false)

// 驗證規則
const validateName = (name: string): string | null => {
  if (!name.trim()) return '請填寫姓名'
  if (name.trim().length < 2) return '姓名至少需要2個字符'
  if (name.trim().length > 10) return '姓名不能超過10個字符'
  return null
}

const validateBirthDate = (date: string): string | null => {
  if (!date) return '請選擇出生日期'
  
  const birthDate = new Date(date)
  const today = new Date()
  const minDate = new Date('1900-01-01')
  
  if (birthDate > today) return '出生日期不能是未來'
  if (birthDate < minDate) return '出生日期不能早於1900年'
  
  return null
}

const validateBirthTime = (time: string): string | null => {
  if (!time) return '請選擇出生時間'
  
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  if (!timeRegex.test(time)) return '時間格式不正確'
  
  return null
}

const validateBirthPlace = (place: string): string | null => {
  if (!place.trim()) return '請填寫出生地點'
  if (place.trim().length < 2) return '出生地點至少需要2個字符'
  return null
}

// 實時驗證
const validateField = (field: string, value: string) => {
  let error: string | null = null
  
  switch (field) {
    case 'name':
      error = validateName(value)
      break
    case 'birthDate':
      error = validateBirthDate(value)
      break
    case 'birthTime':
      error = validateBirthTime(value)
      break
    case 'birthPlace':
      error = validateBirthPlace(value)
      break
  }
  
  if (error) {
    errors.value[field] = error
  } else {
    delete errors.value[field]
  }
}

// 表單驗證
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {}
  
  const nameError = validateName(formData.value.name)
  if (nameError) newErrors.name = nameError
  
  const birthDateError = validateBirthDate(formData.value.birthDate)
  if (birthDateError) newErrors.birthDate = birthDateError
  
  const birthTimeError = validateBirthTime(formData.value.birthTime)
  if (birthTimeError) newErrors.birthTime = birthTimeError
  
  const birthPlaceError = validateBirthPlace(formData.value.birthPlace)
  if (birthPlaceError) newErrors.birthPlace = birthPlaceError
  
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

// 表單提交
const handleSubmit = async () => {
  if (!validateForm()) {
    // 聚焦到第一個有錯誤的欄位
    const firstErrorField = Object.keys(errors.value)[0]
    if (firstErrorField) {
      await nextTick()
      const element = document.getElementById(firstErrorField)
      element?.focus()
    }
    return
  }
  
  isLoading.value = true
  
  try {
    // 國曆轉農曆
    const [year, month, day] = formData.value.birthDate.split('-').map(Number)
    const lunar = solarlunar.solar2lunar(year, month, day)
    
    if (!lunar || !lunar.lYear) {
      throw new Error('日期轉換失敗，請檢查日期是否正確')
    }
    
    const lunarInfo = {
      lunarYear: lunar.lYear,
      lunarMonth: lunar.lMonth,
      lunarDay: lunar.lDay,
      isLeapMonth: lunar.isLeap
    }
    
    const query = {
      name: formData.value.name,
      gender: formData.value.gender,
      birthDate: formData.value.birthDate,
      birthTime: formData.value.birthTime,
      birthPlace: formData.value.birthPlace,
      lunarInfo: encodeURIComponent(JSON.stringify(lunarInfo))
    }
    
    showSuccess.value = true
    
    // 延遲跳轉以顯示成功狀態
    setTimeout(() => {
      router.push({ path: '/ziwei/result', query })
    }, 1000)
    
  } catch (error) {
    console.error('表單提交錯誤:', error)
    errors.value.submit = error instanceof Error ? error.message : '提交失敗，請稍後重試'
  } finally {
    isLoading.value = false
  }
}

// 計算屬性
const isFormValid = computed(() => {
  return Object.keys(errors.value).length === 0 && 
         formData.value.name.trim() && 
         formData.value.birthDate && 
         formData.value.birthTime && 
         formData.value.birthPlace.trim()
})

// 清除錯誤
const clearError = (field: string) => {
  delete errors.value[field]
}
</script>

<template>
  <div class="form-wrapper">
    <div class="form-header">
      <h1>⭐ 探索你的紫微命盤</h1>
      <p class="subtitle">透過生辰八字，洞察命運軌跡</p>
    </div>

    <form @submit.prevent="handleSubmit" class="ziwei-form">
      <!-- 成功提示 -->
      <div v-if="showSuccess" class="success-message">
        <div class="success-icon">✅</div>
        <div class="success-text">資料提交成功！正在為您生成命盤...</div>
      </div>

      <!-- 全局錯誤提示 -->
      <div v-if="errors.submit" class="error-message">
        <div class="error-icon">❌</div>
        <div class="error-text">{{ errors.submit }}</div>
      </div>

      <!-- 姓名 -->
      <div class="form-group">
        <label for="name" class="form-label">
          姓名 <span class="required">*</span>
        </label>
        <input
          type="text"
          id="name"
          v-model="formData.name"
          :class="['form-input', { 'error': errors.name }]"
          placeholder="請輸入您的姓名"
          maxlength="10"
          @blur="validateField('name', formData.name)"
          @input="clearError('name')"
        />
        <div v-if="errors.name" class="field-error">{{ errors.name }}</div>
      </div>

      <!-- 性別 -->
      <div class="form-group">
        <label for="gender" class="form-label">
          性別 <span class="required">*</span>
        </label>
        <select
          id="gender"
          v-model="formData.gender"
          class="form-select"
        >
          <option value="男">男</option>
          <option value="女">女</option>
        </select>
      </div>

      <!-- 出生日期 -->
      <div class="form-group">
        <label for="birthDate" class="form-label">
          出生日期 <span class="required">*</span>
          <span class="label-hint">（國曆）</span>
        </label>
        <input
          type="date"
          id="birthDate"
          v-model="formData.birthDate"
          :class="['form-input', { 'error': errors.birthDate }]"
          :max="new Date().toISOString().split('T')[0]"
          min="1900-01-01"
          @blur="validateField('birthDate', formData.birthDate)"
          @input="clearError('birthDate')"
        />
        <div v-if="errors.birthDate" class="field-error">{{ errors.birthDate }}</div>
      </div>

      <!-- 出生時間 -->
      <div class="form-group">
        <label for="birthTime" class="form-label">
          出生時間 <span class="required">*</span>
          <span class="label-hint">（24小時制）</span>
        </label>
        <input
          type="time"
          id="birthTime"
          v-model="formData.birthTime"
          :class="['form-input', { 'error': errors.birthTime }]"
          @blur="validateField('birthTime', formData.birthTime)"
          @input="clearError('birthTime')"
        />
        <div v-if="errors.birthTime" class="field-error">{{ errors.birthTime }}</div>
        <div class="field-hint">
          💡 時間越精確，命盤分析越準確
        </div>
      </div>

      <!-- 出生地點 -->
      <div class="form-group">
        <label for="birthPlace" class="form-label">
          出生地點 <span class="required">*</span>
        </label>
        <input
          type="text"
          id="birthPlace"
          v-model="formData.birthPlace"
          :class="['form-input', { 'error': errors.birthPlace }]"
          placeholder="例如：台北市、北京市"
          maxlength="20"
          @blur="validateField('birthPlace', formData.birthPlace)"
          @input="clearError('birthPlace')"
        />
        <div v-if="errors.birthPlace" class="field-error">{{ errors.birthPlace }}</div>
      </div>

      <!-- 提交按鈕 -->
      <button
        type="submit"
        :disabled="!isFormValid || isLoading"
        :class="['submit-btn', { 'loading': isLoading }]"
      >
        <span v-if="isLoading" class="loading-spinner"></span>
        {{ isLoading ? '正在生成命盤...' : '🔮 開始解盤' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.form-wrapper {
  max-width: 520px;
  margin: 20px auto;
  padding: 32px;
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(139, 92, 246, 0.2);
  font-family: 'Microsoft JhengHei', 'Segoe UI', sans-serif;
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-header h1 {
  font-size: 28px;
  color: white;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin: 0;
}

.ziwei-form {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.required {
  color: #e74c3c;
}

.label-hint {
  font-size: 12px;
  color: #7f8c8d;
  font-weight: normal;
}

.form-input,
.form-select {
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  transition: all 0.2s ease;
  background: white;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus {
  border-color: #8B5CF6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.form-input.error,
.form-select.error {
  border-color: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.field-error {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.field-hint {
  color: #7f8c8d;
  font-size: 12px;
  margin-top: 4px;
}

.submit-btn {
  width: 100%;
  padding: 14px 20px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.submit-btn.loading {
  pointer-events: none;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-message,
.error-message {
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
}

.success-message {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.success-icon,
.error-icon {
  font-size: 16px;
  flex-shrink: 0;
}

/* 響應式設計 */
@media (max-width: 600px) {
  .form-wrapper {
    margin: 10px;
    padding: 20px;
    box-sizing: border-box;
    width: calc(100% - 20px);
    max-width: 100%;
  }
  
  .ziwei-form {
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
  }
  
  .form-group {
    width: 100%;
    box-sizing: border-box;
  }
  
  .form-input,
  .form-select {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  
  .form-header h1 {
    font-size: 24px;
  }
}

/* 超小螢幕優化 */
@media (max-width: 480px) {
  .form-wrapper {
    margin: 5px;
    padding: 16px;
  }
  
  .ziwei-form {
    padding: 16px;
  }
  
  .form-header h1 {
    font-size: 20px;
  }
  
  .form-input,
  .form-select {
    padding: 10px;
    font-size: 16px; /* 防止iOS自動縮放 */
  }
}
</style>