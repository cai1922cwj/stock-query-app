<template>
  <div class="stock-card" @click="goToDetail">
    <div class="stock-info">
      <div class="stock-name">{{ stock.name }}</div>
      <div class="stock-code">{{ formatCode(stock.code) }}</div>
    </div>
    <div class="stock-price">
      <div class="price" :class="getPriceClass(stock.changePercent)">
        {{ stock.price?.toFixed(2) || '--' }}
      </div>
      <div class="change" :class="getPriceClass(stock.changePercent)">
        {{ formatChange(stock.changePercent) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  stock: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const goToDetail = () => {
  router.push(`/stock/${props.stock.code}`)
}

const formatCode = (code) => {
  if (!code) return '--'
  // 移除前缀，只显示数字代码
  return code.replace(/^(sh|sz|hk|us)/, '').toUpperCase()
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
.stock-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
}

.stock-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.stock-card:active {
  transform: scale(0.98);
}

.stock-info {
  flex: 1;
}

.stock-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.stock-code {
  font-size: 12px;
  color: var(--text-secondary);
}

.stock-price {
  text-align: right;
}

.price {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.change {
  font-size: 13px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.05);
}
</style>
<template>
  <div class="stock-card" @click="goToDetail">
    <div class="stock-info">
      <div class="stock-name">{{ stock.name }}</div>
      <div class="stock-code">{{ formatCode(stock.code) }}</div>
    </div>
    <div class="stock-price">
      <div class="price" :class="getPriceClass(stock.changePercent)">
        {{ stock.price?.toFixed(2) || '--' }}
      </div>
      <div class="change" :class="getPriceClass(stock.changePercent)">
        {{ formatChange(stock.changePercent) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  stock: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const goToDetail = () => {
  router.push(`/stock/${props.stock.code}`)
}

const formatCode = (code) => {
  if (!code) return '--'
  return code.replace(/^(sh|sz|hk|us)/, '').toUpperCase()
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
.stock-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
}

.stock-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.stock-card:active {
  transform: scale(0.98);
}

.stock-info {
  flex: 1;
}

.stock-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.stock-code {
  font-size: 12px;
  color: var(--text-secondary);
}

.stock-price {
  text-align: right;
}

.price {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.change {
  font-size: 13px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.05);
}
</style>
