<template>
  <div class="divination-page">
    <!-- 頁面標題 -->
    <div class="page-header">
      <h1>🔮 占卜系統</h1>
      <p class="subtitle">探索命運的奧秘，洞察未來的方向</p>
    </div>

    <!-- 占卜方式選擇 -->
    <div class="divination-methods">
      <h2>選擇您的占卜方式</h2>
      
      <div class="methods-grid">
        <!-- 塔羅牌占卜 -->
        <div class="method-card" @click="selectMethod('tarot')">
          <div class="card-icon">🃏</div>
          <h3>塔羅牌占卜</h3>
          <p>透過神秘的塔羅牌，探索內心深處的指引</p>
          <div class="card-features">
            <span class="feature">愛情運勢</span>
            <span class="feature">事業發展</span>
            <span class="feature">人生指引</span>
          </div>
        </div>

        <!-- 易經占卜 -->
        <div class="method-card" @click="selectMethod('iching')">
          <div class="card-icon">☯️</div>
          <h3>易經占卜</h3>
          <p>古老的智慧，揭示變化的規律與時機</p>
          <div class="card-features">
            <span class="feature">決策指引</span>
            <span class="feature">時機把握</span>
            <span class="feature">變化預測</span>
          </div>
        </div>

      </div>
    </div>

    <!-- 占卜流程說明 -->
    <div class="divination-process">
      <h2>占卜流程</h2>
      <div class="process-steps">
        <div class="step">
          <div class="step-number">1</div>
          <h4>選擇占卜方式</h4>
          <p>根據您的需求選擇最適合的占卜方法</p>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <h4>專注思考問題</h4>
          <p>在心中專注地思考您想要了解的問題</p>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <h4>獲得占卜結果</h4>
          <p>占卜師將為您解讀結果並提供指引</p>
        </div>
      </div>
    </div>

    <!-- 占卜須知 -->
    <div class="divination-notice">
      <h3>🔮 占卜須知</h3>
      <ul>
        <li>占卜結果僅供參考，人生的選擇權在您手中</li>
        <li>請以開放的心態接受占卜結果，但不要過度依賴</li>
        <li>占卜是探索內心的工具，真正的力量來自於您自己</li>
        <li>建議在安靜的環境中進行占卜，效果更佳</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 選擇占卜方式
function selectMethod(method: string) {
  // 根據選擇的占卜方式跳轉到對應的頁面
  switch (method) {
    case 'tarot':
      router.push({ name: 'TarotDivination' })
      break
    case 'iching':
      router.push({ name: 'IChingDivination' })
      break
    default:
      console.log('未知的占卜方式:', method)
  }
}
</script>

<style scoped>
.divination-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Microsoft JhengHei', sans-serif;
  background: linear-gradient(135deg, #f7f9fc 0%, #e8f4f8 100%);
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
  border-radius: 20px;
  color: white;
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
}

.page-header h1 {
  font-size: 2.5rem;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.2rem;
  margin: 0;
  opacity: 0.9;
  font-weight: 300;
}

.divination-methods {
  margin-bottom: 50px;
}

.divination-methods h2 {
  text-align: center;
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 30px;
  border-bottom: 3px solid #8B5CF6;
  padding-bottom: 10px;
  display: inline-block;
  width: 100%;
}

.methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.method-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.method-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent);
  transition: left 0.5s ease;
}

.method-card:hover::before {
  left: 100%;
}

.method-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(139, 92, 246, 0.2);
  border-color: #8B5CF6;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 16px;
  display: block;
}

.method-card h3 {
  color: #2c3e50;
  font-size: 1.4rem;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.method-card p {
  color: #666;
  line-height: 1.6;
  margin: 0 0 20px 0;
  font-size: 0.95rem;
}

.card-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.feature {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.divination-process {
  background: white;
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.divination-process h2 {
  text-align: center;
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 30px;
  border-bottom: 2px solid #8B5CF6;
  padding-bottom: 10px;
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.step {
  text-align: center;
  padding: 20px;
}

.step-number {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 16px auto;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.step h4 {
  color: #2c3e50;
  font-size: 1.2rem;
  margin: 0 0 8px 0;
}

.step p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.divination-notice {
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  border: 2px solid #ffc107;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.2);
}

.divination-notice h3 {
  color: #856404;
  font-size: 1.4rem;
  margin: 0 0 20px 0;
  text-align: center;
}

.divination-notice ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.divination-notice li {
  color: #856404;
  line-height: 1.8;
  margin-bottom: 12px;
  padding-left: 24px;
  position: relative;
}

.divination-notice li::before {
  content: "✨";
  position: absolute;
  left: 0;
  top: 0;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .divination-page {
    padding: 16px;
  }
  
  .page-header {
    padding: 30px 16px;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .methods-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .method-card {
    padding: 20px;
  }
  
  .divination-process {
    padding: 24px;
  }
  
  .process-steps {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .divination-notice {
    padding: 20px;
  }
}

/* 動畫效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.method-card {
  animation: fadeInUp 0.6s ease forwards;
}

.method-card:nth-child(1) { animation-delay: 0.1s; }
.method-card:nth-child(2) { animation-delay: 0.2s; }
</style>