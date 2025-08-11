const API_BASE_URL = 'https://reforma-bot-production.up.railway.app/api/v1'

export interface ProfileData {
  userProfile: {
    basicInfo: {
      username: string
      email: string
      dateOfBirth: string
      gender: string
      location: string
      unitsOfMeasurement: string
    }
    physicalHealth: {
      heightCm: number
      currentWeightKg: number
      targetWeightKg: number
      activityLevel: string
      healthConditions: string[]
      allergies: string[]
      medications: string[]
      physicalActivityGoals: string[]
      nutrition: {
        dietaryPreferences: string[]
        eatingHabits: string
        nutritionGoals: string
      }
    }
    mentalHealth: {
      currentMood: string
      stressLevel: string
      sleepQuality: string
      stressors: string[]
      mentalHealthGoals: string[]
      relaxationHobbies: string[]
      mindfulnessPractices: string
      contentPreferences: string[]
    }
  }
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, defaultOptions)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  async getProfile(username: string): Promise<ProfileData> {
    return this.request<ProfileData>(`/profiles/username/${username}`)
  }

  async updateProfile(username: string, profileData: ProfileData): Promise<ProfileData> {
    return this.request<ProfileData>(`/profiles/username/${username}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
  }

  async createProfile(profileData: ProfileData): Promise<ProfileData> {
    return this.request<ProfileData>('/profiles', {
      method: 'POST',
      body: JSON.stringify(profileData),
    })
  }
}

export const apiService = new ApiService() 