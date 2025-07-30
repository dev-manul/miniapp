<template>
  <div class="app-header">
    <!-- Back Button (optional) -->
    <button v-if="showBackButton" @click="goBack" class="back-btn">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
    </button>

    <!-- Menu Button (optional) -->
    <button v-if="showMenuButton" @click="toggleMenu" class="menu-btn">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>

    <!-- App Title -->
    <h1 class="app-title">{{ title }}</h1>

    <!-- Action Button (optional) -->
    <button v-if="actionButton" @click="$emit('action')" class="action-btn">
      <component :is="actionButton.icon" v-if="actionButton.icon" />
      <span v-else>{{ actionButton.text }}</span>
    </button>

  </div>

  <!-- Profile Section -->
  <section v-if="showProfile" class="profile-section">
    <div class="avatar-container">
      <div class="avatar">
        <div v-if="userAvatar" class="avatar-img avatar-you">
          <img :src="userAvatar" :alt="userName" class="avatar-photo" />
        </div>
        <div v-else class="avatar-img avatar-you">
          {{ userInitials }}
        </div>
        <span class="avatar-label">@{{ userUsername }}</span>
      </div>
      <div class="arrow-icon" v-if="showArrow">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
      <div class="avatar">
        <div class="avatar-img avatar-ideal">⭐</div>
        <span class="avatar-label">Ideal You</span>
      </div>
    </div>
  </section>

  <!-- Discipline Progress Bar -->
  <section v-if="showProgress" class="progress-section">
    <div class="progress-label">Discipline</div>
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: disciplineProgress + '%' }"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegram } from '@/composables/useTelegram'

interface ActionButton {
  icon?: any
  text?: string
}

interface Props {
  title?: string
  showBackButton?: boolean
  showMenuButton?: boolean
  showProfile?: boolean
  showProgress?: boolean
  showArrow?: boolean
  disciplineProgress?: number
  actionButton?: ActionButton
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Re:Forma',
  showBackButton: false,
  showMenuButton: false,
  showProfile: true,
  showProgress: true,
  showArrow: false,
  disciplineProgress: 65
})

const emit = defineEmits<{
  action: []
  menuToggle: []
}>()

const router = useRouter()
const { getUserAvatar, getUserName, getUserInitials, user } = useTelegram()

const userAvatar = computed(() => getUserAvatar())
const userName = computed(() => getUserName())
const userInitials = computed(() => getUserInitials())
const userUsername = computed(() => user.value?.username || 'user')

const goBack = () => {
  router.back()
}

const toggleMenu = () => {
  emit('menuToggle')
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
}

.back-btn, .menu-btn, .action-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn, .menu-btn {
  margin-right: 12px;
}

.action-btn {
  margin-left: auto;
}

.back-btn:hover, .menu-btn:hover, .action-btn:hover {
  background: var(--secondary-bg);
}

.app-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  flex: 1;
  text-align: center;
  margin: 0;
}

/* Adjust title margin when buttons are present */
.app-header:has(.back-btn) .app-title {
  margin-right: 44px;
}

.app-header:has(.action-btn) .app-title {
  margin-left: 44px;
}

.profile-section {
  margin-bottom: 24px;
}

.avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.avatar-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--secondary-bg);
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  overflow: hidden;
}

.avatar-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-you {
  background: linear-gradient(135deg, var(--accent-green), #4a7c59);
  border-color: var(--accent-green);
}

.avatar-ideal {
  background: linear-gradient(135deg, var(--accent-yellow), #b8941f);
  border-color: var(--accent-yellow);
}

.avatar-label {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

.arrow-icon {
  color: var(--text-secondary);
  margin: 0 8px;
}

.progress-section {
  margin-bottom: 32px;
}

.progress-label {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .app-title {
    font-size: 20px;
  }
  
  .avatar-img {
    width: 50px;
    height: 50px;
  }
}
</style> 