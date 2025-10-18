// 簡單的 API 測試端點
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 檢查環境變數
    const hasApiKey = !!process.env.OPENAI_API_KEY;
    
    const response = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        hasOpenAIKey: hasApiKey,
        nodeVersion: process.version,
        platform: process.platform
      },
      request: {
        method: req.method,
        headers: req.headers,
        body: req.body
      }
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
