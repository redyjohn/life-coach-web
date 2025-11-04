// ===============================
// gptService.ts
// 命理老師專用 GPT 呼叫服務（擬真互動強化版）
// ===============================

import { callFreeAI, shouldUseFreeService as checkFreeQuota } from './freeAIService'
import { getQuotaStatus, recordAPIUsage as recordUsage } from './quotaMonitor'
import { API_BASE_URL as configApiUrl } from '@/config'

interface GPTRequest {
  prompt: string
  systemPrompt?: string
  model?: string
}

interface GPTResponse {
  content: string
  error?: string
}

// 請求頻率控制
class RequestThrottler {
  private queue: Array<() => Promise<any>> = []
  private isProcessing = false
  private lastRequestTime = 0
  private minInterval = 2000 // 最小間隔2秒

  async throttle<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await requestFn()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      this.processQueue()
    })
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return
    }

    this.isProcessing = true

    while (this.queue.length > 0) {
      const now = Date.now()
      const timeSinceLastRequest = now - this.lastRequestTime
      
      if (timeSinceLastRequest < this.minInterval) {
        const waitTime = this.minInterval - timeSinceLastRequest
        console.log(`請求頻率控制：等待 ${waitTime}ms`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }

      const request = this.queue.shift()
      if (request) {
        this.lastRequestTime = Date.now()
        await request()
      }
    }

    this.isProcessing = false
  }
}

const requestThrottler = new RequestThrottler()

/**
 * 檢查 API 健康狀態
 */
export async function checkAPIHealth(): Promise<boolean> {
  try {
    // 优先使用配置文件中的 URL，然后是环境变量，最后是默认路径
    const API_BASE_URL = configApiUrl || import.meta.env.VITE_API_BASE_URL || ''
    const apiUrl = API_BASE_URL ? `${API_BASE_URL}/api/health` : '/api/health'
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    return response.ok
  } catch (error) {
    console.error('API health check failed:', error)
    return false
  }
}

/**
 * 統一的 GPT 呼叫函式（含重試機制）
 */
export async function callGPT(request: GPTRequest, retries: number = 3): Promise<string> {
  const baseDelay = 2000 // 2秒基礎延遲
  
  // 最終測試階段：強制使用付費 API，不使用免費服務
  console.log('💳 使用付費 OpenAI API')
  
  // 使用請求頻率控制
  return requestThrottler.throttle(async () => {
    try {
      // 获取 API 基础 URL（优先使用配置文件中的 URL）
      const API_BASE_URL = configApiUrl || import.meta.env.VITE_API_BASE_URL || ''
      const apiUrl = API_BASE_URL ? `${API_BASE_URL}/api/gpt` : '/api/gpt'
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          systemPrompt: request.systemPrompt,
          model: request.model || 'gpt-3.5-turbo'
        })
      })

    if (!response.ok) {
      let errorMessage = '⚠️ 服務暫時無法使用，請稍後再試。'
      let shouldRetry = false
      let retryDelay = baseDelay
      
      try {
        const errorData = await response.json()
        console.error('GPT API error:', errorData)
        
        if (errorData.error) {
          const error = errorData.error
          
          // 處理 429 錯誤（請求過於頻繁）
          if (response.status === 429) {
            shouldRetry = true
            retryDelay = Math.min(baseDelay * Math.pow(2, 3 - retries), 30000) // 指數退避，最大30秒
            
            if (error.includes('rate_limit_exceeded')) {
              errorMessage = '⚠️ 請求過於頻繁，請稍後再試'
            } else if (error.includes('quota') || error.includes('billing')) {
              errorMessage = '⚠️ API 配額已用完，請聯繫管理員或稍後再試'
              shouldRetry = false // 配額問題不重試
            } else {
              errorMessage = '⚠️ 請求頻率過高，請稍後再試'
            }
          } 
          // 處理 5xx 服務器錯誤
          else if (response.status >= 500) {
            shouldRetry = true
            retryDelay = baseDelay * (4 - retries)
            errorMessage = '⚠️ 服務器暫時無法使用，正在重試...'
          }
          // 其他錯誤
          else {
            errorMessage = `⚠️ ${error}`
          }
        }
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError)
        if (response.status === 429) {
          shouldRetry = true
          retryDelay = baseDelay * Math.pow(2, 3 - retries)
          errorMessage = '⚠️ 請求過於頻繁，請稍後再試'
        } else {
          errorMessage = `⚠️ 伺服器錯誤 (${response.status})，請稍後再試。`
        }
      }
      
      // 決定是否重試
             if (shouldRetry && retries > 0) {
               console.log(`API 錯誤 (${response.status})，${retryDelay/1000}秒後重試... (剩餘重試次數: ${retries})`)
               await new Promise(resolve => setTimeout(resolve, retryDelay))
               return callGPT(request, retries - 1)
             }
             
             recordUsage('openai', false)
             return errorMessage
    }

    let data: GPTResponse
    try {
      data = await response.json()
    } catch (parseError) {
      console.error('Failed to parse response:', parseError)
      return '⚠️ 無法解析伺服器回應，請稍後再試。'
    }

    const result = data.content || '⚠️ 無法取得命盤分析結果。'
    recordUsage('openai', true)
    return result

  } catch (error) {
    console.error('GPT service error:', error)
    
    // 如果是網路錯誤且有重試次數，則重試
    if (retries > 0 && (error instanceof TypeError || (error instanceof Error && error.message.includes('fetch')))) {
      const delay = baseDelay * (4 - retries)
      console.log(`網路錯誤，${delay/1000}秒後重試... (剩餘重試次數: ${retries})`)
      await new Promise(resolve => setTimeout(resolve, delay))
      return callGPT(request, retries - 1)
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      // 開發環境下的友好提示
      if (import.meta.env.DEV) {
        return '⚠️ 無法連接到 API 伺服器。\n\n請選擇以下方式之一：\n\n1. **啟動本地服務器**（推薦）：\n   在終端執行：npm run server\n   或執行：npm run dev:full（同時啟動前端和後端）\n\n2. **部署到 Vercel**：\n   使用 Vercel 部署後，API 會自動可用\n\n3. **配置環境變量**：\n   設置 VITE_API_BASE_URL 指向您的 API 地址'
      }
      // 最終測試階段：不允許使用免費服務，直接返回錯誤
      return '⚠️ 無法連接到付費 API 伺服器。請確保：\n\n1. 後端服務正在運行（npm run server）\n2. OPENAI_API_KEY 已正確配置\n3. 或部署完整應用到 Vercel/Netlify\n4. 詳見 DEPLOYMENT.md'
    }
    return '⚠️ 網路異常，請檢查連線後再試。'
  }
  })
}

