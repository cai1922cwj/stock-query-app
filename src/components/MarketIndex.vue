<template>
  <div class="market-index" :class="trendClass">
    <div class="index-header">
      <span class="index-name">{{ name }}</span>
      <span class="market-label">{{ market }}</span>
    </div>
    <div class="index-value">{{ displayValue }}</div>
    <div class="index-change">{{ displayChange }}</div>
    <div class="mini-chart">
      <svg viewBox="0 0 100 30" class="chart-svg">
        <polyline
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          :points="chartPoints"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:currentColor;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:currentColor;stop-opacity:0" />
          </linearGradient>
        </defs>
        <polygon
          :points="`${chartPoints}, 100,30 0,30`"
          fill="url(#gradient)"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: String,
  market: String,
  data: Object
})

const displayValue = computed(() => {
  return props.data?.price?.toFixed(2) || '--'
})

const displayChange = computed(() => {
  if (!props.data?.changePercent) return '0.00%'
  const sign = props.data.changePercent > 0 ? '+' : ''
  return `${sign}${props.data.changePercent.toFixed(2)}%`
})

const goToDetail = () => {
  const codeMap = {
    '上证指数': 'sh000001',
    '深证成指': 'sz399001',
    '创业板指': 'sz399006',
    '恒生指数': 'hkHSI',
    '纳斯达克': 'usIXIC'
  }
  const code = codeMap[props.name]
  if (code) {
    router.push(`/stock/${code}`)
  }
}


  
const trendClass = computed(() => {
  if (!props.data?.changePercent) return 'flat'
  return props.data.changePercent > 0 ? 'up' : 'down'
})

const chartPoints = computed(() => {
  // 生成模拟的迷你图表数据
  const points = []
  const baseValue = props.data?.price || 3000
  const volatility = baseValue * 0.02
  
  for (let i = 0; i <= 10; i++) {
    const x = i * 10
    const randomChange = (Math.random() - 0.5) * volatility
    const y = 15 - (randomChange / volatility) * 10
    points.push(`${x},${Math.max(2, Math.min(28, y))}`)
  }
  
  return points.join(' ')
})
</script>

<style scoped>
.market-index {
  min-width: 140px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.market-index:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
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

.market-label {
  font-size: 11px;
  padding: 2px 6px;
  background: var(--bg-color);
  border-radius: 4px;
  color: var(--text-secondary);
}

.index-value {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}

.index-change {
  font-size: 13px;
  font-weight: 500;
}

.mini-chart {
  margin-top: 8px;
  height: 30px;
}

.chart-svg {
  width: 100%;
  height: 100%;
}

.up {
  color: var(--danger-color);
}

.up .chart-svg {
  color: var(--danger-color);
}

.down {
  color: var(--success-color);
}

.down .chart-svg {
  color: var(--success-color);
}

.flat {
  color: var(--text-secondary);
}

.flat .chart-svg {
  color: var(--text-secondary);
}
</style>
