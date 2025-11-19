// 配置文件
// 如果您的 Vercel 域名是 https://your-app-name.vercel.app
// 请取消注释下面这行并替换为您的实际域名

// export const API_BASE_URL = 'https://your-app-name.vercel.app'

// 如果上面未设置，将使用环境变量或默认值
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

// Google AdSense 配置
// 请将 PLACEHOLDER 替换为您的 AdSense Publisher ID (格式: ca-pub-xxxxxxxxxxxxxxxx)
// 获取方式: https://www.google.com/adsense -> 账户 -> 账户信息 -> 发布商 ID
export const ADSENSE_CONFIG = {
  // 是否启用 AdSense (设置为 false 时显示占位符)
  enabled: import.meta.env.VITE_ADSENSE_ENABLED === 'true',
  
  // AdSense Publisher ID (从环境变量或直接设置)
  // 格式: ca-pub-xxxxxxxxxxxxxxxx
  clientId: import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-PLACEHOLDER',
  
  // 不同广告位的 Slot ID (可选，如果不设置则使用自动广告)
  slots: {
    // 入口广告
    entry: import.meta.env.VITE_ADSENSE_SLOT_ENTRY || '',
    // 浏览广告
    browse: import.meta.env.VITE_ADSENSE_SLOT_BROWSE || '',
    // 功能前广告
    function: import.meta.env.VITE_ADSENSE_SLOT_FUNCTION || '',
    // 结果页广告
    result: import.meta.env.VITE_ADSENSE_SLOT_RESULT || '',
    // 持续广告（侧边栏、底部）
    persistent: import.meta.env.VITE_ADSENSE_SLOT_PERSISTENT || ''
  }
}

