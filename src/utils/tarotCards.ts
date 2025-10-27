// 塔羅牌數據庫
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
    description: '愚者代表新的開始和無限的可能性。這張牌鼓勵你保持開放的心態，勇敢地踏上新的旅程。',
    keywords: ['新開始', '冒險', '純真', '自由', '可能性'],
    element: '風',
    planet: '天王星'
  },
  {
    id: 1,
    name: '魔法師',
    nameEn: 'The Magician',
    suit: 'major',
    meaning: '意志力、創造力、行動',
    reversed: false,
    description: '魔法師擁有將想法轉化為現實的能力。這張牌提醒你，你擁有實現目標所需的所有工具。',
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
    description: '女祭司代表內在的智慧和直覺。她提醒你要傾聽內心的聲音，相信自己的直覺。',
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
    description: '皇后代表豐盛和創造力。她象徵著自然的力量和母性的關愛。',
    keywords: ['豐盛', '母性', '創造力', '自然', '關愛'],
    element: '土',
    planet: '金星'
  },
  {
    id: 4,
    name: '皇帝',
    nameEn: 'The Emperor',
    suit: 'major',
    meaning: '權威、秩序、領導力',
    reversed: false,
    description: '皇帝代表權威和秩序。他象徵著穩定的領導力和結構化的思維。',
    keywords: ['權威', '秩序', '領導力', '穩定', '結構'],
    element: '火',
    planet: '火星'
  },
  {
    id: 5,
    name: '教皇',
    nameEn: 'The Hierophant',
    suit: 'major',
    meaning: '傳統、教育、精神指導',
    reversed: false,
    description: '教皇代表傳統和精神指導。他象徵著學習和遵循既定的道路。',
    keywords: ['傳統', '教育', '精神指導', '學習', '信仰'],
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
    description: '戀人代表愛情和重要的選擇。這張牌提醒你要做出符合內心價值觀的決定。',
    keywords: ['愛情', '選擇', '和諧', '價值觀', '關係'],
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
    description: '戰車代表意志力和勝利。這張牌象徵著通過堅定的決心來克服障礙。',
    keywords: ['意志力', '勝利', '控制', '決心', '克服'],
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
    description: '力量代表內在的力量和勇氣。這張牌提醒你，真正的力量來自於內心的平靜。',
    keywords: ['內在力量', '勇氣', '耐心', '平靜', '控制'],
    element: '火',
    planet: '太陽'
  },
  {
    id: 9,
    name: '隱者',
    nameEn: 'The Hermit',
    suit: 'major',
    meaning: '內省、智慧、指導',
    reversed: false,
    description: '隱者代表內省和智慧。這張牌鼓勵你進行自我反思，尋找內在的真理。',
    keywords: ['內省', '智慧', '指導', '反思', '真理'],
    element: '土',
    planet: '水星'
  },
  {
    id: 10,
    name: '命運之輪',
    nameEn: 'Wheel of Fortune',
    suit: 'major',
    meaning: '變化、命運、循環',
    reversed: false,
    description: '命運之輪代表變化和命運的循環。這張牌提醒你，生活充滿了起伏和變化。',
    keywords: ['變化', '命運', '循環', '機會', '轉折'],
    element: '火',
    planet: '木星'
  },
  {
    id: 11,
    name: '正義',
    nameEn: 'Justice',
    suit: 'major',
    meaning: '平衡、公正、因果',
    reversed: false,
    description: '正義代表平衡和公正。這張牌提醒你要為自己的行為負責，尋求公平的解決方案。',
    keywords: ['平衡', '公正', '因果', '責任', '公平'],
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
    description: '倒吊人代表犧牲和等待。這張牌提醒你，有時候需要換個角度看待問題。',
    keywords: ['犧牲', '等待', '新視角', '耐心', '反思'],
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
    description: '死神代表結束和轉變。這張牌象徵著舊事物的結束和新事物的開始。',
    keywords: ['結束', '轉變', '重生', '變化', '新開始'],
    element: '水',
    planet: '冥王星'
  },
  {
    id: 14,
    name: '節制',
    nameEn: 'Temperance',
    suit: 'major',
    meaning: '平衡、調和、耐心',
    reversed: false,
    description: '節制代表平衡和調和。這張牌提醒你要在各種對立的力量之間找到平衡。',
    keywords: ['平衡', '調和', '耐心', '中庸', '和諧'],
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
    description: '惡魔代表束縛和誘惑。這張牌提醒你要注意那些限制你自由的事物。',
    keywords: ['束縛', '誘惑', '物質主義', '限制', '自由'],
    element: '土',
    planet: '土星'
  },
  {
    id: 16,
    name: '塔',
    nameEn: 'The Tower',
    suit: 'major',
    meaning: '破壞、覺醒、解放',
    reversed: false,
    description: '塔代表破壞和覺醒。這張牌象徵著突然的變化和舊結構的崩塌。',
    keywords: ['破壞', '覺醒', '解放', '變化', '重建'],
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
    description: '星星代表希望和靈感。這張牌提醒你，即使在黑暗中也有光明。',
    keywords: ['希望', '靈感', '指引', '光明', '未來'],
    element: '風',
    planet: '天王星'
  },
  {
    id: 18,
    name: '月亮',
    nameEn: 'The Moon',
    suit: 'major',
    meaning: '幻覺、恐懼、潛意識',
    reversed: false,
    description: '月亮代表幻覺和潛意識。這張牌提醒你要注意那些隱藏在表面下的真相。',
    keywords: ['幻覺', '恐懼', '潛意識', '直覺', '秘密'],
    element: '水',
    planet: '海王星'
  },
  {
    id: 19,
    name: '太陽',
    nameEn: 'The Sun',
    suit: 'major',
    meaning: '快樂、成功、活力',
    reversed: false,
    description: '太陽代表快樂和成功。這張牌象徵著積極的能量和光明的未來。',
    keywords: ['快樂', '成功', '活力', '光明', '積極'],
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
    description: '審判代表重生和覺醒。這張牌象徵著精神上的覺醒和新的開始。',
    keywords: ['重生', '覺醒', '救贖', '召喚', '轉變'],
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
    description: '世界代表完成和成就。這張牌象徵著一個階段的結束和新的開始。',
    keywords: ['完成', '成就', '圓滿', '成功', '新開始'],
    element: '土',
    planet: '土星'
  }
]

