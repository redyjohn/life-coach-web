// 易經六十四卦數據（繁體中文版）
export interface IChingHexagram {
  number: number
  name: string
  chineseName: string
  symbol: string
  description: string
  meaning: string
  advice: string
  keywords: string[]
}

// 六十四卦數據
export const hexagrams: IChingHexagram[] = [
  {
    number: 1,
    name: "乾卦",
    chineseName: "乾",
    symbol: "☰",
    description: "天在上，天在下",
    meaning: "純陽之氣，力量、領導、創造力",
    advice: "要堅強果斷，以信心和正直領導。",
    keywords: ["力量", "領導", "創造力", "陽"]
  },
  {
    number: 2,
    name: "坤卦",
    chineseName: "坤",
    symbol: "☷",
    description: "地在上，地在下",
    meaning: "純陰之氣，接納、滋養、支持",
    advice: "要接納和支持，滋養他人並保持耐心。",
    keywords: ["接納", "滋養", "支持", "陰"]
  },
  {
    number: 3,
    name: "屯卦",
    chineseName: "屯",
    symbol: "☵☳",
    description: "水在上，雷在下",
    meaning: "初始困難，通過奮鬥成長",
    advice: "要堅持度過初始挑戰，成長來自克服障礙。",
    keywords: ["困難", "開始", "成長", "堅持"]
  },
  {
    number: 4,
    name: "蒙卦",
    chineseName: "蒙",
    symbol: "☶☵",
    description: "山在上，水在下",
    meaning: "年輕的愚昧，需要教導",
    advice: "要謙虛學習，接受指導和教誨。",
    keywords: ["愚昧", "教導", "學習", "謙虛"]
  },
  {
    number: 5,
    name: "需卦",
    chineseName: "需",
    symbol: "☵☰",
    description: "水在上，天在下",
    meaning: "等待，需要耐心",
    advice: "要耐心等待，時機成熟時自然會成功。",
    keywords: ["等待", "耐心", "時機", "需要"]
  },
  {
    number: 6,
    name: "訟卦",
    chineseName: "訟",
    symbol: "☰☵",
    description: "天在上，水在下",
    meaning: "爭訟，衝突",
    advice: "要避免爭訟，尋求和解與妥協。",
    keywords: ["爭訟", "衝突", "和解", "妥協"]
  },
  {
    number: 7,
    name: "師卦",
    chineseName: "師",
    symbol: "☷☵",
    description: "地在上，水在下",
    meaning: "軍隊，紀律，領導",
    advice: "要有紀律和組織，以正義為指導。",
    keywords: ["軍隊", "紀律", "領導", "正義"]
  },
  {
    number: 8,
    name: "比卦",
    chineseName: "比",
    symbol: "☵☷",
    description: "水在上，地在下",
    meaning: "親近，團結",
    advice: "要團結合作，建立良好的關係。",
    keywords: ["親近", "團結", "合作", "關係"]
  },
  {
    number: 9,
    name: "小畜卦",
    chineseName: "小畜",
    symbol: "☴☰",
    description: "風在上，天在下",
    meaning: "小有積蓄，漸進發展",
    advice: "要循序漸進，積少成多。",
    keywords: ["積蓄", "漸進", "發展", "耐心"]
  },
  {
    number: 10,
    name: "履卦",
    chineseName: "履",
    symbol: "☰☱",
    description: "天在上，澤在下",
    meaning: "踐履，行動",
    advice: "要謹慎行動，遵循正道。",
    keywords: ["踐履", "行動", "謹慎", "正道"]
  },
  {
    number: 11,
    name: "泰卦",
    chineseName: "泰",
    symbol: "☷☰",
    description: "地在上，天在下",
    meaning: "通泰，和諧",
    advice: "要維持和諧，順應自然。",
    keywords: ["通泰", "和諧", "順應", "自然"]
  },
  {
    number: 12,
    name: "否卦",
    chineseName: "否",
    symbol: "☰☷",
    description: "天在上，地在下",
    meaning: "閉塞，困難",
    advice: "要等待時機，不要強求。",
    keywords: ["閉塞", "困難", "等待", "時機"]
  },
  {
    number: 13,
    name: "同人卦",
    chineseName: "同人",
    symbol: "☲☰",
    description: "火在上，天在下",
    meaning: "同人，團結",
    advice: "要團結一致，共同奮鬥。",
    keywords: ["同人", "團結", "一致", "奮鬥"]
  },
  {
    number: 14,
    name: "大有卦",
    chineseName: "大有",
    symbol: "☰☲",
    description: "天在上，火在下",
    meaning: "大有，豐盛",
    advice: "要分享財富，回饋社會。",
    keywords: ["大有", "豐盛", "分享", "回饋"]
  },
  {
    number: 15,
    name: "謙卦",
    chineseName: "謙",
    symbol: "☷☶",
    description: "地在上，山在下",
    meaning: "謙虛，謙遜",
    advice: "要保持謙虛，虛心學習。",
    keywords: ["謙虛", "謙遜", "學習", "虛心"]
  },
  {
    number: 16,
    name: "豫卦",
    chineseName: "豫",
    symbol: "☳☷",
    description: "雷在上，地在下",
    meaning: "豫樂，預備",
    advice: "要預先準備，享受快樂。",
    keywords: ["豫樂", "預備", "準備", "快樂"]
  },
  {
    number: 17,
    name: "隨卦",
    chineseName: "隨",
    symbol: "☱☳",
    description: "澤在上，雷在下",
    meaning: "隨從，順應",
    advice: "要順應時勢，隨機應變。",
    keywords: ["隨從", "順應", "時勢", "應變"]
  },
  {
    number: 18,
    name: "蠱卦",
    chineseName: "蠱",
    symbol: "☶☴",
    description: "山在上，風在下",
    meaning: "蠱惑，腐敗",
    advice: "要清除腐敗，重新開始。",
    keywords: ["蠱惑", "腐敗", "清除", "重新開始"]
  },
  {
    number: 19,
    name: "臨卦",
    chineseName: "臨",
    symbol: "☷☱",
    description: "地在上，澤在下",
    meaning: "臨近，監臨",
    advice: "要親臨指導，以身作則。",
    keywords: ["臨近", "監臨", "指導", "以身作則"]
  },
  {
    number: 20,
    name: "觀卦",
    chineseName: "觀",
    symbol: "☴☷",
    description: "風在上，地在下",
    meaning: "觀察，觀看",
    advice: "要仔細觀察，深入了解。",
    keywords: ["觀察", "觀看", "仔細", "了解"]
  }
]

