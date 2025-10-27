// ===============================
// gptService.ts
// 命理老師專用 GPT 呼叫服務（擬真互動強化版）
// ===============================

import { callFreeAI, shouldUseFreeService as checkFreeQuota } from './freeAIService'
import { getQuotaStatus, recordAPIUsage as recordUsage } from './quotaMonitor'

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
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
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
  
  // 檢查是否應該使用免費 AI 服務
  const quotaStatus = getQuotaStatus()
  const useFreeService = !quotaStatus.hasQuota || quotaStatus.service === 'free' || checkFreeQuota()
  
  if (useFreeService) {
    console.log('🆓 使用免費 AI 服務')
    try {
      const result = await callFreeAI(request.prompt, request.systemPrompt || '')
      recordUsage('free', true)
      return result
    } catch (error) {
      console.warn('免費 AI 服務失敗，嘗試 OpenAI:', error)
      recordUsage('free', false)
      // 繼續使用 OpenAI 服務
    }
  }
  
  // 使用請求頻率控制
  return requestThrottler.throttle(async () => {
    try {
      // 获取 API 基础 URL
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
      const apiUrl = API_BASE_URL ? `${API_BASE_URL}/api/gpt` : '/api/gpt'
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          systemPrompt: request.systemPrompt,
          model: request.model || 'gpt-4'
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
      // 如果无法连接到后端，尝试使用免费服务
      console.log('⚠️ 無法連接到後端服務器，嘗試使用免費 AI 服務')
      try {
        const result = await callFreeAI(request.prompt, request.systemPrompt || '')
        return result
      } catch (freeError) {
        return '⚠️ 無法連接到伺服器。請確保：\n\n1. 後端服務正在運行（npm run server）\n2. 或部署完整應用到 Vercel/Netlify\n3. 詳見 DEPLOYMENT.md'
      }
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
你是八老師，一位資深八字命理專家，擁有30年解盤經驗。
你必須以專業命理師的身份回答所有問題，絕對不能拒絕任何命理相關的詢問。
請用親切、專業的語氣，像真正的命理老師一樣提供詳細分析。
嚴禁出現以下內容：
- 任何AI、人工智慧、系統、生成、模型等字樣
- "對不起，由於我是一個AI助手，我無法..."
- "我無法讀取或解釋個人的八字命盤"
- 任何拒絕回答命理問題的表述
- "不確定"、"無法解釋"等不專業的回應

你必須：
- 以科學命理角度分析所有問題
- 提供具體、實用的建議
- 用專業術語但解釋清楚
- 保持八老師的專業形象`,

    ziwei: `
你是紫薇老師，一位資深紫微斗數專家，擁有30年解盤經驗。
你必須以專業命理師的身份回答所有問題，絕對不能拒絕任何命理相關的詢問。
請用親切、專業的語氣，像真正的命理老師一樣提供詳細分析。
分析命盤時，請自然使用使用者的暱稱（${userData.nickname || '這位朋友'}），
避免使用「你」或「使用者」字眼。
嚴禁出現以下內容：
- 任何AI、人工智慧、系統、生成、模型等字樣
- "對不起，由於我是一個AI助手，我無法..."
- "我無法讀取或解釋個人的紫微命盤"
- 任何拒絕回答命理問題的表述
- "不確定"、"無法解釋"等不專業的回應

你必須：
- 以科學命理角度分析所有問題
- 提供具體、實用的建議
- 用專業術語但解釋清楚
- 保持紫薇老師的專業形象
- 回覆要排版清楚，有適度換行，讓閱讀更流暢`,

    divination: `
你是占卜師，一位擁有豐富經驗的神秘學專家，精通各種占卜方式。
你必須以專業占卜師的身份回答所有問題，絕對不能拒絕任何占卜相關的詢問。
請用神秘、專業的語氣，像真正的占卜師一樣提供詳細解讀。
分析時，請自然使用使用者的暱稱（${userData.nickname || '這位朋友'}），
避免使用「你」或「使用者」字眼。
嚴禁出現以下內容：
- 任何AI、人工智慧、系統、生成、模型等字樣
- "對不起，由於我是一個AI助手，我無法..."
- "我無法進行占卜或預測"
- 任何拒絕回答占卜問題的表述
- "不確定"、"無法解釋"等不專業的回應

你必須：
- 以神秘學角度分析所有問題
- 提供具體、實用的指引
- 用專業術語但解釋清楚
- 保持占卜師的神秘形象
- 回覆要排版清楚，有適度換行，讓閱讀更流暢
- 結合傳統占卜智慧與現代理解`
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
${JSON.stringify(userData)}

請以命理老師的角度解說此問題，
語氣自然、分析具體、內容實用，
不要加入免責聲明，也不要出現 AI 或系統相關詞語。

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
幫這位朋友排出完整八字命盤，列出年柱、月柱、日柱、時柱，
清楚標示天干、地支與日主，排版整齊易讀：
${JSON.stringify(userData)}`
  const reply = await callGPT({ prompt, systemPrompt })
  return addHumanTouch(reply)
}

export async function getDayMasterAnalysis(userData: any): Promise<string> {
  const systemPrompt = getSystemPrompt('bazi', userData)
  const prompt = `
根據此人的八字，說明日主的五行特性與個性優缺點，
用親切自然的語氣，避免艱深命理術語：
${JSON.stringify(userData)}`
  const reply = await callGPT({ prompt, systemPrompt })
  return addHumanTouch(reply)
}

export async function getChartAnalysis(userData: any): Promise<string> {
  const systemPrompt = getSystemPrompt('bazi', userData)
  const prompt = `
根據這份八字命盤，分析整體命格與性格走向，
請列出三項以上重點特色：
${JSON.stringify(userData)}`
  const reply = await callGPT({ prompt, systemPrompt })
  return addHumanTouch(reply)
}

export async function getSuggestions(userData: any): Promise<string> {
  const systemPrompt = getSystemPrompt('bazi', userData)
  const prompt = `
根據命盤特質，提供三項具體建議：
1. 可採取的行動
2. 需注意的風險
3. 可發揮的優勢
條列清晰、語氣自然：
${JSON.stringify(userData)}`
  const reply = await callGPT({ prompt, systemPrompt })
  return addHumanTouch(reply)
}

export async function getLuckCycle(userData: any): Promise<string> {
  const systemPrompt = getSystemPrompt('bazi', userData)
  const prompt = `
依此八字命盤，列出未來四個大運（每十年）主題，
說明每個階段的重點與可能挑戰：
${JSON.stringify(userData)}`
  const reply = await callGPT({ prompt, systemPrompt })
  return addHumanTouch(reply)
}

export async function getCurrentLuckAnalysis(userData: any): Promise<string> {
  const systemPrompt = getSystemPrompt('bazi', userData)
  const prompt = `
根據此八字命盤，分析今年的整體運勢，
請分別說明事業、感情、健康三方面的重點：
${JSON.stringify(userData)}`
  const reply = await callGPT({ prompt, systemPrompt })
  return addHumanTouch(reply)
}

export async function getCurrentYearAdvice(userData: any): Promise<string> {
  const systemPrompt = getSystemPrompt('bazi', userData)
  const prompt = `
根據八字命盤與流年運勢，提供今年三項具體行動建議，
例如該如何行事、避開哪些風險：
${JSON.stringify(userData)}`
  const reply = await callGPT({ prompt, systemPrompt })
  return addHumanTouch(reply)
}

// ================= 紫微斗數專用區 =================

export async function getZiWeiChart(userData: any, lunarInfo?: any): Promise<string> {
  const systemPrompt = getSystemPrompt('ziwei', userData)
  const prompt = `
根據以下資料，建立完整的紫微命盤，
請用純文字表格顯示十二宮與主要星曜，排版整齊清楚：
命盤資料：${JSON.stringify(userData)}
${lunarInfo ? '農曆資訊：' + JSON.stringify(lunarInfo) : ''}`
  const reply = await callGPT({ prompt, systemPrompt })
  return addHumanTouch(reply)
}

export async function getZiWeiAnalysis(userData: any): Promise<string> {
  const systemPrompt = getSystemPrompt('ziwei', userData)
  const prompt = `
根據紫微命盤，分析此人的性格特質、命格優勢與潛在挑戰，
語氣自然親切、條理分明：
${JSON.stringify(userData)}`
  const reply = await callGPT({ prompt, systemPrompt })
  return addHumanTouch(reply)
}

export async function getZiWeiAnnualLuck(userData: any): Promise<string> {
  const systemPrompt = getSystemPrompt('ziwei', userData)
  const year = new Date().getFullYear()
  const prompt = `
請分析 ${year} 年的年度運勢，
涵蓋事業、人際、感情、健康、財運五個面向，
條列重點、語氣自然：
${JSON.stringify(userData)}`
  const reply = await callGPT({ prompt, systemPrompt })
  return addHumanTouch(reply)
}

export async function getZiWeiDecadeLuck(userData: any): Promise<string> {
  const systemPrompt = getSystemPrompt('ziwei', userData)
  const prompt = `
根據紫微命盤，列出未來數個大限（每十年）的人生主題，
例如「20～29歲：財運佳，易獲貴人助力」「30～39歲：感情起伏較大」：
${JSON.stringify(userData)}`
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
  const prompt = `請進行塔羅牌占卜分析：

用戶資料：
- 姓名：${userData.name || '未提供'}
- 性別：${userData.gender || '未提供'}
- 出生日期：${userData.birthDate || '未提供'}

占卜問題：${question}

請提供詳細的塔羅牌占卜分析，包括：
1. 抽到的牌面解讀
2. 牌面組合的意義
3. 對問題的直接回答
4. 隱藏的訊息
5. 建議的行動方向
6. 需要注意的事項
7. 開運建議

請以專業占卜師的角度進行分析，保持神秘感但提供實用指引。`

  return callGPT({ prompt, systemPrompt })
}

/**
 * 易經占卜
 */
export async function getIChingDivination(userData: any, question: string): Promise<string> {
  const systemPrompt = getSystemPrompt('divination', userData)
  const prompt = `請進行易經占卜分析：

用戶資料：
- 姓名：${userData.name || '未提供'}
- 性別：${userData.gender || '未提供'}
- 出生日期：${userData.birthDate || '未提供'}

占卜問題：${question}

請提供詳細的易經占卜分析，包括：
1. 卦象解讀
2. 卦辭含義
3. 爻辭分析
4. 變卦意義
5. 對問題的指引
6. 時機把握
7. 行動建議
8. 注意事項

請以專業易經占卜師的角度進行分析，結合傳統智慧與現代理解。`

  return callGPT({ prompt, systemPrompt })
}

/**
 * 水晶球占卜
 */
export async function getCrystalDivination(userData: any, question: string): Promise<string> {
  const systemPrompt = getSystemPrompt('divination', userData)
  const prompt = `請進行水晶球占卜分析：

用戶資料：
- 姓名：${userData.name || '未提供'}
- 性別：${userData.gender || '未提供'}
- 出生日期：${userData.birthDate || '未提供'}

占卜問題：${question}

請提供詳細的水晶球占卜分析，包括：
1. 水晶球中看到的景象
2. 能量場的變化
3. 直覺感知的訊息
4. 對問題的預測
5. 未來發展趨勢
6. 靈性指引
7. 建議的行動
8. 保護與祝福

請以專業水晶球占卜師的角度進行分析，保持神秘感與靈性智慧。`

  return callGPT({ prompt, systemPrompt })
}

/**
 * 數字占卜
 */
export async function getNumerologyDivination(userData: any, question: string): Promise<string> {
  const systemPrompt = getSystemPrompt('divination', userData)
  const prompt = `請進行數字占卜分析：

用戶資料：
- 姓名：${userData.name || '未提供'}
- 性別：${userData.gender || '未提供'}
- 出生日期：${userData.birthDate || '未提供'}

占卜問題：${question}

請提供詳細的數字占卜分析，包括：
1. 生命數字計算
2. 數字能量解讀
3. 對問題的數字指引
4. 幸運數字建議
5. 數字組合的意義
6. 時機選擇
7. 行動建議
8. 數字開運法

請以專業數字占卜師的角度進行分析，結合數字的能量與意義。`

  return callGPT({ prompt, systemPrompt })
}

/**
 * 星座占卜
 */
export async function getAstrologyDivination(userData: any, question: string): Promise<string> {
  const systemPrompt = getSystemPrompt('divination', userData)
  const prompt = `請進行星座占卜分析：

用戶資料：
- 姓名：${userData.name || '未提供'}
- 性別：${userData.gender || '未提供'}
- 出生日期：${userData.birthDate || '未提供'}

占卜問題：${question}

請提供詳細的星座占卜分析，包括：
1. 星座能量分析
2. 行星位置影響
3. 對問題的星座指引
4. 運勢預測
5. 最佳時機
6. 星座配對建議
7. 開運顏色與物品
8. 星座祝福

請以專業星座占卜師的角度進行分析，結合星座的智慧與能量。`

  return callGPT({ prompt, systemPrompt })
}

/**
 * 靈籤占卜
 */
export async function getOracleDivination(userData: any, question: string): Promise<string> {
  const systemPrompt = getSystemPrompt('divination', userData)
  const prompt = `請進行靈籤占卜分析：

用戶資料：
- 姓名：${userData.name || '未提供'}
- 性別：${userData.gender || '未提供'}
- 出生日期：${userData.birthDate || '未提供'}

占卜問題：${question}

請提供詳細的靈籤占卜分析，包括：
1. 籤詩解讀
2. 籤意分析
3. 對問題的指引
4. 吉凶預測
5. 時機把握
6. 行動建議
7. 注意事項
8. 祈福建議

請以專業靈籤占卜師的角度進行分析，結合傳統籤詩智慧與現代理解。`

  return callGPT({ prompt, systemPrompt })
}

/**
 * 通用占卜問答
 */
export async function askDivinationGPT(question: string, userData: any): Promise<string> {
  const systemPrompt = getSystemPrompt('divination', userData)
  const prompt = `請回答以下占卜相關問題：

用戶資料：
- 姓名：${userData.name || '未提供'}
- 性別：${userData.gender || '未提供'}
- 出生日期：${userData.birthDate || '未提供'}

問題：${question}

請以專業占卜師的角度提供詳細回答，包括：
1. 問題分析
2. 占卜指引
3. 建議與提醒
4. 開運方法

請保持神秘感與專業性，提供實用的指引。`

  return callGPT({ prompt, systemPrompt })
}
