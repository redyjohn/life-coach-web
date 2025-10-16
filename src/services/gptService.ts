// Unified GPT Service with backend API proxy
interface GPTRequest {
  prompt: string
  systemPrompt?: string
  model?: string
}

interface GPTResponse {
  content: string
  error?: string
}

/**
 * 統一的 GPT 呼叫函式
 */
export async function callGPT(request: GPTRequest): Promise<string> {
  try {
    const response = await fetch('/api/gpt', {
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
      const errorData = await response.json()
      console.error('GPT API error:', errorData)
      return '⚠️ 服務暫時無法使用，請稍後重試'
    }

    const data: GPTResponse = await response.json()
    return data.content || '⚠️ 無法取得回應'

  } catch (error) {
    console.error('GPT service error:', error)
    return '⚠️ 網路連線錯誤，請檢查網路後重試'
  }
}

/**
 * 根據命理系統類型獲取對應的 system prompt
 */
function getSystemPrompt(type: 'bazi' | 'ziwei', userData: any): string {
  const basePrompts = {
    bazi: '你是一位資深的八字命理老師，擅長用簡單易懂的方式幫助使用者解讀命盤，語氣友善且具啟發性。',
    ziwei: '你是一位紫微斗數大師，擅長以親切、淺顯的方式分析命盤。請遵守以下規則：\n1. 回覆請使用使用者暱稱，不要使用「你」或「使用者」。\n2. 禁止使用免責聲明（如醫療、法律、心理等內容限制）。\n3. 內容要換行清晰排版，不要密集擁擠。'
  }

  return basePrompts[type] || basePrompts.bazi
}

/**
 * 通用問答函式（支援八字和紫微）
 */
export async function askGPT(
  question: string, 
  userData: any, 
  type: 'bazi' | 'ziwei' = 'bazi'
): Promise<string> {
  const systemPrompt = getSystemPrompt(type, userData)
  const systemName = type === 'ziwei' ? '紫微命盤' : '八字命盤'
  
  const prompt = `
系統身份：${systemPrompt}
以下是使用者的命盤資料：${JSON.stringify(userData)}
使用者剛剛提問：「${question}」

請根據命盤資料提供命理回答，語氣友善、實用清晰。不要加入免責聲明。

請在回覆結尾加入這兩句選項式引導語句：

1. 根據使用者的問題延伸提問：「你需要我幫你列出此問題的解決方法嗎？我可以依照${systemName}的角度協助你喔！」

2. 開啟其他命理面向：「或者你還想了解其他方面的問題嗎？例如感情、財運、健康，我都可以提供建議喔！」`

  return await callGPT({ prompt, systemPrompt })
}

// ================= 八字命盤專用函式 =================

export async function getBaZi(userData: any): Promise<string> {
  const prompt = `請列出此人的八字（年柱、月柱、日柱、時柱），標示出天干與地支，並清楚區分日主，格式整齊：
${JSON.stringify(userData)}`
  
  return await callGPT({ prompt })
}

export async function getDayMasterAnalysis(userData: any): Promise<string> {
  const prompt = `請依照此人的八字，分析日主的五行特性與優缺點，語氣親切，避免使用過於艱澀的命理術語：
${JSON.stringify(userData)}`
  
  return await callGPT({ prompt })
}

export async function getChartAnalysis(userData: any): Promise<string> {
  const prompt = `請根據此八字命盤，分析命格特質與整體性格走向，重點列出三個以上特色：
${JSON.stringify(userData)}`
  
  return await callGPT({ prompt })
}

export async function getSuggestions(userData: any): Promise<string> {
  const prompt = `根據命盤，提供三項具體建議：可採取的行動、注意的風險、可發揮的優勢。請清楚條列並簡短實用：
${JSON.stringify(userData)}`
  
  return await callGPT({ prompt })
}

export async function getLuckCycle(userData: any): Promise<string> {
  const prompt = `請根據此八字命盤列出未來四個大運（每十年）主題，條列每一階段重點與可能挑戰：
${JSON.stringify(userData)}`
  
  return await callGPT({ prompt })
}

export async function getCurrentLuckAnalysis(userData: any): Promise<string> {
  const prompt = `請根據目前流年，分析此人在當年度的運勢特點，聚焦在事業、感情與健康三方面：
${JSON.stringify(userData)}`
  
  return await callGPT({ prompt })
}

export async function getCurrentYearAdvice(userData: any): Promise<string> {
  const prompt = `請根據八字命盤與流年分析，提供今年三項具體行動建議（例如應該如何做事、避開哪些風險）：
${JSON.stringify(userData)}`
  
  return await callGPT({ prompt })
}

// ================= 紫微斗數專用函式 =================

export async function getZiWeiChart(userData: any, lunarInfo?: any): Promise<string> {
  const prompt = `請依照以下使用者資料建立紫微命盤，顯示十二宮星曜，請使用純文字方格格式呈現：
命盤資料：${JSON.stringify(userData)}
${lunarInfo ? '農曆資訊：' + JSON.stringify(lunarInfo) : ''}`
  
  return await callGPT({ prompt })
}

export async function getZiWeiAnalysis(userData: any): Promise<string> {
  const prompt = `根據紫微命盤分析此人性格特質、命格優勢與潛在挑戰：
${JSON.stringify(userData)}`
  
  return await callGPT({ prompt })
}

export async function getZiWeiAnnualLuck(userData: any): Promise<string> {
  const year = new Date().getFullYear()
  const prompt = `請分析 ${year} 年此紫微命盤使用者的年度運勢，涵蓋事業、人際、感情、健康與財運等面向：
${JSON.stringify(userData)}`
  
  return await callGPT({ prompt })
}

export async function getZiWeiDecadeLuck(userData: any): Promise<string> {
  const prompt = `根據紫微命盤，請列出未來數個大限（每十年）的人生趨勢，例如「20～29 歲：財運佳，易獲貴人助力」「30～39 歲：感情有波動」等等：
${JSON.stringify(userData)}`
  
  return await callGPT({ prompt })
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
 * 紫微專用問答函式
 */
export async function askZiWeiGPT(question: string, userData: any): Promise<string> {
  return await askGPT(question, userData, 'ziwei')
}