// 抽取卦象
export function drawHexagram(): IChingHexagram {
  const randomIndex = Math.floor(Math.random() * hexagrams.length)
  return hexagrams[randomIndex]
}

// 根據問題推薦卦象
export function getRecommendedHexagram(question: string): IChingHexagram {
  const lowerQuestion = question.toLowerCase()
  
  if (lowerQuestion.includes('愛情') || lowerQuestion.includes('感情') || lowerQuestion.includes('關係')) {
    return hexagrams.find(h => h.number === 8) || drawHexagram() // 比卦
  }
  
  if (lowerQuestion.includes('事業') || lowerQuestion.includes('工作') || lowerQuestion.includes('職場')) {
    return hexagrams.find(h => h.number === 1) || drawHexagram() // 乾卦
  }
  
  if (lowerQuestion.includes('健康') || lowerQuestion.includes('身體') || lowerQuestion.includes('醫療')) {
    return hexagrams.find(h => h.number === 2) || drawHexagram() // 坤卦
  }
  
  if (lowerQuestion.includes('財運') || lowerQuestion.includes('金錢') || lowerQuestion.includes('投資')) {
    return hexagrams.find(h => h.number === 14) || drawHexagram() // 大有卦
  }
  
  if (lowerQuestion.includes('決策') || lowerQuestion.includes('選擇') || lowerQuestion.includes('決定')) {
    return hexagrams.find(h => h.number === 20) || drawHexagram() // 觀卦
  }
  
  // 默認隨機抽取
  return drawHexagram()
}

// 獲取卦象解讀
export function getHexagramInterpretation(hexagram: IChingHexagram, question: string): string {
  return `根據您提出的問題「${question}」，易經為您抽到了第${hexagram.number}卦：${hexagram.chineseName}卦。

卦象：${hexagram.symbol}
卦名：${hexagram.name}
含義：${hexagram.meaning}

建議：${hexagram.advice}

關鍵詞：${hexagram.keywords.join('、')}

這個卦象提醒您要${hexagram.advice}，在面對當前情況時，應該${hexagram.meaning}。`
}

// 問題類別定義
export type QuestionCategory = '運勢' | '愛情' | '事業' | '財運' | '健康' | '決策' | '人際' | '其他'

// 檢測問題類別
export function detectQuestionCategory(question: string): QuestionCategory {
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

// 檢查問題類別是否一致（允許子類別）
export function checkQuestionCategoryConsistency(currentCategory: QuestionCategory, previousCategory: QuestionCategory): boolean {
  // 如果新問題與前一個問題類別相同，則允許
  if (currentCategory === previousCategory) {
    return true
  }
  
  // 如果原本問的是"運勢"類別，可以接著問運勢的子問題（注意事項等）
  if (previousCategory === '運勢') {
    // 允許運勢類別的子問題，比如"注意事項"、"今日該做什麼"等
    if (currentCategory === '運勢' || currentCategory === '其他') {
      return true
    }
  }
  
  // 如果原本問的是其他類別（愛情、事業、財運等），必須是同類別的子問題
  // 不允許跨類別詢問（比如從愛情跳到事業）
  return false
}