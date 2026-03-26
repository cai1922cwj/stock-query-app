<template>
  <div class="stock-card" @click="goToDetail">
    <div class="stock-info">
      <div class="stock-name">{{ stock.name }}</div>
      <div class="stock-code">{{ stock.code }}</div>
    </div>
    <div class="stock-price" :class="priceClass">
      <div class="current-price">{{ formatPrice(stock.price) }}</div>
      <div class="price-change">{{ formatChange(stock.changePercent) }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  stock: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const priceClass = computed(() => {
  if (!props.stock.changePercent) return 'flat'
  return props.stock.changePercent > 0 ? 'up' : 'down'
})

const formatPrice = (price) => {
  if (!price) return '--'
  return price.toFixed(2)
}

const formatChange = (change) => {
  if (!change) return '0.00%'
  const sign = change > 0 ? '+' : ''
  return `${sign}${change.toFixed(2)}%`
}

const goToDetail = () => {
  router.push(`/stock/${props.stock.code}`)
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
  font-size: 13px;
  color: var(--text-secondary);
}

.stock-price {
  text-align: right;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}

.price-change {
  font-size: 13px;
}

.up {
  color: var(--danger-color);
}

.down {
  color: var(--success-color);
}

.flat {
  color: var(--text-secondary);
}
</style>
