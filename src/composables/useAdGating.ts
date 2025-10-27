import { ref, computed } from 'vue'

/**
 * 統一的廣告 gating 策略
 * 策略：奇數次免費（第1、3、5...次），偶數次需廣告（第2、4、6...次）
 */
export function useAdGating() {
  const askCount = ref(0)
  const adClicked = ref(false)

  // 計算是否需要廣告
  // 偶數次（2, 4, 6, ...）需要廣告，奇數次（1, 3, 5, ...）免費
  const needsAd = computed(() => {
    const nextQuestionNumber = askCount.value + 1
    // 偶數次需要廣告，但用戶需先點擊廣告
    return nextQuestionNumber % 2 === 0 && !adClicked.value
  })

  // 是否可以提問
  const canAsk = computed(() => !needsAd.value)

  // 獲取當前狀態文字
  const getStatusText = computed(() => {
    const nextQuestionNumber = askCount.value + 1
    // 奇數次免費，偶數次需廣告
    if (nextQuestionNumber % 2 === 1) {
      return '🆓 可免費提問'
    } else if (adClicked.value) {
      // 偶數次但已點擊廣告，可以提問
      return '✅ 可免費提問'
    } else {
      // 偶數次且未點擊廣告
      return '🎬 需觀看廣告'
    }
  })

  // 獲取按鈕文字
  const getButtonText = computed(() => {
    if (needsAd.value) {
      return '🎬 觀看廣告後提問'
    } else {
      const nextQuestionNumber = askCount.value + 1
      if (nextQuestionNumber % 2 === 1) {
        return '💫 免費提問'
      } else {
        return '✅ 可免費提問'
      }
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
