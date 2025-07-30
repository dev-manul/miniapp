import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ru from './locales/ru.json'

// Get user's preferred language from browser or Telegram
function getDefaultLocale(): string {
  // Check localStorage first (user preference)
  const savedLang = localStorage.getItem('preferred-language')
  if (savedLang && ['en', 'ru'].includes(savedLang)) {
    return savedLang
  }
  
  // Check if we're in Telegram Web App
  if (window.Telegram?.WebApp) {
    const tgLang = window.Telegram.WebApp.initDataUnsafe?.user?.language_code
    if (tgLang) {
      return tgLang.startsWith('ru') ? 'ru' : 'en'
    }
  }
  
  // Fallback to browser language
  const browserLang = navigator.language || navigator.languages?.[0] || 'en'
  return browserLang.startsWith('ru') ? 'ru' : 'en'
}

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    ru
  }
})

export default i18n 