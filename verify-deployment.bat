@echo off
REM Vercel 部署验证脚本 (Windows)
REM 用于快速检查部署状态和 API 配置

echo 🔍 检查 Vercel 部署状态...
echo.

REM 从参数获取 URL，如果没有则使用默认值
if "%1"=="" (
    set URL=https://life-coach-web.vercel.app
) else (
    set URL=%1
)

echo 📡 测试 URL: %URL%
echo.

REM 1. 健康检查
echo 1️⃣ 测试健康检查端点...
curl -s "%URL%/api/health"
echo.
echo.

REM 2. GPT API 测试 (GET)
echo 2️⃣ 测试 GPT API (GET)...
curl -s "%URL%/api/gpt"
echo.
echo.

REM 3. GPT API 测试 (POST)
echo 3️⃣ 测试 GPT API (POST)...
curl -s -X POST "%URL%/api/gpt" -H "Content-Type: application/json" -d "{\"prompt\": \"测试\"}"
echo.
echo.

echo ✅ 验证完成！
echo.
echo 如果看到错误，请：
echo 1. 检查 Vercel Dashboard 中的环境变量配置
echo 2. 确认已重新部署
echo 3. 查看 Vercel 函数日志获取详细错误信息

pause

