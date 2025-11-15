import { ref, computed, onMounted } from 'vue'

/**
 * 確保每個用戶都能產生收益的廣告策略
 * 
 * 策略：
 * 1. 入口廣告：用戶首次訪問時必須觀看（100%覆蓋）
 * 2. 瀏覽廣告：在首頁、導航等位置持續顯示（100%覆蓋）
 * 3. 功能前廣告：使用任何功能前必須觀看（100%覆蓋）
 * 4. 結果頁廣告：查看結果時顯示（100%覆蓋）
 * 5. 持續廣告：在頁面中持續顯示（100%覆蓋）
 */
export function useAdRevenue() {
  // 用戶會話狀態
  const sessionId = ref<string>(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const isFirstVisit = ref(true)
  const hasViewedEntryAd = ref(false)
  const hasViewedBrowseAd = ref(false)
  const hasViewedFunctionAd = ref(false)
  const hasViewedResultAd = ref(false)
  
  // 廣告展示追蹤
  const adViewCount = ref(0)
  const adClickCount = ref(0)
  const lastAdViewTime = ref<number | null>(null)
  
  // 功能使用追蹤
  const functionUsageCount = ref(0)
  const lastFunctionUsed = ref<string | null>(null)

  // 檢查是否需要顯示入口廣告（首次訪問）
  const needsEntryAd = computed(() => {
    return isFirstVisit.value && !hasViewedEntryAd.value
  })

  // 檢查是否需要顯示瀏覽廣告（每30分鐘一次）
  const needsBrowseAd = computed(() => {
    if (!lastAdViewTime.value) return true
    const timeSinceLastAd = Date.now() - lastAdViewTime.value
    return timeSinceLastAd > 30 * 60 * 1000 // 30分鐘
  })

  // 檢查是否需要顯示功能前廣告（每次使用功能前）
  const needsFunctionAd = computed(() => {
    return !hasViewedFunctionAd.value
  })

  // 檢查是否需要顯示結果頁廣告（查看結果時）
  const needsResultAd = computed(() => {
    return !hasViewedResultAd.value
  })

  // 檢查是否可以訪問功能（必須先看入口廣告）
  const canAccessFunction = computed(() => {
    return hasViewedEntryAd.value || !isFirstVisit.value
  })

  // 檢查是否可以查看結果（必須先看功能前廣告）
  const canViewResult = computed(() => {
    return hasViewedFunctionAd.value
  })

  // 處理入口廣告觀看
  const handleEntryAdViewed = () => {
    hasViewedEntryAd.value = true
    isFirstVisit.value = false
    adViewCount.value++
    lastAdViewTime.value = Date.now()
    // 保存到 localStorage
    localStorage.setItem('hasViewedEntryAd', 'true')
    localStorage.setItem('firstVisit', 'false')
    localStorage.setItem('lastAdViewTime', Date.now().toString())
  }

  // 處理瀏覽廣告觀看
  const handleBrowseAdViewed = () => {
    hasViewedBrowseAd.value = true
    adViewCount.value++
    lastAdViewTime.value = Date.now()
    localStorage.setItem('lastAdViewTime', Date.now().toString())
  }

  // 處理功能前廣告觀看
  const handleFunctionAdViewed = (functionName: string) => {
    hasViewedFunctionAd.value = true
    lastFunctionUsed.value = functionName
    functionUsageCount.value++
    adViewCount.value++
    lastAdViewTime.value = Date.now()
    localStorage.setItem(`functionAd_${functionName}`, Date.now().toString())
  }

  // 處理結果頁廣告觀看
  const handleResultAdViewed = () => {
    hasViewedResultAd.value = true
    adViewCount.value++
    lastAdViewTime.value = Date.now()
  }

  // 處理廣告點擊
  const handleAdClick = () => {
    adClickCount.value++
    // 這裡可以發送統計到後端
    console.log('📊 Ad clicked:', {
      sessionId: sessionId.value,
      clickCount: adClickCount.value,
      timestamp: new Date().toISOString()
    })
  }

  // 重置功能前廣告狀態（用於下一個功能）
  const resetFunctionAd = () => {
    hasViewedFunctionAd.value = false
  }

  // 重置結果頁廣告狀態（用於下一個結果）
  const resetResultAd = () => {
    hasViewedResultAd.value = false
  }

  // 獲取廣告統計
  const getAdStats = computed(() => {
    return {
      sessionId: sessionId.value,
      adViewCount: adViewCount.value,
      adClickCount: adClickCount.value,
      functionUsageCount: functionUsageCount.value,
      lastAdViewTime: lastAdViewTime.value,
      revenuePotential: adViewCount.value * 0.01 + adClickCount.value * 0.05 // 假設的收益計算
    }
  })

  // 初始化：從 localStorage 恢復狀態
  onMounted(() => {
    const savedEntryAd = localStorage.getItem('hasViewedEntryAd')
    const savedFirstVisit = localStorage.getItem('firstVisit')
    const savedLastAdTime = localStorage.getItem('lastAdViewTime')

    if (savedEntryAd === 'true') {
      hasViewedEntryAd.value = true
    }
    if (savedFirstVisit === 'false') {
      isFirstVisit.value = false
    }
    if (savedLastAdTime) {
      lastAdViewTime.value = parseInt(savedLastAdTime)
    }
  })

  return {
    // 狀態
    sessionId,
    isFirstVisit,
    hasViewedEntryAd,
    hasViewedBrowseAd,
    hasViewedFunctionAd,
    hasViewedResultAd,
    adViewCount,
    adClickCount,
    functionUsageCount,
    
    // 計算屬性
    needsEntryAd,
    needsBrowseAd,
    needsFunctionAd,
    needsResultAd,
    canAccessFunction,
    canViewResult,
    getAdStats,
    
    // 方法
    handleEntryAdViewed,
    handleBrowseAdViewed,
    handleFunctionAdViewed,
    handleResultAdViewed,
    handleAdClick,
    resetFunctionAd,
    resetResultAd
  }
}

