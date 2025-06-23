import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import FormView from '@/views/FormView.vue'
import ResultView from '@/views/ResultView.vue'
import ZiWeiView from '@/views/ZiWeiView.vue'
import Divination from '@/views/Divination.vue'
import NameView from '@/views/NameView.vue'
import CalendarView from '@/views/CalendarView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/form', name: 'Form', component: FormView },
  { path: '/result', name: 'Result', component: ResultView },
  { path: '/bazi', redirect: '/form' },
  { path: '/ziwei', name: 'ZiWei', component: ZiWeiView },
  { path: '/divination', name: 'Divination', component: Divination },
  { path: '/name', name: 'Name', component: NameView },
  { path: '/calendar', name: 'Calendar', component: CalendarView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
