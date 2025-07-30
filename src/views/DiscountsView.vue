<template>
  <div class="discounts-container">
    <!-- App Header Component -->
    <AppHeader 
      :title="t('discounts.title')"
      :show-back-button="true"
      :show-profile="false"
      :show-progress="false"
    />

    <!-- Discounts Content -->
    <div class="discounts-content">
      <!-- Search Bar -->
      <div class="search-section">
        <div class="search-bar">
          <input 
            v-model="searchQuery" 
            :placeholder="t('discounts.searchPlaceholder')"
            class="search-input"
            @input="filterDiscounts"
          />
          <button class="search-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-tabs">
        <button 
          v-for="category in discountCategories" 
          :key="category.value"
          @click="selectedCategory = category.value"
          class="filter-tab"
          :class="{ active: selectedCategory === category.value }"
        >
          {{ category.label }}
        </button>
      </div>

      <!-- Google Maps Container -->
      <div class="map-container">
        <div ref="mapContainer" class="map"></div>
        <div class="map-controls">
          <button @click="centerMap" class="map-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6"/>
              <path d="M1 12h6m6 0h6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Selected Discount Modal -->
    <div v-if="selectedDiscount" class="modal-overlay" @click="selectedDiscount = null">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedDiscount.name }}</h3>
          <button @click="selectedDiscount = null" class="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="modal-content">
          <img :src="selectedDiscount.image" :alt="selectedDiscount.name" class="modal-image" />
          <div class="discount-details">
            <div class="discount-percentage">{{ selectedDiscount.discount }}% {{ t('discounts.off') }}</div>
            <p class="discount-full-description">{{ selectedDiscount.fullDescription }}</p>
            <div class="discount-location">
              <h4>{{ t('discounts.location') }}</h4>
              <p>{{ selectedDiscount.address }}</p>
              <p>{{ selectedDiscount.distance }}km {{ t('discounts.away') }}</p>
            </div>
            <div class="discount-validity">
              <h4>{{ t('discounts.validUntil') }}</h4>
              <p>{{ selectedDiscount.validUntil }}</p>
            </div>
          </div>
          <div class="modal-actions">
            <button @click="getDirections" class="btn btn-primary">
              {{ t('discounts.getDirections') }}
            </button>
            <button @click="shareDiscount" class="btn btn-secondary">
              {{ t('discounts.share') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppHeader from '@/components/AppHeader.vue'

const { t } = useI18n()

// State
const mapContainer = ref<HTMLElement>()
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedDiscount = ref<any>(null)
let map: google.maps.Map | null = null
let markers: google.maps.Marker[] = []

// Discount categories
const discountCategories = [
  { label: t('discounts.categories.all'), value: 'all' },
  { label: t('discounts.categories.fitness'), value: 'fitness' },
  { label: t('discounts.categories.nutrition'), value: 'nutrition' },
  { label: t('discounts.categories.wellness'), value: 'wellness' },
  { label: t('discounts.categories.sports'), value: 'sports' }
]

// Sample discount data
const discounts = ref([
  {
    id: 1,
    name: 'PowerFit Gym & Wellness',
    description: 'Premium fitness center with modern equipment and expert trainers',
    fullDescription: 'State-of-the-art gym featuring cardio zones, strength training areas, group fitness studios, and personal training services. Includes access to swimming pool, sauna, and recovery facilities. Perfect for all fitness levels from beginners to advanced athletes.',
    discount: 30,
    category: 'fitness',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    address: '15 Amathountos Avenue, Limassol',
    distance: 0.8,
    validUntil: '2024-12-31',
    coordinates: { lat: 34.681331, lng: 33.0439075 } // North
  },
  {
    id: 2,
    name: 'Fresh & Organic Market',
    description: 'Premium organic foods, supplements, and healthy lifestyle products',
    fullDescription: 'Specialized store offering fresh organic produce, superfoods, vitamins, protein powders, and healthy snacks. Expert nutritionists available for consultations. Wide selection of gluten-free, vegan, and keto-friendly products.',
    discount: 20,
    category: 'nutrition',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
    address: '28 Spyrou Kyprianou Street, Limassol',
    distance: 1.2,
    validUntil: '2024-11-30',
    coordinates: { lat: 34.679331, lng: 33.0459075 } // East
  },
  {
    id: 3,
    name: 'Serenity Spa & Wellness',
    description: 'Luxury spa treatments and holistic wellness services',
    fullDescription: 'Premium spa offering therapeutic massages, facial treatments, body wraps, and wellness therapies. Features meditation rooms, aromatherapy sessions, and stress relief programs. Professional therapists certified in various healing techniques.',
    discount: 35,
    category: 'wellness',
    image: 'https://images.unsplash.com/photo-1544161512-84f9c86cb992?w=400&h=300&fit=crop',
    address: '7 Promachon Street, Limassol',
    distance: 1.5,
    validUntil: '2024-10-31',
    coordinates: { lat: 34.677331, lng: 33.0439075 } // South
  },
  {
    id: 5,
    name: 'Elite Sports & Fitness',
    description: 'Professional sports equipment and athletic wear',
    fullDescription: 'Comprehensive sports store featuring premium athletic footwear, workout clothing, fitness accessories, and sports equipment. Expert staff for personalized fitting and recommendations. Brands include Nike, Adidas, Under Armour, and more.',
    discount: 25,
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    address: '42 Makarios Avenue, Limassol',
    distance: 2.1,
    validUntil: '2024-12-15',
    coordinates: { lat: 34.679331, lng: 33.0419075 } // West
  },
  {
    id: 6,
    name: 'Yoga Flow Studio',
    description: 'Mindful yoga classes and meditation sessions',
    fullDescription: 'Dedicated yoga studio offering various styles including Vinyasa, Hatha, Power Yoga, and meditation classes. Experienced instructors, peaceful environment, and all equipment provided. Perfect for stress relief and flexibility training.',
    discount: 40,
    category: 'wellness',
    image: 'https://images.unsplash.com/photo-1544161512-84f9c86cb992?w=400&h=300&fit=crop',
    address: '19 Athinon Street, Limassol',
    distance: 1.8,
    validUntil: '2024-11-15',
    coordinates: { lat: 34.680331, lng: 33.0429075 } // Northeast
  },
  {
    id: 7,
    name: 'Protein Plus Nutrition',
    description: 'Specialized sports nutrition and supplements',
    fullDescription: 'Expert sports nutrition store offering premium protein powders, pre-workout supplements, BCAAs, vitamins, and meal replacement products. Certified nutritionists provide personalized supplement plans and dietary advice.',
    discount: 15,
    category: 'nutrition',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
    address: '33 Kolonakiou Street, Limassol',
    distance: 0.9,
    validUntil: '2024-12-20',
    coordinates: { lat: 34.678331, lng: 33.0449075 } // Southeast
  }
])

// Computed
const filteredDiscounts = computed(() => {
  let filtered = discounts.value

  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(d => d.category === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(d => 
      d.name.toLowerCase().includes(query) ||
      d.description.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Methods
const initMap = () => {
  if (!mapContainer.value) return

  // Initialize Google Maps
  map = new google.maps.Map(mapContainer.value, {
    center: { lat: 34.679331, lng: 33.0439075 }, // New center
    zoom: 15,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  })

  // Add markers for all discounts
  addMarkers()
}

const addMarkers = () => {
  if (!map) return

  // Clear existing markers
  markers.forEach(marker => marker.setMap(null))
  markers = []

  // Add new markers
  discounts.value.forEach(discount => {
    const marker = new google.maps.Marker({
      position: discount.coordinates,
      map: map,
      title: discount.name,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="#4CAF50" stroke="white" stroke-width="2"/>
            <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${discount.discount}%</text>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 32)
      }
    })

    marker.addListener('click', () => {
      selectDiscount(discount)
    })

    markers.push(marker)
  })
}

const selectDiscount = (discount: any) => {
  selectedDiscount.value = discount
  
  // Center map on selected discount
  if (map) {
    map.setCenter(discount.coordinates)
    map.setZoom(15)
  }
}

const centerMap = () => {
  if (map) {
    map.setCenter({ lat: 34.679331, lng: 33.0439075 })
    map.setZoom(15)
  }
}

const filterDiscounts = () => {
  // Re-add markers based on filtered results
  addMarkers()
}

const getDirections = () => {
  if (!selectedDiscount.value) return
  
  const { lat, lng } = selectedDiscount.value.coordinates
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
  window.open(url, '_blank')
}

const shareDiscount = () => {
  if (!selectedDiscount.value) return
  
  const text = `${t('discounts.shareText')} ${selectedDiscount.value.name} - ${selectedDiscount.value.discount}% ${t('discounts.off')}`
  
  if (navigator.share) {
    navigator.share({
      title: selectedDiscount.value.name,
      text: text,
      url: window.location.href
    })
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(text)
    alert(t('discounts.copiedToClipboard'))
  }
}

// Lifecycle
onMounted(() => {
  // Load Google Maps script
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBjjWSS-URo5pwOrWJJ4N17CaAASdqvzHA&libraries=places`
  script.async = true
  script.defer = true
  script.onload = initMap
  document.head.appendChild(script)
})
</script>

<style scoped>
.discounts-container {
  height: 100vh;
  background: var(--primary-bg);
  display: flex;
  flex-direction: column;
}

.discounts-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow: hidden;
}

.search-section {
  margin-bottom: 16px;
}

.search-bar {
  display: flex;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 16px;
}

.search-input::placeholder {
  color: var(--text-secondary);
}

.search-btn {
  padding: 12px 16px;
  background: var(--accent-green);
  border: none;
  color: white;
  cursor: pointer;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.filter-tab {
  padding: 8px 16px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  color: var(--text-primary);
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-tab.active {
  background: var(--accent-green);
  border-color: var(--accent-green);
  color: white;
}

.map-container {
  position: relative;
  height: calc(100vh - 200px);
  margin-bottom: 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  flex: 1;
}

.map {
  width: 100%;
  height: 100%;
}

.map-controls {
  position: absolute;
  top: 16px;
  right: 16px;
}

.map-btn {
  width: 40px;
  height: 40px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.discount-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.discount-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.discount-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}

.discount-image {
  position: relative;
  height: 120px;
  overflow: hidden;
}

.discount-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.discount-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--accent-green);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.discount-info {
  padding: 16px;
}

.discount-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.discount-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 12px;
  line-height: 1.4;
}

.discount-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.discount-distance {
  font-size: 12px;
  color: var(--accent-green);
  font-weight: 500;
}

.discount-category {
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: capitalize;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal {
  background: var(--card-bg);
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  color: var(--text-primary);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
}

.modal-content {
  padding: 20px;
}

.modal-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
}

.discount-percentage {
  font-size: 24px;
  font-weight: bold;
  color: var(--accent-green);
  margin-bottom: 12px;
}

.discount-full-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
}

.discount-location,
.discount-validity {
  margin-bottom: 16px;
}

.discount-location h4,
.discount-validity h4 {
  color: var(--text-primary);
  margin-bottom: 8px;
  font-size: 16px;
}

.discount-location p,
.discount-validity p {
  color: var(--text-secondary);
  margin: 4px 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--accent-green);
  color: white;
}

.btn-secondary {
  background: var(--secondary-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

@media (max-width: 480px) {
  .discounts-content {
    padding: 12px;
  }
  
  .map-container {
    height: calc(100vh - 180px);
  }
  
  .filter-tabs {
    gap: 6px;
  }
  
  .filter-tab {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style> 