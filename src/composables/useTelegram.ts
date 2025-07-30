import { ref, onMounted } from 'vue'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  photo_url?: string
}

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  close: () => void
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    showProgress: (leaveActive?: boolean) => void
    hideProgress: () => void
    setText: (text: string) => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
  }
  BackButton: {
    isVisible: boolean
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
  }
  initData: string
  initDataUnsafe: {
    query_id?: string
    user?: TelegramUser
    receiver?: TelegramUser
    chat?: any
    chat_type?: string
    chat_instance?: string
    start_param?: string
    can_send_after?: number
    auth_date: number
    hash: string
  }
  colorScheme: 'light' | 'dark'
  themeParams: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    link_color?: string
    button_color?: string
    button_text_color?: string
  }
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  headerColor: string
  backgroundColor: string
  isClosingConfirmationEnabled: boolean
  onEvent: (eventType: string, eventHandler: () => void) => void
  offEvent: (eventType: string, eventHandler: () => void) => void
  sendData: (data: string) => void
  switchInlineQuery: (query: string, choose_chat_types?: string[]) => void
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void
  openTelegramLink: (url: string) => void
  openInvoice: (url: string, callback?: (status: string) => void) => void
  showPopup: (params: { title?: string; message: string; buttons?: Array<{ id?: string; type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'; text: string }> }, callback?: (buttonId: string) => void) => void
  showAlert: (message: string, callback?: () => void) => void
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void
  showScanQrPopup: (params: { text?: string }, callback?: (data: string) => void) => void
  closeScanQrPopup: () => void
  readTextFromClipboard: (callback?: (data: string) => void) => void
  requestWriteAccess: (callback?: (access: boolean) => void) => void
  requestContact: (callback?: (contact: any) => void) => void
  invokeCustomMethod: (method: string, params: any, callback?: (data: any) => void) => void
  version: string
  platform: string
  isVersionAtLeast: (version: string) => boolean
  setHeaderColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  enableClosingConfirmation: () => void
  disableClosingConfirmation: () => void
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

export function useTelegram() {
  const isTelegramAvailable = ref(false)
  const user = ref<TelegramUser | null>(null)
  const webApp = ref<TelegramWebApp | null>(null)
  const isLoading = ref(true)

  const initTelegram = () => {
    if (window.Telegram?.WebApp) {
      webApp.value = window.Telegram.WebApp
      isTelegramAvailable.value = true
      
      console.log('🚀 Telegram Web App initialized')
      console.log('📱 Web App Info:', {
        version: webApp.value.version,
        platform: webApp.value.platform,
        colorScheme: webApp.value.colorScheme,
        isExpanded: webApp.value.isExpanded,
        viewportHeight: webApp.value.viewportHeight
      })
      
      // Initialize the Web App
      webApp.value.ready()
      webApp.value.expand()
      
      // Get user data
      if (webApp.value.initDataUnsafe?.user) {
        user.value = webApp.value.initDataUnsafe.user
        console.log('👤 Telegram User Data:', {
          id: user.value.id,
          first_name: user.value.first_name,
          last_name: user.value.last_name,
          username: user.value.username,
          language_code: user.value.language_code,
          photo_url: user.value.photo_url
        })
      } else {
        console.log('⚠️ No user data found in Telegram Web App')
      }
      
      console.log('🔧 Full initDataUnsafe:', webApp.value.initDataUnsafe)
      
      // Set theme
      if (webApp.value.colorScheme === 'dark') {
        document.body.classList.add('telegram-dark')
        console.log('🌙 Dark theme applied')
      } else {
        console.log('☀️ Light theme detected')
      }
      
      isLoading.value = false
      console.log('✅ Telegram Web App setup complete')
    } else {
      // Fallback for development
      console.log('🔧 Telegram Web App not available, using mock data')
      user.value = {
        id: 123456789,
        first_name: 'John',
        last_name: 'Doe',
        username: 'johndoe',
        photo_url: 'https://via.placeholder.com/150/2d5a2d/ffffff?text=JD'
      }
      console.log('👤 Mock User Data:', user.value)
      isLoading.value = false
    }
  }

  const getUserAvatar = () => {
    if (user.value?.photo_url) {
      return user.value.photo_url
    }
    return null
  }

  const getUserName = () => {
    if (user.value) {
      return user.value.last_name 
        ? `${user.value.first_name} ${user.value.last_name}`
        : user.value.first_name
    }
    return 'User'
  }

  const getUserInitials = () => {
    if (user.value) {
      const first = user.value.first_name.charAt(0)
      const last = user.value.last_name?.charAt(0) || ''
      return (first + last).toUpperCase()
    }
    return 'U'
  }

  onMounted(() => {
    initTelegram()
  })

  return {
    isTelegramAvailable,
    user,
    webApp,
    isLoading,
    getUserAvatar,
    getUserName,
    getUserInitials,
    initTelegram
  }
} 