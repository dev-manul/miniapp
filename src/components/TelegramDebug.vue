<template>
  <div v-if="!isTelegramAvailable" class="telegram-debug">
    <div class="debug-header">
      <h3>🔧 Telegram Web App Debug</h3>
      <p>This app is designed to run inside Telegram. For development, we're using mock data.</p>
    </div>
    
    <div class="debug-info">
      <div class="info-item">
        <strong>User:</strong> {{ userName }}
      </div>
      <div class="info-item">
        <strong>Username:</strong> @{{ user?.username || 'N/A' }}
      </div>
      <div class="info-item">
        <strong>User ID:</strong> {{ user?.id || 'N/A' }}
      </div>

      <div class="info-item">
        <strong>Avatar:</strong> {{ userAvatar ? 'Available' : 'Not available' }}
      </div>
      <div class="info-item">
        <strong>Telegram Web App:</strong> {{ isTelegramAvailable ? 'Available' : 'Not available' }}
      </div>
    </div>

    <div class="debug-actions">
      <button @click="refreshData" class="debug-btn">
        🔄 Refresh Data
      </button>
      <button @click="showTelegramInfo" class="debug-btn">
        ℹ️ Show Telegram Info
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTelegram } from '@/composables/useTelegram'

const { 
  isTelegramAvailable, 
  user, 
  webApp, 
  getUserAvatar, 
  getUserName, 
  initTelegram 
} = useTelegram()

const userAvatar = getUserAvatar()
const userName = getUserName()

const refreshData = () => {
  initTelegram()
}

const showTelegramInfo = () => {
  if (webApp.value) {
    console.log('Telegram Web App Info:', {
      version: webApp.value.version,
      platform: webApp.value.platform,
      colorScheme: webApp.value.colorScheme,
      isExpanded: webApp.value.isExpanded,
      viewportHeight: webApp.value.viewportHeight,
      initDataUnsafe: webApp.value.initDataUnsafe
    })
    alert('Check console for Telegram Web App information')
  } else {
    alert('Telegram Web App not available')
  }
}
</script>

<style scoped>
.telegram-debug {
  position: fixed;
  top: 10px;
  right: 10px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  max-width: 300px;
  z-index: 1000;
  font-size: 12px;
}

.debug-header h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: var(--text-primary);
}

.debug-header p {
  margin: 0 0 12px 0;
  color: var(--text-secondary);
  font-size: 11px;
  line-height: 1.4;
}

.debug-info {
  margin-bottom: 12px;
}

.info-item {
  margin-bottom: 4px;
  color: var(--text-secondary);
}

.info-item strong {
  color: var(--text-primary);
}

.debug-actions {
  display: flex;
  gap: 8px;
}

.debug-btn {
  background: var(--secondary-bg);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 6px 8px;
  color: var(--text-primary);
  font-size: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.debug-btn:hover {
  background: var(--accent-green);
  border-color: var(--accent-green);
}

@media (max-width: 768px) {
  .telegram-debug {
    position: static;
    margin: 16px;
    max-width: none;
  }
}
</style> 