// 簡化版塔羅牌數據庫（繁體中文版）
export interface TarotCard {
  id: number
  name: string
  nameEn: string
  suit: 'major' | 'cups' | 'wands' | 'swords' | 'pentacles'
  number?: number
  meaning: string
  reversed: boolean
  description: string
  keywords: string[]
  element?: string
  planet?: string
  zodiac?: string
}

// 大阿爾卡納（22張）
export const majorArcana: TarotCard[] = [
  {
    id: 0,
    name: '愚者',
    nameEn: 'The Fool',
    suit: 'major',
    meaning: '新的開始、冒險、純真',
    reversed: false,
    description: '愚者代表新的開始和無限的可能性。',
    keywords: ['新開始', '冒險', '純真', '自由', '可能性'],
    element: '風',
    planet: '天王星'
  },
  {
    id: 1,
    name: '魔術師',
    nameEn: 'The Magician',
    suit: 'major',
    meaning: '意志力、創造力、行動',
    reversed: false,
    description: '魔術師有能力將想法轉化為現實。',
    keywords: ['意志力', '創造力', '行動', '技能', '專注'],
    element: '風',
    planet: '水星'
  },
  {
    id: 2,
    name: '女祭司',
    nameEn: 'The High Priestess',
    suit: 'major',
    meaning: '直覺、神秘、內在智慧',
    reversed: false,
    description: '女祭司代表內在智慧和直覺。',
    keywords: ['直覺', '神秘', '內在智慧', '潛意識', '秘密'],
    element: '水',
    planet: '月亮'
  },
  {
    id: 3,
    name: '皇后',
    nameEn: 'The Empress',
    suit: 'major',
    meaning: '豐盛、母性、創造力',
    reversed: false,
    description: '皇后代表豐盛、母性和創造力。',
    keywords: ['豐盛', '母性', '創造力', '自然', '滋養'],
    element: '土',
    planet: '金星'
  },
  {
    id: 4,
    name: '皇帝',
    nameEn: 'The Emperor',
    suit: 'major',
    meaning: '權威、秩序、領導',
    reversed: false,
    description: '皇帝代表權威、秩序和領導力。',
    keywords: ['權威', '秩序', '領導', '穩定', '控制'],
    element: '火',
    planet: '火星'
  },
  {
    id: 5,
    name: '教皇',
    nameEn: 'The Hierophant',
    suit: 'major',
    meaning: '傳統、教導、精神指引',
    reversed: false,
    description: '教皇代表傳統、教導和精神指引。',
    keywords: ['傳統', '教導', '精神指引', '儀式', '智慧'],
    element: '土',
    planet: '金星'
  },
  {
    id: 6,
    name: '戀人',
    nameEn: 'The Lovers',
    suit: 'major',
    meaning: '愛情、選擇、和諧',
    reversed: false,
    description: '戀人代表愛情、選擇和和諧。',
    keywords: ['愛情', '選擇', '和諧', '關係', '平衡'],
    element: '風',
    planet: '水星'
  },
  {
    id: 7,
    name: '戰車',
    nameEn: 'The Chariot',
    suit: 'major',
    meaning: '意志力、勝利、控制',
    reversed: false,
    description: '戰車代表意志力、勝利和控制。',
    keywords: ['意志力', '勝利', '控制', '決心', '成功'],
    element: '水',
    planet: '月亮'
  },
  {
    id: 8,
    name: '力量',
    nameEn: 'Strength',
    suit: 'major',
    meaning: '內在力量、勇氣、耐心',
    reversed: false,
    description: '力量代表內在力量、勇氣和耐心。',
    keywords: ['內在力量', '勇氣', '耐心', '控制', '溫柔'],
    element: '火',
    planet: '太陽'
  },
  {
    id: 9,
    name: '隱者',
    nameEn: 'The Hermit',
    suit: 'major',
    meaning: '內省、智慧、指引',
    reversed: false,
    description: '隱者代表內省、智慧和指引。',
    keywords: ['內省', '智慧', '指引', '孤獨', '真理'],
    element: '土',
    planet: '水星'
  },
  {
    id: 10,
    name: '命運之輪',
    nameEn: 'Wheel of Fortune',
    suit: 'major',
    meaning: '命運、變化、循環',
    reversed: false,
    description: '命運之輪代表命運、變化和循環。',
    keywords: ['命運', '變化', '循環', '機會', '轉機'],
    element: '火',
    planet: '木星'
  },
  {
    id: 11,
    name: '正義',
    nameEn: 'Justice',
    suit: 'major',
    meaning: '正義、平衡、真理',
    reversed: false,
    description: '正義代表正義、平衡和真理。',
    keywords: ['正義', '平衡', '真理', '公平', '責任'],
    element: '風',
    planet: '金星'
  },
  {
    id: 12,
    name: '倒吊人',
    nameEn: 'The Hanged Man',
    suit: 'major',
    meaning: '犧牲、等待、新視角',
    reversed: false,
    description: '倒吊人代表犧牲、等待和新視角。',
    keywords: ['犧牲', '等待', '新視角', '暫停', '反思'],
    element: '水',
    planet: '海王星'
  },
  {
    id: 13,
    name: '死神',
    nameEn: 'Death',
    suit: 'major',
    meaning: '結束、轉變、重生',
    reversed: false,
    description: '死神代表結束、轉變和重生。',
    keywords: ['結束', '轉變', '重生', '變化', '釋放'],
    element: '水',
    planet: '天蠍座'
  },
  {
    id: 14,
    name: '節制',
    nameEn: 'Temperance',
    suit: 'major',
    meaning: '平衡、調和、耐心',
    reversed: false,
    description: '節制代表平衡、調和和耐心。',
    keywords: ['平衡', '調和', '耐心', '中庸', '融合'],
    element: '火',
    planet: '木星'
  },
  {
    id: 15,
    name: '惡魔',
    nameEn: 'The Devil',
    suit: 'major',
    meaning: '束縛、誘惑、物質主義',
    reversed: false,
    description: '惡魔代表束縛、誘惑和物質主義。',
    keywords: ['束縛', '誘惑', '物質主義', '依賴', '恐懼'],
    element: '土',
    planet: '土星'
  },
  {
    id: 16,
    name: '塔',
    nameEn: 'The Tower',
    suit: 'major',
    meaning: '突變、覺醒、解放',
    reversed: false,
    description: '塔代表突變、覺醒和解放。',
    keywords: ['突變', '覺醒', '解放', '破壞', '啟示'],
    element: '火',
    planet: '火星'
  },
  {
    id: 17,
    name: '星星',
    nameEn: 'The Star',
    suit: 'major',
    meaning: '希望、靈感、指引',
    reversed: false,
    description: '星星代表希望、靈感和指引。',
    keywords: ['希望', '靈感', '指引', '平靜', '信心'],
    element: '風',
    planet: '水瓶座'
  },
  {
    id: 18,
    name: '月亮',
    nameEn: 'The Moon',
    suit: 'major',
    meaning: '幻覺、潛意識、恐懼',
    reversed: false,
    description: '月亮代表幻覺、潛意識和恐懼。',
    keywords: ['幻覺', '潛意識', '恐懼', '直覺', '神秘'],
    element: '水',
    planet: '月亮'
  },
  {
    id: 19,
    name: '太陽',
    nameEn: 'The Sun',
    suit: 'major',
    meaning: '快樂、成功、活力',
    reversed: false,
    description: '太陽代表快樂、成功和活力。',
    keywords: ['快樂', '成功', '活力', '樂觀', '成就'],
    element: '火',
    planet: '太陽'
  },
  {
    id: 20,
    name: '審判',
    nameEn: 'Judgement',
    suit: 'major',
    meaning: '重生、覺醒、救贖',
    reversed: false,
    description: '審判代表重生、覺醒和救贖。',
    keywords: ['重生', '覺醒', '救贖', '寬恕', '召喚'],
    element: '火',
    planet: '冥王星'
  },
  {
    id: 21,
    name: '世界',
    nameEn: 'The World',
    suit: 'major',
    meaning: '完成、成就、圓滿',
    reversed: false,
    description: '世界代表完成、成就和圓滿。',
    keywords: ['完成', '成就', '圓滿', '成功', '旅行'],
    element: '土',
    planet: '土星'
  }
]

