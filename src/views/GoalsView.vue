<template>
  <div class="goals-container">
    <!-- App Header Component -->
    <AppHeader 
      :title="t('goals.title')"
      :show-back-button="true"
      :show-profile="false"
      :show-progress="false"
      :action-button="{ icon: AddIcon }"
      @action="showAddGoal = true"
    />

    <!-- Goals Content -->
    <div class="goals-content">
      <div class="goals-list">
        <div v-for="goal in goals" :key="goal.id" class="goal-card">
          <div class="goal-header">
            <div class="goal-icon">{{ goal.icon }}</div>
            <div class="goal-info">
              <h3 class="goal-title">{{ goal.title }}</h3>
              <p class="goal-description">{{ goal.description }}</p>
            </div>
            <div class="goal-status" :class="goal.status">
              {{ goal.status === 'completed' ? '✓' : goal.status === 'in-progress' ? '⋯' : '○' }}
            </div>
          </div>
          <div class="goal-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: goal.progress + '%' }"></div>
            </div>
            <span class="progress-text">{{ goal.progress }}%</span>
          </div>
          <div class="goal-meta">
            <span class="goal-deadline">{{ goal.deadline }}</span>
            <span class="goal-priority" :class="goal.priority">{{ goal.priority }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Goal Modal -->
    <div v-if="showAddGoal" class="modal-overlay" @click="showAddGoal = false">
      <div class="modal" @click.stop>
        <h3>{{ t('goals.addGoal') }}</h3>
        <form @submit.prevent="addGoal">
          <div class="form-group">
            <label>{{ t('goals.goalName') }}</label>
            <input v-model="newGoal.title" type="text" required />
          </div>
          <div class="form-group">
            <label>{{ t('goals.goalDescription') }}</label>
            <textarea v-model="newGoal.description" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Icon</label>
            <select v-model="newGoal.icon">
              <option value="🏃‍♂️">🏃‍♂️</option>
              <option value="📚">📚</option>
              <option value="💧">💧</option>
              <option value="💪">💪</option>
              <option value="🧘‍♂️">🧘‍♂️</option>
              <option value="🎯">🎯</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" @click="showAddGoal = false" class="btn">{{ t('app.cancel') }}</button>
            <button type="submit" class="btn btn-primary">{{ t('goals.addGoal') }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppHeader from '@/components/AppHeader.vue'
import AddIcon from '@/components/icons/AddIcon.vue'

const { t } = useI18n()

// State
const showAddGoal = ref(false)
const newGoal = ref({
  title: '',
  description: '',
  icon: '🎯'
})

const goals = ref([
  {
    id: 1,
    title: 'Daily Exercise',
    description: 'Complete 30 minutes of physical activity',
    icon: '🏃‍♂️',
    progress: 75,
    status: 'in-progress',
    deadline: 'Today',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Read More Books',
    description: 'Read 30 pages every day',
    icon: '📚',
    progress: 100,
    status: 'completed',
    deadline: 'This week',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Stay Hydrated',
    description: 'Drink 8 glasses of water daily',
    icon: '💧',
    progress: 60,
    status: 'in-progress',
    deadline: 'Ongoing',
    priority: 'high'
  },
  {
    id: 4,
    title: 'Learn New Skill',
    description: 'Practice coding for 1 hour daily',
    icon: '💻',
    progress: 25,
    status: 'not-started',
    deadline: 'This month',
    priority: 'medium'
  }
])

// Methods
const addGoal = () => {
  const goal = {
    id: Date.now(),
    title: newGoal.value.title,
    description: newGoal.value.description,
    icon: newGoal.value.icon,
    progress: 0,
    status: 'not-started',
    deadline: 'New',
    priority: 'medium'
  }
  
  goals.value.unshift(goal)
  showAddGoal.value = false
  
  // Reset form
  newGoal.value = {
    title: '',
    description: '',
    icon: '🎯'
  }
}
</script>

<style scoped>
.goals-container {
  height: 100vh;
  background: var(--primary-bg);
  display: flex;
  flex-direction: column;
  padding: 16px;
}



.goals-content {
  flex: 1;
  overflow-y: auto;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.goal-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid var(--border-color);
}

.goal-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.goal-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--secondary-bg);
  border-radius: 8px;
  flex-shrink: 0;
}

.goal-info {
  flex: 1;
}

.goal-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.goal-description {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.goal-status {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  flex-shrink: 0;
}

.goal-status.completed {
  background: var(--accent-green);
  color: white;
}

.goal-status.in-progress {
  background: var(--accent-yellow);
  color: var(--primary-bg);
}

.goal-status.not-started {
  background: var(--secondary-bg);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.goal-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.progress-text {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
  min-width: 40px;
}

.goal-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goal-deadline {
  font-size: 12px;
  color: var(--text-secondary);
}

.goal-priority {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

.goal-priority.high {
  background: #dc3545;
  color: white;
}

.goal-priority.medium {
  background: var(--accent-yellow);
  color: var(--primary-bg);
}

.goal-priority.low {
  background: var(--accent-green);
  color: white;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  border: 1px solid var(--border-color);
}

.modal h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px;
  background: var(--secondary-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 16px;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--accent-green);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.form-actions .btn {
  flex: 1;
}

@media (max-width: 480px) {
  .goals-container {
    padding: 12px;
  }
  
  .goal-card {
    padding: 12px;
  }
  
  .modal {
    width: 95%;
    padding: 20px;
  }
}
</style> 