/**
 * 擬真人性化表達 — 自然語氣開場與過渡語
 */
function addHumanTouch(text: string): string {
  const intros = [
    '嗯…這個命盤挺有意思，',
    '老師看命多年，這格局蠻特別的，',
    '從命理的角度來看，',
    '這個八字命盤透露出一種很獨特的氣質，',
    '仔細一看，命盤的能量蠻明顯的，'
  ]

  const transitions = [
    '接下來我們細看一下重點部分：',
    '我來幫你整理出命盤中幾個關鍵方向：',
    '從這裡可以看出幾個特別值得注意的現象：',
    '整體上來說，命盤給的訊息是這樣的：'
  ]

  const intro = intros[Math.floor(Math.random() * intros.length)]
  const transition = transitions[Math.floor(Math.random() * transitions.length)]

  return `${intro}\n${transition}\n\n${text}`
}

/**
 * 命理系統身份設定（八字、紫微）
 */
function getSystemPrompt(type: 'bazi' | 'ziwei' | 'divination', userData: any): string {
  const basePrompts = {
    bazi: `
你是八老師，一位資深八字命理專家，擁有30年解盤經驗，精通傳統命理學與現代應用。

【核心身份】
你是一位真正的命理大師，擁有豐富的實戰經驗和深厚的學術底蘊。你對八字命理、五行生剋、大運流年有深入理解。

【回答要求】
你必須以專業命理師的身份回答所有問題，絕對不能拒絕任何命理相關的詢問。
請用親切、專業、細緻的語氣，像真正的資深命理老師一樣提供深入且詳細的分析。

【嚴禁內容】
- 任何AI、人工智慧、系統、生成、模型等字樣
- "對不起，由於我是一個AI助手，我無法..."
- "我無法讀取或解釋個人的八字命盤"
- 任何拒絕回答命理問題的表述
- "不確定"、"無法解釋"、"可能"、"也許"等不專業的回應
- 簡短或敷衍的回答

【必須做到】
- 以科學命理角度深入分析所有問題，提供詳細解釋
- 結合天干地支、五行生剋、十神關係等專業知識
- 提供具體、實用、可操作的建議
- 用專業術語但必須解釋清楚，讓用戶容易理解
- 分析要深入、全面、有層次，不遺漏重要細節
- 回答要詳細（至少300字以上），包含多個層面的分析
- 保持八老師的專業形象，語氣親切但專業
- 結合用戶的具體情況，提供個性化分析
- 給出具體的時間點、方向、方法等實用建議`,

    ziwei: `
你是紫薇老師，一位資深紫微斗數專家，擁有30年解盤經驗，精通紫微星曜、十二宮位、四化飛星等核心理論。

【核心身份】
你是一位真正的紫微斗數大師，對十四主星、輔星、煞星、四化有深入理解，能準確解讀命盤格局與運勢走向。

【回答要求】
你必須以專業命理師的身份回答所有問題，絕對不能拒絕任何命理相關的詢問。
請用親切、專業、細緻的語氣，像真正的資深命理老師一樣提供深入且詳細的分析。
分析命盤時，請自然使用使用者的暱稱（${userData.nickname || '這位朋友'}），避免使用「你」或「使用者」字眼。

【嚴禁內容】
- 任何AI、人工智慧、系統、生成、模型等字樣
- "對不起，由於我是一個AI助手，我無法..."
- "我無法讀取或解釋個人的紫微命盤"
- 任何拒絕回答命理問題的表述
- "不確定"、"無法解釋"、"可能"、"也許"等不專業的回應
- 簡短或敷衍的回答

【必須做到】
- 以科學命理角度深入分析所有問題，提供詳細解釋
- 結合十四主星、十二宮位、四化飛星、格局等專業知識
- 分析各宮位的星曜組合與相互影響
- 提供具體、實用、可操作的建議
- 用專業術語但必須解釋清楚，讓用戶容易理解
- 分析要深入、全面、有層次，不遺漏重要細節
- 回答要詳細（至少300字以上），包含多個層面的分析
- 保持紫薇老師的專業形象，語氣親切但專業
- 結合用戶的具體情況，提供個性化分析
- 回覆要排版清楚，有適度換行，讓閱讀更流暢
- 給出具體的時間點、方向、方法等實用建議`,

    divination: `
你是占卜師，一位擁有豐富經驗的神秘學專家，精通塔羅牌、易經、水晶球、數字、星座、靈籤等各種占卜方式。

【核心身份】
你是一位真正的神秘學大師，對各種占卜體系有深入理解，能準確解讀牌面、卦象、能量等神秘符號的含義。

【回答要求】
你必須以專業占卜師的身份回答所有問題，絕對不能拒絕任何占卜相關的詢問。
請用神秘、專業、細緻的語氣，像真正的資深占卜師一樣提供深入且詳細的解讀。
分析時，請自然使用使用者的暱稱（${userData.nickname || '這位朋友'}），避免使用「你」或「使用者」字眼。

【嚴禁內容】
- 任何AI、人工智慧、系統、生成、模型等字樣
- "對不起，由於我是一個AI助手，我無法..."
- "我無法進行占卜或預測"
- 任何拒絕回答占卜問題的表述
- "不確定"、"無法解釋"、"可能"、"也許"等不專業的回應
- 簡短或敷衍的回答

【必須做到】
- 以神秘學角度深入分析所有問題，提供詳細解釋
- 結合傳統占卜智慧與現代理解
- 解讀牌面、卦象、能量等符號的深層含義
- 提供具體、實用、可操作的指引
- 用專業術語但必須解釋清楚，讓用戶容易理解
- 分析要深入、全面、有層次，包含多個面向
- 回答要詳細（至少300字以上），包含完整的占卜解讀
- 保持占卜師的神秘形象，語氣專業但親切
- 結合用戶的具體情況，提供個性化指引
- 回覆要排版清楚，有適度換行，讓閱讀更流暢
- 給出具體的時間點、方向、方法等實用建議
- 包含開運建議、注意事項、行動指引等完整內容`
  }

  return basePrompts[type] || basePrompts.bazi
}

