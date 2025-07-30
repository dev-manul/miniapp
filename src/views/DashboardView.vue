<template>
  <div class="dashboard-container">
    <!-- App Header Component -->
    <AppHeader 
      title="Dashboard"
      :show-back-button="true"
      :show-profile="false"
      :show-progress="false"
    />

    <!-- Dashboard Content -->
    <div class="dashboard-content">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">7</div>
          <div class="stat-label">Days Streak</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">85%</div>
          <div class="stat-label">Completion</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">12</div>
          <div class="stat-label">Goals Active</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">3.2k</div>
          <div class="stat-label">Points Earned</div>
        </div>
      </div>

      <div class="recent-activity">
        <h3 class="section-title">Recent Activity</h3>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon">🏃‍♂️</div>
            <div class="activity-content">
              <div class="activity-title">Morning Run</div>
              <div class="activity-time">2 hours ago</div>
            </div>
            <div class="activity-status completed">✓</div>
          </div>
          <div class="activity-item">
            <div class="activity-icon">📚</div>
            <div class="activity-content">
              <div class="activity-title">Read 30 pages</div>
              <div class="activity-time">4 hours ago</div>
            </div>
            <div class="activity-status completed">✓</div>
          </div>
          <div class="activity-item">
            <div class="activity-icon">💧</div>
            <div class="activity-content">
              <div class="activity-title">Drink 8 glasses of water</div>
              <div class="activity-time">6 hours ago</div>
            </div>
            <div class="activity-status pending">⋯</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
</script>

<style scoped>
.dashboard-container {
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border: 1px solid var(--border-color);
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--accent-green);
  margin-bottom: 8px;
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

@media (max-width: 480px) {
  .dashboard-container {
    padding: 12px;
  }
  
  .stats-grid {
    gap: 12px;
  }
  
  .stat-card {
    padding: 16px;
  }
  
  .stat-value {
    font-size: 28px;
  }
}
</style> 