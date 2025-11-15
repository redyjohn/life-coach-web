/**
 * 全面測試所有 API 端點
 * 檢查所有頁面的 API 請求是否順暢
 */

// 檢測 API 基礎網址
// 優先使用環境變數，然後嘗試本地服務器，最後使用前端開發服務器
const API_BASE_URL = process.env.VITE_API_BASE_URL || 
                     process.env.API_BASE_URL || 
                     (process.argv[2] === 'local' ? 'http://localhost:3000' : 'http://localhost:5173');
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// 測試結果統計
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
};

// 測試函數
async function testAPI(name, url, options = {}) {
  results.total++;
  const method = options.method || 'GET';
  const body = options.body;
  
  try {
    console.log(`${colors.cyan}測試: ${name}${colors.reset}`);
    console.log(`  ${colors.blue}${method} ${url}${colors.reset}`);
    
    const startTime = Date.now();
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: body ? JSON.stringify(body) : undefined
    });
    
    const duration = Date.now() - startTime;
    
    // 處理空響應
    let data = {};
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = { error: `JSON parse error: ${e.message}`, raw: text.substring(0, 100) };
        }
      }
    } else {
      const text = await response.text();
      data = { message: text || 'Empty response', status: response.status };
    }
    
    if (response.ok) {
      results.passed++;
      console.log(`${colors.green}  ✅ 通過 (${duration}ms)${colors.reset}`);
      if (options.showResponse) {
        console.log(`  ${colors.blue}回應: ${JSON.stringify(data, null, 2).substring(0, 200)}...${colors.reset}`);
      }
      return { success: true, data, duration };
    } else {
      results.failed++;
      const error = `HTTP ${response.status}: ${data.error || data.message || 'Unknown error'}`;
      results.errors.push({ name, error });
      console.log(`${colors.red}  ❌ 失敗: ${error}${colors.reset}`);
      return { success: false, error, duration };
    }
  } catch (error) {
    results.failed++;
    const errorMsg = error.message || 'Unknown error';
    results.errors.push({ name, error: errorMsg });
    console.log(`${colors.red}  ❌ 錯誤: ${errorMsg}${colors.reset}`);
    return { success: false, error: errorMsg };
  }
}

