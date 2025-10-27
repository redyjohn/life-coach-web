// 姓名學分析工具
export interface NameAnalysis {
  name: string
  birthDate: string
  birthPlace: string
  totalStrokes: number
  fiveElements: string
  personality: string
  career: string
  health: string
  relationships: string
  luck: string
  suggestions: string[]
  alternativeNames: string[]
}

// 五行對應表
const fiveElementsMap: { [key: number]: string } = {
  1: '木', 2: '木', 3: '火', 4: '火', 5: '土', 6: '土', 7: '金', 8: '金', 9: '水', 0: '水'
}

// 筆畫數對應的五行
const strokeFiveElements: { [key: number]: string } = {
  1: '木', 2: '木', 3: '火', 4: '火', 5: '土', 6: '土', 7: '金', 8: '金', 9: '水', 10: '水',
  11: '木', 12: '木', 13: '火', 14: '火', 15: '土', 16: '土', 17: '金', 18: '金', 19: '水', 20: '水',
  21: '木', 22: '木', 23: '火', 24: '火', 25: '土', 26: '土', 27: '金', 28: '金', 29: '水', 30: '水'
}

// 常用字的筆畫數（簡化版）
const characterStrokes: { [key: string]: number } = {
  // 常用姓氏
  '王': 4, '李': 7, '張': 11, '劉': 15, '陳': 16, '楊': 13, '黃': 12, '趙': 14, '周': 8, '吳': 7,
  '徐': 10, '孫': 10, '胡': 9, '朱': 6, '高': 10, '林': 8, '何': 7, '郭': 15, '馬': 10, '羅': 19,
  '梁': 11, '宋': 7, '鄭': 19, '謝': 17, '韓': 17, '唐': 10, '馮': 12, '于': 3, '董': 15, '蕭': 16,
  
  // 常用名字
  '明': 8, '華': 12, '建': 9, '國': 11, '文': 4, '德': 15, '志': 7, '強': 11, '偉': 11, '軍': 9,
  '傑': 12, '勇': 9, '濤': 18, '波': 8, '峰': 10, '山': 3, '海': 9, '天': 4, '宇': 6, '星': 9,
  '月': 4, '日': 4, '春': 9, '夏': 10, '秋': 9, '冬': 5, '東': 8, '西': 6, '南': 9, '北': 5,
  '中': 4, '正': 5, '義': 13, '信': 9, '仁': 4, '禮': 17, '智': 12, '慧': 15, '美': 9, '麗': 19,
  '芳': 7, '香': 9, '花': 7, '草': 9, '樹': 16, '林': 8, '森': 12, '竹': 6, '梅': 11, '蘭': 20,
  '菊': 11, '蓮': 13, '荷': 10, '桃': 10, '李': 7, '杏': 7, '梨': 11, '橘': 16, '橙': 16, '櫻': 21,
  '楓': 13, '松': 8, '柏': 9, '柳': 9, '楊': 13, '槐': 14, '榆': 13, '桐': 10, '梓': 11, '楠': 13,
  '欣': 8, '悅': 10, '樂': 15, '歡': 22, '喜': 12, '愛': 13, '情': 11, '心': 4, '意': 13, '思': 9,
  '想': 13, '念': 8, '記': 10, '憶': 16, '夢': 13, '希': 7, '望': 11, '願': 19, '福': 13, '祿': 12,
  '壽': 14, '康': 11, '健': 11, '安': 6, '寧': 14, '靜': 16, '和': 8, '平': 5, '祥': 11, '瑞': 13,
  '吉': 6, '利': 7, '順': 12, '通': 10, '達': 16, '成': 6, '功': 5, '業': 13, '績': 17, '果': 8,
  '實': 14, '真': 10, '善': 12, '美': 9, '好': 6, '優': 17, '秀': 7, '傑': 12, '出': 5, '眾': 11,
  '超': 12, '越': 12, '進': 11, '步': 7, '發': 12, '展': 10, '開': 12, '拓': 8, '創': 12, '新': 13,
  '立': 5, '足': 7, '穩': 19, '固': 8, '堅': 11, '強': 11, '硬': 12, '軟': 11, '輕': 14, '重': 9,
  '大': 3, '小': 3, '高': 10, '低': 7, '長': 8, '短': 12, '寬': 15, '窄': 10, '厚': 9, '薄': 16,
  '深': 11, '淺': 11, '遠': 13, '近': 7, '快': 7, '慢': 14, '急': 9, '緩': 15, '早': 6, '晚': 11,
  '新': 13, '舊': 18, '老': 6, '少': 4, '多': 6, '少': 4, '全': 6, '半': 5, '整': 16, '零': 13,
  '一': 1, '二': 2, '三': 3, '四': 5, '五': 4, '六': 4, '七': 2, '八': 2, '九': 2, '十': 2,
  '百': 6, '千': 3, '萬': 13, '億': 15, '兆': 6, '京': 8, '垓': 9, '秭': 9, '穰': 22, '溝': 13,
  '澗': 15, '正': 5, '負': 6, '加': 5, '減': 11, '乘': 10, '除': 9, '等': 12, '於': 8, '是': 9,
  '非': 8, '有': 6, '無': 12, '在': 6, '不': 4, '可': 5, '能': 10, '會': 13, '要': 9, '需': 14,
  '必': 5, '須': 12, '應': 17, '該': 13, '當': 13, '就': 12, '都': 11, '也': 3, '還': 16, '再': 6,
  '又': 2, '更': 7, '最': 12, '很': 9, '太': 4, '極': 12, '非': 8, '常': 11, '特': 10, '別': 7,
  '特': 10, '殊': 10, '奇': 8, '怪': 8, '異': 6, '同': 6, '相': 9, '似': 7, '像': 14, '如': 6,
  '若': 8, '假': 11, '真': 10, '實': 14, '虛': 11, '空': 8, '滿': 14, '缺': 10, '完': 7, '整': 16,
  '破': 10, '壞': 19, '好': 6, '壞': 19, '對': 14, '錯': 16, '正': 5, '反': 4, '前': 9, '後': 9,
  '左': 5, '右': 5, '上': 3, '下': 3, '內': 4, '外': 5, '中': 4, '間': 12, '邊': 18, '角': 7,
  '圓': 13, '方': 4, '長': 8, '短': 12, '粗': 11, '細': 11, '厚': 9, '薄': 16, '寬': 15, '窄': 10,
  '高': 10, '低': 7, '大': 3, '小': 3, '多': 6, '少': 4, '全': 6, '半': 5, '整': 16, '零': 13
}

