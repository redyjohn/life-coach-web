import { ref, computed } from 'vue'

/**
 * 統一的廣告 gating 策略
 * 策略：第1次免費，第2次需廣告，第3次免費，第4次需廣告...
 */
export function useAdGating() {
  const askCount = ref(0)
  const adClicked = ref(false)

  // 計算是否需要廣告
  const needsAd = computed(() => {
    const nextQuestionNumber = askCount.value + 1
    return nextQuestionNumber % 2 === 0 && !adClicked.value
  })

  // 是否可以提問
  const canAsk = computed(() => !needsAd.value)

  // 獲取當前狀態文字
  const getStatusText = computed(() => {
    const nextQuestionNumber = askCount.value + 1
    if (nextQuestionNumber === 1) {
      return '🆓 免費提問'
    } else if (nextQuestionNumber % 2 === 0) {
      return '🎬 需觀看廣告'
    } else {
      return '🆓 免費提問'
    }
  })

  // 獲取按鈕文字
  const getButtonText = computed(() => {
    if (needsAd.value) {
      return '🎬 觀看廣告後提問'
    } else {
      return '💫 請教命理老師'
    }
  })

  // 處理廣告點擊
  const handleAdClick = () => {
    adClicked.value = true
  }

  // 處理提問（增加計數並重置廣告狀態）
  const handleQuestionAsked = () => {
    askCount.value++
    adClicked.value = false
  }

  // 重置狀態
  const reset = () => {
    askCount.value = 0
    adClicked.value = false
  }

  return {
    askCount,
    adClicked,
    needsAd,
    canAsk,
    getStatusText,
    getButtonText,
    handleAdClick,
    handleQuestionAsked,
    reset
  }
}