// 主測試函數
async function runAllTests() {
  console.log(`${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.cyan}開始測試所有 API 端點${colors.reset}`);
  console.log(`${colors.cyan}API 基礎網址: ${API_BASE_URL}${colors.reset}`);
  console.log(`${colors.cyan}========================================\n${colors.reset}`);

  // 1. 健康檢查
  console.log(`${colors.yellow}1. 健康檢查端點${colors.reset}`);
  await testAPI('Health Check', `${API_BASE_URL}/api/health`, { showResponse: true });
  console.log('');

  // 2. Hello API
  console.log(`${colors.yellow}2. Hello API 端點${colors.reset}`);
  await testAPI('Hello API', `${API_BASE_URL}/api/hello`, { showResponse: true });
  console.log('');

  // 3. GPT API - GET 請求
  console.log(`${colors.yellow}3. GPT API - GET 請求（測試用）${colors.reset}`);
  await testAPI('GPT API GET', `${API_BASE_URL}/api/gpt`, { showResponse: true });
  console.log('');

  // 4. GPT API - POST 請求（簡單測試）
  console.log(`${colors.yellow}4. GPT API - POST 請求（簡單測試）${colors.reset}`);
  await testAPI('GPT API POST (Simple)', `${API_BASE_URL}/api/gpt`, {
    method: 'POST',
    body: {
      prompt: '請用一句話介紹你自己',
      systemPrompt: '你是一個友善的助手',
      model: 'gpt-3.5-turbo'
    },
    showResponse: true
  });
  console.log('');

  // 5. GPT API - 八字命理測試
  console.log(`${colors.yellow}5. GPT API - 八字命理測試${colors.reset}`);
  await testAPI('GPT API (BaZi)', `${API_BASE_URL}/api/gpt`, {
    method: 'POST',
    body: {
      prompt: '請分析這個八字：1990年1月1日，男性',
      systemPrompt: '你是一位專業的八字命理師',
      model: 'gpt-3.5-turbo'
    },
    showResponse: false
  });
  console.log('');

  // 6. GPT API - 紫微斗數測試
  console.log(`${colors.yellow}6. GPT API - 紫微斗數測試${colors.reset}`);
  await testAPI('GPT API (ZiWei)', `${API_BASE_URL}/api/gpt`, {
    method: 'POST',
    body: {
      prompt: '請分析紫微命盤',
      systemPrompt: '你是一位專業的紫微斗數命理師',
      model: 'gpt-3.5-turbo'
    },
    showResponse: false
  });
  console.log('');

  // 7. GPT API - 占卜測試
  console.log(`${colors.yellow}7. GPT API - 占卜測試${colors.reset}`);
  await testAPI('GPT API (Divination)', `${API_BASE_URL}/api/gpt`, {
    method: 'POST',
    body: {
      prompt: '請為我占卜今天的運勢',
      systemPrompt: '你是一位專業的占卜師',
      model: 'gpt-3.5-turbo'
    },
    showResponse: false
  });
  console.log('');

  // 8. 測試錯誤處理 - 缺少 prompt
  console.log(`${colors.yellow}8. 錯誤處理測試 - 缺少 prompt${colors.reset}`);
  await testAPI('GPT API (Missing Prompt)', `${API_BASE_URL}/api/gpt`, {
    method: 'POST',
    body: {
      systemPrompt: '你是一個助手'
    }
  });
  console.log('');

  // 9. 測試錯誤處理 - 無效方法
  console.log(`${colors.yellow}9. 錯誤處理測試 - 無效方法${colors.reset}`);
  await testAPI('GPT API (Invalid Method)', `${API_BASE_URL}/api/gpt`, {
    method: 'PUT'
  });
  console.log('');

  // 10. CORS 測試
  console.log(`${colors.yellow}10. CORS 測試${colors.reset}`);
  await testAPI('CORS Check', `${API_BASE_URL}/api/health`, {
    headers: {
      'Origin': 'http://localhost:5173'
    }
  });
  console.log('');

  // 輸出測試結果
  console.log(`${colors.cyan}========================================${colors.reset}`);
  console.log(`${colors.cyan}測試結果統計${colors.reset}`);
  console.log(`${colors.cyan}========================================${colors.reset}`);
  console.log(`總測試數: ${results.total}`);
  console.log(`${colors.green}通過: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}失敗: ${results.failed}${colors.reset}`);
  console.log(`成功率: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  
  if (results.errors.length > 0) {
    console.log(`\n${colors.red}錯誤詳情:${colors.reset}`);
    results.errors.forEach((err, index) => {
      console.log(`${index + 1}. ${err.name}: ${err.error}`);
    });
  }

  console.log(`\n${colors.cyan}========================================${colors.reset}`);
  
  // 返回測試結果
  return {
    total: results.total,
    passed: results.passed,
    failed: results.failed,
    successRate: (results.passed / results.total) * 100,
    errors: results.errors
  };
}

// 執行測試
if (typeof window === 'undefined') {
  // Node.js 環境 - 使用內建的 fetch（Node.js 18+）
  if (typeof fetch === 'undefined') {
    // 如果 Node.js 版本較舊，需要安裝 node-fetch
    console.error(`${colors.red}錯誤: 需要 Node.js 18+ 或安裝 node-fetch${colors.reset}`);
    process.exit(1);
  }
  
  runAllTests().then(result => {
    process.exit(result.failed > 0 ? 1 : 0);
  }).catch(error => {
    console.error(`${colors.red}測試執行錯誤: ${error.message}${colors.reset}`);
    process.exit(1);
  });
} else {
  // 瀏覽器環境
  window.testAllAPIs = runAllTests;
  console.log('測試函數已載入，在控制台執行: testAllAPIs()');
}

// ES module export
export { runAllTests, testAPI };

