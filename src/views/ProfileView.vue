<template>
  <div class="profile-container">
    <AppHeader title="Profile" :show-back-button="true" />

    <div class="profile-content">
      <section class="profile-section">
        <h3 class="section-title">Basic Information</h3>
        <div class="profile-field"><span class="field-label">Username:</span> {{ basicInfo.username }}</div>
        <div class="profile-field"><span class="field-label">Email:</span> {{ basicInfo.email }}</div>
        <div v-if="basicInfo.dateOfBirth" class="profile-field"><span class="field-label">Date of Birth:</span> {{ formattedDateOfBirth }}</div>
        <div v-if="basicInfo.gender" class="profile-field"><span class="field-label">Gender:</span> {{ basicInfo.gender }}</div>
        <div v-if="basicInfo.location" class="profile-field"><span class="field-label">Location:</span> {{ basicInfo.location }}</div>
        <div class="profile-field"><span class="field-label">Units:</span> {{ basicInfo.unitsOfMeasurement }}</div>
      </section>

      <section class="profile-section">
        <h3 class="section-title">Physical Health</h3>
        <div v-if="physicalHealth.heightCm" class="profile-field"><span class="field-label">Height (cm):</span> {{ physicalHealth.heightCm }}</div>
        <div v-if="physicalHealth.currentWeightKg" class="profile-field"><span class="field-label">Current Weight (kg):</span> {{ physicalHealth.currentWeightKg }}</div>
        <div v-if="physicalHealth.targetWeightKg" class="profile-field"><span class="field-label">Target Weight (kg):</span> {{ physicalHealth.targetWeightKg }}</div>
        <div v-if="physicalHealth.activityLevel" class="profile-field"><span class="field-label">Activity Level:</span> {{ physicalHealth.activityLevel }}</div>
        <div v-if="physicalHealth.healthConditions.length" class="profile-field"><span class="field-label">Health Conditions:</span> {{ physicalHealth.healthConditions.join(', ') }}</div>
        <div v-if="physicalHealth.allergies.length" class="profile-field"><span class="field-label">Allergies:</span> {{ physicalHealth.allergies.join(', ') }}</div>
        <div v-if="physicalHealth.medications.length" class="profile-field"><span class="field-label">Medications:</span> {{ physicalHealth.medications.join(', ') }}</div>
        <div v-if="physicalHealth.physicalActivityGoals.length" class="profile-field"><span class="field-label">Physical Activity Goals:</span> {{ physicalHealth.physicalActivityGoals.join(', ') }}</div>
        <div v-if="physicalHealth.nutrition.dietaryPreferences.length" class="profile-field"><span class="field-label">Dietary Preferences:</span> {{ physicalHealth.nutrition.dietaryPreferences.join(', ') }}</div>
        <div v-if="physicalHealth.nutrition.eatingHabits" class="profile-field"><span class="field-label">Eating Habits:</span> {{ physicalHealth.nutrition.eatingHabits }}</div>
        <div v-if="physicalHealth.nutrition.nutritionGoals" class="profile-field"><span class="field-label">Nutrition Goals:</span> {{ physicalHealth.nutrition.nutritionGoals }}</div>
      </section>

      <section class="profile-section">
        <h3 class="section-title">Mental Health</h3>
        <div v-if="mentalHealth.currentMood" class="profile-field"><span class="field-label">Current Mood:</span> {{ mentalHealth.currentMood }}</div>
        <div v-if="mentalHealth.stressLevel" class="profile-field"><span class="field-label">Stress Level:</span> {{ mentalHealth.stressLevel }}</div>
        <div v-if="mentalHealth.sleepQuality" class="profile-field"><span class="field-label">Sleep Quality:</span> {{ mentalHealth.sleepQuality }}</div>
        <div v-if="mentalHealth.stressors.length" class="profile-field"><span class="field-label">Stressors:</span> {{ mentalHealth.stressors.join(', ') }}</div>
        <div v-if="mentalHealth.mentalHealthGoals.length" class="profile-field"><span class="field-label">Mental Health Goals:</span> {{ mentalHealth.mentalHealthGoals.join(', ') }}</div>
        <div v-if="mentalHealth.relaxationHobbies.length" class="profile-field"><span class="field-label">Relaxation Hobbies:</span> {{ mentalHealth.relaxationHobbies.join(', ') }}</div>
        <div v-if="mentalHealth.mindfulnessPractices" class="profile-field"><span class="field-label">Mindfulness Practices:</span> {{ mentalHealth.mindfulnessPractices }}</div>
        <div v-if="mentalHealth.contentPreferences.length" class="profile-field"><span class="field-label">Content Preferences:</span> {{ mentalHealth.contentPreferences.join(', ') }}</div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import { apiService, type ProfileData } from '@/services/api'
