// 免費 AI 服務配置
export interface FreeAIConfig {
  name: string
  endpoint: string
  apiKey?: string
  model: string
  maxTokens: number
  isAvailable: boolean
  priority: number // 優先級，數字越小優先級越高
}

// 免費 AI 服務列表
export const freeAIServices: FreeAIConfig[] = [
  {
    name: 'Mock AI (測試用)',
    endpoint: 'http://localhost:3000/api/mock',
    model: 'mock-model',
    maxTokens: 1000,
    isAvailable: true,
    priority: 1
  },
  {
    name: 'Hugging Face',
    endpoint: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
    model: 'microsoft/DialoGPT-medium',
    maxTokens: 1000,
    isAvailable: false, // 需要 API Key
    priority: 2
  },
  {
    name: 'Ollama Local',
    endpoint: 'http://localhost:11434/api/generate',
    model: 'llama2',
    maxTokens: 2000,
    isAvailable: false, // 需要本地安裝 Ollama
    priority: 3
  }
]

// 免費 AI 服務管理器
export class FreeAIManager {
  private currentService: FreeAIConfig | null = null
  private fallbackToOpenAI = false

  constructor() {
    this.initializeServices()
  }

  // 初始化服務
  private initializeServices() {
    // 檢查哪些服務可用
    this.checkServiceAvailability()
  }

  // 檢查服務可用性
  private async checkServiceAvailability() {
    for (const service of freeAIServices) {
      if (service.isAvailable) {
        try {
          await this.testService(service)
        } catch (error) {
          console.warn(`服務 ${service.name} 不可用:`, error)
          service.isAvailable = false
        }
      }
    }
  }

