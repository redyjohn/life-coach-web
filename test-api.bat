@echo off
REM Windows 测试脚本
echo 🧪 测试网站 API 功能...
echo.

if "%1"=="" (
    set URL=https://life-coach-web.vercel.app
) else (
    set URL=%1
)

echo 📍 测试 URL: %URL%
echo.
echo ============================================================
echo.

echo 📡 测试 1: 健康检查
echo    URL: %URL%/api/health
curl -s "%URL%/api/health"
echo.
echo.

echo 📡 测试 2: GPT API (GET)
echo    URL: %URL%/api/gpt
curl -s "%URL%/api/gpt"
echo.
echo.

echo 📡 测试 3: GPT API (POST) - 简单测试
echo    URL: %URL%/api/gpt
curl -s -X POST "%URL%/api/gpt" ^
  -H "Content-Type: application/json" ^
  -d "{\"prompt\": \"测试\", \"model\": \"gpt-3.5-turbo\"}"
echo.
echo.

echo ============================================================
echo.
echo ✅ 测试完成！
echo.
echo 💡 提示：
echo    - 如果看到 "hasOpenAIKey": true，说明 API Key 已配置
echo    - 如果看到 "hasOpenAIKey": false，需要配置环境变量
echo    - 如果看到 500 错误，请检查 Vercel 函数日志
echo.

pause