import { useTelegram } from '@/composables/useTelegram'

const { user, getUserAvatar, getUserName, getUserInitials } = useTelegram()
const userAvatar = computed(() => getUserAvatar())
const userName = computed(() => getUserName())
const userInitials = computed(() => getUserInitials())
const userUsername = computed(() => user.value?.username || 'user')

const username = computed(() => user.value?.username || 'manul_dev')
const isLoading = ref(true)
const error = ref<string | null>(null)

const profile = reactive<ProfileData>({
  userProfile: {
    basicInfo: {
      username: username.value,
      email: '',
      dateOfBirth: '',
      gender: '',
      location: '',
      unitsOfMeasurement: 'metric',
    },
    physicalHealth: {
      heightCm: 0,
      currentWeightKg: 0,
      targetWeightKg: 0,
      activityLevel: '',
      healthConditions: [],
      allergies: [],
      medications: [],
      physicalActivityGoals: [],
      nutrition: {
        dietaryPreferences: [],
        eatingHabits: '',
        nutritionGoals: '',
      },
    },
    mentalHealth: {
      currentMood: '',
      stressLevel: '',
      sleepQuality: '',
      stressors: [],
      mentalHealthGoals: [],
      relaxationHobbies: [],
      mindfulnessPractices: '',
      contentPreferences: [],
    },
  },
})

const basicInfo = computed(() => profile.userProfile.basicInfo)
const physicalHealth = computed(() => profile.userProfile.physicalHealth)
const mentalHealth = computed(() => profile.userProfile.mentalHealth)

// Format date of birth nicely
const formattedDateOfBirth = computed(() => {
  if (!basicInfo.value.dateOfBirth) {
    return ''
  }
  try {
    const date = new Date(basicInfo.value.dateOfBirth)
    if (isNaN(date.getTime())) {
      return basicInfo.value.dateOfBirth // Return original if invalid date
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    return basicInfo.value.dateOfBirth // Return original if error
  }
})

const loadProfile = async () => {
  try {
    isLoading.value = true
    error.value = null
    const profileData = await apiService.getProfile(username.value)
    Object.assign(profile, profileData)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load profile'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px 16px 48px 16px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.profile-content {
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  flex: 1;
  overflow-y: auto;
  margin-top: 16px;
}

.profile-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-color);
}

.profile-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--accent-green);
  padding-bottom: 8px;
  border-bottom: 2px solid var(--accent-green);
}

.profile-field {
  margin-bottom: 12px;
  font-size: 1rem;
  padding: 8px 0;
}

.field-label {
  font-weight: 600;
  color: var(--text-secondary);
  margin-right: 8px;
  min-width: 140px;
  display: inline-block;
}

/* Scrollbar styling */
.profile-content::-webkit-scrollbar {
  width: 6px;
}

.profile-content::-webkit-scrollbar-track {
  background: var(--secondary-bg);
  border-radius: 3px;
}

.profile-content::-webkit-scrollbar-thumb {
  background: var(--accent-green);
  border-radius: 3px;
}

.profile-content::-webkit-scrollbar-thumb:hover {
  background: var(--accent-yellow);
}
</style> 