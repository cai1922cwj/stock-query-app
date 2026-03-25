<template>
  <div class="home">
    <!-- 头部 -->
    <header class="header">
      <h1 class="logo">股票查询</h1>
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
            :data="marketData?.[key]"
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

const marketIndices = [
  { name: '上证指数', market: 'A股', key: 'shanghai' },
  { name: '深证成指', market: 'A股', key: 'shenzhen' },
  { name: '创业板指', market: 'A股', key: 'chinext' },
  { name: '恒生指数', market: '港股', key: 'hangseng' },
  { name: '纳斯达克', market: '美股', key: 'nasdaq' }
]

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
  color: var(--primary-color);
  text-decoration: none;
}

.count {
  font-size: 14px;
  color: var(--text-secondary);
  background: var(--bg-color);
  padding: 2px 10px;
  border-radius: 10px;
}

.market-scroll {
  overflow-x: auto;
  margin: 0 -16px;
  padding: 0 16px;
  -webkit-overflow-scrolling: touch;
}

.market-scroll::-webkit-scrollbar {
  display: none;
}

.market-list {
  display: flex;
  gap: 12px;
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
