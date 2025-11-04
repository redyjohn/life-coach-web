// Vercel 部署诊断工具
// 用于诊断环境变量和 API 配置问题

const BASE_URL = 'https://life-coach-web.vercel.app';

console.log('🔍 Vercel 部署诊断工具\n');
console.log('='.repeat(60));
console.log(`📍 项目 URL: ${BASE_URL}\n`);

async function diagnose() {
  const issues = [];
  const fixes = [];

  // 1. 检查健康检查端点
  console.log('📡 检查 1: 健康检查端点...');
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('   ✅ 健康检查端点正常');
      console.log(`   📊 状态: ${data.status}`);
      console.log(`   🔑 hasOpenAIKey: ${data.hasOpenAIKey}`);
      
      if (!data.hasOpenAIKey) {
        issues.push('❌ OpenAI API Key 未配置');
        fixes.push('在 Vercel Dashboard 添加 OPENAI_API_KEY 环境变量');
      } else {
        console.log('   ✅ OpenAI API Key 已配置');
      }
    } else {
      issues.push(`❌ 健康检查失败 (${response.status})`);
      console.log(`   ❌ 错误: ${data.error || '未知错误'}`);
    }
  } catch (error) {
    issues.push('❌ 无法连接到健康检查端点');
    console.log(`   ❌ 错误: ${error.message}`);
  }

  console.log('\n' + '-'.repeat(60) + '\n');

  // 2. 检查 GPT API (GET)
  console.log('📡 检查 2: GPT API (GET)...');
  try {
    const response = await fetch(`${BASE_URL}/api/gpt`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('   ✅ GPT API (GET) 正常');
      if (!data.hasOpenAIKey) {
        console.log('   ⚠️  但 API Key 未配置');
      }
    } else {
      issues.push(`❌ GPT API (GET) 失败 (${response.status})`);
      console.log(`   ❌ 错误: ${data.error || '未知错误'}`);
    }
  } catch (error) {
    issues.push('❌ 无法连接到 GPT API');
    console.log(`   ❌ 错误: ${error.message}`);
  }

  console.log('\n' + '-'.repeat(60) + '\n');

  // 3. 检查 GPT API (POST)
  console.log('📡 检查 3: GPT API (POST)...');
  try {
    const response = await fetch(`${BASE_URL}/api/gpt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: '测试',
        model: 'gpt-3.5-turbo'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('   ✅ GPT API (POST) 正常');
      if (data.content) {
        console.log(`   📝 收到回复: ${data.content.substring(0, 50)}...`);
      }
    } else {
      issues.push(`❌ GPT API (POST) 失败 (${response.status})`);
      console.log(`   ❌ 错误: ${data.error || '未知错误'}`);
      
      if (data.error && data.error.includes('API key')) {
        fixes.push('配置 OPENAI_API_KEY 环境变量并重新部署');
      }
      
      if (data.message) {
        console.log(`   💡 提示: ${data.message}`);
      }
    }
  } catch (error) {
    issues.push('❌ GPT API (POST) 请求失败');
    console.log(`   ❌ 错误: ${error.message}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 诊断总结:\n');

  if (issues.length === 0) {
    console.log('✅ 所有检查通过！网站运行正常！\n');
  } else {
    console.log(`发现 ${issues.length} 个问题:\n`);
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue}`);
    });

    if (fixes.length > 0) {
      console.log('\n💡 解决方案:\n');
      fixes.forEach((fix, index) => {
        console.log(`${index + 1}. ${fix}`);
      });
    }

    console.log('\n📋 详细解决步骤:\n');
    console.log('1. 访问 Vercel Dashboard:');
    console.log('   https://vercel.com/redyjohns-projects/life-coach-web/settings/environment-variables\n');
    console.log('2. 检查环境变量:');
    console.log('   - 确认 OPENAI_API_KEY 存在');
    console.log('   - 确认值正确（以 sk- 开头）');
    console.log('   - 确认选择了所有环境（Production, Preview, Development）\n');
    console.log('3. 重新部署:');
    console.log('   https://vercel.com/redyjohns-projects/life-coach-web/deployments');
    console.log('   点击最新部署的 "..." → "Redeploy"\n');
    console.log('4. 等待部署完成（1-2 分钟）\n');
    console.log('5. 再次运行诊断:');
    console.log('   npm run diagnose\n');
  }

  console.log('='.repeat(60));
}

diagnose().catch(console.error);

