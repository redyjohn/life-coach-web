<template>
  <nav class="navbar">
    <div class="logo">
      <router-link to="/" class="logo-text">生命教練網</router-link>
    </div>
    <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle menu">
      <span class="hamburger-line" :class="{ 'active': isMenuOpen }"></span>
      <span class="hamburger-line" :class="{ 'active': isMenuOpen }"></span>
      <span class="hamburger-line" :class="{ 'active': isMenuOpen }"></span>
    </button>
    <ul class="nav-links" :class="{ 'open': isMenuOpen }">
      <li><router-link to="/" @click="closeMenu">首頁</router-link></li>
      <li><router-link to="/form" @click="closeMenu">八字命理</router-link></li>
      <li><router-link to="/ziwei" @click="closeMenu">紫微斗數</router-link></li>
      <li><router-link to="/divination" @click="closeMenu">占卜系統</router-link></li>
      <li><router-link to="/name" @click="closeMenu">姓名學</router-link></li>
      <li><router-link to="/calendar" @click="closeMenu">擇日系統</router-link></li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

// 監聽視窗大小變化，在大螢幕時自動關閉菜單
const handleResize = () => {
  if (window.innerWidth > 768) {
    isMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #0d6efd;
  text-decoration: none;
  white-space: nowrap;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 8px;
  padding: 0;
  margin: 0;
}

.nav-links li a {
  color: #333;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 8px;
  display: block;
  white-space: nowrap;
}

.nav-links li a:hover {
  background-color: #f0f7ff;
  color: #0d6efd;
}

.nav-links li a.router-link-exact-active {
  color: #0d6efd;
  font-weight: bold;
  background-color: #e7f3ff;
  box-shadow: 0 2px 4px rgba(13, 110, 253, 0.15);
}

/* 漢堡菜單按鈕 */
.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.hamburger-line {
  width: 100%;
  height: 3px;
  background-color: #333;
  border-radius: 3px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.hamburger-line.active:nth-child(1) {
  transform: rotate(45deg) translate(7px, 7px);
}

.hamburger-line.active:nth-child(2) {
  opacity: 0;
}

.hamburger-line.active:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}

/* 響應式設計 - 手機版 */
@media (max-width: 768px) {
  .navbar {
    padding: 12px 16px;
    flex-wrap: wrap;
  }

  .logo-text {
    font-size: 18px;
  }

  .menu-toggle {
    display: flex;
  }

  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #ffffff;
    flex-direction: column;
    gap: 0;
    padding: 8px 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-top: 1px solid #e1e5e9;
    max-height: calc(100vh - 60px);
    overflow-y: auto;
  }

  .nav-links.open {
    display: flex;
  }

  .nav-links li {
    width: 100%;
  }

  .nav-links li a {
    padding: 12px 20px;
    border-radius: 0;
    width: 100%;
    text-align: left;
  }

  .nav-links li a:hover,
  .nav-links li a.router-link-exact-active {
    background-color: #f0f7ff;
  }
}

/* 超小螢幕優化 */
@media (max-width: 480px) {
  .navbar {
    padding: 10px 12px;
  }

  .logo-text {
    font-size: 16px;
  }

  .menu-toggle {
    width: 24px;
    height: 24px;
  }

  .hamburger-line {
    height: 2px;
  }

  .nav-links li a {
    padding: 10px 16px;
    font-size: 14px;
  }
}
</style>