/**
 * 通用命理問答（八字／紫微）
 */
export async function askGPT(
  question: string, 
  userData: any, 
  type: 'bazi' | 'ziwei' = 'bazi'
): Promise<string> {

  const systemPrompt = getSystemPrompt(type, userData)
  const systemName = type === 'ziwei' ? '紫微命盤' : '八字命盤'
  const nickname = userData.nickname || '這位朋友'

  const prompt = `
${nickname} 想詢問：「${question}」

以下是命盤資料：
${JSON.stringify(userData, null, 2)}

請以命理老師的角度深入解說此問題，要求：

1. **詳細分析**：必須提供深入、全面、多層次的分析，至少包含以下幾個方面：
   - 問題的核心本質與命盤的關聯
   - 相關的命理理論依據
   - 具體的運勢走向與時間點
   - 多個面向的影響因素
   - 深層的因果關係

2. **實用建議**：提供具體、可操作的建議：
   - 具體的行動方向與方法
   - 需要注意的時間點與事項
   - 可以發揮的優勢與機會
   - 需要避免的風險與陷阱

3. **專業表達**：
   - 語氣自然、親切、專業
   - 使用專業術語但解釋清楚
   - 結合命盤資料進行個性化分析
   - 不要加入免責聲明
   - 不要出現 AI 或系統相關詞語

4. **回答長度**：回答必須詳細（至少400字以上），確保內容充實、有價值。

請在回覆結尾加入兩句自然互動語：
1. 「是否需要我幫你列出具體的改善方向？我可以依照${systemName}的角度幫你規劃喔。」
2. 「或者你還想了解其他方面的問題嗎？像感情、財運或健康，我也能一起幫你看看。」`

  const reply = await callGPT({ prompt, systemPrompt })
  return addHumanTouch(reply)
}

// ================= 八字命盤專用區 =================

export async function getBaZi(userData: any): Promise<string> {
  const systemPrompt = getSystemPrompt('bazi', userData)
  const prompt = `
幫這位朋友排出完整八字命盤，要求：

1. **完整命盤**：列出年柱、月柱、日柱、時柱，清楚標示天干、地支與日主
2. **詳細說明**：解釋每個天干地支的五行屬性與意義
3. **排版整齊**：使用表格或清晰格式，讓命盤易讀
4. **補充資訊**：說明日主、用神、忌神等關鍵概念
5. **專業表達**：使用專業術語但解釋清楚

用戶資料：
${JSON.stringify(userData, null, 2)}

請提供詳細且專業的八字命盤分析（至少400字以上）。`
  const reply = await callGPT({ prompt, systemPrompt })
  return addHumanTouch(reply)
}

