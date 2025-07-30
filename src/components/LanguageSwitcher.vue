<template>
  <div class="language-switcher">
    <button 
      v-for="lang in availableLanguages" 
      :key="lang.code"
      @click="changeLanguage(lang.code)"
      class="lang-button"
      :class="{ active: currentLocale === lang.code }"
    >
      {{ lang.flag }} {{ lang.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const currentLocale = computed(() => locale.value)

const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' }
]

const changeLanguage = (langCode: string) => {
  locale.value = langCode
  // Store preference in localStorage
  localStorage.setItem('preferred-language', langCode)
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 8px;
  align-items: center;
}

.lang-button {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-primary);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.lang-button:hover {
  background: var(--secondary-bg);
  border-color: var(--accent-green);
}

.lang-button.active {
  background: var(--accent-green);
  border-color: var(--accent-green);
  color: white;
}

@media (max-width: 480px) {
  .language-switcher {
    gap: 4px;
  }
  
  .lang-button {
    padding: 6px 8px;
    font-size: 12px;
  }
}
</style> 