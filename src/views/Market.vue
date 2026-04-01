<template>
  <div class="market-page">
    <!-- 头部 -->
    <header class="market-header">
      <h1>市场行情</h1>
    </header>

    <!-- 市场分类标签 -->
    <div class="market-tabs">
      <button 
        v-for="tab in marketTabs" 
        :key="tab.key"
        class="market-tab"
        :class="{ active: currentTab === tab.key }"
        @click="currentTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 指数卡片 -->
    <section class="index-section">
      <div class="index-cards">
        <div 
          v-for="index in currentIndices" 
          :key="index.code"
          class="index-card"
          @click="goToStock(index.code)"
        >
          <div class="index-name">{{ index.name }}</div>
          <div class="index-price" :class="getPriceClass(index.changePercent)">
            {{ index.price?.toFixed(2) || '--' }}
          </div>
          <div class="index-change" :class="getPriceClass(index.changePercent)">
            {{ formatChange(index.changePercent) }}
          </div>
        </div>
      </div>
    </section>

    <!-- 涨幅榜 -->
    <section class="list-section">
      <div class="list-header">
        <h3>涨幅榜</h3>
        <span class="update-time">{{ updateTime }}</span>
      </div>
      <div class="stock-list-header">
        <span class="col-name">股票名称</span>
        <span class="col-price">最新价</span>
        <span class="col-change">涨跌幅</span>
      </div>
      <div class="stock-list">
        <div 
          v-for="stock in gainers" 
          :key="stock.code"
          class="stock-row"
          @click="goToStock(stock.code)"
        >
          <div class="col-name">
            <div class="stock-name">{{ stock.name }}</div>
            <div class="stock-code">{{ formatCode(stock.code) }}</div>
          </div>
          <span class="col-price" :class="getPriceClass(stock.changePercent)">
            {{ stock.price?.toFixed(2) }}
          </span>
          <span class="col-change up">
            +{{ stock.changePercent?.toFixed(2) }}%
          </span>
        </div>
      </div>
    </section>

    <!-- 跌幅榜 -->
    <section class="list-section">
      <div class="list-header">
        <h3>跌幅榜</h3>
      </div>
      <div class="stock-list-header">
        <span class="col-name">股票名称</span>
        <span class="col-price">最新价</span>
        <span class="col-change">涨跌幅</span>
      </div>
      <div class="stock-list">
        <div 
          v-for="stock in losers" 
          :key="stock.code"
          class="stock-row"
          @click="goToStock(stock.code)"
        >
          <div class="col-name">
            <div class="stock-name">{{ stock.name }}</div>
            <div class="stock-code">{{ formatCode(stock.code) }}</div>
          </div>
          <span class="col-price" :class="getPriceClass(stock.changePercent)">
            {{ stock.price?.toFixed(2) }}
          </span>
          <span class="col-change down">
            {{ stock.changePercent?.toFixed(2) }}%
          </span>
        </div>
      </div>
    </section>

    <!-- 成交量榜 -->
    <section class="list-section">
      <div class="list-header">
        <h3>成交量榜</h3>
      </div>
      <div class="stock-list-header">
        <span class="col-name">股票名称</span>
        <span class="col-price">最新价</span>
        <span class="col-change">成交量</span>
      </div>
      <div class="stock-list">
        <div 
          v-for="stock in volumeLeaders" 
          :key="stock.code"
          class="stock-row"
          @click="goToStock(stock.code)"
        >
          <div class="col-name">
            <div class="stock-name">{{ stock.name }}</div>
            <div class="stock-code">{{ formatCode(stock.code) }}</div>
          </div>
          <span class="col-price" :class="getPriceClass(stock.changePercent)">
            {{ stock.price?.toFixed(2) }}
          </span>
          <span class="col-change">
            {{ formatVolume(stock.volume) }}
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { stockApi } from '../api/stock'
import dayjs from 'dayjs'

const router = useRouter()

const marketTabs = [
  { key: 'A股', label: 'A股' },
  { key: '港股', label: '港股' },
  { key: '美股', label: '美股' }
]

const currentTab = ref('A股')
const updateTime = ref(dayjs().format('HH:mm:ss'))

// 从API获取的真实指数数据
const realTimeIndices = ref({
  'sh000001': { code: 'sh000001', name: '上证指数', price: 0, changePercent: 0 },
  'sz399001': { code: 'sz399001', name: '深证成指', price: 0, changePercent: 0 },
  'sz399006': { code: 'sz399006', name: '创业板指', price: 0, changePercent: 0 },
  'sh000016': { code: 'sh000016', name: '上证50', price: 0, changePercent: 0 },
  'hkHSI': { code: 'hkHSI', name: '恒生指数', price: 0, changePercent: 0 },
  'usIXIC': { code: 'usIXIC', name: '纳斯达克', price: 0, changePercent: 0 }
})

// 指数数据映射
const indexData = computed(() => {
  return {
    'A股': [
      realTimeIndices.value['sh000001'],
      realTimeIndices.value['sz399001'],
      realTimeIndices.value['sz399006'],
      realTimeIndices.value['sh000016']
    ],
    '港股': [
      realTimeIndices.value['hkHSI']
    ],
    '美股': [
      realTimeIndices.value['usIXIC']
    ]
  }
})