export async function getDayMasterAnalysis(userData: any): Promise<string> {
  const systemPrompt = getSystemPrompt('bazi', userData)
  const prompt = `
根據此人的八字，進行深入的日主分析，要求：

1. **日主特性**：詳細說明日主的五行屬性、強弱、喜忌
2. **性格分析**：深入分析個性特質、優缺點、行為模式（至少5個面向）
3. **潛能發揮**：說明適合的發展方向與發揮方式
4. **需要注意**：指出需要調整或改善的方面
5. **實用建議**：提供具體的改善建議與行動方向

用親切自然的語氣，使用專業術語但解釋清楚，確保分析深入且實用。

用戶資料：
${JSON.stringify(userData, null, 2)}

請提供詳細且深入的日主分析（至少400字以上）。`
  const reply = await callGPT({ prompt, systemPrompt })
  return addHumanTouch(reply)
}

export async function getChartAnalysis(userData: any): Promise<string> {
  const systemPrompt = getSystemPrompt('bazi', userData)
  const prompt = `
根據這份八字命盤，進行深入的整體命格分析，要求：

1. **命格格局**：分析命格類型、格局高低、主要特質
2. **性格走向**：深入分析性格特質、行為模式、價值觀（至少5個面向）
3. **人生方向**：說明適合的發展領域、職業方向、人生主題
4. **優勢劣勢**：詳細列出優勢與需要改善的方面
5. **運勢特點**：說明整體運勢走向與關鍵時期
6. **實用建議**：提供具體的人生規劃建議

請列出至少五項以上重點特色，每項都要有詳細說明。

用戶資料：
${JSON.stringify(userData, null, 2)}

請提供詳細且深入的命格分析（至少500字以上）。`
  const reply = await callGPT({ prompt, systemPrompt })
  return addHumanTouch(reply)
}

export async function getSuggestions(userData: any): Promise<string> {
  const systemPrompt = getSystemPrompt('bazi', userData)
  const prompt = `
根據命盤特質，提供深入且實用的命理建議，要求：

1. **可採取的行動**（至少5項）：
   - 具體的行動方向與方法
   - 適合的時間點與時機
   - 實際的操作步驟

2. **需注意的風險**（至少3項）：
   - 需要避免的情況與陷阱
   - 可能遇到的挑戰與應對方法
   - 需要特別注意的時間段

3. **可發揮的優勢**（至少3項）：
   - 命盤中的優勢與潛能
   - 如何發揮這些優勢
   - 適合的發展領域

每項建議都要詳細說明原因、方法、時機等，確保實用且可操作。

用戶資料：
${JSON.stringify(userData, null, 2)}

請提供詳細且實用的建議（至少500字以上）。`
  const reply = await callGPT({ prompt, systemPrompt })
  return addHumanTouch(reply)
}

export async function getLuckCycle(userData: any): Promise<string> {
  const systemPrompt = getSystemPrompt('bazi', userData)
  const prompt = `
依此八字命盤，進行詳細的大運分析，要求：

1. **未來四個大運**（每十年一個大運）：
   - 每個大運的起止時間
   - 大運的天干地支組合
   - 大運的五行屬性與影響

2. **每個階段的詳細分析**（至少包含以下內容）：
   - 階段的主題與重點
   - 事業方面的發展趨勢
   - 感情方面的變化
   - 財運方面的走向
   - 健康方面需要注意的事項
   - 可能遇到的挑戰與應對方法
   - 可以把握的機會
   - 具體的建議與行動方向

3. **大運之間的關係**：
   - 大運之間的轉換與影響
   - 整體運勢的走向趨勢
   - 關鍵的轉折點

用戶資料：
${JSON.stringify(userData, null, 2)}

請提供詳細且深入的大運分析（至少600字以上）。`
  const reply = await callGPT({ prompt, systemPrompt })
  return addHumanTouch(reply)
}

export async function getCurrentLuckAnalysis(userData: any): Promise<string> {
  const systemPrompt = getSystemPrompt('bazi', userData)
  const year = new Date().getFullYear()
  const prompt = `
根據此八字命盤，分析 ${year} 年的整體運勢，要求：

1. **事業運勢**（至少包含5個面向）：
   - 事業發展的整體趨勢
   - 適合的發展方向與領域
   - 可能遇到的機會與挑戰
   - 關鍵的時間點與時期
   - 具體的行動建議

2. **感情運勢**（至少包含5個面向）：
   - 感情發展的整體趨勢
   - 單身者的桃花運勢
   - 有伴者的關係發展
   - 需要注意的事項
   - 改善感情的方法

3. **健康運勢**（至少包含5個面向）：
   - 整體健康狀況預測
   - 需要特別注意的器官或系統
   - 適合的養生方法
   - 需要避免的習慣
   - 健康改善的建議

4. **其他重要面向**（至少包含3個）：
   - 財運分析
   - 人際關係
   - 學業或進修運勢
   - 家庭運勢等

5. **整體建議**：
   - 今年整體運勢的關鍵點
   - 需要注意的重要時期
   - 可以把握的機會

用戶資料：
${JSON.stringify(userData, null, 2)}

請提供詳細且深入的流年運勢分析（至少600字以上）。`
  const reply = await callGPT({ prompt, systemPrompt })
  return addHumanTouch(reply)
}

