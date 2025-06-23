import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const API_URL = 'https://api.openai.com/v1/chat/completions'

async function callGPT(prompt: string): Promise<string> {
  try {
    const messages = [
    {
      role: 'system',
      content: '你是一位專業的中文八字命理老師，擅長以簡明易懂的方式，依據使用者提供的基本資料（暱稱、生日、出生時間與地點）來排出八字，並給予命理分析與建議。請注意以下原則：1. 直接稱呼使用者輸入的「暱稱」，不要使用「你」、「使用者」、「客戶」、「先生」、「小姐」等詞彙。2.不要自行猜測使用者是男性或女性。3.如無法提供特定分析，請略過該項，不需提醒使用者資料不足。4.禁止使用法律、醫療、心理等免責聲明語句。5.所有段落請以換行方式自然分段，避免行距擁擠。'
    },
    {
      role: 'user',
      content: prompt
    }
  ]

  const response = await axios.post(
    API_URL,
    {
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  )

  return response.data.choices[0].message.content
}catch (error) {
    console.error('GPT 回傳失敗:', error)
    return '❌ GPT 回覆錯誤，請稍後再試。'
  }
}
// 以下函式配合 ResultView.vue

export async function getBaZi(data: any) {
  const prompt = `以下是用戶資料：${JSON.stringify(data)}
請使用「節氣換日換時法」推算其八字（四柱），使用條列式簡潔呈現。`
  return await callGPT(prompt)
}

export async function getDayMasterAnalysis(data: any) {
  const prompt = `以下是用戶資料：${JSON.stringify(data)}
請說明此人日主五行屬性、喜忌與特點，簡潔明確。`
  return await callGPT(prompt)
}

export async function getChartAnalysis(data: any) {
  const prompt = `以下是用戶資料：${JSON.stringify(data)}
請根據八字命盤進行詳細解讀，包括宮位、五行、十神分析等。`
  return await callGPT(prompt)
}

export async function getSuggestions(data: any) {
  const prompt = `以下是用戶資料：${JSON.stringify(data)}
請根據八字給予用神、喜忌分析與實用建議，例如適合職業、生活方式等。`
  return await callGPT(prompt)
}

export async function getLuckCycle(data: any) {
  const prompt = `以下是用戶資料：${JSON.stringify(data)}
請列出其大運列表（每十年為一柱），每柱簡述上升或下降趨勢與建議事項。`
  return await callGPT(prompt)
}

export async function getCurrentLuckAnalysis(data: any) {
  const prompt = `以下是用戶資料：${JSON.stringify(data)}
目前處於哪一柱大運？請說明此大運的整體趨勢與對其運勢影響。`
  return await callGPT(prompt)
}

export async function getCurrentYearAdvice(data: any) {
  const prompt = `以下是用戶資料：${JSON.stringify(data)}
請針對2025年的流年運勢進行詳細分析與建議，不少於50字。`
  return await callGPT(prompt)
}
// ✅ 新增 GPT 問答模擬函式（可替換為 API）
export async function askGPT(question: string, userData: any): Promise<string> {
  const prompt = `
以下是使用者的八字資料：${JSON.stringify(userData)}
根據這些資料，請回答以下命理提問：
「${question}」
請以親切易懂的方式回覆，不要提及免責聲明。
`
  return await callGPT(prompt)
}
