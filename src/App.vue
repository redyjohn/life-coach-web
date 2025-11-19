<template>
  <div id="app" class="app-layout">
    <Navbar />

    <div class="content-wrapper">
      <!-- 左側廣告欄（桌面版） -->
      <aside class="ad-left">
        <AdBanner 
          type="persistent"
          ad-label="側邊廣告"
        />
      </aside>

      <!-- 主內容 -->
      <main class="main-content">
        <router-view />
      </main>
    </div>

    <!-- 底部廣告欄 -->
    <footer class="ad-bottom">
      <AdBanner 
        type="browse" 
        ad-label="底部廣告"
        :custom-style="{ maxHeight: '60px', height: '60px' }" 
      />
    </footer>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import AdBanner from '@/components/AdBanner.vue'
</script>

<style>
/* 網站整體背景與文字設定 */
body, html, #app {
  margin: 0;
  padding: 0;
  font-family: "Noto Sans TC", sans-serif;
  background: linear-gradient(to bottom right, #eef3f9, #e4ebf4);
  min-height: 100vh;
  color: #333;
}

.app-layout {
  display: flex;
  flex-direction: column;
}

/* 包含左欄與主內容 */
.content-wrapper {
  display: flex;
  flex: 1;
  padding-bottom: 70px; /* 預留底部廣告高度 */
}

/* 左側廣告欄 */
.ad-left {
  width: 60px;
  min-width: 60px;
  background-color: #f4f4f4;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 主內容區 */
.main-content {
  flex: 1;
  padding: 40px 60px;
  min-height: calc(100vh - 180px); /* 為底部廣告預留空間 */
}

/* 底部廣告欄 */
.ad-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #f9f9f9;
  border-top: 1px solid #ddd;
  padding: 4px 8px;
  height: 60px;
  max-height: 60px;
  text-align: center;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.ad-bottom :deep(.ad-box) {
  max-height: 52px !important;
  height: 52px !important;
  min-height: 52px !important;
}

.ad-bottom :deep(.ad-placeholder) {
  padding: 4px 8px !important;
  gap: 4px !important;
}

.ad-bottom :deep(.ad-icon) {
  font-size: 1.2rem !important;
}

.ad-bottom :deep(.ad-label) {
  font-size: 0.85rem !important;
  margin-bottom: 2px !important;
}

.ad-bottom :deep(.ad-hint) {
  font-size: 10px !important;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .ad-left {
    display: none;
  }

  .main-content {
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
  }

  .content-wrapper {
    padding-bottom: 70px; /* 調整底部廣告高度 */
  }
  
  .ad-bottom {
    height: 60px;
    max-height: 60px;
    padding: 4px;
  }
  
  .ad-bottom :deep(.ad-box) {
    max-height: 52px !important;
    height: 52px !important;
    min-height: 52px !important;
  }
}

/* 超小螢幕優化 */
@media (max-width: 480px) {
  .main-content {
    padding: 12px;
  }

  .content-wrapper {
    padding-bottom: 70px;
  }
  
  .ad-bottom {
    height: 60px;
    max-height: 60px;
  }
}
</style>