// 小阿爾卡納 - 聖杯（14張）
export const cupsCards: TarotCard[] = [
  {
    id: 22,
    name: '聖杯王牌',
    nameEn: 'Ace of Cups',
    suit: 'cups',
    number: 1,
    meaning: '新的情感開始、愛情的萌芽',
    reversed: false,
    description: '聖杯王牌代表新的情感開始。這張牌象徵著愛情的萌芽和情感的豐盛。',
    keywords: ['新開始', '愛情', '情感', '豐盛', '直覺'],
    element: '水'
  },
  {
    id: 23,
    name: '聖杯二',
    nameEn: 'Two of Cups',
    suit: 'cups',
    number: 2,
    meaning: '愛情、合作、和諧',
    reversed: false,
    description: '聖杯二代表愛情和合作。這張牌象徵著兩個人之間的和諧關係。',
    keywords: ['愛情', '合作', '和諧', '關係', '平衡'],
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
    description: '聖杯三代表友誼和慶祝。這張牌象徵著與朋友們的歡樂時光。',
    keywords: ['友誼', '慶祝', '歡樂', '聚會', '社交'],
    element: '水'
  },
  {
    id: 25,
    name: '聖杯四',
    nameEn: 'Four of Cups',
    suit: 'cups',
    number: 4,
    meaning: '冷漠、錯失機會、內省',
    reversed: false,
    description: '聖杯四代表冷漠和錯失機會。這張牌提醒你要注意身邊的機會。',
    keywords: ['冷漠', '錯失機會', '內省', '不滿', '反思'],
    element: '水'
  },
  {
    id: 26,
    name: '聖杯五',
    nameEn: 'Five of Cups',
    suit: 'cups',
    number: 5,
    meaning: '失落、悲傷、遺憾',
    reversed: false,
    description: '聖杯五代表失落和悲傷。這張牌提醒你，雖然有失去，但仍有希望。',
    keywords: ['失落', '悲傷', '遺憾', '失望', '希望'],
    element: '水'
  },
  {
    id: 27,
    name: '聖杯六',
    nameEn: 'Six of Cups',
    suit: 'cups',
    number: 6,
    meaning: '懷舊、純真、童年',
    reversed: false,
    description: '聖杯六代表懷舊和純真。這張牌象徵著對過去的懷念和純真的情感。',
    keywords: ['懷舊', '純真', '童年', '回憶', '簡單'],
    element: '水'
  },
  {
    id: 28,
    name: '聖杯七',
    nameEn: 'Seven of Cups',
    suit: 'cups',
    number: 7,
    meaning: '幻想、選擇、夢想',
    reversed: false,
    description: '聖杯七代表幻想和選擇。這張牌提醒你要在眾多選擇中做出決定。',
    keywords: ['幻想', '選擇', '夢想', '機會', '決定'],
    element: '水'
  },
  {
    id: 29,
    name: '聖杯八',
    nameEn: 'Eight of Cups',
    suit: 'cups',
    number: 8,
    meaning: '放棄、追尋、精神之旅',
    reversed: false,
    description: '聖杯八代表放棄和追尋。這張牌象徵著為了更高目標而放棄現有的成就。',
    keywords: ['放棄', '追尋', '精神之旅', '離開', '成長'],
    element: '水'
  },
  {
    id: 30,
    name: '聖杯九',
    nameEn: 'Nine of Cups',
    suit: 'cups',
    number: 9,
    meaning: '滿足、願望實現、快樂',
    reversed: false,
    description: '聖杯九代表滿足和願望實現。這張牌象徵著情感上的滿足和快樂。',
    keywords: ['滿足', '願望實現', '快樂', '成功', '情感'],
    element: '水'
  },
  {
    id: 31,
    name: '聖杯十',
    nameEn: 'Ten of Cups',
    suit: 'cups',
    number: 10,
    meaning: '家庭和諧、圓滿、幸福',
    reversed: false,
    description: '聖杯十代表家庭和諧和圓滿。這張牌象徵著完美的家庭關係和幸福。',
    keywords: ['家庭和諧', '圓滿', '幸福', '完美', '愛'],
    element: '水'
  },
  {
    id: 32,
    name: '聖杯侍者',
    nameEn: 'Page of Cups',
    suit: 'cups',
    meaning: '情感消息、創意、直覺',
    reversed: false,
    description: '聖杯侍者代表情感消息和創意。這張牌象徵著新的情感機會和創意靈感。',
    keywords: ['情感消息', '創意', '直覺', '新機會', '靈感'],
    element: '水'
  },
  {
    id: 33,
    name: '聖杯騎士',
    nameEn: 'Knight of Cups',
    suit: 'cups',
    meaning: '浪漫、理想主義、追求',
    reversed: false,
    description: '聖杯騎士代表浪漫和理想主義。這張牌象徵著對愛情和理想的追求。',
    keywords: ['浪漫', '理想主義', '追求', '愛情', '夢想'],
    element: '水'
  },
  {
    id: 34,
    name: '聖杯皇后',
    nameEn: 'Queen of Cups',
    suit: 'cups',
    meaning: '情感智慧、直覺、關愛',
    reversed: false,
    description: '聖杯皇后代表情感智慧和直覺。這張牌象徵著深度的情感理解和關愛。',
    keywords: ['情感智慧', '直覺', '關愛', '理解', '同情'],
    element: '水'
  },
  {
    id: 35,
    name: '聖杯國王',
    nameEn: 'King of Cups',
    suit: 'cups',
    meaning: '情感控制、智慧、平衡',
    reversed: false,
    description: '聖杯國王代表情感控制和智慧。這張牌象徵著成熟的情感管理和平衡。',
    keywords: ['情感控制', '智慧', '平衡', '成熟', '領導'],
    element: '水'
  }
]

