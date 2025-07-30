<template>
  <div class="home-container">
    <!-- App Header Component -->
    <AppHeader 
      :show-menu-button="true"
      :show-arrow="showArrow"
      :discipline-progress="disciplineProgress"
      @menu-toggle="toggleMenu"
    />

    <!-- Dashboard Content -->
    <div class="dashboard-content">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <h2 class="welcome-title">{{ t('dashboard.welcome') }}</h2>
        <p class="welcome-subtitle">{{ t('dashboard.subtitle') }}</p>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <div class="stat-value">7</div>
            <div class="stat-label">{{ t('dashboard.daysStreak') }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-value">85%</div>
            <div class="stat-label">{{ t('dashboard.completion') }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-content">
            <div class="stat-value">12</div>
            <div class="stat-label">{{ t('dashboard.activeGoals') }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-content">
            <div class="stat-value">3.2k</div>
            <div class="stat-label">{{ t('dashboard.pointsEarned') }}</div>
          </div>
        </div>
      </div>



      <!-- Recent Activity -->
      <div class="recent-activity">
        <h3 class="section-title">{{ t('dashboard.recentActivity') }}</h3>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon">🏃‍♂️</div>
            <div class="activity-content">
              <div class="activity-title">{{ t('dashboard.activities.morningRun') }}</div>
              <div class="activity-time">{{ t('dashboard.timeAgo', { time: '2' }) }}</div>
            </div>
            <div class="activity-status completed">✓</div>
          </div>
          <div class="activity-item">
            <div class="activity-icon">📚</div>
            <div class="activity-content">
              <div class="activity-title">{{ t('dashboard.activities.readPages') }}</div>
              <div class="activity-time">{{ t('dashboard.timeAgo', { time: '4' }) }}</div>
            </div>
            <div class="activity-status completed">✓</div>
          </div>
          <div class="activity-item">
            <div class="activity-icon">💧</div>
            <div class="activity-content">
              <div class="activity-title">{{ t('dashboard.activities.drinkWater') }}</div>
              <div class="activity-time">{{ t('dashboard.timeAgo', { time: '6' }) }}</div>
            </div>
            <div class="activity-status pending">⋯</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Menu (Hidden by default) -->
    <div v-if="showMenu" class="menu-overlay" @click="closeMenu">
      <nav class="navigation-menu" @click.stop>
        <div class="menu-header">
          <h3>{{ t('navigation.menu') }}</h3>
          <button @click="closeMenu" class="close-menu-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <router-link 
          v-for="item in menuItems" 
          :key="item.name"
          :to="item.route"
          class="nav-item"
          :class="item.class"
          @click="closeMenu"
        >
          <div class="nav-icon">
            <component :is="item.icon" />
          </div>
          <span class="nav-text">{{ item.label }}</span>
          <div class="nav-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppHeader from '@/components/AppHeader.vue'
import DashboardIcon from '@/components/icons/DashboardIcon.vue'
import GoalsIcon from '@/components/icons/GoalsIcon.vue'
import StatisticsIcon from '@/components/icons/StatisticsIcon.vue'
import ProfileIcon from '@/components/icons/ProfileIcon.vue'
import DiscountsIcon from '@/components/icons/DiscountsIcon.vue'

const router = useRouter()
const { t } = useI18n()

// State
const disciplineProgress = ref(65)
const showArrow = ref(false)
const showMenu = ref(false)

// Menu items
const menuItems = computed(() => [
  {
    name: 'profile',
    label: t('navigation.profile'),
    route: '/profile',
    icon: ProfileIcon,
    class: 'nav-profile'
  },
  {
    name: 'dashboard',
    label: t('navigation.dashboard'),
    route: '/dashboard',
    icon: DashboardIcon,
    class: 'nav-dashboard'
  },
  {
    name: 'goals',
    label: t('navigation.goals'),
    route: '/goals',
    icon: GoalsIcon,
    class: 'nav-goals'
  },
  {
    name: 'statistics',
    label: t('navigation.statistics'),
    route: '/statistics',
    icon: StatisticsIcon,
    class: 'nav-statistics'
  },
  {
    name: 'discounts',
    label: t('navigation.discounts'),
    route: '/discounts',
    icon: DiscountsIcon,
    class: 'nav-discounts'
  }
])

// Methods
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const closeMenu = () => {
  showMenu.value = false
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

.dashboard-content {
  flex: 1;
  overflow-y: auto;
}

.welcome-section {
  margin-bottom: 24px;
  text-align: center;
}

.welcome-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.welcome-subtitle {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--secondary-bg);
  border-radius: 12px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--accent-green);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.recent-activity {
  margin-bottom: 24px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.activity-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--secondary-bg);
  border-radius: 8px;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.activity-time {
  font-size: 14px;
  color: var(--text-secondary);
}

.activity-status {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
}

.activity-status.completed {
  background: var(--accent-green);
  color: white;
}

.activity-status.pending {
  background: var(--secondary-bg);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

/* Menu Overlay */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 16px;
}

.navigation-menu {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 20px;
  min-width: 280px;
  max-width: 320px;
  border: 1px solid var(--border-color);
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.menu-header h3 {
  color: var(--text-primary);
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-menu-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  text-decoration: none;
  color: var(--text-primary);
  border-radius: 12px;
  transition: all 0.2s ease;
  margin-bottom: 8px;
}

.nav-item:hover {
  background: var(--secondary-bg);
}

.nav-icon {
  width: 24px;
  height: 24px;
  color: var(--text-secondary);
}

.nav-text {
  flex: 1;
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
  
  .welcome-title {
    font-size: 24px;
  }
  
  .stats-grid {
    gap: 12px;
  }
  
  .stat-card {
    padding: 16px;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }
  
  .navigation-menu {
    min-width: 260px;
    max-width: 300px;
  }
}
</style> 