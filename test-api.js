// 测试 API 是否正常工作
// 使用方法: node test-api.js [url]

const BASE_URL = process.argv[2] || 'https://life-coach-web.vercel.app';

console.log('🧪 测试网站 API 功能...\n');
console.log(`📍 测试 URL: ${BASE_URL}\n`);
console.log('='.repeat(60));

// 测试函数
async function testAPI(name, url, options = {}) {
  try {
    console.log(`\n📡 测试: ${name}`);
    console.log(`   URL: ${url}`);
    
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log(`   ✅ 成功 (${response.status})`);
      console.log(`   📄 响应:`, JSON.stringify(data, null, 2).substring(0, 200));
      return { success: true, data };
    } else {
      console.log(`   ❌ 失败 (${response.status})`);
      console.log(`   📄 错误:`, JSON.stringify(data, null, 2));
      return { success: false, data, status: response.status };
    }
  } catch (error) {
    console.log(`   ❌ 错误: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// 主测试函数
async function runTests() {
  const results = {
    health: null,
    gptGet: null,
    gptPost: null
  };

  // 测试 1: 健康检查
  results.health = await testAPI(
    '健康检查',
    `${BASE_URL}/api/health`
  );

  // 测试 2: GPT API (GET)
  results.gptGet = await testAPI(
    'GPT API (GET)',
    `${BASE_URL}/api/gpt`
  );

  // 测试 3: GPT API (POST) - 简单测试
  results.gptPost = await testAPI(
    'GPT API (POST) - 简单测试',
    `${BASE_URL}/api/gpt`,
    {
      method: 'POST',
      body: {
        prompt: '请用一句话介绍你自己',
        model: 'gpt-3.5-turbo'
      }
    }
  );

  // 测试 4: GPT API (POST) - 完整测试（带 systemPrompt）
  const gptPostFull = await testAPI(
    'GPT API (POST) - 完整测试',
    `${BASE_URL}/api/gpt`,
    {
      method: 'POST',
      body: {
        prompt: '分析这个八字：甲子年、乙丑月、丙寅日、丁卯时',
        systemPrompt: '你是一位专业的命理老师，擅长八字分析。',
        model: 'gpt-3.5-turbo'
      }
    }
  );

  // 总结
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 测试总结:\n');

  const allTests = [
    { name: '健康检查', result: results.health },
    { name: 'GPT API (GET)', result: results.gptGet },
    { name: 'GPT API (POST) - 简单', result: results.gptPost },
    { name: 'GPT API (POST) - 完整', result: gptPostFull }
  ];

  let successCount = 0;
  let failCount = 0;

  allTests.forEach(test => {
    if (test.result?.success) {
      console.log(`✅ ${test.name}: 通过`);
      successCount++;
    } else {
      console.log(`❌ ${test.name}: 失败`);
      failCount++;
    }
  });

  console.log(`\n总计: ${successCount} 通过, ${failCount} 失败\n`);

  // 检查关键配置
  if (results.health?.success) {
    const hasKey = results.health.data?.hasOpenAIKey;
    if (hasKey) {
      console.log('✅ OpenAI API Key 已配置');
    } else {
      console.log('❌ OpenAI API Key 未配置！');
      console.log('   请在 Vercel Dashboard 中添加 OPENAI_API_KEY 环境变量');
    }
  }

  // 给出建议
  if (failCount > 0) {
    console.log('\n💡 建议:');
    if (!results.health?.data?.hasOpenAIKey) {
      console.log('   1. 检查 Vercel 环境变量配置');
      console.log('   2. 确认 OPENAI_API_KEY 已添加');
      console.log('   3. 重新部署项目');
    }
    if (results.gptPost?.status === 500) {
      console.log('   4. 查看 Vercel 函数日志获取详细错误信息');
    }
  } else {
    console.log('\n🎉 所有测试通过！网站运行正常！');
  }
}

// 运行测试
runTests().catch(console.error);