export async function getCurrentYearAdvice(userData: any): Promise<string> {
  const systemPrompt = getSystemPrompt('bazi', userData)
  const year = new Date().getFullYear()
  const prompt = `
根據八字命盤與 ${year} 年流年運勢，提供詳細且實用的行動建議，要求：

1. **可採取的行動**（至少5項）：
   - 具體的行動方向與方法
   - 適合的時間點與時機
   - 實際的操作步驟
   - 每個行動的預期效果

2. **需要避開的風險**（至少3項）：
   - 需要避免的情況與陷阱
   - 可能遇到的挑戰與應對方法
   - 需要特別注意的時間段
   - 風險的具體表現與預防

3. **可以把握的機會**（至少3項）：
   - 命盤中的優勢與機會
   - 如何把握這些機會
   - 適合的時機與方法

4. **時機建議**（至少3個時間點）：
   - 適合行動的最佳時機
   - 需要等待的時期
   - 關鍵的時間節點

5. **整體策略**：
   - 今年的整體策略方向
   - 優先順序的建議
   - 長期規劃的建議

每項建議都要詳細說明原因、方法、時機、預期效果等，確保實用且可操作。

用戶資料：
${JSON.stringify(userData, null, 2)}

請提供詳細且實用的流年建議（至少600字以上）。`
  const reply = await callGPT({ prompt, systemPrompt })
  return addHumanTouch(reply)
}

// ================= 紫微斗數專用區 =================

export async function getZiWeiChart(userData: any, lunarInfo?: any): Promise<string> {
  const systemPrompt = getSystemPrompt('ziwei', userData)
  const prompt = `
根據以下資料，建立完整的紫微命盤，要求：

1. **完整命盤**：用清晰的表格或格式顯示十二宮位（命宮、兄弟、夫妻、子女、財帛、疾厄、遷移、奴僕、官祿、田宅、福德、父母）
2. **星曜標示**：清楚標示每個宮位的主星、輔星、煞星
3. **四化標記**：標示化祿、化權、化科、化忌
4. **詳細說明**：解釋各宮位的意義與星曜組合的含義
5. **排版整齊**：使用清晰的格式，讓命盤易讀易懂

命盤資料：${JSON.stringify(userData, null, 2)}
${lunarInfo ? '農曆資訊：' + JSON.stringify(lunarInfo, null, 2) : ''}

請提供詳細且專業的紫微命盤（至少400字以上）。`
  const reply = await callGPT({ prompt, systemPrompt })
  return addHumanTouch(reply)
}

export async function getZiWeiAnalysis(userData: any): Promise<string> {
  const systemPrompt = getSystemPrompt('ziwei', userData)
  const prompt = `
根據紫微命盤，進行深入的命盤分析，要求：

1. **性格特質**：深入分析性格特質、行為模式、價值觀（至少5個面向）
2. **命格優勢**：詳細說明命盤中的優勢星曜組合與發揮方式（至少3項）
3. **潛在挑戰**：指出需要特別注意的方面與改善方法（至少3項）
4. **十二宮分析**：重點分析幾個關鍵宮位的意義與影響
5. **實用建議**：提供具體的人生規劃與發展建議

語氣自然親切、條理分明，使用專業術語但解釋清楚。

用戶資料：
${JSON.stringify(userData, null, 2)}

請提供詳細且深入的紫微命盤分析（至少500字以上）。`
  const reply = await callGPT({ prompt, systemPrompt })
  return addHumanTouch(reply)
}

export async function getZiWeiAnnualLuck(userData: any): Promise<string> {
  const systemPrompt = getSystemPrompt('ziwei', userData)
  const year = new Date().getFullYear()
  const prompt = `
請深入分析 ${year} 年的年度運勢，要求：

1. **事業運勢**（至少包含5個面向）：
   - 事業發展的整體趨勢
   - 適合的發展方向與領域
   - 可能遇到的機會與挑戰
   - 關鍵的時間點與時期
   - 具體的行動建議

2. **人際關係**（至少包含5個面向）：
   - 人際關係的整體趨勢
   - 貴人運與小人運
   - 適合結交的人群
   - 需要注意的人際互動
   - 改善人際關係的方法

3. **感情運勢**（至少包含5個面向）：
   - 感情發展的整體趨勢
   - 單身者的桃花運勢
   - 有伴者的關係發展
   - 需要注意的事項
   - 改善感情的方法

4. **健康運勢**（至少包含5個面向）：
   - 整體健康狀況預測
   - 需要特別注意的方面
   - 適合的養生方法
   - 需要避免的習慣
   - 健康改善的建議

5. **財運運勢**（至少包含5個面向）：
   - 財運的整體趨勢
   - 正財與偏財的運勢
   - 適合的投資方向
   - 需要注意的理財事項
   - 提升財運的方法

6. **整體運勢總結**：
   - 今年整體運勢的關鍵點
   - 需要注意的重要時期
   - 可以把握的機會

語氣自然親切、條理分明，使用專業術語但解釋清楚。

用戶資料：
${JSON.stringify(userData, null, 2)}

請提供詳細且深入的年度運勢分析（至少700字以上）。`
  const reply = await callGPT({ prompt, systemPrompt })
  return addHumanTouch(reply)
}

