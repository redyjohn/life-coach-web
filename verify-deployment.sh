#!/bin/bash

# Vercel 部署验证脚本
# 用于快速检查部署状态和 API 配置

echo "🔍 检查 Vercel 部署状态..."
echo ""

# 从环境变量或参数获取 URL
URL=${1:-"https://life-coach-web.vercel.app"}

echo "📡 测试 URL: $URL"
echo ""

# 1. 健康检查
echo "1️⃣ 测试健康检查端点..."
HEALTH_RESPONSE=$(curl -s "$URL/api/health")
echo "响应: $HEALTH_RESPONSE"
echo ""

# 检查 hasOpenAIKey
if echo "$HEALTH_RESPONSE" | grep -q '"hasOpenAIKey":true'; then
    echo "✅ OpenAI API Key 已配置"
else
    echo "❌ OpenAI API Key 未配置！"
    echo "   请在 Vercel Dashboard 中添加 OPENAI_API_KEY 环境变量"
fi
echo ""

# 2. GPT API 测试 (GET)
echo "2️⃣ 测试 GPT API (GET)..."
GPT_GET_RESPONSE=$(curl -s "$URL/api/gpt")
echo "响应: $GPT_GET_RESPONSE"
echo ""

# 3. GPT API 测试 (POST)
echo "3️⃣ 测试 GPT API (POST)..."
GPT_POST_RESPONSE=$(curl -s -X POST "$URL/api/gpt" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "测试"}')
echo "响应: $GPT_POST_RESPONSE"
echo ""

# 检查错误
if echo "$GPT_POST_RESPONSE" | grep -q "error"; then
    echo "❌ API 请求失败"
    echo "$GPT_POST_RESPONSE" | grep -o '"error":"[^"]*"' || echo "未知错误"
else
    echo "✅ API 请求成功"
fi
echo ""

echo "✅ 验证完成！"
echo ""
echo "如果看到错误，请："
echo "1. 检查 Vercel Dashboard 中的环境变量配置"
echo "2. 确认已重新部署"
echo "3. 查看 Vercel 函数日志获取详细错误信息"

