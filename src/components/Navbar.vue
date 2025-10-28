<template>
  <nav class="navbar">
    <div class="logo">
      <router-link to="/" class="logo-text">生命教練網</router-link>
    </div>
    <ul class="nav-links">
      <li><router-link to="/">首頁</router-link></li>
      <li><router-link to="/form">八字命理</router-link></li>
      <li><router-link to="/ziwei">紫微斗數</router-link></li>
      <li><router-link to="/divination">占卜系統</router-link></li>
      <li><router-link to="/name">姓名學</router-link></li>
      <li><router-link to="/calendar">擇日系統</router-link></li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
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
</style>