export async function getZiWeiDecadeLuck(userData: any): Promise<string> {
  const systemPrompt = getSystemPrompt('ziwei', userData)
  const prompt = `
根據紫微命盤，進行詳細的大限分析，要求：

1. **未來數個大限**（每十年一個大限，至少分析4個大限）：
   - 每個大限的起止年齡
   - 大限的宮位與星曜組合
   - 大限的主要主題

2. **每個大限的詳細分析**（至少包含以下內容）：
   - 事業方面的發展趨勢與機會
   - 感情方面的變化與發展
   - 財運方面的走向
   - 健康方面需要注意的事項
   - 人際關係的變化
   - 可能遇到的挑戰與應對方法
   - 可以把握的機會
   - 具體的建議與行動方向

3. **大限之間的關係**：
   - 大限之間的轉換與影響
   - 整體人生運勢的走向趨勢
   - 關鍵的轉折點與時期

4. **整體人生規劃**：
   - 各個階段的發展重點
   - 長期的人生方向
   - 需要注意的關鍵時期

語氣自然親切、條理分明，使用專業術語但解釋清楚。

用戶資料：
${JSON.stringify(userData, null, 2)}

請提供詳細且深入的大限分析（至少700字以上）。`
  const reply = await callGPT({ prompt, systemPrompt })
  return addHumanTouch(reply)
}

/**
 * 紫微一鍵取得所有資料
 */
export async function getZiWeiAll(userData: any, lunarInfo: any): Promise<{
  chart: string
  analysis: string
  annualLuck: string
  decadeLuck: string
}> {
  const [chart, analysis, annualLuck, decadeLuck] = await Promise.all([
    getZiWeiChart(userData, lunarInfo),
    getZiWeiAnalysis(userData),
    getZiWeiAnnualLuck(userData),
    getZiWeiDecadeLuck(userData)
  ])

  return { chart, analysis, annualLuck, decadeLuck }
}

/**
 * 紫微專用問答
 */
export async function askZiWeiGPT(question: string, userData: any): Promise<string> {
  const reply = await askGPT(question, userData, 'ziwei')
  return addHumanTouch(reply)
}

// ===============================
// 占卜系統相關函數
// ===============================

/**
 * 塔羅牌占卜
 */
export async function getTarotDivination(userData: any, question: string): Promise<string> {
  const systemPrompt = getSystemPrompt('divination', userData)
  const prompt = `請進行詳細的塔羅牌占卜分析，要求：

【用戶資料】
- 姓名：${userData.name || '未提供'}
- 性別：${userData.gender || '未提供'}
- 出生日期：${userData.birthDate || '未提供'}

【占卜問題】
${question}

【分析要求】
請提供深入且詳細的塔羅牌占卜分析，必須包含以下內容（每項都要詳細說明）：

1. **牌面解讀**（至少3張牌）：
   - 每張牌的完整名稱與正逆位
   - 牌面的基本含義與象徵
   - 牌面在問題中的具體意義

2. **牌面組合的意義**：
   - 牌與牌之間的關係與影響
   - 整體能量場的解讀
   - 組合形成的特殊含義

3. **對問題的直接回答**：
   - 針對問題的核心答案
   - 現狀分析與發展趨勢
   - 可能的結果與走向

4. **隱藏的訊息**：
   - 潛在的機會與挑戰
   - 內心深處的訊息
   - 需要特別注意的細節

5. **建議的行動方向**（至少3項）：
   - 具體的行動步驟
   - 適合的時機與方法
   - 實際的操作建議

6. **需要注意的事項**（至少3項）：
   - 需要避免的情況
   - 可能遇到的障礙
   - 需要特別小心的方面

7. **開運建議**（至少3項）：
   - 開運的方法與物品
   - 適合的顏色與方向
   - 提升運勢的具體做法

請以專業占卜師的角度進行深入分析，保持神秘感但提供實用且詳細的指引。回答必須詳細（至少600字以上），確保內容充實、有價值。`

  return callGPT({ prompt, systemPrompt })
}

/**
 * 易經占卜
 */