  // 測試服務
  private async testService(service: FreeAIConfig): Promise<boolean> {
    // Mock AI 服務總是可用
    if (service.name === 'Mock AI (測試用)') {
      return true
    }
    
    try {
      const response = await fetch(service.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(service.apiKey && { 'Authorization': `Bearer ${service.apiKey}` })
        },
        body: JSON.stringify({
          inputs: 'Hello',
          parameters: {
            max_length: 50,
            temperature: 0.7
          }
        })
      })
      return response.ok
    } catch (error) {
      return false
    }
  }

  // 獲取最佳可用服務
  public getBestAvailableService(): FreeAIConfig | null {
    const availableServices = freeAIServices
      .filter(service => service.isAvailable)
      .sort((a, b) => a.priority - b.priority)

    return availableServices.length > 0 ? availableServices[0] : null
  }

  // 使用免費 AI 服務
  public async callFreeAI(prompt: string, systemPrompt: string): Promise<string> {
    const service = this.getBestAvailableService()
    
    if (!service) {
      throw new Error('沒有可用的免費 AI 服務')
    }

    try {
      return await this.callService(service, prompt, systemPrompt)
    } catch (error) {
      console.error(`服務 ${service.name} 調用失敗:`, error)
      service.isAvailable = false
      
      // 嘗試下一個服務
      const nextService = this.getBestAvailableService()
      if (nextService) {
        return await this.callService(nextService, prompt, systemPrompt)
      }
      
      throw error
    }
  }

  // 調用具體服務
  private async callService(service: FreeAIConfig, prompt: string, systemPrompt: string): Promise<string> {
    switch (service.name) {
      case 'Mock AI (測試用)':
        return await this.callMockAI(service, prompt, systemPrompt)
      case 'Hugging Face':
        return await this.callHuggingFace(service, prompt, systemPrompt)
      case 'Ollama Local':
        return await this.callOllama(service, prompt, systemPrompt)
      default:
        throw new Error(`不支持的服務: ${service.name}`)
    }
  }

  // Mock AI 服務調用（測試用）
  private async callMockAI(service: FreeAIConfig, prompt: string, systemPrompt: string): Promise<string> {
    // 模擬 API 調用延遲
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 根據問題類型生成模擬回應
    const responses = {
      '塔羅牌': '🔮 根據塔羅牌的指引，您目前正處於一個重要的轉折點。建議您保持開放的心態，相信自己的直覺，新的機會即將到來。',
      '愛情': '💕 在愛情方面，您需要更多的耐心和理解。真正的愛情需要時間來培養，不要急於求成。',
      '事業': '💼 您的事業發展前景良好，但需要更多的努力和專注。建議您制定明確的目標，並堅持不懈地追求。',
      '健康': '🏥 您的健康狀況整體良好，但需要注意休息和飲食。建議您保持規律的生活作息，適度運動。',
      '財運': '💰 您的財運正在上升，但需要謹慎理財。建議您制定合理的投資計劃，避免衝動消費。',
      'tarot': '🔮 According to the tarot cards, you are at an important turning point. Keep an open mind and trust your intuition, new opportunities are coming.',
      'love': '💕 In matters of love, you need more patience and understanding. True love takes time to develop, don\'t rush.',
      'career': '💼 Your career prospects are good, but you need more effort and focus. Set clear goals and pursue them persistently.',
      'health': '🏥 Your health is generally good, but pay attention to rest and diet. Maintain regular lifestyle and moderate exercise.',
      'money': '💰 Your financial luck is rising, but be careful with money management. Make reasonable investment plans and avoid impulsive spending.'
    }
    
    // 根據提示詞內容選擇回應
    let response = '🔮 根據占卜的結果，您目前的情況需要更多的耐心和智慧。建議您保持積極的心態，相信美好的未來即將到來。'
    
    for (const [keyword, mockResponse] of Object.entries(responses)) {
      if (prompt.toLowerCase().includes(keyword.toLowerCase()) || systemPrompt.toLowerCase().includes(keyword.toLowerCase())) {
        response = mockResponse
        break
      }
    }
    
    return response
  }

  // Hugging Face API 調用
  private async callHuggingFace(service: FreeAIConfig, prompt: string, systemPrompt: string): Promise<string> {
    const response = await fetch(service.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(service.apiKey && { 'Authorization': `Bearer ${service.apiKey}` })
      },
      body: JSON.stringify({
        inputs: `${systemPrompt}\n\n${prompt}`,
        parameters: {
          max_length: service.maxTokens,
          temperature: 0.7,
          do_sample: true
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Hugging Face API 錯誤: ${response.status}`)
    }

    const data = await response.json()
    return data[0]?.generated_text || '無法生成回應'
  }

  // Ollama 本地 API 調用
  private async callOllama(service: FreeAIConfig, prompt: string, systemPrompt: string): Promise<string> {
    const response = await fetch(service.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: service.model,
        prompt: `${systemPrompt}\n\n${prompt}`,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: service.maxTokens
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama API 錯誤: ${response.status}`)
    }

    const data = await response.json()
    return data.response || '無法生成回應'
  }

  // Groq API 調用
  private async callGroq(service: FreeAIConfig, prompt: string, systemPrompt: string): Promise<string> {
    const response = await fetch(service.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${service.apiKey}`
      },
      body: JSON.stringify({
        model: service.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: service.maxTokens,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`Groq API 錯誤: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || '無法生成回應'
  }

  // 檢查是否應該使用免費服務
  public shouldUseFreeService(): boolean {
    // 檢查 OpenAI API 配額狀態
    const hasQuota = this.checkOpenAIQuota()
    
    // 如果有免費服務可用且 OpenAI 配額不足，優先使用免費服務
    const hasFreeService = this.getBestAvailableService() !== null
    
    return hasFreeService && !hasQuota
  }

  // 檢查 OpenAI 配額（簡化版本）
  private checkOpenAIQuota(): boolean {
    // 這裡可以實現更複雜的配額檢查邏輯
    // 目前簡化為檢查環境變量
    return !!process.env.OPENAI_API_KEY
  }
}

// 創建全局實例
export const freeAIManager = new FreeAIManager()

// 簡化的免費 AI 調用函數
export async function callFreeAI(prompt: string, systemPrompt: string): Promise<string> {
  try {
    return await freeAIManager.callFreeAI(prompt, systemPrompt)
  } catch (error) {
    console.error('免費 AI 服務調用失敗:', error)
    throw new Error('免費 AI 服務暫時不可用，請稍後再試')
  }
}

// 檢查是否應該使用免費服務
export function shouldUseFreeService(): boolean {
  return freeAIManager.shouldUseFreeService()
}
