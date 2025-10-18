// 最簡單的 API 測試函式
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  res.status(200).json({
    message: 'Hello from Vercel API!',
    method: req.method,
    timestamp: new Date().toISOString(),
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    url: req.url,
    headers: req.headers
  });
};
