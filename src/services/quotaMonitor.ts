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
    // 檢查環境變量（異步，不阻塞初始化）
    this.checkEnvironmentQuota()
    
    // 定期檢查配額狀態
    setInterval(() => {
      this.checkQuotaStatus()
    }, this.quotaCheckInterval)
  }

  // 檢查環境變量配額
  private async checkEnvironmentQuota() {
    // 默認使用免費服務，直到確認後端可用
    const hasFreeService = this.checkFreeServiceAvailability()
    
    this.quotaStatus = {
      hasQuota: false, // 默認無配額，需要測試後端連接
      service: 'free',
      lastCheck: new Date()
    }

    const statusText = this.quotaStatus.hasQuota ? '有配額' : '無配額'
    console.log('📊 配額狀態:', this.quotaStatus.service, statusText)
    
    // 異步檢查後端是否可用
    this.checkQuotaStatus().catch(error => {
      console.warn('初始配額檢查失敗:', error)
    })
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
      // 獲取 API 基础 URL
      // 优先使用配置文件，然后环境变量，最后默认路径
      let API_BASE_URL = ''
      try {
        const config = await import('../config')
        API_BASE_URL = config.API_BASE_URL || import.meta.env.VITE_API_BASE_URL || ''
      } catch {
        API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
      }
      const apiUrl = API_BASE_URL ? `${API_BASE_URL}/api/health` : '/api/health'
      
      // 先檢查健康狀態
      const healthResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      // 如果後端不可用，返回無配額狀態
      if (!healthResponse.ok) {
        console.warn('⚠️ 後端服務不可用，使用免費服務')
        return {
          hasQuota: false,
          service: 'free',
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
      // 無法連接到後端，使用免費服務
      return {
        hasQuota: false,
        service: 'free',
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