// 計算字符的筆畫數
function getCharacterStrokes(char: string): number {
  return characterStrokes[char] || Math.floor(Math.random() * 20) + 1
}

// 計算姓名的總筆畫數
export function calculateTotalStrokes(name: string): number {
  let total = 0
  for (const char of name) {
    total += getCharacterStrokes(char)
  }
  return total
}

// 根據筆畫數確定五行
export function getFiveElements(strokes: number): string {
  const remainder = strokes % 10
  return fiveElementsMap[remainder] || '土'
}

// 根據五行分析性格
export function getPersonalityAnalysis(fiveElements: string): string {
  const personalityMap: { [key: string]: string } = {
    '木': '性格溫和，富有創造力，具有領導才能，但可能過於理想主義。',
    '火': '熱情開朗，積極進取，具有強烈的行動力，但可能缺乏耐心。',
    '土': '穩重可靠，務實踏實，具有強烈的責任感，但可能過於保守。',
    '金': '理性冷靜，邏輯思維強，具有強烈的正義感，但可能過於嚴肅。',
    '水': '智慧靈活，適應力強，具有強烈的直覺力，但可能過於敏感。'
  }
  return personalityMap[fiveElements] || '性格平衡，具有多方面的特質。'
}

// 根據五行分析事業
export function getCareerAnalysis(fiveElements: string): string {
  const careerMap: { [key: string]: string } = {
    '木': '適合從事教育、文化、藝術、園林等行業，具有很好的創造力和領導能力。',
    '火': '適合從事銷售、公關、娛樂、餐飲等行業，具有很好的溝通能力和行動力。',
    '土': '適合從事建築、房地產、農業、金融等行業，具有很好的穩定性和責任感。',
    '金': '適合從事法律、醫療、科技、工程等行業，具有很好的邏輯思維和專業能力。',
    '水': '適合從事貿易、物流、旅遊、服務等行業，具有很好的適應力和直覺力。'
  }
  return careerMap[fiveElements] || '適合從事多種行業，具有很好的適應能力。'
}

// 根據五行分析健康
export function getHealthAnalysis(fiveElements: string): string {
  const healthMap: { [key: string]: string } = {
    '木': '需要注意肝膽、眼睛、神經系統的健康，建議多接觸大自然。',
    '火': '需要注意心臟、血液循環、精神狀態的健康，建議保持規律作息。',
    '土': '需要注意脾胃、消化系統、肌肉的健康，建議注意飲食均衡。',
    '金': '需要注意肺部、呼吸系統、皮膚的健康，建議多呼吸新鮮空氣。',
    '水': '需要注意腎臟、泌尿系統、骨骼的健康，建議多補充水分。'
  }
  return healthMap[fiveElements] || '整體健康狀況良好，建議保持規律的生活習慣。'
}

// 根據五行分析人際關係
export function getRelationshipAnalysis(fiveElements: string): string {
  const relationshipMap: { [key: string]: string } = {
    '木': '人際關係和諧，容易獲得他人信任，但需要注意不要過於依賴他人。',
    '火': '人際關係活躍，容易結交朋友，但需要注意控制情緒，避免衝突。',
    '土': '人際關係穩定，朋友忠誠可靠，但需要注意不要過於固執己見。',
    '金': '人際關係理性，朋友品質較高，但需要注意不要過於嚴肅，缺乏幽默感。',
    '水': '人際關係靈活，朋友多樣化，但需要注意不要過於敏感，影響關係。'
  }
  return relationshipMap[fiveElements] || '人際關係良好，容易與他人建立良好的關係。'
}

