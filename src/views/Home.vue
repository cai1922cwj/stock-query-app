<template>
  <div class="home">
    <!-- 头部 -->
    <header class="header">
      <h1 class="logo">云南能源集团@云维股份行情</h1>
      <div class="header-actions">
        <button class="icon-btn" @click="refresh">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
        </button>
      </div>
    </header>

    <!-- 市场指数 -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">市场指数</h2>
        <router-link to="/market" class="more-link">更多 ></router-link>
      </div>
      <div class="market-scroll">
        <div class="market-list">
          <MarketIndex 
            v-for="(item, key) in marketIndices" 
            :key="key"
            :name="item.name"
            :market="item.market"
            :data="getMarketData(key, item.name)"
            :code="key"
          />
        </div>
      </div>
    </section>

    <!-- 自选股 -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">自选股</h2>
        <span class="count">{{ favoriteList.length }}</span>
      </div>
      <div v-if="favoriteList.length > 0" class="stock-list">
        <StockCard 
          v-for="stock in favoriteList" 
          :key="stock.code"
          :stock="stock"
        />
      </div>
      <div v-else class="empty-state">
        <div class="empty-icon">📊</div>
        <p>暂无自选股</p>
        <router-link to="/search" class="empty-action">去添加</router-link>
      </div>
    </section>

    <!-- 热门股票 -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">热门股票</h2>
      </div>
      <div class="stock-list">
        <StockCard 
          v-for="stock in hotStocks" 
          :key="stock.code"
          :stock="stock"
        />
      </div>
    </section>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStockStore } from '../stores/stock'
import StockCard from '../components/StockCard.vue'
import MarketIndex from '../components/MarketIndex.vue'

const stockStore = useStockStore()
const loading = ref(false)

const marketData = computed(() => stockStore.marketData)
const favoriteList = computed(() => stockStore.favoriteList)
const hotStocks = computed(() => stockStore.hotStocks)

const marketIndices = {
  shanghai: { name: '上证指数', market: 'A股' },
  shenzhen: { name: '深证成指', market: 'A股' },
  chinext: { name: '创业板指', market: 'A股' },
  hangseng: { name: '恒生指数', market: '港股' },
  nasdaq: { name: '纳斯达克', market: '美股' }
}

const defaultMarketData = {
  shanghai: { name: '上证指数', price: 3050.32, changePercent: 0.52 },
  shenzhen: { name: '深证成指', price: 9876.54, changePercent: -0.23 },
  chinext: { name: '创业板指', price: 1987.65, changePercent: 1.15 },
  hangseng: { name: '恒生指数', price: 16543.21, changePercent: 0.88 },
  nasdaq: { name: '纳斯达克', price: 14567.89, changePercent: 1.23 }
}

const getMarketData = (key, name) => {
  const data = marketData.value?.[key]
  if (data && data.price) {
    return data
  }
  return defaultMarketData[key] || { name, price: 3000, changePercent: 0 }
}

const refresh = async () => {
  loading.value = true
  try {
    await Promise.all([
      stockStore.fetchMarketData(),
      stockStore.fetchHotStocks()
    ])
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  refresh()
  // 定时刷新
  setInterval(() => {
    stockStore.fetchMarketData()
  }, 30000)
})
</script>

<style scoped>
.home {
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
  background: transparent;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 12px 16px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: var(--card-bg);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.3s;
}

.icon-btn:active {
  background: var(--border-color);
}

.icon-btn svg {
  width: 20px;
  height: 20px;
}

.section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.more-link {
  font-size: 14px;
  color: #fff;
  text-decoration: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.count {
  font-size: 14px;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 10px;
  border-radius: 10px;
}

.market-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  margin: 0 -16px;
  padding: 4px 16px;
  -webkit-overflow-scrolling: touch;
}

.market-scroll::-webkit-scrollbar {
  display: none;
}

.market-list {
  display: flex;
  flex-direction: row;
  gap: 12px;
  min-height: 150px;
  padding: 8px 0;
}

.stock-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.empty-action {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
</style>
