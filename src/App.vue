<template>
  <div class="app">
    <router-view v-slot="{ Component }">
      <keep-alive :include="['Home', 'Market']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <TabBar v-if="showTabBar" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TabBar from './components/TabBar.vue'

const route = useRoute()
const showTabBar = computed(() => {
  return ['Home', 'Market', 'Search'].includes(route.name)
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  padding-bottom: 60px;
}
</style>
