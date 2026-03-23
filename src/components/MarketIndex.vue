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

const goToDetail = () => {
  // 根据市场类型跳转到对应指数详情
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
  background: var(--card-bg);
  border-radius: 12px;
  padding: 16px;
  min-width: 140px;
  cursor: pointer;
  transition: transform 0.2s;
}

.market-index:active {
  transform: scale(0.98);
}

.index-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.index-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.index-tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--bg-color);
  color: var(--text-secondary);
}

.index-price {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.index-change {
  font-size: 14px;
  font-weight: 500;
}
</style>