// 根據五行分析運勢
export function getLuckAnalysis(fiveElements: string): string {
  const luckMap: { [key: string]: string } = {
    '木': '運勢穩步上升，適合在春季發展，建議把握機會，積極進取。',
    '火': '運勢波動較大，適合在夏季發展，建議保持熱情，但要注意控制。',
    '土': '運勢穩定持久，適合在長夏發展，建議穩紮穩打，積累實力。',
    '金': '運勢逐漸提升，適合在秋季發展，建議理性規劃，循序漸進。',
    '水': '運勢靈活多變，適合在冬季發展，建議順應變化，把握時機。'
  }
  return luckMap[fiveElements] || '運勢整體良好，建議保持積極的心態。'
}

// 生成建議
export function generateSuggestions(fiveElements: string, name: string): string[] {
  const suggestions: string[] = []
  
  // 根據五行給出建議
  switch (fiveElements) {
    case '木':
      suggestions.push('建議多接觸綠色植物，有助於提升運勢')
      suggestions.push('適合在東方發展事業')
      suggestions.push('建議培養藝術或文學方面的興趣')
      break
    case '火':
      suggestions.push('建議多參與社交活動，有助於提升人際關係')
      suggestions.push('適合在南方發展事業')
      suggestions.push('建議保持積極樂觀的心態')
      break
    case '土':
      suggestions.push('建議多接觸大自然，有助於穩定情緒')
      suggestions.push('適合在中部地區發展事業')
      suggestions.push('建議培養耐心和責任感')
      break
    case '金':
      suggestions.push('建議多呼吸新鮮空氣，有助於健康')
      suggestions.push('適合在西方發展事業')
      suggestions.push('建議培養邏輯思維能力')
      break
    case '水':
      suggestions.push('建議多接觸水源，有助於提升智慧')
      suggestions.push('適合在北方發展事業')
      suggestions.push('建議培養直覺和靈感')
      break
  }
  
  // 根據姓名長度給出建議
  if (name.length === 2) {
    suggestions.push('建議考慮使用三字名，有助於平衡五行')
  } else if (name.length === 3) {
    suggestions.push('姓名結構良好，建議保持現有格局')
  } else if (name.length > 3) {
    suggestions.push('建議簡化姓名，有助於提升運勢')
  }
  
  return suggestions
}

// 生成替代姓名建議
export function generateAlternativeNames(originalName: string, fiveElements: string): string[] {
  const alternatives: string[] = []
  const surname = originalName[0]
  const givenName = originalName.slice(1)
  
  // 根據五行推薦合適的字
  const suitableCharacters: { [key: string]: string[] } = {
    '木': ['林', '森', '樹', '竹', '梅', '蘭', '菊', '蓮', '荷', '桃', '李', '杏', '梨', '橘', '橙', '櫻', '楓', '松', '柏', '柳', '楊', '槐', '榆', '桐', '梓', '楠'],
    '火': ['明', '華', '建', '國', '文', '德', '志', '強', '偉', '軍', '傑', '勇', '濤', '波', '峰', '山', '海', '天', '宇', '星', '月', '日', '春', '夏', '秋', '冬'],
    '土': ['中', '正', '義', '信', '仁', '禮', '智', '慧', '美', '麗', '芳', '香', '花', '草', '樹', '林', '森', '竹', '梅', '蘭', '菊', '蓮', '荷', '桃', '李', '杏'],
    '金': ['金', '銀', '銅', '鐵', '鋼', '鋒', '銳', '利', '劍', '刀', '槍', '矛', '盾', '甲', '盔', '冠', '冕', '珠', '寶', '玉', '石', '鑽', '晶', '瑩', '亮', '光'],
    '水': ['水', '海', '江', '河', '湖', '池', '泉', '溪', '流', '波', '濤', '浪', '潮', '雨', '雪', '冰', '霜', '露', '霧', '雲', '風', '氣', '空', '天', '宇', '星']
  }
  
  const characters = suitableCharacters[fiveElements] || suitableCharacters['土']
  
  // 生成3個替代姓名
  for (let i = 0; i < 3; i++) {
    const randomChar1 = characters[Math.floor(Math.random() * characters.length)]
    const randomChar2 = characters[Math.floor(Math.random() * characters.length)]
    alternatives.push(surname + randomChar1 + randomChar2)
  }
  
  return alternatives
}

// 主要分析函數
export function analyzeName(name: string, birthDate: string, birthPlace: string): NameAnalysis {
  const totalStrokes = calculateTotalStrokes(name)
  const fiveElements = getFiveElements(totalStrokes)
  
  return {
    name,
    birthDate,
    birthPlace,
    totalStrokes,
    fiveElements,
    personality: getPersonalityAnalysis(fiveElements),
    career: getCareerAnalysis(fiveElements),
    health: getHealthAnalysis(fiveElements),
    relationships: getRelationshipAnalysis(fiveElements),
    luck: getLuckAnalysis(fiveElements),
    suggestions: generateSuggestions(fiveElements, name),
    alternativeNames: generateAlternativeNames(name, fiveElements)
  }
}

