// API 配額監控服務
export interface QuotaStatus {
  hasQuota: boolean
  remainingQuota?: number
  resetTime?: Date
  service: 'openai' | 'free'
  lastCheck: Date
}

class QuotaMonitor {
  private quotaStatus: QuotaStatus = {
    hasQuota: true,
    service: 'openai',
    lastCheck: new Date()
  }

  private quotaCheckInterval: number = 5 * 60 * 1000 // 5分鐘檢查一次
  private lastQuotaCheck: number = 0

  constructor() {
    this.initializeQuotaMonitoring()
  }

  // 初始化配額監控
  private initializeQuotaMonitoring() {
    // 檢查環境變量
    this.checkEnvironmentQuota()
    
    // 定期檢查配額狀態
    setInterval(() => {
      this.checkQuotaStatus()
    }, this.quotaCheckInterval)
  }

  // 檢查環境變量配額
  private checkEnvironmentQuota() {
    // 在瀏覽器環境中，我們假設有 OpenAI Key（因為服務器會處理）
    const hasOpenAIKey = true
    const hasFreeService = this.checkFreeServiceAvailability()
    
    this.quotaStatus = {
      hasQuota: hasOpenAIKey,
      service: hasOpenAIKey ? 'openai' : 'free',
      lastCheck: new Date()
    }

    console.log(`📊 配額狀態: ${this.quotaStatus.service} (${this.quotaStatus.hasQuota ? '有配額' : '無配額'})`)
  }

  // 檢查免費服務可用性
  private checkFreeServiceAvailability(): boolean {
    // 這裡可以實現更複雜的免費服務檢查邏輯
    // 目前簡化為檢查本地服務
    return true // 假設免費服務可用
  }

  // 檢查配額狀態
  public async checkQuotaStatus(): Promise<QuotaStatus> {
    const now = Date.now()
    
    // 避免頻繁檢查
    if (now - this.lastQuotaCheck < this.quotaCheckInterval) {
      return this.quotaStatus
    }

    this.lastQuotaCheck = now

    try {
      // 檢查 OpenAI 配額
      const openAIStatus = await this.checkOpenAIQuota()
      
      if (openAIStatus.hasQuota) {
        this.quotaStatus = {
          ...openAIStatus,
          service: 'openai',
          lastCheck: new Date()
        }
      } else {
        // OpenAI 配額不足，檢查免費服務
        const freeServiceAvailable = this.checkFreeServiceAvailability()
        
        this.quotaStatus = {
          hasQuota: freeServiceAvailable,
          service: 'free',
          lastCheck: new Date()
        }
      }
    } catch (error) {
      console.error('配額檢查失敗:', error)
      // 保持當前狀態
    }

    return this.quotaStatus
  }

  // 檢查 OpenAI 配額
  private async checkOpenAIQuota(): Promise<QuotaStatus> {
    try {
      // 發送一個簡單的測試請求
      const response = await fetch('/api/gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'test',
          systemPrompt: 'You are a helpful assistant.',
          model: 'gpt-4'
        })
      })

      if (response.status === 429) {
        return {
          hasQuota: false,
          service: 'openai',
          lastCheck: new Date()
        }
      }

      if (response.status === 402 || response.status === 403) {
        return {
          hasQuota: false,
          service: 'openai',
          lastCheck: new Date()
        }
      }

      return {
        hasQuota: true,
        service: 'openai',
        lastCheck: new Date()
      }
    } catch (error) {
      console.error('OpenAI 配額檢查失敗:', error)
      return {
        hasQuota: false,
        service: 'openai',
        lastCheck: new Date()
      }
    }
  }

  // 獲取當前配額狀態
  public getQuotaStatus(): QuotaStatus {
    return this.quotaStatus
  }

  // 更新配額狀態
  public updateQuotaStatus(status: Partial<QuotaStatus>) {
    this.quotaStatus = {
      ...this.quotaStatus,
      ...status,
      lastCheck: new Date()
    }
  }

  // 檢查是否應該使用免費服務
  public shouldUseFreeService(): boolean {
    // 在測試模式下優先使用免費服務
    const isTestMode = (typeof window !== 'undefined' && window.location.hostname === 'localhost')
    
    if (isTestMode) {
      console.log('🧪 測試模式：優先使用免費 AI 服務')
      return true
    }
    
    return !this.quotaStatus.hasQuota || this.quotaStatus.service === 'free'
  }

  // 記錄 API 使用
  public recordAPIUsage(service: 'openai' | 'free', success: boolean) {
    if (service === 'openai' && !success) {
      // OpenAI 調用失敗，可能配額不足
      this.updateQuotaStatus({
        hasQuota: false,
        service: 'free'
      })
    }
  }
}

// 創建全局實例
export const quotaMonitor = new QuotaMonitor()

// 導出便捷函數
export function getQuotaStatus(): QuotaStatus {
  return quotaMonitor.getQuotaStatus()
}

export function shouldUseFreeService(): boolean {
  return quotaMonitor.shouldUseFreeService()
}

export function recordAPIUsage(service: 'openai' | 'free', success: boolean) {
  quotaMonitor.recordAPIUsage(service, success)
}