// 聖杯牌組（部分）
export const cupsCards: TarotCard[] = [
  {
    id: 22,
    name: '聖杯王牌',
    nameEn: 'Ace of Cups',
    suit: 'cups',
    number: 1,
    meaning: '新的情感開始、愛情的萌芽',
    reversed: false,
    description: '聖杯王牌代表新的情感開始和愛情的萌芽。',
    keywords: ['新開始', '愛情', '情感', '直覺', '精神'],
    element: '水'
  },
  {
    id: 23,
    name: '聖杯二',
    nameEn: 'Two of Cups',
    suit: 'cups',
    number: 2,
    meaning: '愛情、夥伴關係、和諧',
    reversed: false,
    description: '聖杯二代表愛情、夥伴關係和和諧。',
    keywords: ['愛情', '夥伴關係', '和諧', '合作', '平衡'],
    element: '水'
  },
  {
    id: 24,
    name: '聖杯三',
    nameEn: 'Three of Cups',
    suit: 'cups',
    number: 3,
    meaning: '友誼、慶祝、歡樂',
    reversed: false,
    description: '聖杯三代表友誼、慶祝和歡樂。',
    keywords: ['友誼', '慶祝', '歡樂', '聚會', '成功'],
    element: '水'
  }
]

// 權杖牌組（部分）
export const wandsCards: TarotCard[] = [
  {
    id: 25,
    name: '權杖王牌',
    nameEn: 'Ace of Wands',
    suit: 'wands',
    number: 1,
    meaning: '新的開始、創造力、靈感',
    reversed: false,
    description: '權杖王牌代表新的開始、創造力和靈感。',
    keywords: ['新開始', '創造力', '靈感', '熱情', '行動'],
    element: '火'
  },
  {
    id: 26,
    name: '權杖二',
    nameEn: 'Two of Wands',
    suit: 'wands',
    number: 2,
    meaning: '計劃、決策、未來',
    reversed: false,
    description: '權杖二代表計劃、決策和未來。',
    keywords: ['計劃', '決策', '未來', '控制', '領導'],
    element: '火'
  }
]

