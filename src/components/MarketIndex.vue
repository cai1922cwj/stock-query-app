<template>
  <div class="market-index" @click="goToDetail">
    <div class="index-header">
      <span class="index-name">{{ data?.name || name }}</span>
      <span class="index-tag" :class="market">{{ marketLabel }}</span>
    </div>
    <div class="index-price" :class="getPriceClass(data?.changePercent)">
      {{ data?.price?.toFixed(2) || '--' }}
    </div>
    <div class="index-change" :class="getPriceClass(data?.changePercent)">
      {{ formatChange(data?.changePercent) }}
    </div>
    <!-- 迷你趋势图 -->
    <div class="mini-chart">
      <svg viewBox="0 0 100 30" class="trend-line">
        <polyline
          :points="generateTrendPoints()"
          fill="none"
          :stroke="getTrendColor()"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <defs>
          <linearGradient :id="'gradient-' + name" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" :stop-color="getTrendColor()" stop-opacity="0.3" />
            <stop offset="100%" :stop-color="getTrendColor()" stop-opacity="0" />
          </linearGradient>
        </defs>
        <polygon
          :points="generateTrendPoints() + ' 100,30 0,30'"
          :fill="'url(#gradient-' + name + ')'"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  name: String,
  market: {
    type: String,
    default: 'A股'
  },
  data: Object
})

const router = useRouter()

const marketLabel = computed(() => {
  const labels = {
    'A股': 'A股',
    '港股': '港股',
    '美股': '美股'
  }
  return labels[props.market] || props.market
})

// 生成模拟趋势数据
const generateTrendPoints = () => {
  const points = []
  const basePrice = props.data?.price || 3000
  const volatility = basePrice * 0.02
  
  for (let i = 0; i <= 20; i++) {
    const x = i * 5
    const randomChange = (Math.random() - 0.5) * volatility
    const y = 15 - (randomChange / volatility) * 10
    points.push(`${x},${Math.max(2, Math.min(28, y))}`)
  }
  
  return points.join(' ')
}

const getTrendColor = () => {
  const changePercent = props.data?.changePercent
  if (changePercent > 0) return '#f44336'
  if (changePercent < 0) return '#4caf50'
  return '#999'
}

const goToDetail = () => {
  const codeMap = {
    '上证指数': 'sh000001',
    '深证成指': 'sz399001',
    '创业板指': 'sz399006',
    '恒生指数': 'hk00700',
    '纳斯达克': 'usAAPL'
  }
  const code = codeMap[props.name]
  if (code) {
    router.push(`/stock/${code}`)
  }
}

const formatChange = (changePercent) => {
  if (changePercent === undefined || changePercent === null) return '--'
  const sign = changePercent >= 0 ? '+' : ''
  return `${sign}${changePercent.toFixed(2)}%`
}

const getPriceClass = (changePercent) => {
  if (changePercent === undefined || changePercent === null) return 'flat'
  if (changePercent > 0) return 'up'
  if (changePercent < 0) return 'down'
  return 'flat'
}
</script>

<style scoped>
.market-index {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 16px;
  min-width: 140px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.market-index:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.market-index:active {
  transform: scale(0.98);
}

.index-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.index-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.index-tag {
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 500;
}

.index-tag.港股 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.index-tag.美股 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.index-price {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
}

.index-change {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}

.mini-chart {
  width: 100%;
  height: 30px;
  margin-top: 8px;
}

.trend-line {
  width: 100%;
  height: 100%;
}
</style>
<template>
  <div class="market-index" @click="goToDetail">
    <div class="index-header">
      <span class="index-name">{{ data?.name || name }}</span>
      <span class="index-tag" :class="market">{{ marketLabel }}</span>
    </div>
    <div class="index-price" :class="getPriceClass(data?.changePercent)">
      {{ data?.price?.toFixed(2) || '--' }}
    </div>
    <div class="index-change" :class="getPriceClass(data?.changePercent)">
      {{ formatChange(data?.changePercent) }}
    </div>
    <!-- 迷你趋势图 -->
    <div class="mini-chart">
      <svg viewBox="0 0 100 30" class="trend-line">
        <polyline
          :points="generateTrendPoints()"
          fill="none"
          :stroke="getTrendColor()"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <defs>
          <linearGradient :id="'gradient-' + name" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" :stop-color="getTrendColor()" stop-opacity="0.3" />
            <stop offset="100%" :stop-color="getTrendColor()" stop-opacity="0" />
          </linearGradient>
        </defs>
        <polygon
          :points="generateTrendPoints() + ' 100,30 0,30'"
          :fill="'url(#gradient-' + name + ')'"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  name: String,
  market: {
    type: String,
    default: 'A股'
  },
  data: Object
})

const router = useRouter()

const marketLabel = computed(() => {
  const labels = {
    'A股': 'A股',
    '港股': '港股',
    '美股': '美股'
  }
  return labels[props.market] || props.market
})

// 生成模拟趋势数据
const generateTrendPoints = () => {
  const points = []
  const basePrice = props.data?.price || 3000
  const volatility = basePrice * 0.02
  
  for (let i = 0; i <= 20; i++) {
    const x = i * 5
    const randomChange = (Math.random() - 0.5) * volatility
    const y = 15 - (randomChange / volatility) * 10
    points.push(`${x},${Math.max(2, Math.min(28, y))}`)
  }
  
  return points.join(' ')
}

const getTrendColor = () => {
  const changePercent = props.data?.changePercent
  if (changePercent > 0) return '#f44336'
  if (changePercent < 0) return '#4caf50'
  return '#999'
}

const goToDetail = () => {
  const codeMap = {
    '上证指数': 'sh000001',
    '深证成指': 'sz399001',
    '创业板指': 'sz399006',
    '恒生指数': 'hk00700',
    '纳斯达克': 'usAAPL'
  }
  const code = codeMap[props.name]
  if (code) {
    router.push(`/stock/${code}`)
  }
}

const formatChange = (changePercent) => {
  if (changePercent === undefined || changePercent === null) return '--'
  const sign = changePercent >= 0 ? '+' : ''
  return `${sign}${changePercent.toFixed(2)}%`
}

const getPriceClass = (changePercent) => {
  if (changePercent === undefined || changePercent === null) return 'flat'
  if (changePercent > 0) return 'up'
  if (changePercent < 0) return 'down'
  return 'flat'
}
</script>

<style scoped>
.market-index {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 16px;
  min-width: 140px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.market-index:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.market-index:active {
  transform: scale(0.98);
}

.index-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.index-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.index-tag {
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 500;
}

.index-tag.港股 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.index-tag.美股 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.index-price {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
}

.index-change {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}

.mini-chart {
  width: 100%;
  height: 30px;
  margin-top: 8px;
}

.trend-line {
  width: 100%;
  height: 100%;
}
</style>
