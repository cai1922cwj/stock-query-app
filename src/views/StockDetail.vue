<template>
  <div class="stock-detail">
    <!-- 头部 -->
    <header class="detail-header">
      <button class="back-btn" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"></path>
        </svg>
      </button>
      <div class="header-title">
        <h1>{{ stockData?.name || '--' }}</h1>
        <span class="header-code">{{ stockCode }}</span>
      </div>
      <button class="favorite-btn" @click="toggleFavorite">
        <svg 
          viewBox="0 0 24 24" 
          :fill="isFav ? '#ff9800' : 'none'" 
          stroke="currentColor" 
          stroke-width="2"
          :class="{ active: isFav }"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      </button>
    </header>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
    </div>

    <template v-else-if="stockData">
      <!-- 价格信息 -->
      <section class="price-section">
        <div class="main-price" :class="getPriceClass(stockData.changePercent)">
          <span class="current-price">{{ stockData.price?.toFixed(2) }}</span>
          <div class="price-change">
            <span class="change-amount">{{ formatChangeAmount(stockData.change) }}</span>
            <span class="change-percent">{{ formatChange(stockData.changePercent) }}</span>
          </div>
        </div>
        <div class="update-time">
          更新于 {{ stockData.updateTime || '刚刚' }}
        </div>
      </section>

      <!-- 行情数据 -->
      <section class="data-grid">
        <div class="data-item">
          <span class="data-label">今开</span>
          <span class="data-value" :class="getPriceClass((stockData.open - stockData.preClose) / stockData.preClose * 100)">
            {{ stockData.open?.toFixed(2) }}
          </span>
        </div>
        <div class="data-item">
          <span class="data-label">昨收</span>
          <span class="data-value">{{ stockData.preClose?.toFixed(2) }}</span>
        </div>
        <div class="data-item">
          <span class="data-label">最高</span>
          <span class="data-value" :class="getPriceClass((stockData.high - stockData.preClose) / stockData.preClose * 100)">
            {{ stockData.high?.toFixed(2) }}
          </span>
        </div>
        <div class="data-item">
          <span class="data-label">最低</span>
          <span class="data-value" :class="getPriceClass((stockData.low - stockData.preClose) / stockData.preClose * 100)">
            {{ stockData.low?.toFixed(2) }}
          </span>
        </div>
        <div class="data-item">
          <span class="data-label">成交量</span>
          <span class="data-value">{{ formatVolume(stockData.volume) }}</span>
        </div>
        <div class="data-item">
          <span class="data-label">成交额</span>
          <span class="data-value">{{ formatAmount(stockData.amount) }}</span>
        </div>
        <div class="data-item">
          <span class="data-label">市盈率</span>
          <span class="data-value">{{ stockData.pe || '--' }}</span>
        </div>
        <div class="data-item">
          <span class="data-label">市净率</span>
          <span class="data-value">{{ stockData.pb || '--' }}</span>
        </div>
      </section>

      <!-- 图表 -->
      <section class="chart-section">
        <div class="chart-tabs">
          <button 
            v-for="tab in chartTabs" 
            :key="tab.key"
            class="chart-tab"
            :class="{ active: currentChart === tab.key }"
            @click="switchChart(tab.key)"
          >
            {{ tab.label }}
          </button>
        </div>
        <div class="chart-container">
          <div ref="chartRef" class="chart"></div>
        </div>
      </section>

      <!-- 公司概况 -->
      <section class="info-section">
        <h3 class="section-title">公司概况</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">公司全称</span>
            <span class="info-value">{{ stockData.companyInfo?.fullName || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">所属行业</span>
            <span class="info-value">{{ stockData.companyInfo?.industry || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">成立时间</span>
            <span class="info-value">{{ stockData.companyInfo?.founded || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">员工人数</span>
            <span class="info-value">{{ stockData.companyInfo?.employees || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">公司官网</span>
            <span class="info-value">{{ stockData.companyInfo?.website || '--' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">公司地址</span>
            <span class="info-value">{{ stockData.companyInfo?.address || '--' }}</span>
          </div>
        </div>
        <div class="business-desc">
          <h4>主营业务</h4>
          <p>{{ stockData.companyInfo?.business || '暂无信息' }}</p>
        </div>
      </section>

      <!-- 财务数据 -->
      <section class="finance-section">
        <h3 class="section-title">财务数据</h3>
        <div class="finance-grid">
          <div class="finance-item">
            <span class="finance-label">总市值</span>
            <span class="finance-value">{{ stockData.marketCap || '--' }}</span>
          </div>
          <div class="finance-item">
            <span class="finance-label">总营收</span>
            <span class="finance-value">{{ stockData.finance?.totalRevenue || '--' }}</span>
          </div>
          <div class="finance-item">
            <span class="finance-label">净利润</span>
            <span class="finance-value">{{ stockData.finance?.netProfit || '--' }}</span>
          </div>
          <div class="finance-item">
            <span class="finance-label">总资产</span>
            <span class="finance-value">{{ stockData.finance?.totalAssets || '--' }}</span>
          </div>
          <div class="finance-item">
            <span class="finance-label">净资产收益率</span>
            <span class="finance-value">{{ stockData.finance?.roe || '--' }}</span>
          </div>
          <div class="finance-item">
            <span class="finance-label">资产负债率</span>
            <span class="finance-value">{{ stockData.finance?.debtRatio || '--' }}</span>
          </div>
        </div>
      </section>

      <!-- 大宗交易 -->
      <section class="block-trade-section">
        <h3 class="section-title">大宗交易</h3>
        <div class="block-trade-list">
          <div v-for="(trade, index) in stockData.blockTrade" :key="index" class="block-trade-item">
            <div class="trade-header">
              <span class="trade-date">{{ trade.date }}</span>
              <span class="trade-volume">{{ trade.volume }}</span>
            </div>
            <div class="trade-body">
              <div class="trade-row">
                <span class="trade-label">成交价</span>
                <span class="trade-value">{{ trade.price }}</span>
              </div>
              <div class="trade-row">
                <span class="trade-label">成交额</span>
                <span class="trade-value">{{ trade.amount }}</span>
              </div>
              <div class="trade-row">
                <span class="trade-label">买方</span>
                <span class="trade-party">{{ trade.buyer }}</span>
              </div>
              <div class="trade-row">
                <span class="trade-label">卖方</span>
                <span class="trade-party">{{ trade.seller }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 公司资讯 -->
      <section class="news-section">
        <h3 class="section-title">公司资讯</h3>
        <div class="news-list">
          <a 
            v-for="(news, index) in stockData.news" 
            :key="index" 
            class="news-item"
            :href="news.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h4 class="news-title">{{ news.title }}</h4>
            <div class="news-meta">
              <span class="news-source">{{ news.source }}</span>
              <span class="news-date">{{ news.date }}</span>
            </div>
          </a>
        </div>
      </section>

      <!-- 网页讨论 -->
      <section class="discussion-section">
        <h3 class="section-title">网页讨论</h3>
        <div class="discussion-list">
          <a 
            v-for="(item, index) in stockData.discussions" 
            :key="index" 
            class="discussion-item"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div class="discussion-header">
              <span class="discussion-user">{{ item.user }}</span>
              <span class="discussion-time">{{ item.time }}</span>
            </div>
            <p class="discussion-content">{{ item.content }}</p>
            <div class="discussion-footer">
              <span class="discussion-likes">👍 {{ item.likes }}</span>
            </div>
          </a>
        </div>
      </section>
    </template>

    <!-- 错误状态 -->
    <div v-else class="error-state">
      <p>加载失败，请稍后重试</p>
      <button class="retry-btn" @click="loadData">重新加载</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStockStore } from '../stores/stock'
import { stockApi } from '../api/stock'
import * as echarts from 'echarts'

const route = useRoute()
const router = useRouter()
const stockStore = useStockStore()

const stockCode = computed(() => route.params.code)
const stockData = ref(null)
const loading = ref(false)
const isFav = computed(() => stockStore.isFavorite(stockCode.value))
const chartRef = ref(null)
let chartInstance = null

const chartTabs = [
  { key: 'intraday', label: '分时' },
  { key: 'day', label: '日K' },
  { key: 'week', label: '周K' },
  { key: 'month', label: '月K' }
]
const currentChart = ref('intraday')

const loadData = async () => {
  loading.value = true
  try {
    const data = await stockApi.getStockDetail(stockCode.value)
    stockData.value = data
    await nextTick()
    initChart()
  } catch (error) {
    console.error('加载股票数据失败:', error)
  } finally {
    loading.value = false
  }
}

const toggleFavorite = () => {
  if (stockData.value) {
    stockStore.toggleFavorite({
      code: stockData.value.code,
      name: stockData.value.name,
      price: stockData.value.price,
      changePercent: stockData.value.changePercent
    })
  }
}

const goBack = () => {
  router.back()
}

const formatChange = (changePercent) => {
  if (changePercent === undefined || changePercent === null) return '--'
  const sign = changePercent >= 0 ? '+' : ''
  return `${sign}${changePercent.toFixed(2)}%`
}

const formatChangeAmount = (change) => {
  if (change === undefined || change === null) return '--'
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(2)}`
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

const formatAmount = (amount) => {
  if (!amount) return '--'
  if (amount >= 100000000) {
    return (amount / 100000000).toFixed(2) + '亿'
  }
  if (amount >= 10000) {
    return (amount / 10000).toFixed(2) + '万'
  }
  return amount.toFixed(2)
}

const getPriceClass = (changePercent) => {
  if (changePercent === undefined || changePercent === null) return 'flat'
  if (changePercent > 0) return 'up'
  if (changePercent < 0) return 'down'
  return 'flat'
}

const switchChart = async (type) => {
  currentChart.value = type
  await loadChartData()
}

const loadChartData = async () => {
  if (!chartInstance) return
  
  let data = []
  if (currentChart.value === 'intraday') {
    data = await stockApi.getIntraday(stockCode.value)
    renderIntradayChart(data)
  } else {
    data = await stockApi.getKline(stockCode.value, currentChart.value)
    renderKlineChart(data)
  }
}

const renderIntradayChart = (data) => {
  const prices = data.map(item => item.price)
  const times = data.map(item => item.time)
  
  chartInstance.setOption({
    grid: {
      top: 10,
      left: 0,
      right: 0,
      bottom: 20
    },
    xAxis: {
      type: 'category',
      data: times,
      show: false
    },
    yAxis: {
      type: 'value',
      show: false,
      scale: true
    },
    series: [{
      type: 'line',
      data: prices,
      smooth: true,
      symbol: 'none',
      lineStyle: {
        color: '#1976d2',
        width: 1.5
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(25, 118, 210, 0.2)' },
            { offset: 1, color: 'rgba(25, 118, 210, 0)' }
          ]
        }
      }
    }]
  })
}

const renderKlineChart = (data) => {
  const klineData = data.map(item => [item.open, item.close, item.low, item.high])
  const dates = data.map(item => item.date)
  
  chartInstance.setOption({
    grid: {
      top: 10,
      left: 0,
      right: 0,
      bottom: 20
    },
    xAxis: {
      type: 'category',
      data: dates,
      show: false
    },
    yAxis: {
      type: 'value',
      show: false,
      scale: true
    },
    series: [{
      type: 'candlestick',
      data: klineData,
      itemStyle: {
        color: '#f44336',
        color0: '#4caf50',
        borderColor: '#f44336',
        borderColor0: '#4caf50'
      }
    }]
  })
}

const initChart = () => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    loadChartData()
  }
}

// 定时刷新
let refreshTimer = null

onMounted(() => {
  loadData()
  refreshTimer = setInterval(() => {
    if (!loading.value) {
      loadData()
    }
  }, 30000)
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
  if (chartInstance) {
    chartInstance.dispose()
  }
})

watch(() => stockCode.value, () => {
  loadData()
})
</script>

<style scoped>
.stock-detail {
  min-height: 100vh;
  background: var(--bg-color);
  padding-bottom: 20px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
}

.back-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-primary);
}

.back-btn svg {
  width: 24px;
  height: 24px;
}

.header-title {
  flex: 1;
}

.header-title h1 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.header-code {
  font-size: 12px;
  color: var(--text-secondary);
}

.favorite-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
}

.favorite-btn svg {
  width: 24px;
  height: 24px;
  transition: all 0.3s;
}

.favorite-btn svg.active {
  stroke: #ff9800;
}

.price-section {
  background: var(--card-bg);
  padding: 20px 16px;
  text-align: center;
}

.main-price {
  margin-bottom: 8px;
}

.current-price {
  font-size: 42px;
  font-weight: 700;
}

.price-change {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 8px;
  font-size: 16px;
  font-weight: 500;
}

.update-time {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 8px;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--border-color);
  margin: 12px;
  border-radius: 12px;
  overflow: hidden;
}

.data-item {
  background: var(--card-bg);
  padding: 12px 8px;
  text-align: center;
}

.data-label {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.data-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.chart-section {
  background: var(--card-bg);
  margin: 12px;
  border-radius: 12px;
  padding: 16px;
}

.chart-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.chart-tab {
  flex: 1;
  padding: 8px;
  border: none;
  background: var(--bg-color);
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s;
}

.chart-tab.active {
  background: var(--primary-color);
  color: white;
}

.chart-container {
  height: 200px;
}

.chart {
  width: 100%;
  height: 100%;
}

.info-section,
.finance-section,
.block-trade-section,
.news-section,
.discussion-section {
  background: var(--card-bg);
  margin: 12px;
  border-radius: 12px;
  padding: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.info-grid,
.finance-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item,
.finance-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label,
.finance-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.info-value,
.finance-value {
  font-size: 14px;
  color: var(--text-primary);
}

.business-desc {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.business-desc h4 {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.business-desc p {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.6;
}

/* 大宗交易样式 */
.block-trade-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.block-trade-item {
  background: var(--bg-color);
  border-radius: 8px;
  padding: 12px;
}

.trade-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.trade-date {
  font-size: 12px;
  color: var(--text-secondary);
}

.trade-volume {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-color);
}

.trade-body {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.trade-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.trade-label {
  font-size: 11px;
  color: var(--text-secondary);
}

.trade-value {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.trade-party {
  font-size: 12px;
  color: var(--primary-color);
}

/* 公司资讯样式 */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.news-item {
  display: block;
  padding: 12px;
  background: var(--bg-color);
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.news-item:hover {
  background: var(--primary-light);
  transform: translateX(4px);
}

.news-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.5;
  margin-bottom: 8px;
}

.news-meta {
  display: flex;
  gap: 12px;
}

.news-source {
  font-size: 12px;
  color: var(--primary-color);
}

.news-date {
  font-size: 12px;
  color: var(--text-secondary);
}

/* 网页讨论样式 */
.discussion-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.discussion-item {
  display: block;
  padding: 12px;
  background: var(--bg-color);
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.discussion-item:hover {
  background: var(--primary-light);
  transform: translateX(4px);
}

.discussion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.discussion-user {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-color);
}

.discussion-time {
  font-size: 11px;
  color: var(--text-secondary);
}

.discussion-content {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.5;
  margin-bottom: 8px;
}

.discussion-footer {
  display: flex;
  justify-content: flex-end;
}

.discussion-likes {
  font-size: 12px;
  color: var(--text-secondary);
}

.loading {
  padding: 60px;
  display: flex;
  justify-content: center;
}

.error-state {
  text-align: center;
  padding: 60px 20px;
}

.error-state p {
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.retry-btn {
  padding: 10px 24px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
}
</style>