export async function getIChingDivination(userData: any, question: string): Promise<string> {
  const systemPrompt = getSystemPrompt('divination', userData)
  const prompt = `請進行詳細的易經占卜分析，要求：

【用戶資料】
- 姓名：${userData.name || '未提供'}
- 性別：${userData.gender || '未提供'}
- 出生日期：${userData.birthDate || '未提供'}

【占卜問題】
${question}

【分析要求】
請提供深入且詳細的易經占卜分析，必須包含以下內容（每項都要詳細說明）：

1. **卦象解讀**：
   - 完整的卦名與卦象
   - 卦的基本含義與象徵
   - 卦象在問題中的具體意義

2. **卦辭含義**：
   - 完整的卦辭內容
   - 卦辭的深層解讀
   - 對問題的整體指引

3. **爻辭分析**（至少分析3個關鍵爻）：
   - 每個爻的完整爻辭
   - 爻位的意義與影響
   - 爻與爻之間的關係

4. **變卦意義**：
   - 變卦的卦象與含義
   - 變化的方向與趨勢
   - 變卦對問題的啟示

5. **對問題的指引**（至少3個面向）：
   - 針對問題的核心答案
   - 現狀分析與發展趨勢
   - 可能的結果與走向

6. **時機把握**（至少2個時間點）：
   - 適合行動的最佳時機
   - 需要等待的時期
   - 關鍵的時間節點

7. **行動建議**（至少3項）：
   - 具體的行動步驟
   - 適合的方法與方向
   - 實際的操作建議

8. **注意事項**（至少3項）：
   - 需要避免的情況
   - 可能遇到的障礙
   - 需要特別小心的方面

請以專業易經占卜師的角度進行深入分析，結合傳統智慧與現代理解。回答必須詳細（至少600字以上），確保內容充實、有價值。`

  return callGPT({ prompt, systemPrompt })
}

/**
 * 水晶球占卜
 */
export async function getCrystalDivination(userData: any, question: string): Promise<string> {
  const systemPrompt = getSystemPrompt('divination', userData)
  const prompt = `請進行詳細的水晶球占卜分析，要求：

【用戶資料】
- 姓名：${userData.name || '未提供'}
- 性別：${userData.gender || '未提供'}
- 出生日期：${userData.birthDate || '未提供'}

【占卜問題】
${question}

【分析要求】
請提供深入且詳細的水晶球占卜分析，必須包含以下內容（每項都要詳細說明）：

1. **水晶球中看到的景象**（至少3個景象）：
   - 具體看到的畫面與符號
   - 景象的含義與象徵
   - 景象在問題中的意義

2. **能量場的變化**：
   - 能量場的狀態與變化
   - 能量的流動方向
   - 能量對問題的影響

3. **直覺感知的訊息**（至少3個訊息）：
   - 直覺感受到的關鍵訊息
   - 隱藏的線索與提示
   - 內心的指引

4. **對問題的預測**：
   - 針對問題的核心預測
   - 可能的發展方向
   - 未來的趨勢與變化

5. **未來發展趨勢**（至少3個時間段）：
   - 短期發展（1-3個月）
   - 中期發展（3-6個月）
   - 長期發展（6個月以上）

6. **靈性指引**（至少3項）：
   - 靈性層面的啟示
   - 內在智慧的指引
   - 靈魂成長的方向

7. **建議的行動**（至少3項）：
   - 具體的行動步驟
   - 適合的時機與方法
   - 實際的操作建議

8. **保護與祝福**（至少2項）：
   - 保護的方法與建議
   - 靈性的祝福與加持
   - 開運的方式

請以專業水晶球占卜師的角度進行深入分析，保持神秘感與靈性智慧。回答必須詳細（至少600字以上），確保內容充實、有價值。`

  return callGPT({ prompt, systemPrompt })
}

/**
 * 數字占卜
 */
export async function getNumerologyDivination(userData: any, question: string): Promise<string> {
  const systemPrompt = getSystemPrompt('divination', userData)
  const prompt = `請進行詳細的數字占卜分析，要求：

【用戶資料】
- 姓名：${userData.name || '未提供'}
- 性別：${userData.gender || '未提供'}
- 出生日期：${userData.birthDate || '未提供'}

【占卜問題】
${question}

【分析要求】
請提供深入且詳細的數字占卜分析，必須包含以下內容（每項都要詳細說明）：

1. **生命數字計算**：
   - 完整的生命數字計算過程
   - 各個數字（生命數、命運數等）的計算結果
   - 數字的基本含義

2. **數字能量解讀**（至少3個數字）：
   - 每個數字的能量特性
   - 數字對性格的影響
   - 數字在問題中的意義

3. **對問題的數字指引**（至少3個面向）：
   - 針對問題的核心數字答案
   - 數字組合的指引
   - 數字預測的結果

4. **幸運數字建議**（至少3個數字）：
   - 適合的幸運數字
   - 數字的使用方法
   - 數字的開運效果

5. **數字組合的意義**（至少2組組合）：
   - 數字組合的含義
   - 組合對問題的影響
   - 組合的吉凶判斷

6. **時機選擇**（至少2個時間點）：
   - 適合行動的數字日期
   - 需要避免的數字日期
   - 關鍵的時間節點

7. **行動建議**（至少3項）：
   - 具體的行動步驟
   - 適合的方法與方向
   - 實際的操作建議

8. **數字開運法**（至少3項）：
   - 使用數字開運的方法
   - 數字能量的運用
   - 提升運勢的具體做法

請以專業數字占卜師的角度進行深入分析，結合數字的能量與意義。回答必須詳細（至少600字以上），確保內容充實、有價值。`

  return callGPT({ prompt, systemPrompt })
}

/**
 * 星座占卜
 */
