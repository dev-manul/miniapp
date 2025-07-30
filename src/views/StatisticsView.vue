<template>
  <div class="statistics-container">
    <!-- App Header Component -->
    <AppHeader 
      :title="t('statistics.title')"
      :show-back-button="true"
      :show-profile="false"
      :show-progress="false"
    />

    <!-- Statistics Content -->
    <div class="statistics-content">
      <!-- Time Period Selector -->
      <div class="period-selector">
        <button 
          v-for="period in timePeriods" 
          :key="period.value"
          @click="selectedPeriod = period.value"
          class="period-btn"
          :class="{ active: selectedPeriod === period.value }"
        >
          {{ period.label }}
        </button>
      </div>

      <!-- Overview Cards -->
      <div class="overview-cards">
        <div class="overview-card">
          <div class="card-icon">📊</div>
          <div class="card-content">
            <div class="card-value">{{ stats.totalGoals }}</div>
            <div class="card-label">Total Goals</div>
          </div>
        </div>
        <div class="overview-card">
          <div class="card-icon">✅</div>
          <div class="card-content">
            <div class="card-value">{{ stats.completedGoals }}</div>
            <div class="card-label">Completed</div>
          </div>
        </div>
        <div class="overview-card">
          <div class="card-icon">📈</div>
          <div class="card-content">
            <div class="card-value">{{ stats.successRate }}%</div>
            <div class="card-label">Success Rate</div>
          </div>
        </div>
        <div class="overview-card">
          <div class="card-icon">🔥</div>
          <div class="card-content">
            <div class="card-value">{{ stats.currentStreak }}</div>
            <div class="card-label">Day Streak</div>
          </div>
        </div>
      </div>

      <!-- Progress Chart -->
      <div class="chart-section">
        <h3 class="section-title">{{ t('statistics.trends') }}</h3>
        <div class="chart-container">
          <div class="chart-bars">
            <div 
              v-for="(day, index) in weeklyData" 
              :key="index"
              class="chart-bar"
            >
              <div class="bar-fill" :style="{ height: day.progress + '%' }"></div>
              <div class="bar-label">{{ day.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Breakdown -->
      <div class="category-section">
        <h3 class="section-title">{{ t('statistics.overview') }}</h3>
        <div class="category-list">
          <div 
            v-for="category in categoryData" 
            :key="category.name"
            class="category-item"
          >
            <div class="category-info">
              <div class="category-icon">{{ category.icon }}</div>
              <div class="category-details">
                <div class="category-name">{{ category.name }}</div>
                <div class="category-count">{{ category.count }} goals</div>
              </div>
            </div>
            <div class="category-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: category.progress + '%' }"></div>
              </div>
              <span class="progress-text">{{ category.progress }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppHeader from '@/components/AppHeader.vue'

const { t } = useI18n()

// State
const selectedPeriod = ref('week')

const timePeriods = [
  { label: t('statistics.period.week'), value: 'week' },
  { label: t('statistics.period.month'), value: 'month' },
  { label: t('statistics.period.year'), value: 'year' }
]

// Computed stats based on selected period
const stats = computed(() => {
  const baseStats = {
    totalGoals: 12,
    completedGoals: 8,
    successRate: 67,
    currentStreak: 7
  }
  
  // In a real app, these would be calculated based on the selected period
  return baseStats
})

const weeklyData = ref([
  { label: 'Mon', progress: 80 },
  { label: 'Tue', progress: 65 },
  { label: 'Wed', progress: 90 },
  { label: 'Thu', progress: 75 },
  { label: 'Fri', progress: 85 },
  { label: 'Sat', progress: 60 },
  { label: 'Sun', progress: 70 }
])

const categoryData = ref([
  {
    name: 'Fitness',
    icon: '🏃‍♂️',
    count: 4,
    progress: 75
  },
  {
    name: 'Learning',
    icon: '📚',
    count: 3,
    progress: 60
  },
  {
    name: 'Health',
    icon: '💧',
    count: 2,
    progress: 90
  },
  {
    name: 'Productivity',
    icon: '💻',
    count: 3,
    progress: 45
  }
])


</script>

<style scoped>
.statistics-container {
  height: 100vh;
  background: var(--primary-bg);
  display: flex;
  flex-direction: column;
  padding: 16px;
}



.statistics-content {
  flex: 1;
  overflow-y: auto;
}

.period-selector {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.period-btn {
  flex: 1;
  padding: 12px;
  background: var(--secondary-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.period-btn.active {
  background: var(--accent-green);
  color: white;
  border-color: var(--accent-green);
}

.period-btn:hover:not(.active) {
  background: var(--card-bg);
  border-color: var(--accent-green);
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.overview-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-icon {
  font-size: 32px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--secondary-bg);
  border-radius: 8px;
}

.card-content {
  flex: 1;
}

.card-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--accent-green);
  margin-bottom: 4px;
}

.card-label {
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

.chart-section {
  margin-bottom: 32px;
}

.chart-container {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--border-color);
}

.chart-bars {
  display: flex;
  align-items: end;
  justify-content: space-between;
  height: 120px;
  gap: 8px;
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(to top, var(--accent-green), var(--accent-yellow));
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  transition: height 0.3s ease;
}

.bar-label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

.category-section {
  margin-bottom: 24px;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-item {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid var(--border-color);
}

.category-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.category-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--secondary-bg);
  border-radius: 8px;
}

.category-details {
  flex: 1;
}

.category-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.category-count {
  font-size: 14px;
  color: var(--text-secondary);
}

.category-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-text {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
  min-width: 40px;
}

@media (max-width: 480px) {
  .statistics-container {
    padding: 12px;
  }
  
  .overview-cards {
    gap: 12px;
  }
  
  .overview-card {
    padding: 16px;
  }
  
  .card-value {
    font-size: 20px;
  }
  
  .chart-container {
    padding: 16px;
  }
  
  .chart-bars {
    height: 100px;
  }
}
</style> 