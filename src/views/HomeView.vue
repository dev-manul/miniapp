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

      <!-- Weight Scale Section -->
      <div class="section-card">
        <h3 class="section-title">{{ t('dashboard.weightScale') }}</h3>
        <div class="weight-scale">
          <div class="scale-labels">
            <span>0</span>
            <span>{{ currentWeight }}kg</span>
          </div>
          <div class="scale-bar">
            <div class="scale-fill green" :style="{ width: `${(targetWeight / currentWeight) * 100}%` }"></div>
            <div class="scale-fill yellow" :style="{ width: `${((currentWeight - targetWeight) / currentWeight) * 100}%` }"></div>
          </div>
          <div class="weight-info">
            <span class="target-weight">Цель: {{ targetWeight }}kg</span>
            <span class="current-weight">Текущий: {{ currentWeight }}kg</span>
          </div>
        </div>
      </div>

      <!-- Water Tracking Section -->
      <div class="section-card">
        <h3 class="section-title">{{ t('dashboard.waterTracking') }}</h3>
        <div class="water-container">
          <div class="water-bottle">
            <div class="water-fill" :style="{ height: `${(waterDrunk / waterGoal) * 100}%` }">
              <div class="water-waves"></div>
            </div>
            <div class="bottle-cap"></div>
          </div>
          <div class="water-stats">
            <div class="water-amount">{{ waterDrunk }}л / {{ waterGoal }}л</div>
            <div class="water-progress">{{ Math.round((waterDrunk / waterGoal) * 100) }}%</div>
            <button class="add-water-btn" @click="addWater">+ 0.25л</button>
          </div>
        </div>
      </div>

      <!-- Discipline Meter Section -->
      <div class="section-card clickable" @click="showDisciplineDetails">
        <h3 class="section-title">{{ t('dashboard.discipline') }}</h3>
        <div class="discipline-meter">
          <div class="meter-circle">
            <svg viewBox="0 0 120 120" class="meter-svg">
              <circle cx="60" cy="60" r="54" class="meter-bg" />
              <circle 
                cx="60" cy="60" r="54" 
                class="meter-fill" 
                :stroke-dasharray="`${disciplineScore * 3.39} 339.3`"
              />
            </svg>
            <div class="meter-value">{{ disciplineScore }}%</div>
          </div>
          <div class="discipline-tips">
            <p>Нажмите для деталей</p>
            <p>Утренние привычки • Регулярность • Фокус</p>
          </div>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <!-- Streak Counter -->
        <div class="stat-card clickable" @click="showStreakDetails">
          <div class="stat-icon">🔥</div>
          <div class="stat-value">{{ streakDays }}</div>
          <div class="stat-label">{{ t('dashboard.streak') }}</div>
          <div class="stat-subtitle">{{ achievementsCount }} достижений</div>
        </div>

        <!-- Tokens Counter -->
        <div class="stat-card clickable" @click="showTokensDetails">
          <div class="stat-icon">🪙</div>
          <div class="stat-value">{{ tokens }}</div>
          <div class="stat-label">{{ t('dashboard.tokens') }}</div>
          <div class="stat-subtitle">Рейтинг</div>
        </div>

        <!-- Partners -->
        <div class="stat-card clickable" @click="showPartners">
          <div class="stat-icon">🤝</div>
          <div class="stat-value">Партнеры</div>
          <div class="stat-label">Карта</div>
          <div class="stat-subtitle">Потратить токены</div>
        </div>
      </div>

      <!-- Daily Tasks Section -->
      <div class="section-card">
        <h3 class="section-title">{{ t('dashboard.dailyTasks') }}</h3>
        <div class="tasks-list">
          <div 
            v-for="task in dailyTasks" 
            :key="task.id" 
            class="task-item"
            :class="{ completed: task.completed }"
          >
            <div class="task-info">
              <div class="task-title">{{ task.title }}</div>
              <div class="task-time">{{ task.time }}</div>
            </div>
            <div class="task-actions">
              <button 
                class="task-btn" 
                :class="{ 'completed': task.completed }"
                @click="toggleTask(task.id)"
              >
                {{ task.completed ? '✓' : '○' }}
              </button>
              <button class="calendar-sync-btn" @click="syncWithCalendar(task.id)">
                📅
              </button>
            </div>
          </div>
        </div>
        <button class="sync-all-btn" @click="syncAllWithCalendar">
          Синхронизировать с календарем
        </button>
      </div>

      <!-- Active Goals Section -->
      <div class="section-card">
        <h3 class="section-title">{{ t('dashboard.activeGoals') }}</h3>
        <div class="goals-list">
          <div 
            v-for="goal in activeGoals" 
            :key="goal.id" 
            class="goal-item"
          >
            <div class="goal-icon">{{ goal.icon }}</div>
            <div class="goal-content">
              <div class="goal-title">{{ goal.title }}</div>
              <div class="goal-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: `${goal.progress}%` }"></div>
                </div>
                <span class="progress-text">{{ goal.progress }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Knowledge Library Section -->
      <div class="section-card">
        <h3 class="section-title">{{ t('dashboard.knowledgeLibrary') }}</h3>
        <div class="library-intro">
          <p>{{ t('dashboard.libraryDescription') }}</p>
        </div>
        
        <div class="expert-categories">
          <div class="category-tabs">
            <button 
              v-for="category in expertCategories" 
              :key="category.id"
              class="category-tab"
              :class="{ active: selectedCategory === category.id }"
              @click="selectCategory(category.id)"
            >
              {{ category.icon }} {{ category.name }}
            </button>
          </div>
        </div>

        <div class="materials-grid">
          <div 
            v-for="material in filteredMaterials" 
            :key="material.id" 
            class="material-card"
            :class="{ premium: material.isPremium }"
          >
            <div class="material-header">
              <div class="expert-info">
                <img :src="material.expertAvatar" :alt="material.expertName" class="expert-avatar" />
                <div class="expert-details">
                  <div class="expert-name">{{ material.expertName }}</div>
                  <div class="expert-specialty">{{ material.expertSpecialty }}</div>
                </div>
              </div>
              <div class="material-badge" v-if="material.isPremium">
                <span class="premium-icon">⭐</span>
                <span class="premium-text">{{ t('dashboard.premium') }}</span>
              </div>
            </div>
            
            <div class="material-content">
              <h4 class="material-title">{{ material.title }}</h4>
              <p class="material-description">{{ material.description }}</p>
              <div class="material-meta">
                <span class="material-type">{{ material.type }}</span>
                <span class="material-duration">{{ material.duration }}</span>
                <span class="material-views">{{ material.views }} просмотров</span>
              </div>
            </div>

            <div class="material-actions">
              <button class="view-material-btn" @click="viewMaterial(material.id)">
                {{ material.isPremium ? t('dashboard.subscribeToView') : t('dashboard.view') }}
              </button>
              <button class="like-material-btn" @click="likeMaterial(material.id)">
                <span class="like-icon">{{ material.isLiked ? '❤️' : '🤍' }}</span>
                <span class="like-count">{{ material.likes }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="become-expert">
          <h4>{{ t('dashboard.becomeExpert') }}</h4>
          <p>{{ t('dashboard.expertDescription') }}</p>
          <button class="become-expert-btn" @click="showExpertApplication">
            {{ t('dashboard.applyAsExpert') }}
          </button>
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
        
        <!-- Language Switcher -->
        <div class="menu-language-section">
          <h4>{{ t('common.language') }}</h4>
          <LanguageSwitcher />
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppHeader from '@/components/AppHeader.vue'
import GoalsIcon from '@/components/icons/GoalsIcon.vue'
import StatisticsIcon from '@/components/icons/StatisticsIcon.vue'
import ProfileIcon from '@/components/icons/ProfileIcon.vue'
import DiscountsIcon from '@/components/icons/DiscountsIcon.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const router = useRouter()
const { t } = useI18n()

// State
const disciplineProgress = ref(65)
const showArrow = ref(false)
const showMenu = ref(false)

// Weight tracking
const currentWeight = ref(85)
const targetWeight = ref(70)

// Water tracking
const waterDrunk = ref(1.8)
const waterGoal = ref(2.5)

// Discipline
const disciplineScore = ref(78)

// Stats
const streakDays = ref(12)
const achievementsCount = ref(47)
const tokens = ref(1250)

// Daily tasks
const dailyTasks = ref([
  { id: 1, title: 'Упражнения для шеи', time: '09:00', completed: true },
  { id: 2, title: 'Приседания', time: '12:00', completed: false },
  { id: 3, title: 'Растяжка', time: '18:00', completed: false },
  { id: 4, title: 'Дыхательные упражнения', time: '21:00', completed: false }
])

// Active goals
const activeGoals = ref([
  { id: 1, title: 'Похудеть до 70кг', icon: '⚖️', progress: 65 },
  { id: 2, title: 'Выучить английский B2', icon: '📚', progress: 42 },
  { id: 3, title: 'Начать бегать', icon: '🏃‍♂️', progress: 23 },
  { id: 4, title: 'Медитировать каждый день', icon: '🧘‍♀️', progress: 89 }
])

// Knowledge Library
const selectedCategory = ref('all')

const expertCategories = ref([
  { id: 'all', name: 'Все', icon: '📚' },
  { id: 'fitness', name: 'Фитнес', icon: '💪' },
  { id: 'yoga', name: 'Йога', icon: '🧘‍♀️' },
  { id: 'massage', name: 'Массаж', icon: '💆‍♀️' },
  { id: 'nutrition', name: 'Питание', icon: '🥗' },
  { id: 'mental', name: 'Ментальное здоровье', icon: '🧠' }
])

const knowledgeMaterials = ref([
  {
    id: 1,
    title: 'Утренняя зарядка для офиса',
    description: '5 простых упражнений, которые можно делать прямо за рабочим столом',
    type: 'Видео',
    duration: '8 мин',
    views: 1247,
    likes: 89,
    isLiked: false,
    isPremium: false,
    expertName: 'Анна Петрова',
    expertSpecialty: 'Фитнес-тренер',
    expertAvatar: '/avatar-ideal.png',
    category: 'fitness'
  },
  {
    id: 2,
    title: 'Техника самомассажа шеи',
    description: 'Снимаем напряжение после рабочего дня за 10 минут',
    type: 'Гайд',
    duration: '10 мин',
    views: 2156,
    likes: 156,
    isLiked: true,
    isPremium: false,
    expertName: 'Михаил Соколов',
    expertSpecialty: 'Массажист',
    expertAvatar: '/avatar-ideal.png',
    category: 'massage'
  },
  {
    id: 3,
    title: 'Медитация для начинающих',
    description: 'Пошаговое руководство по медитации для тех, кто никогда не медитировал',
    type: 'Аудио',
    duration: '15 мин',
    views: 3421,
    likes: 234,
    isLiked: false,
    isPremium: true,
    expertName: 'Елена Морозова',
    expertSpecialty: 'Психолог',
    expertAvatar: '/avatar-ideal.png',
    category: 'mental'
  },
  {
    id: 4,
    title: 'Правильное питание для похудения',
    description: 'Основы здорового питания без жестких диет',
    type: 'Статья',
    duration: '12 мин',
    views: 1890,
    likes: 123,
    isLiked: false,
    isPremium: false,
    expertName: 'Дарья Козлова',
    expertSpecialty: 'Нутрициолог',
    expertAvatar: '/avatar-ideal.png',
    category: 'nutrition'
  }
])

const filteredMaterials = computed(() => {
  if (selectedCategory.value === 'all') {
    return knowledgeMaterials.value
  }
  return knowledgeMaterials.value.filter(material => material.category === selectedCategory.value)
})

// Menu items (removed dashboard since it's now merged)
const menuItems = computed(() => [
  {
    name: 'profile',
    label: t('navigation.profile'),
    route: '/profile',
    icon: ProfileIcon,
    class: 'nav-profile'
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

const addWater = () => {
  if (waterDrunk.value < waterGoal.value) {
    waterDrunk.value = Math.min(waterDrunk.value + 0.25, waterGoal.value)
  }
}

const toggleTask = (taskId: number) => {
  const task = dailyTasks.value.find(t => t.id === taskId)
  if (task) {
    task.completed = !task.completed
  }
}

const syncWithCalendar = (taskId: number) => {
  console.log('Syncing task with calendar:', taskId)
  // TODO: Implement calendar sync
}

const syncAllWithCalendar = () => {
  console.log('Syncing all tasks with calendar')
  // TODO: Implement bulk calendar sync
}

const showDisciplineDetails = () => {
  console.log('Show discipline details')
  // TODO: Navigate to discipline details page
}

const showStreakDetails = () => {
  console.log('Show streak details')
  // TODO: Navigate to streak details page
}

const showTokensDetails = () => {
  console.log('Show tokens details')
  // TODO: Navigate to tokens/ranking page
}

const showPartners = () => {
  console.log('Show partners map')
  // TODO: Navigate to partners page
}

const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
}

const viewMaterial = (materialId: number) => {
  console.log('View material:', materialId)
  // TODO: Navigate to material view page
}

const likeMaterial = (materialId: number) => {
  const material = knowledgeMaterials.value.find(m => m.id === materialId)
  if (material) {
    material.isLiked = !material.isLiked
    material.likes += material.isLiked ? 1 : -1
  }
}

const showExpertApplication = () => {
  console.log('Show expert application form')
  // TODO: Navigate to expert application page
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
  padding-bottom: 20px;
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

.section-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid var(--border-color);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.clickable {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.clickable:hover {
  transform: translateY(-2px);
}

/* Weight Scale */
.weight-scale {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: var(--text-secondary);
}

.scale-bar {
  height: 20px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.scale-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.scale-fill.green {
  background: linear-gradient(90deg, #4CAF50, #66BB6A);
}

.scale-fill.yellow {
  background: linear-gradient(90deg, #FFC107, #FFD54F);
}

.weight-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.target-weight {
  color: var(--accent-green);
  font-weight: 500;
}

.current-weight {
  color: var(--text-primary);
  font-weight: 500;
}

/* Water Tracking */
.water-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.water-bottle {
  width: 60px;
  height: 120px;
  background: #e3f2fd;
  border: 3px solid #2196f3;
  border-radius: 30px 30px 8px 8px;
  position: relative;
  overflow: hidden;
}

.water-fill {
  background: linear-gradient(180deg, #2196f3, #64b5f6);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  transition: height 0.5s ease;
  border-radius: 0 0 25px 25px;
}

.water-waves {
  position: absolute;
  top: -10px;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(180deg, transparent, #1976d2);
  border-radius: 50%;
  animation: wave 2s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(10px); }
}

.bottle-cap {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 8px;
  background: #1976d2;
  border-radius: 4px;
}

.water-stats {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.water-amount {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.water-progress {
  font-size: 14px;
  color: var(--text-secondary);
}

.add-water-btn {
  background: var(--accent-blue);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.add-water-btn:hover {
  background: #1976d2;
}

/* Discipline Meter */
.discipline-meter {
  display: flex;
  align-items: center;
  gap: 20px;
}

.meter-circle {
  position: relative;
  width: 120px;
  height: 120px;
}

.meter-svg {
  transform: rotate(-90deg);
}

.meter-bg {
  fill: none;
  stroke: #e0e0e0;
  stroke-width: 8;
}

.meter-fill {
  fill: none;
  stroke: var(--accent-green);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dasharray 0.5s ease;
}

.meter-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.discipline-tips {
  flex: 1;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Stats Row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  border: 1px solid var(--border-color);
  transition: transform 0.2s ease;
}

.stat-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--accent-green);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 4px;
}

.stat-subtitle {
  font-size: 10px;
  color: var(--text-secondary);
}

/* Tasks */
.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: var(--secondary-bg);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.task-item.completed {
  opacity: 0.7;
}

.task-info {
  flex: 1;
}

.task-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.task-time {
  font-size: 12px;
  color: var(--text-secondary);
}

.task-actions {
  display: flex;
  gap: 8px;
}

.task-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  background: transparent;
  color: var(--text-secondary);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.task-btn.completed {
  background: var(--accent-green);
  border-color: var(--accent-green);
  color: white;
}

.calendar-sync-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: var(--secondary-bg);
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
}

.calendar-sync-btn:hover {
  background: var(--accent-blue);
  color: white;
}

.sync-all-btn {
  width: 100%;
  background: var(--accent-blue);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.sync-all-btn:hover {
  background: #1976d2;
}

/* Goals */
.goals-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.goal-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--secondary-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.goal-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card-bg);
  border-radius: 50%;
}

.goal-content {
  flex: 1;
}

.goal-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.goal-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-green), #66BB6A);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
  min-width: 30px;
}

/* Knowledge Library */
.library-intro {
  margin-bottom: 20px;
}

.library-intro p {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
}

.expert-categories {
  margin-bottom: 20px;
}

.category-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.category-tab {
  background: var(--secondary-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.category-tab:hover {
  background: var(--card-bg);
  border-color: var(--accent-green);
}

.category-tab.active {
  background: var(--accent-green);
  border-color: var(--accent-green);
  color: white;
}

.materials-grid {
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
}

.material-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  transition: transform 0.2s ease;
}

.material-card:hover {
  transform: translateY(-2px);
}

.material-card.premium {
  border-color: var(--accent-yellow);
  background: linear-gradient(135deg, var(--card-bg) 0%, rgba(212, 175, 55, 0.1) 100%);
}

.material-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.expert-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.expert-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.expert-details {
  display: flex;
  flex-direction: column;
}

.expert-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.expert-specialty {
  font-size: 12px;
  color: var(--text-secondary);
}

.material-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--accent-yellow);
  color: #000;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.premium-icon {
  font-size: 12px;
}

.material-content {
  margin-bottom: 16px;
}

.material-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1.4;
}

.material-description {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 12px;
}

.material-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--text-secondary);
}

.material-type {
  background: var(--accent-blue);
  color: white;
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 500;
}

.material-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-material-btn {
  background: var(--accent-green);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.view-material-btn:hover {
  background: #3a6a3a;
}

.like-material-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 6px 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.like-material-btn:hover {
  border-color: var(--accent-green);
  color: var(--accent-green);
}

.like-icon {
  font-size: 14px;
}

.like-count {
  font-size: 12px;
  font-weight: 500;
}

.become-expert {
  background: var(--secondary-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.become-expert h4 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.become-expert p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 16px;
}

.become-expert-btn {
  background: var(--accent-blue);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.become-expert-btn:hover {
  background: #1976d2;
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
  display: flex;
  flex-direction: column;
  height: 100%;
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

.menu-language-section {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.menu-language-section h4 {
  color: var(--text-primary);
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .water-container {
    flex-direction: column;
    text-align: center;
  }
  
  .discipline-meter {
    flex-direction: column;
    text-align: center;
  }
  
  .category-tabs {
    gap: 6px;
  }
  
  .category-tab {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .materials-grid {
    gap: 12px;
  }
  
  .material-card {
    padding: 12px;
  }
  
  .material-actions {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .view-material-btn {
    width: 100%;
  }
  
  .navigation-menu {
    min-width: 260px;
    max-width: 300px;
  }
}
</style> 