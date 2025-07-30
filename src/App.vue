<template>
  <div id="app">
    <RouterView />
    <TelegramDebug />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import TelegramDebug from '@/components/TelegramDebug.vue'
</script>

<style>
#app {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style> 