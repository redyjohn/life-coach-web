import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import FormView from '@/views/FormView.vue'
import ResultView from '@/views/ResultView.vue'
import ZiWeiView from '@/views/ZiWeiView.vue'
import ZiWeiResult from '@/views/ZiWeiResult.vue'
import Divination from '@/views/Divination.vue'
import NameView from '@/views/NameView.vue'
import CalendarView from '@/views/CalendarView.vue'
import DiagnosticView from '@/views/DiagnosticView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/form', name: 'Form', component: FormView },
  { path: '/result', name: 'Result', component: ResultView },
  { path: '/bazi', redirect: '/form' },

  // ✅ ZiWei 系列（已移除 ZiWeiForm）
  { path: '/ziwei', name: 'ZiWei', component: ZiWeiView },
  { path: '/ziwei/result', name: 'ZiWeiResult', component: ZiWeiResult },

  { path: '/divination', name: 'Divination', component: Divination },
  { path: '/name', name: 'Name', component: NameView },
  { path: '/calendar', name: 'Calendar', component: CalendarView },
  { path: '/diagnostic', name: 'Diagnostic', component: DiagnosticView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
