<template>
  <div class="form-wrapper">
    <h1>探索你的八字命盤</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="nickname">暱稱</label>
        <input type="text" id="nickname" v-model="form.nickname" required />
      </div>

      <div class="form-group">
        <label for="birthdate">出生日期</label>
        <input type="date" id="birthdate" v-model="form.birthdate" required />
      </div>

      <div class="form-group">
        <label for="birthtime">出生時間</label>
        <input type="time" id="birthtime" v-model="form.birthtime" required />
      </div>

      <div class="form-group">
        <label for="birthplace">出生地點</label>
        <input type="text" id="birthplace" v-model="form.birthplace" required />
      </div>

      <button type="submit" class="submit-btn">開始探索</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  nickname: '',
  birthdate: '',
  birthtime: '',
  birthplace: ''
})

const submitForm = () => {
  router.push({ path: '/result', query: form })
}
</script>

<style scoped>
.form-wrapper {
  max-width: 500px;
  margin: 40px auto;
  padding: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  font-family: 'Microsoft JhengHei', 'Poppins', sans-serif;
}

h1 {
  font-size: 24px;
  text-align: center;
  margin-bottom: 32px;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #34495e;
}

input {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.2s ease-in-out;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #0056b3;
}
</style>