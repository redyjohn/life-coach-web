<!-- AdBanner.vue - 支持多種廣告類型 -->
<template>
  <div 
    :class="['ad-box', `ad-type-${type}`, { 'ad-clickable': clickable }]"
    :ref="adContainerRef"
    @click="handleClick"
  >
    <!-- Google AdSense 廣告（如果已配置） -->
    <ins 
      v-if="useAdSense && adSenseClientId"
      class="adsbygoogle"
      :style="adSenseStyle"
      :data-ad-client="adSenseClientId"
      :data-ad-slot="adSenseSlot"
      :data-ad-format="adFormat"
      :data-full-width-responsive="responsive"
    ></ins>
    
    <!-- 占位符廣告（開發/測試用） -->
    <div v-else class="ad-placeholder">
      <div class="ad-icon">🔗</div>
      <div class="ad-text">
        <div class="ad-label">{{ adLabel }}</div>
        <div class="ad-hint">廣告位（可替換成 AdSense）</div>
      </div>
      <div v-if="showTimer && viewTime > 0" class="ad-timer">
        {{ Math.ceil(viewTime / 1000) }}秒
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

interface Props {
  // 廣告類型
  type?: 'entry' | 'browse' | 'function' | 'result' | 'persistent'
  // 是否可點擊
  clickable?: boolean
  // 是否需要計時（用於強制觀看時長）
  showTimer?: boolean
  // 最小觀看時長（毫秒）
  minViewTime?: number
  // Google AdSense 配置
  useAdSense?: boolean
  adSenseClientId?: string
  adSenseSlot?: string
  adFormat?: string
  responsive?: boolean
  // 自定義標籤
  adLabel?: string
  // 自定義樣式
  customStyle?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  type: 'persistent',
  clickable: true,
  showTimer: false,
  minViewTime: 0,
  useAdSense: false,
  adFormat: 'auto',
  responsive: true,
  adLabel: '廣告位',
  customStyle: () => ({})
})

const emit = defineEmits<{
  viewed: [viewTime: number]
  clicked: []
  timerComplete: []
}>()

const adContainerRef = ref<HTMLElement | null>(null)
const viewStartTime = ref<number | null>(null)
const viewTime = ref(0)
const timerInterval = ref<number | null>(null)
const hasViewed = ref(false)

// 根據廣告類型設置樣式
const adSenseStyle = computed(() => {
  const baseStyle: Record<string, string> = {
    display: 'block'
  }
  
  switch (props.type) {
    case 'entry':
      return { ...baseStyle, width: '100%', minHeight: '250px' }
    case 'browse':
      return { ...baseStyle, width: '100%', minHeight: '90px' }
    case 'function':
      return { ...baseStyle, width: '100%', minHeight: '200px' }
    case 'result':
      return { ...baseStyle, width: '100%', minHeight: '100px' }
    case 'persistent':
    default:
      return { ...baseStyle, width: '100%', minHeight: '250px' }
  }
})

// 處理點擊
const handleClick = () => {
  if (props.clickable) {
    emit('clicked')
  }
}

// 開始計時
const startTimer = () => {
  if (!props.showTimer || props.minViewTime <= 0) return
  
  viewStartTime.value = Date.now()
  timerInterval.value = window.setInterval(() => {
    if (viewStartTime.value) {
      viewTime.value = Date.now() - viewStartTime.value
      
      // 達到最小觀看時長
      if (viewTime.value >= props.minViewTime && !hasViewed.value) {
        hasViewed.value = true
        emit('viewed', viewTime.value)
        emit('timerComplete')
      }
    }
  }, 100)
}

// 停止計時
const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
  
  if (viewStartTime.value && !hasViewed.value) {
    const totalTime = Date.now() - viewStartTime.value
    viewTime.value = totalTime
    emit('viewed', totalTime)
  }
}

// 初始化 Google AdSense
const initAdSense = () => {
  if (!props.useAdSense || !props.adSenseClientId) return
  
  // 確保 AdSense 腳本已加載
  if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    } catch (e) {
      console.error('AdSense initialization error:', e)
    }
  }
}

onMounted(() => {
  // 使用 Intersection Observer 檢測廣告是否可見
  if (adContainerRef.value && props.showTimer) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startTimer()
          } else {
            stopTimer()
          }
        })
      },
      { threshold: 0.5 }
    )
    
    observer.observe(adContainerRef.value)
    
    onUnmounted(() => {
      observer.disconnect()
      stopTimer()
    })
  } else if (props.showTimer) {
    // 如果沒有 Intersection Observer，直接開始計時
    startTimer()
  }
  
  // 初始化 AdSense
  if (props.useAdSense) {
    // 延遲初始化，確保 AdSense 腳本已加載
    setTimeout(() => {
      initAdSense()
    }, 100)
  }
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.ad-box {
  position: relative;
  background: #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-size: 14px;
  border: 1px dashed #bbb;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.ad-box:hover {
  border-color: #8B5CF6;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.2);
}

.ad-box.ad-clickable {
  cursor: pointer;
}

/* 不同廣告類型的樣式 */
.ad-type-entry {
  width: 100%;
  min-height: 250px;
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
}

.ad-type-browse {
  width: 100%;
  min-height: 90px;
  background: linear-gradient(135deg, #e8f4f8, #d1e7dd);
}

.ad-type-function {
  width: 100%;
  min-height: 200px;
  background: linear-gradient(135deg, #f8d7da, #f5c2c7);
}

.ad-type-result {
  width: 100%;
  min-height: 100px;
  background: linear-gradient(135deg, #d1ecf1, #bee5eb);
}

.ad-type-persistent {
  width: 100%;
  min-height: 250px;
  background: linear-gradient(135deg, #e2e3e5, #d6d8db);
}

/* 占位符樣式 */
.ad-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 100%;
  height: 100%;
  gap: 12px;
}

.ad-icon {
  font-size: 2rem;
}

.ad-text {
  text-align: center;
}

.ad-label {
  font-weight: 600;
  color: #8B5CF6;
  margin-bottom: 4px;
}

.ad-hint {
  font-size: 12px;
  color: #999;
}

.ad-timer {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(139, 92, 246, 0.9);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .ad-type-entry,
  .ad-type-persistent {
    min-height: 200px;
  }
  
  .ad-type-function {
    min-height: 150px;
  }
  
  .ad-type-browse,
  .ad-type-result {
    min-height: 80px;
  }
}
</style>
