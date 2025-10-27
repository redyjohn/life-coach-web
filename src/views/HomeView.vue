<template>
  <div class="home-page">
    <!-- 頁面標題 -->
    <div class="page-header">
      <h1>🔮 生命教練網 🔮</h1>
      <p class="subtitle">科技命理時代，用最真實的數據分析您的命理</p>
    </div>

    <!-- 服務介紹 -->
    <div class="intro-section">
      <h3>💡 面對命理的困擾？我們為您解決</h3>
      <div class="intro-list">
        <div class="intro-item">❌ 害羞不敢詢問命理師</div>
        <div class="intro-item">❌ 花大錢卻得到空泛話術</div>
        <div class="intro-item">❌ 開運小物買了也沒用</div>
      </div>
      <div class="highlight-box">
        <p>✅ 不限時、地，與AI命理師深度談話</p>
        <p>✅ 科學數據分析，專業命理建議</p>
        <p>✅ 完全免費，讓您輕鬆探索命運</p>
      </div>
    </div>

    <!-- 服務卡片 -->
    <div class="services-section">
      <h2>選擇您的命理服務</h2>
      <div class="services-grid">
        <!-- 八字命理 -->
        <router-link to="/form" class="service-card">
          <div class="service-icon">☯️</div>
          <h3>八字命理</h3>
          <p>深入分析您的四柱命盤，了解性格與命運走向</p>
          <div class="service-features">
            <span>個人八字</span>
            <span>命盤分析</span>
            <span>大運流年</span>
          </div>
        </router-link>

        <!-- 紫微斗數 -->
        <router-link to="/ziwei" class="service-card">
          <div class="service-icon">⭐</div>
          <h3>紫微斗數</h3>
          <p>透過星盤配置，探索人生十二宮的奧秘與指引</p>
          <div class="service-features">
            <span>十二宮位</span>
            <span>星曜解讀</span>
            <span>運勢分析</span>
          </div>
        </router-link>

        <!-- 占卜系統 -->
        <router-link to="/divination" class="service-card">
          <div class="service-icon">🔮</div>
          <h3>占卜系統</h3>
          <p>透過塔羅牌或易經，獲得人生指引與方向</p>
          <div class="service-features">
            <span>塔羅占卜</span>
            <span>易經卜卦</span>
            <span>即時指引</span>
          </div>
        </router-link>

        <!-- 姓名學 -->
        <router-link to="/name" class="service-card">
          <div class="service-icon">✍️</div>
          <h3>姓名學</h3>
          <p>分析姓名能量，了解姓名對命運的影響</p>
          <div class="service-features">
            <span>五格分析</span>
            <span>音數吉凶</span>
            <span>改運建議</span>
          </div>
        </router-link>

        <!-- 擇日系統 -->
        <router-link to="/calendar" class="service-card">
          <div class="service-icon">📅</div>
          <h3>擇日系統</h3>
          <p>選擇良辰吉日，為重要時刻加持好運</p>
          <div class="service-features">
            <span>黃道吉日</span>
            <span>宜忌事項</span>
            <span>時辰選擇</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Microsoft JhengHei', sans-serif;
  background: linear-gradient(135deg, #f7f9fc 0%, #e8f4f8 100%);
  min-height: 100vh;
}

/* 頁面標題 */
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

/* 服務介紹 */
.intro-section {
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.intro-section h3 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-align: center;
}

.intro-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.intro-item {
  color: #666;
  font-size: 1rem;
  padding: 8px 0;
}

.highlight-box {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  border-radius: 12px;
  padding: 20px;
}

.highlight-box p {
  color: #059669;
  font-weight: 600;
  margin: 8px 0;
  font-size: 1.05rem;
}

/* 服務卡片區 */
.services-section {
  margin-bottom: 40px;
}

.services-section h2 {
  text-align: center;
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 30px;
  border-bottom: 3px solid #8B5CF6;
  padding-bottom: 10px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.service-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  display: block;
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent);
  transition: left 0.5s ease;
}

.service-card:hover::before {
  left: 100%;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(139, 92, 246, 0.2);
  border-color: #8B5CF6;
}

.service-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  display: block;
}

.service-card h3 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin: 0 0 16px 0;
  font-weight: 600;
}

.service-card p {
  color: #666;
  line-height: 1.6;
  margin: 0 0 20px 0;
  font-size: 0.95rem;
}

.service-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.service-features span {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
  }
  
  .intro-list {
    gap: 8px;
  }
  
  .intro-item,
  .highlight-box p {
    font-size: 0.95rem;
  }
}
</style>
