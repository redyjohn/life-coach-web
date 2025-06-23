<template>
  <div class="page home">
    <h1>歡迎來到生命教練網</h1>
    <br>
    <h3>面對命理你是否有以下經驗?</h3>
    <p><b>害羞的你，即便內心有很多困惑想詢問，但面對命理師時卻說不出口。</b></p>
    <p><b>花了大錢，命理師卻用一些空泛的話術來敷衍你</b></p>
    <p><b>買了許多開運小物，卻只是放在家裡長滿灰塵</b></p>
    <br>
    <h2>歡迎進入科技命理時代，讓我們用最真實的數據來分析您的命理</h2>
    <h2>我們會為您打造一套科學且有效率的方法來解決您生命裡的困擾</h2>
    <h2>您可以不限「時」、「地」自在的與我們的AI命理師深度談話</h2>
    <h2>無須花費任何金錢</h2>
    <h2>現在就選擇一個您喜歡的命理方式，讓我們開始為您解惑</h2>
    <div class="link-section">
      <router-link to="/form" class="feature-link">
        <img src="@/assets/bazi.png" alt="八字命理" />
        <span>八字命理</span>
      </router-link>
      <router-link to="/ziwei" class="feature-link">
        <img src="@/assets/ziwei.png" alt="紫微斗數" />
        <span>紫微斗數</span>
      </router-link>
      <router-link to="/divination" class="feature-link">
        <img src="@/assets/divination.png" alt="占卜系統" />
        <span>占卜系統</span>
      </router-link>
      <router-link to="/name" class="feature-link">
        <img src="@/assets/name.png" alt="姓名學" />
        <span>姓名學</span>
      </router-link>
      <router-link to="/calendar" class="feature-link">
        <img src="@/assets/calendar.png" alt="擇日系統" />
        <span>擇日系統</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.page {
  padding: 40px 20px;
  font-family: 'Microsoft JhengHei', sans-serif;
  text-align: center;
}

h1 {
  font-size: 28px;
  margin-bottom: 16px;
}

h2 {
  font-size: 18px;
  color: #444;
  margin-bottom: 32px;
}

/* 導覽圖片區 */
.link-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px;
}

.feature-link {
  width: 19%;
  text-decoration: none;
  color: #333;
  transition: transform 0.2s;
}

.feature-link img {
  width: 100%;
  height: auto; /* 自動等比例縮小 */
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.feature-link span {
  display: block;
  margin-top: 8px;
  font-size: 15px;
  font-weight: 500;
}

.feature-link:hover {
  transform: scale(1.03);
}

/* 響應式處理 */
@media (max-width: 1024px) {
  .feature-link {
    width: 30%;
  }
}

@media (max-width: 768px) {
  .feature-link {
    width: 45%;
  }
}

@media (max-width: 480px) {
  .feature-link {
    width: 100%;
  }
}
</style>
