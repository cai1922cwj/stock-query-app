<template>
  <div class="search-page">
    <!-- 搜索栏 -->
    <div class="search-header">
      <div class="search-box">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input 
          v-model="keyword"
          type="text" 
          class="search-input"
          placeholder="输入股票代码或名称"
          @input="onSearch"
          @keyup.enter="onSearch"
          autofocus
        >
        <button v-if="keyword" class="clear-btn" @click="clearSearch">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </button>
      </div>
      <button class="cancel-btn" @click="goBack">取消</button>
    </div>

    <!-- 搜索结果 -->
    <div v-if="keyword && searchResults.length > 0" class="search-results">
      <div 
        v-for="stock in searchResults" 
        :key="stock.code"
        class="result-item"
        @click="selectStock(stock)"
      >
        <div class="result-info">
          <div class="result-name">{{ stock.name }}</div>
          <div class="result-code">{{ stock.code }}</div>
        </div>
        <span class="market-tag" :class="stock.market">{{ stock.market }}</span>
      </div>
    </div>

    <!-- 无结果 -->
    <div v-else-if="keyword && !loading" class="no-result">
      <p>未找到相关股票</p>
    </div>

    <!-- 搜索历史 -->
    <div v-if="!keyword && searchHistory.length > 0" class="search-section">
      <div class="section-header">
        <h3>搜索历史</h3>
        <button class="clear-all" @click="clearAllHistory">清空</button>
      </div>
      <div class="history-list">
        <div 
          v-for="stock in searchHistory" 
          :key="stock.code"
          class="history-item"
          @click="selectStock(stock)"
        >
          <svg class="history-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          <span class="history-name">{{ stock.name }}</span>
          <span class="history-code">{{ stock.code }}</span>
        </div>
      </div>
    </div>

    <!-- 热门搜索 -->
    <div v-if="!keyword" class="search-section">
      <div class="section-header">
        <h3>热门搜索</h3>
      </div>
      <div class="hot-list">
        <div 
          v-for="(stock, index) in hotSearchStocks" 
          :key="stock.code"
          class="hot-item"
          @click="selectStock(stock)"
        >
          <span class="hot-rank" :class="{ top: index < 3 }">{{ index + 1 }}</span>
          <span class="hot-name">{{ stock.name }}</span>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStockStore } from '../stores/stock'
import { stockApi } from '../api/stock'
import { debounce } from '../utils/debounce'

const router = useRouter()
const stockStore = useStockStore()

const keyword = ref('')
const searchResults = ref([])
const loading = ref(false)

const searchHistory = computed(() => stockStore.searchHistory)

const hotSearchStocks = [
  { code: 'sh600519', name: '贵州茅台', market: 'A股' },
  { code: 'hk00700', name: '腾讯控股', market: '港股' },
  { code: 'usTSLA', name: '特斯拉', market: '美股' },
  { code: 'usNVDA', name: '英伟达', market: '美股' },
  { code: 'sh601398', name: '工商银行', market: 'A股' },
  { code: 'hk09988', name: '阿里巴巴', market: '港股' },
  { code: 'usAAPL', name: '苹果', market: '美股' },
  { code: 'sz000858', name: '五粮液', market: 'A股' },
  { code: 'sh600036', name: '招商银行', market: 'A股' },
  { code: 'sz002594', name: '比亚迪', market: 'A股' },
  { code: 'sh601318', name: '中国平安', market: 'A股' },
  { code: 'hk03690', name: '美团-W', market: '港股' },
  { code: 'usMSFT', name: '微软', market: '美股' },
  { code: 'usGOOGL', name: '谷歌', market: '美股' },
  { code: 'usAMZN', name: '亚马逊', market: '美股' },
  { code: 'sh300750', name: '宁德时代', market: 'A股' },
  { code: 'hk01810', name: '小米集团', market: '港股' },
  { code: 'usBABA', name: '阿里巴巴', market: '美股' },
  { code: 'usNIO', name: '蔚来', market: '美股' },
  { code: 'sh600276', name: '恒瑞医药', market: 'A股' },
  { code: 'sz000333', name: '美的集团', market: 'A股' },
  { code: 'hk09618', name: '京东集团', market: '港股' },
  { code: 'usMETA', name: 'Meta', market: '美股' },
  { code: 'usNFLX', name: '奈飞', market: '美股' }
]

const doSearch = async () => {
  if (!keyword.value.trim()) {
    searchResults.value = []
    return
  }
  
  loading.value = true
  try {
    const results = await stockApi.searchStocks(keyword.value.trim())
    searchResults.value = results
  } finally {
    loading.value = false
  }
}

const onSearch = debounce(doSearch, 300)

const clearSearch = () => {
  keyword.value = ''
  searchResults.value = []
}

const selectStock = (stock) => {
  stockStore.addToHistory(stock)
  router.push(`/stock/${stock.code}`)
}

const clearAllHistory = () => {
  stockStore.clearHistory()
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-attachment: fixed;
}

.search-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  background: var(--bg-color);
  border-radius: 20px;
  padding: 8px 12px;
}

.search-icon {
  width: 18px;
  height: 18px;
  color: var(--text-secondary);
  margin-right: 8px;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px;
  outline: none;
  color: var(--text-primary);
}

.clear-btn {
  width: 20px;
  height: 20px;
  border: none;
  background: var(--text-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  padding: 0;
}

.clear-btn svg {
  width: 14px;
  height: 14px;
}

.cancel-btn {
  border: none;
  background: transparent;
  color: var(--primary-color);
  font-size: 15px;
  cursor: pointer;
  padding: 4px 8px;
}

.search-results {
  background: var(--card-bg);
}

.result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
}

.result-item:active {
  background: var(--bg-color);
}

.result-name {
  font-size: 16px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.result-code {
  font-size: 13px;
  color: var(--text-secondary);
}

.market-tag {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  background: var(--bg-color);
  color: var(--text-secondary);
}

.market-tag.A股 {
  background: #e3f2fd;
  color: #1976d2;
}

.market-tag.港股 {
  background: #fce4ec;
  color: #c2185b;
}

.market-tag.美股 {
  background: #f3e5f5;
  color: #7b1fa2;
}

.no-result {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.search-section {
  padding: 20px 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  font-size: 15px;
  color: #fff;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.clear-all {
  border: none;
  background: transparent;
  color: var(--primary-color);
  font-size: 14px;
  cursor: pointer;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  cursor: pointer;
}

.history-item:active {
  background: var(--bg-color);
}

.history-icon {
  width: 18px;
  height: 18px;
  color: var(--text-secondary);
}

.history-name {
  flex: 1;
  font-size: 15px;
  color: var(--text-primary);
}

.history-code {
  font-size: 13px;
  color: var(--text-secondary);
}

.hot-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.hot-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.hot-item:active {
  background: rgba(255, 255, 255, 0.8);
}

.hot-rank {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-color);
  border-radius: 4px;
}

.hot-rank.top {
  color: white;
  background: var(--danger-color);
}

.hot-name {
  font-size: 14px;
  color: var(--text-primary);
}

.loading {
  padding: 40px;
}
</style>