// 寶劍牌組（部分）
export const swordsCards: TarotCard[] = [
  {
    id: 27,
    name: '寶劍王牌',
    nameEn: 'Ace of Swords',
    suit: 'swords',
    number: 1,
    meaning: '新的想法、真理、正義',
    reversed: false,
    description: '寶劍王牌代表新的想法、真理和正義。',
    keywords: ['新想法', '真理', '正義', '清晰', '突破'],
    element: '風'
  },
  {
    id: 28,
    name: '寶劍二',
    nameEn: 'Two of Swords',
    suit: 'swords',
    number: 2,
    meaning: '困難的選擇、平衡、猶豫',
    reversed: false,
    description: '寶劍二代表困難的選擇、平衡和猶豫。',
    keywords: ['困難選擇', '平衡', '猶豫', '僵局', '決策'],
    element: '風'
  }
]

// 錢幣牌組（部分）
export const pentaclesCards: TarotCard[] = [
  {
    id: 29,
    name: '錢幣王牌',
    nameEn: 'Ace of Pentacles',
    suit: 'pentacles',
    number: 1,
    meaning: '新的機會、物質成功、潛力',
    reversed: false,
    description: '錢幣王牌代表新的機會、物質成功和潛力。',
    keywords: ['新機會', '物質成功', '潛力', '財富', '穩定'],
    element: '土'
  },
  {
    id: 30,
    name: '錢幣二',
    nameEn: 'Two of Pentacles',
    suit: 'pentacles',
    number: 2,
    meaning: '平衡、優先順序、多工',
    reversed: false,
    description: '錢幣二代表平衡、優先順序和多工。',
    keywords: ['平衡', '優先順序', '多工', '靈活', '適應'],
    element: '土'
  }
]

// 所有塔羅牌
export const allTarotCards: TarotCard[] = [
  ...majorArcana,
  ...cupsCards,
  ...wandsCards,
  ...swordsCards,
  ...pentaclesCards
]

// 抽牌函數
export function drawCards(count: number): TarotCard[] {
  const shuffled = [...allTarotCards].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map(card => ({
    ...card,
    reversed: Math.random() < 0.3 // 30% 機率為逆位
  }))
}

// 根據問題推薦牌陣
export function getRecommendedSpread(question: string): { name: string, count: number, description: string } {
  const lowerQuestion = question.toLowerCase()
  
  if (lowerQuestion.includes('愛情') || lowerQuestion.includes('感情') || lowerQuestion.includes('關係')) {
    return {
      name: '愛情三角牌陣',
      count: 3,
      description: '探索愛情關係的過去、現在和未來'
    }
  }
  
  if (lowerQuestion.includes('事業') || lowerQuestion.includes('工作') || lowerQuestion.includes('職場')) {
    return {
      name: '事業發展牌陣',
      count: 3,
      description: '分析事業發展的現況、挑戰和機會'
    }
  }
  
  if (lowerQuestion.includes('健康') || lowerQuestion.includes('身體') || lowerQuestion.includes('醫療')) {
    return {
      name: '健康狀況牌陣',
      count: 3,
      description: '了解健康狀況和養生建議'
    }
  }
  
  if (lowerQuestion.includes('財運') || lowerQuestion.includes('金錢') || lowerQuestion.includes('投資')) {
    return {
      name: '財運分析牌陣',
      count: 3,
      description: '分析財運狀況和理財建議'
    }
  }
  
  // 默認牌陣
  return {
    name: '一般指引牌陣',
    count: 3,
    description: '提供一般性的指引和建議'
  }
}

