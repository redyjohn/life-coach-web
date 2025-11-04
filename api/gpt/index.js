// Vercel Serverless Function for GPT API proxy
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 支援 GET 請求用於測試
  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'GPT API is working!',
      method: 'GET',
      timestamp: new Date().toISOString(),
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      usage: 'Send POST request with { "prompt": "your question" }'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, systemPrompt, model = 'gpt-3.5-turbo' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('❌ OpenAI API key not configured');
      return res.status(500).json({ 
        error: 'OpenAI API key not configured',
        message: 'Please configure OPENAI_API_KEY in Vercel environment variables'
      });
    }

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    // 記錄請求信息（不記錄完整內容以避免日誌過長）
    console.log(`📤 Sending request to OpenAI:`, {
      model,
      messagesCount: messages.length,
      promptLength: prompt.length,
      systemPromptLength: systemPrompt ? systemPrompt.length : 0
    });

    const requestBody = {
      model,
      messages,
      temperature: 0.7,
      max_tokens: 4000, // 增加最大token數，確保答案更詳細
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.3
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        errorData = { 
          error: { 
            message: `HTTP ${response.status}: ${response.statusText}`,
            type: 'unknown_error'
          }
        };
      }
      
      console.error('❌ OpenAI API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });

      // 根據不同的錯誤類型返回更詳細的信息
      let errorMessage = 'OpenAI API error';
      if (errorData.error) {
        if (errorData.error.message) {
          errorMessage = errorData.error.message;
        } else if (typeof errorData.error === 'string') {
          errorMessage = errorData.error;
        }
      }

      return res.status(response.status).json({ 
        error: errorMessage,
        details: errorData,
        status: response.status
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim() || '⚠️ 無法取得回應';

    console.log(`✅ Successfully received response from OpenAI (${content.length} characters)`);

    res.status(200).json({ content });

  } catch (error) {
    console.error('❌ GPT API proxy error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // 返回更詳細的錯誤信息
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      type: error.name || 'UnknownError',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
