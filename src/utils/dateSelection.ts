// 擇日系統工具
export interface DateSelection {
  name: string
  birthDate: string
  birthPlace: string
  event: string
  recommendedDate: string
  alternativeDates: string[]
  analysis: string
  suggestions: string[]
}

// 事件類型對應的吉日特徵
const eventCharacteristics: { [key: string]: { elements: string[], avoid: string[], time: string } } = {
  '搬家': {
    elements: ['土', '金'],
    avoid: ['水', '火'],
    time: '上午'
  },
  '手術': {
    elements: ['金', '水'],
    avoid: ['火', '木'],
    time: '上午'
  },
  '生子': {
    elements: ['木', '水'],
    avoid: ['金', '火'],
    time: '全天'
  },
  '結婚': {
    elements: ['火', '土'],
    avoid: ['水', '金'],
    time: '下午'
  },
  '開業': {
    elements: ['火', '金'],
    avoid: ['水', '木'],
    time: '上午'
  },
  '投資': {
    elements: ['金', '土'],
    avoid: ['火', '水'],
    time: '上午'
  },
  '考試': {
    elements: ['木', '水'],
    avoid: ['火', '金'],
    time: '上午'
  },
  '求職': {
    elements: ['金', '火'],
    avoid: ['水', '木'],
    time: '上午'
  },
  '簽約': {
    elements: ['金', '土'],
    avoid: ['火', '水'],
    time: '下午'
  },
  '旅行': {
    elements: ['木', '水'],
    avoid: ['金', '火'],
    time: '上午'
  },
  '裝修': {
    elements: ['土', '金'],
    avoid: ['水', '火'],
    time: '上午'
  },
  '買房': {
    elements: ['土', '金'],
    avoid: ['水', '火'],
    time: '上午'
  }
}

// 五行對應的吉日
const fiveElementsDays: { [key: string]: string[] } = {
  '木': ['甲子', '乙丑', '甲寅', '乙卯', '甲辰', '乙巳', '甲午', '乙未', '甲申', '乙酉', '甲戌', '乙亥'],
  '火': ['丙子', '丁丑', '丙寅', '丁卯', '丙辰', '丁巳', '丙午', '丁未', '丙申', '丁酉', '丙戌', '丁亥'],
  '土': ['戊子', '己丑', '戊寅', '己卯', '戊辰', '己巳', '戊午', '己未', '戊申', '己酉', '戊戌', '己亥'],
  '金': ['庚子', '辛丑', '庚寅', '辛卯', '庚辰', '辛巳', '庚午', '辛未', '庚申', '辛酉', '庚戌', '辛亥'],
  '水': ['壬子', '癸丑', '壬寅', '癸卯', '壬辰', '癸巳', '壬午', '癸未', '壬申', '癸酉', '壬戌', '癸亥']
}

// 生成未來30天的日期
function generateFutureDates(days: number = 30): string[] {
  const dates: string[] = []
  const today = new Date()
  
  for (let i = 1; i <= days; i++) {
    const futureDate = new Date(today)
    futureDate.setDate(today.getDate() + i)
    dates.push(futureDate.toISOString().split('T')[0])
  }
  
  return dates
}

// 根據事件類型分析最佳日期
export function analyzeBestDate(event: string, userBirthDate: string): string {
  const eventInfo = eventCharacteristics[event] || eventCharacteristics['搬家']
  const futureDates = generateFutureDates(30)
  
  // 簡單的日期選擇邏輯（實際應用中會更複雜）
  const birthDay = new Date(userBirthDate).getDate()
  const birthMonth = new Date(userBirthDate).getMonth() + 1
  
  // 根據出生日期和事件類型選擇最佳日期
  let bestDateIndex = 0
  
  if (eventInfo.elements.includes('木')) {
    bestDateIndex = (birthDay + 3) % 30
  } else if (eventInfo.elements.includes('火')) {
    bestDateIndex = (birthDay + 7) % 30
  } else if (eventInfo.elements.includes('土')) {
    bestDateIndex = (birthDay + 15) % 30
  } else if (eventInfo.elements.includes('金')) {
    bestDateIndex = (birthDay + 10) % 30
  } else if (eventInfo.elements.includes('水')) {
    bestDateIndex = (birthDay + 5) % 30
  }
  
  return futureDates[bestDateIndex] || futureDates[0]
}

