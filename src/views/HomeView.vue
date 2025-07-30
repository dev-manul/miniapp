<template>
  <div class="home-container">
    <!-- App Header Component -->
    <AppHeader 
      :show-menu-button="true"
      :show-arrow="showArrow"
      :discipline-progress="disciplineProgress"
      @menu-toggle="toggleMenu"
    />

    <!-- Navigation Menu -->
    <nav class="navigation-menu" :class="menuStyle">
      <router-link 
        v-for="item in menuItems" 
        :key="item.name"
        :to="item.route"
        class="nav-item"
        :class="item.class"
      >
        <div v-if="menuStyle === 'icon-list'" class="nav-icon">
          <component :is="item.icon" />
        </div>
        <span class="nav-text">{{ item.label }}</span>
        <div v-if="menuStyle === 'list'" class="nav-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import DashboardIcon from '@/components/icons/DashboardIcon.vue'
import GoalsIcon from '@/components/icons/GoalsIcon.vue'
import StatisticsIcon from '@/components/icons/StatisticsIcon.vue'
import ProfileIcon from '@/components/icons/ProfileIcon.vue'

const router = useRouter()

// State
const disciplineProgress = ref(65)
const menuStyle = ref<'list' | 'buttons' | 'icon-list'>('list')
const showArrow = ref(false)

// Menu items
const menuItems = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    route: '/dashboard',
    icon: DashboardIcon,
    class: 'nav-dashboard'
  },
  {
    name: 'goals',
    label: 'Goals',
    route: '/goals',
    icon: GoalsIcon,
    class: 'nav-goals'
  },
  {
    name: 'statistics',
    label: 'Statistics',
    route: '/statistics',
    icon: StatisticsIcon,
    class: 'nav-statistics'
  },
  {
    name: 'profile',
    label: 'Profile',
    route: '/profile',
    icon: ProfileIcon,
    class: 'nav-profile'
  }
]

// Methods
const toggleMenu = () => {
  // Cycle through menu styles
  const styles: Array<'list' | 'buttons' | 'icon-list'> = ['list', 'buttons', 'icon-list']
  const currentIndex = styles.indexOf(menuStyle.value)
  const nextIndex = (currentIndex + 1) % styles.length
  menuStyle.value = styles[nextIndex]
}


</script>

<style scoped>
.home-container {
  height: 100vh;
  background: var(--primary-bg);
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.navigation-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.navigation-menu.list .nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--card-bg);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.navigation-menu.buttons .nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--secondary-bg);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  font-weight: 600;
  font-size: 18px;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.2s ease;
}

.navigation-menu.icon-list .nav-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--card-bg);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: var(--secondary-bg);
  border-color: var(--accent-green);
  transform: translateY(-2px);
}

.nav-icon {
  width: 24px;
  height: 24px;
  color: var(--text-secondary);
}

.nav-text {
  font-size: 16px;
  font-weight: 500;
}

.nav-arrow {
  color: var(--text-secondary);
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .home-container {
    padding: 12px;
  }
  
  .avatar-img {
    width: 50px;
    height: 50px;
  }
  
  .app-title {
    font-size: 20px;
  }
}
</style> 