// 完整的塔羅牌牌組
export const allTarotCards: TarotCard[] = [
  ...majorArcana,
  ...cupsCards
  // 這裡可以添加其他花色：權杖、寶劍、錢幣
]

// 抽牌函數
export function drawCards(count: number = 3): TarotCard[] {
  const shuffled = [...allTarotCards].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map(card => ({
    ...card,
    reversed: Math.random() < 0.3 // 30% 機率為逆位
  }))
}

// 根據問題類型推薦牌陣
export function getRecommendedSpread(question: string): { name: string, count: number, description: string } {
  const lowerQuestion = question.toLowerCase()
  
  if (lowerQuestion.includes('愛情') || lowerQuestion.includes('感情') || lowerQuestion.includes('關係')) {
    return {
      name: '愛情牌陣',
      count: 3,
      description: '過去、現在、未來 - 了解感情發展的脈絡'
    }
  } else if (lowerQuestion.includes('事業') || lowerQuestion.includes('工作') || lowerQuestion.includes('職場')) {
    return {
      name: '事業牌陣',
      count: 3,
      description: '現況、挑戰、建議 - 指引事業發展方向'
    }
  } else if (lowerQuestion.includes('選擇') || lowerQuestion.includes('決定') || lowerQuestion.includes('抉擇')) {
    return {
      name: '選擇牌陣',
      count: 2,
      description: '選項A、選項B - 比較不同選擇的結果'
    }
  } else {
    return {
      name: '三牌牌陣',
      count: 3,
      description: '過去、現在、未來 - 全面了解問題的發展'
    }
  }
}

