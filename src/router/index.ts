import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DashboardView from '@/views/DashboardView.vue'
import GoalsView from '@/views/GoalsView.vue'
import StatisticsView from '@/views/StatisticsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import DiscountsView from '@/views/DiscountsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/goals',
      name: 'goals',
      component: GoalsView
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: StatisticsView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/discounts',
      name: 'discounts',
      component: DiscountsView
    }
  ]
})

export default router 