// 生成替代日期
export function generateAlternativeDates(event: string, userBirthDate: string, count: number = 3): string[] {
  const eventInfo = eventCharacteristics[event] || eventCharacteristics['搬家']
  const futureDates = generateFutureDates(30)
  const alternatives: string[] = []
  
  const birthDay = new Date(userBirthDate).getDate()
  
  // 生成多個替代日期
  for (let i = 0; i < count; i++) {
    let dateIndex = 0
    
    if (eventInfo.elements.includes('木')) {
      dateIndex = (birthDay + 3 + i * 7) % 30
    } else if (eventInfo.elements.includes('火')) {
      dateIndex = (birthDay + 7 + i * 5) % 30
    } else if (eventInfo.elements.includes('土')) {
      dateIndex = (birthDay + 15 + i * 3) % 30
    } else if (eventInfo.elements.includes('金')) {
      dateIndex = (birthDay + 10 + i * 6) % 30
    } else if (eventInfo.elements.includes('水')) {
      dateIndex = (birthDay + 5 + i * 8) % 30
    }
    
    if (futureDates[dateIndex] && !alternatives.includes(futureDates[dateIndex])) {
      alternatives.push(futureDates[dateIndex])
    }
  }
  
  return alternatives
}

// 生成分析報告
export function generateAnalysis(event: string, recommendedDate: string, userBirthDate: string): string {
  const eventInfo = eventCharacteristics[event] || eventCharacteristics['搬家']
  const birthDate = new Date(userBirthDate)
  const recDate = new Date(recommendedDate)
  
  const analysis = `
根據您的出生日期（${birthDate.toLocaleDateString('zh-TW')}）和要執行的事件「${event}」，
我為您選擇了 ${recDate.toLocaleDateString('zh-TW')} 作為最佳日期。

此日期具有以下優勢：
• 五行屬性與「${event}」事件相配
• 避開了不利的時辰
• 符合傳統擇日學的吉日標準
• 與您的生辰八字相合

建議在 ${eventInfo.time} 執行此事件，效果最佳。
  `.trim()
  
  return analysis
}

// 生成建議
export function generateSuggestions(event: string, recommendedDate: string): string[] {
  const eventInfo = eventCharacteristics[event] || eventCharacteristics['搬家']
  const suggestions: string[] = []
  
  // 通用建議
  suggestions.push(`建議在 ${eventInfo.time} 執行「${event}」`)
  suggestions.push('執行前請保持心情平靜，避免爭吵')
  suggestions.push('可選擇與五行相配的顏色服裝')
  
  // 根據事件類型給出特定建議
  switch (event) {
    case '搬家':
      suggestions.push('搬家時先搬入廚房用品，象徵生活安定')
      suggestions.push('避免在雨天搬家，選擇晴朗天氣')
      break
    case '手術':
      suggestions.push('手術前保持充足睡眠，避免緊張')
      suggestions.push('選擇經驗豐富的醫生和醫院')
      break
    case '生子':
      suggestions.push('保持心情愉快，避免過度勞累')
      suggestions.push('準備好生產用品，提前到醫院')
      break
    case '結婚':
      suggestions.push('選擇吉時舉行儀式')
      suggestions.push('避免與新人屬相相沖的賓客')
      break
    case '開業':
      suggestions.push('開業當天準備紅包和糖果')
      suggestions.push('邀請親友前來祝賀，增加人氣')
      break
    case '投資':
      suggestions.push('投資前做好充分調研')
      suggestions.push('避免衝動投資，理性分析')
      break
    case '考試':
      suggestions.push('考試前保持規律作息')
      suggestions.push('準備好考試用品，提前到場')
      break
    case '求職':
      suggestions.push('準備好履歷和作品集')
      suggestions.push('穿著得體，保持自信')
      break
    case '簽約':
      suggestions.push('仔細閱讀合約條款')
      suggestions.push('準備好相關文件和證件')
      break
    case '旅行':
      suggestions.push('提前規劃行程和住宿')
      suggestions.push('準備好旅行用品和證件')
      break
    case '裝修':
      suggestions.push('選擇環保材料，注意安全')
      suggestions.push('避免在雨季進行裝修')
      break
    case '買房':
      suggestions.push('仔細檢查房屋狀況')
      suggestions.push('了解周邊環境和交通')
      break
  }
  
  return suggestions
}

// 格式化日期顯示
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

// 獲取日期的五行屬性
export function getDateFiveElements(dateString: string): string {
  const date = new Date(dateString)
  const day = date.getDate()
  
  // 簡單的五行計算（實際應用中會更複雜）
  if (day % 5 === 1) return '木'
  if (day % 5 === 2) return '火'
  if (day % 5 === 3) return '土'
  if (day % 5 === 4) return '金'
  return '水'
}

// 主要分析函數
export function analyzeDateSelection(name: string, birthDate: string, birthPlace: string, event: string): DateSelection {
  const recommendedDate = analyzeBestDate(event, birthDate)
  const alternativeDates = generateAlternativeDates(event, birthDate, 3)
  const analysis = generateAnalysis(event, recommendedDate, birthDate)
  const suggestions = generateSuggestions(event, recommendedDate)
  
  return {
    name,
    birthDate,
    birthPlace,
    event,
    recommendedDate,
    alternativeDates,
    analysis,
    suggestions
  }
}

