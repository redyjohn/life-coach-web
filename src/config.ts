// 配置文件
// 如果您的 Vercel 域名是 https://your-app-name.vercel.app
// 请取消注释下面这行并替换为您的实际域名

// export const API_BASE_URL = 'https://your-app-name.vercel.app'

// 如果上面未设置，将使用环境变量或默认值
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