// 獲取大阿爾卡納符號
export function getMajorSymbol(cardName: string): string {
  const symbols: { [key: string]: string } = {
    '愚者': '🃏',
    '魔術師': '🎩',
    '女祭司': '🌙',
    '皇后': '👑',
    '皇帝': '⚔️',
    '教皇': '⛪',
    '戀人': '💕',
    '戰車': '🏛️',
    '力量': '🦁',
    '隱者': '🔦',
    '命運之輪': '🎡',
    '正義': '⚖️',
    '倒吊人': '🙃',
    '死神': '💀',
    '節制': '🍷',
    '惡魔': '😈',
    '塔': '🗼',
    '星星': '⭐',
    '月亮': '🌙',
    '太陽': '☀️',
    '審判': '📯',
    '世界': '🌍'
  }
  return symbols[cardName] || '🃏'
}

// 塔羅牌問題類別定義
export type TarotQuestionCategory = '運勢' | '愛情' | '事業' | '財運' | '健康' | '決策' | '人際' | '其他'

// 檢測塔羅牌問題類別
export function detectTarotQuestionCategory(question: string): TarotQuestionCategory {
  const lowerQuestion = question.toLowerCase()
  
  // 運勢類別
  if (lowerQuestion.includes('運勢') || lowerQuestion.includes('運程') || lowerQuestion.includes('今日') || lowerQuestion.includes('今天') || lowerQuestion.includes('注意事項') || lowerQuestion.includes('要注意')) {
    return '運勢'
  }
  
  // 愛情類別
  if (lowerQuestion.includes('愛情') || lowerQuestion.includes('感情') || lowerQuestion.includes('戀愛') || lowerQuestion.includes('婚姻') || lowerQuestion.includes('緣分') || lowerQuestion.includes('桃花') || lowerQuestion.includes('伴侶')) {
    return '愛情'
  }
  
  // 事業類別
  if (lowerQuestion.includes('事業') || lowerQuestion.includes('工作') || lowerQuestion.includes('職場') || lowerQuestion.includes('升職') || lowerQuestion.includes('職涯') || lowerQuestion.includes('公司')) {
    return '事業'
  }
  
  // 財運類別
  if (lowerQuestion.includes('財運') || lowerQuestion.includes('金錢') || lowerQuestion.includes('投資') || lowerQuestion.includes('收入') || lowerQuestion.includes('賺錢') || lowerQuestion.includes('理財')) {
    return '財運'
  }
  
  // 健康類別
  if (lowerQuestion.includes('健康') || lowerQuestion.includes('身體') || lowerQuestion.includes('疾病') || lowerQuestion.includes('醫療') || lowerQuestion.includes('養生')) {
    return '健康'
  }
  
  // 人際類別
  if (lowerQuestion.includes('人際') || lowerQuestion.includes('朋友') || lowerQuestion.includes('社交') || lowerQuestion.includes('關係') || lowerQuestion.includes('同事')) {
    return '人際'
  }
  
  // 決策類別
  if (lowerQuestion.includes('決策') || lowerQuestion.includes('選擇') || lowerQuestion.includes('決定') || lowerQuestion.includes('應該') || lowerQuestion.includes('如何做')) {
    return '決策'
  }
  
  return '其他'
}

// 檢查塔羅牌問題類別一致性
export function checkTarotQuestionCategoryConsistency(currentCategory: TarotQuestionCategory, previousCategory: TarotQuestionCategory): boolean {
  // 如果新問題與前一個問題類別相同，則允許
  if (currentCategory === previousCategory) {
    return true
  }
  
  // 如果原本問的是"運勢"類別，可以接著問運勢的子問題
  if (previousCategory === '運勢') {
    if (currentCategory === '運勢' || currentCategory === '其他') {
      return true
    }
  }
  
  // 不允許跨類別詢問
  return false
}