export async function getAstrologyDivination(userData: any, question: string): Promise<string> {
  const systemPrompt = getSystemPrompt('divination', userData)
  const prompt = `請進行詳細的星座占卜分析，要求：

【用戶資料】
- 姓名：${userData.name || '未提供'}
- 性別：${userData.gender || '未提供'}
- 出生日期：${userData.birthDate || '未提供'}

【占卜問題】
${question}

【分析要求】
請提供深入且詳細的星座占卜分析，必須包含以下內容（每項都要詳細說明）：

1. **星座能量分析**（至少3個面向）：
   - 太陽星座的能量特性
   - 上升星座的影響
   - 其他重要行星位置的能量

2. **行星位置影響**（至少3個行星）：
   - 各行星的當前位置
   - 行星對問題的影響
   - 行星之間的相位關係

3. **對問題的星座指引**（至少3個面向）：
   - 針對問題的核心星座答案
   - 星座能量的指引
   - 星座預測的結果

4. **運勢預測**（至少3個時間段）：
   - 短期運勢（1-3個月）
   - 中期運勢（3-6個月）
   - 長期運勢（6個月以上）

5. **最佳時機**（至少2個時間點）：
   - 適合行動的最佳時機
   - 需要等待的時期
   - 關鍵的時間節點

6. **星座配對建議**（至少2個面向）：
   - 適合的星座配對
   - 需要注意的星座組合
   - 人際關係的建議

7. **開運顏色與物品**（至少3項）：
   - 適合的開運顏色
   - 開運的物品與方向
   - 提升運勢的具體做法

8. **星座祝福**（至少2項）：
   - 星座的祝福語
   - 能量的加持方式
   - 運勢提升的方法

請以專業星座占卜師的角度進行深入分析，結合星座的智慧與能量。回答必須詳細（至少600字以上），確保內容充實、有價值。`

  return callGPT({ prompt, systemPrompt })
}

/**
 * 靈籤占卜
 */
export async function getOracleDivination(userData: any, question: string): Promise<string> {
  const systemPrompt = getSystemPrompt('divination', userData)
  const prompt = `請進行詳細的靈籤占卜分析，要求：

【用戶資料】
- 姓名：${userData.name || '未提供'}
- 性別：${userData.gender || '未提供'}
- 出生日期：${userData.birthDate || '未提供'}

【占卜問題】
${question}

【分析要求】
請提供深入且詳細的靈籤占卜分析，必須包含以下內容（每項都要詳細說明）：

1. **籤詩解讀**：
   - 完整的籤詩內容
   - 籤詩的基本含義
   - 籤詩的歷史背景

2. **籤意分析**（至少3個層面）：
   - 表面含義的解釋
   - 深層含義的挖掘
   - 隱藏的智慧與啟示

3. **對問題的指引**（至少3個面向）：
   - 針對問題的核心答案
   - 籤詩指引的方向
   - 可能的結果與走向

4. **吉凶預測**：
   - 籤的吉凶等級判斷
   - 各面向的吉凶分析
   - 需要注意的方面

5. **時機把握**（至少2個時間點）：
   - 適合行動的最佳時機
   - 需要等待的時期
   - 關鍵的時間節點

6. **行動建議**（至少3項）：
   - 具體的行動步驟
   - 適合的方法與方向
   - 實際的操作建議

7. **注意事項**（至少3項）：
   - 需要避免的情況
   - 可能遇到的障礙
   - 需要特別小心的方面

8. **祈福建議**（至少2項）：
   - 適合的祈福方式
   - 祈願的方向與方法
   - 開運的具體做法

請以專業靈籤占卜師的角度進行深入分析，結合傳統籤詩智慧與現代理解。回答必須詳細（至少600字以上），確保內容充實、有價值。`

  return callGPT({ prompt, systemPrompt })
}

/**
 * 通用占卜問答
 */
export async function askDivinationGPT(question: string, userData: any): Promise<string> {
  const systemPrompt = getSystemPrompt('divination', userData)
  const prompt = `請詳細回答以下占卜相關問題，要求：

【用戶資料】
- 姓名：${userData.name || '未提供'}
- 性別：${userData.gender || '未提供'}
- 出生日期：${userData.birthDate || '未提供'}

【問題】
${question}

【回答要求】
請以專業占卜師的角度提供深入且詳細的回答，必須包含以下內容（每項都要詳細說明）：

1. **問題分析**（至少3個層面）：
   - 問題的核心本質
   - 問題的深層含義
   - 問題的多面向分析

2. **占卜指引**（至少3個面向）：
   - 占卜的角度與方法
   - 能量場的指引
   - 神秘符號的解讀

3. **建議與提醒**（至少5項）：
   - 具體的行動建議
   - 需要注意的事項
   - 可以發揮的優勢
   - 需要避免的風險
   - 時機的把握

4. **開運方法**（至少3項）：
   - 開運的具體方法
   - 開運的物品與方向
   - 提升運勢的做法

請保持神秘感與專業性，提供實用且詳細的指引。回答必須詳細（至少500字以上），確保內容充實、有價值。`

  return callGPT({ prompt, systemPrompt })
}
