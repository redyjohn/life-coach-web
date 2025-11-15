# GPT Prompt 位置说明

## 📁 主要文件

**所有 GPT 答案生成的 prompt 都在：`src/services/gptService.ts`**

## 📍 Prompt 结构

### 1. System Prompt（系统提示词）

**位置：** `src/services/gptService.ts` 第 286-389 行

**函数：** `getSystemPrompt(type, userData)`

**包含三种类型：**
- **八字命理** (`bazi`) - 第 288-317 行
- **紫微斗数** (`ziwei`) - 第 319-360 行  
- **占卜系统** (`divination`) - 第 362-389 行

**作用：** 定义 AI 的身份、回答风格、禁止内容等

### 2. User Prompt（用户提示词）

**位置：** `src/services/gptService.ts` 各个函数中

**主要函数和 prompt 位置：**

#### 八字命理相关
- `getBaZi()` - 第 447-464 行
- `getDayMasterAnalysis()` - 第 469-485 行
- `getChartAnalysis()` - 第 490-507 行
- `getSuggestions()` - 第 512-537 行
- `getLuckCycle()` - 第 542-570 行
- `getCurrentLuckAnalysis()` - 第 575-616 行
- `getCurrentYearAdvice()` - 第 621-659 行

#### 紫微斗数相关
- `getZiWeiChart()` - 第 666-683 行
- `getZiWeiAnalysis()` - 第 688-704 行
- `getZiWeiAnnualLuck()` - 第 711-760 行
- `getZiWeiDecadeLuck()` - 第 766-800 行

#### 占卜系统相关
- `getTarotDivination()` - 第 840-896 行
- `getIChingDivination()` - 第 904-965 行 ⭐ **易經占卜 prompt**
- `getCrystalDivination()` - 第 973-1034 行
- `getNumerologyDivination()` - 第 1042-1103 行
- `getAstrologyDivination()` - 第 1111-1172 行
- `getOracleDivination()` - 第 1180-1241 行
- `askDivinationGPT()` - 第 1249-1292 行

## 🔍 易經占卜 Prompt 详细位置

**函数：** `getIChingDivination()`

**位置：** `src/services/gptService.ts` 第 902-965 行

**包含：**
- System Prompt：调用 `getSystemPrompt('divination', userData)` - 第 903 行
- User Prompt：第 904-963 行
  - 用户资料部分
  - 占卜问题
  - 8 个详细分析要求（每个 200-300 字）

## 📝 Prompt 修改指南

### 修改 System Prompt

编辑 `src/services/gptService.ts` 第 286-389 行的 `getSystemPrompt()` 函数：

```typescript
function getSystemPrompt(type: 'bazi' | 'ziwei' | 'divination', userData: any): string {
  const basePrompts = {
    bazi: `...`,      // 修改这里
    ziwei: `...`,     // 修改这里
    divination: `...` // 修改这里
  }
  return basePrompts[type] || basePrompts.bazi
}
```

### 修改易經占卜 Prompt

编辑 `src/services/gptService.ts` 第 902-965 行的 `getIChingDivination()` 函数：

```typescript
export async function getIChingDivination(...): Promise<string> {
  const systemPrompt = getSystemPrompt('divination', userData)
  const prompt = `請進行詳細的易經占卜分析，要求：
    // 修改这里的 prompt 内容
  `
  return callGPT({ prompt, systemPrompt })
}
```

### 修改其他占卜 Prompt

- **塔罗牌：** 第 840-896 行 `getTarotDivination()`
- **水晶球：** 第 973-1034 行 `getCrystalDivination()`
- **数字占卜：** 第 1042-1103 行 `getNumerologyDivination()`
- **星座占卜：** 第 1111-1172 行 `getAstrologyDivination()`
- **灵签占卜：** 第 1180-1241 行 `getOracleDivination()`

## 🎯 快速查找

### 查找特定功能的 prompt

```bash
# 在终端中搜索
grep -n "getIChingDivination\|getTarotDivination\|getBaZi" src/services/gptService.ts
```

### 查找所有 prompt 定义

```bash
grep -n "const prompt = \`" src/services/gptService.ts
```

## 📋 Prompt 结构说明

每个 prompt 通常包含：

1. **用户资料部分**
   ```typescript
   【用戶資料】
   - 姓名：${userData.name}
   - 性别：${userData.gender}
   - 出生日期：${userData.birthDate}
   ```

2. **问题/需求部分**
   ```typescript
   【占卜問題】
   ${question}
   ```

3. **分析要求部分**
   ```typescript
   【分析要求】
   1. **第一项**（200-300字）：...
   2. **第二项**（200-300字）：...
   ```

4. **重要要求部分**
   ```typescript
   **重要要求：**
   - 每个分析段落都要详细说明200-300字
   - 整体回答至少800字以上
   - 内容要专业、详细、不随便
   ```

## ⚠️ 注意事项

1. **修改后需要重新部署**
   - 本地：重启开发服务器
   - Vercel：自动部署（推送到 GitHub 后）

2. **测试修改**
   - 修改后测试相应功能
   - 检查答案是否符合预期

3. **保持格式**
   - 保持 prompt 的格式和结构
   - 确保变量正确替换（如 `${userData.name}`）

---

**主要文件：** `src/services/gptService.ts`
**易經占卜 Prompt：** 第 902-965 行

