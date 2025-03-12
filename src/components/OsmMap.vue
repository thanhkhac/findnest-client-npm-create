<script setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import RegionService from '@/api/services/regionService.js'

  const props = defineProps({
    wardCode: String,
    districtCode: String,
    provinceCode: String
  })

  const emit = defineEmits(['update:coordinates'])

  const map = ref(null)
  const marker = ref(null)

  const defaultLat = 21.0285
  const defaultLng = 105.8542
  const latitude = ref(defaultLat)
  const longitude = ref(defaultLng)

  onMounted(() => {
    map.value = L.map('osm-map').setView([latitude.value, longitude.value], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(map.value)

    marker.value = L.marker([latitude.value, longitude.value])
      .addTo(map.value)
      .bindPopup('Hà Nội')
      .openPopup()

    map.value.on('click', (e) => {
      const lat = e.latlng.lat.toFixed(5)
      const lng = e.latlng.lng.toFixed(5)

      updateMarker(lat, lng, `Vị trí đã chọn: ${lat}, ${lng}`)
      emitCoordinates(lat, lng)
    })

    fetchCoordinatesFromProps()
  })

  onUnmounted(() => {
    if (map.value) {
      map.value.remove()
    }
  })

  const fetchCoordinates = async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      )
      const data = await response.json()
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat)
        const lng = parseFloat(data[0].lon)
        updateMarker(lat, lng, query)
        emitCoordinates(lat, lng)
      } else {
        console.warn('Không tìm thấy vị trí trên bản đồ:', query)
      }
    } catch (error) {
      console.error('Lỗi khi lấy tọa độ:', error)
    }
  }

  const updateMarker = (lat, lng, label) => {
    if (marker.value) {
      map.value.removeLayer(marker.value)
    }
    marker.value = L.marker([lat, lng])
      .addTo(map.value)
      .bindPopup(label)
      .openPopup()

    map.value.setView([lat, lng])
    latitude.value = lat
    longitude.value = lng
  }

  const emitCoordinates = (lat, lng) => {
    emit('update:coordinates', { latitude: lat, longitude: lng })
  }

  const fetchCoordinatesFromProps = async () => {
    let query = ''
    if (props.wardCode) {
      query = props.wardCode
    } else if (props.districtCode) {
      query = props.districtCode
    } else if (props.provinceCode) {
      query = props.provinceCode
    }

    if (query) {
      try {
        const response = await RegionService.getFullAddress(query)
        const fullAddress = response.data
        fetchCoordinates(fullAddress)
      } catch (error) {
        console.error('Lỗi khi lấy địa chỉ đầy đủ:', error)
      }
    } else {
      updateMarker(defaultLat, defaultLng, 'Hà Nội')
      emitCoordinates(defaultLat, defaultLng)
    }
  }

  watch(
    () => [props.provinceCode, props.districtCode, props.wardCode],
    () => {
      fetchCoordinatesFromProps()
    }
  )
</script>

<template>
  <div id="osm-map" style="height: 300px; width: 100%;"></div>
</template>

<style scoped>
  #osm-map {
    z-index: 1;
  }
</style>