// 加载真实指数数据
const loadIndexData = async () => {
  try {
    const marketData = await stockApi.getMarketOverview()
    if (marketData) {
      if (marketData.shanghai) realTimeIndices.value['sh000001'] = { ...realTimeIndices.value['sh000001'], ...marketData.shanghai }
      if (marketData.shenzhen) realTimeIndices.value['sz399001'] = { ...realTimeIndices.value['sz399001'], ...marketData.shenzhen }
      if (marketData.chinext) realTimeIndices.value['sz399006'] = { ...realTimeIndices.value['sz399006'], ...marketData.chinext }
      if (marketData.hangseng) realTimeIndices.value['hkHSI'] = { ...realTimeIndices.value['hkHSI'], ...marketData.hangseng }
      if (marketData.nasdaq) realTimeIndices.value['usIXIC'] = { ...realTimeIndices.value['usIXIC'], ...marketData.nasdaq }
    }
  } catch (error) {
    console.error('加载指数数据失败:', error)
  }
}

// 模拟榜单数据
const generateMockStocks = (market, type, count = 10) => {
  const stocks = []
  const prefixes = { 'A股': 'sh', '港股': 'hk', '美股': 'us' }
  const prefix = prefixes[market]
  
  for (let i = 0; i < count; i++) {
    const basePrice = Math.random() * 100 + 10
    const changePercent = type === 'gainer' 
      ? Math.random() * 10 
      : type === 'loser' 
        ? -Math.random() * 10 
        : (Math.random() - 0.5) * 10
    
    stocks.push({
      code: `${prefix}${String(600000 + i).padStart(6, '0')}`,
      name: `${market}股票${i + 1}`,
      price: basePrice,
      changePercent: changePercent,
      volume: Math.floor(Math.random() * 100000000)
    })
  }
  
  if (type === 'gainer') {
    return stocks.sort((a, b) => b.changePercent - a.changePercent)
  } else if (type === 'loser') {
    return stocks.sort((a, b) => a.changePercent - b.changePercent)
  } else {
    return stocks.sort((a, b) => b.volume - a.volume)
  }
}

const currentIndices = computed(() => indexData.value[currentTab.value] || [])

const gainers = computed(() => generateMockStocks(currentTab.value, 'gainer'))
const losers = computed(() => generateMockStocks(currentTab.value, 'loser'))
const volumeLeaders = computed(() => generateMockStocks(currentTab.value, 'volume'))

const formatCode = (code) => {
  return code.replace(/^(sh|sz|hk|us)/, '').toUpperCase()
}

const formatChange = (changePercent) => {
  if (changePercent === undefined || changePercent === null) return '--'
  const sign = changePercent >= 0 ? '+' : ''
  return `${sign}${changePercent.toFixed(2)}%`
}

const formatVolume = (volume) => {
  if (!volume) return '--'
  if (volume >= 100000000) {
    return (volume / 100000000).toFixed(2) + '亿'
  }
  if (volume >= 10000) {
    return (volume / 10000).toFixed(2) + '万'
  }
  return volume.toString()
}

const getPriceClass = (changePercent) => {
  if (changePercent === undefined || changePercent === null) return 'flat'
  if (changePercent > 0) return 'up'
  if (changePercent < 0) return 'down'
  return 'flat'
}

const goToStock = (code) => {
  router.push(`/stock/${code}`)
}

onMounted(() => {
  // 加载指数数据
  loadIndexData()
  
  // 定时更新时间和数据
  setInterval(() => {
    updateTime.value = dayjs().format('HH:mm:ss')
  }, 1000)
  
  // 每30秒刷新一次指数数据
  setInterval(() => {
    loadIndexData()
  }, 30000)
})
</script>

<style scoped>
.market-page {
  padding: 16px;
  padding-bottom: 80px;
  max-width: 600px;
  margin: 0 auto;
}

.market-header {
  margin-bottom: 20px;
}

.market-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.market-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.market-tab {
  flex: 1;
  padding: 12px;
  border: none;
  background: var(--card-bg);
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s;
}

.market-tab.active {
  background: var(--primary-color);
  color: white;
}

.index-section {
  margin-bottom: 24px;
}

.index-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.index-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.index-card:active {
  transform: scale(0.98);
}

.index-name {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.index-price {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
}

.index-change {
  font-size: 13px;
  font-weight: 500;
}

.list-section {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.list-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.update-time {
  font-size: 12px;
  color: var(--text-secondary);
}

.stock-list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
  font-size: 12px;
  color: var(--text-secondary);
}

.stock-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  align-items: center;
}

.stock-row:last-child {
  border-bottom: none;
}

.stock-row:active {
  background: var(--bg-color);
  margin: 0 -16px;
  padding-left: 16px;
  padding-right: 16px;
}

.stock-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.stock-code {
  font-size: 12px;
  color: var(--text-secondary);
}

.col-price,
.col-change {
  text-align: right;
  font-size: 15px;
  font-weight: 500;
}
</style>
