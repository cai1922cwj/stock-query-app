import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { stockApi } from '../api/stock'

export const useStockStore = defineStore('stock', () => {
  // State
  const searchHistory = ref(JSON.parse(localStorage.getItem('searchHistory') || '[]'))
  const favoriteStocks = ref(JSON.parse(localStorage.getItem('favoriteStocks') || '[]'))
  const marketData = ref(null)
  const hotStocks = ref([])
  
  // Getters
  const favoriteList = computed(() => favoriteStocks.value)
  
  // Actions
  const addToHistory = (stock) => {
    const exists = searchHistory.value.findIndex(s => s.code === stock.code)
    if (exists > -1) {
      searchHistory.value.splice(exists, 1)
    }
    searchHistory.value.unshift(stock)
    if (searchHistory.value.length > 20) {
      searchHistory.value = searchHistory.value.slice(0, 20)
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
  }
  
  const clearHistory = () => {
    searchHistory.value = []
    localStorage.removeItem('searchHistory')
  }
  
  const toggleFavorite = (stock) => {
    const index = favoriteStocks.value.findIndex(s => s.code === stock.code)
    if (index > -1) {
      favoriteStocks.value.splice(index, 1)
    } else {
      favoriteStocks.value.push(stock)
    }
    localStorage.setItem('favoriteStocks', JSON.stringify(favoriteStocks.value))
  }
  
  const isFavorite = (code) => {
    return favoriteStocks.value.some(s => s.code === code)
  }
  
  const fetchMarketData = async () => {
    try {
      const data = await stockApi.getMarketOverview()
      marketData.value = data
      return data
    } catch (error) {
      console.error('获取市场数据失败:', error)
      throw error
    }
  }
  
  const fetchHotStocks = async () => {
    try {
      const data = await stockApi.getHotStocks()
      hotStocks.value = data
      return data
    } catch (error) {
      console.error('获取热门股票失败:', error)
      throw error
    }
  }
  
  return {
    searchHistory,
    favoriteStocks,
    marketData,
    hotStocks,
    favoriteList,
    addToHistory,
    clearHistory,
    toggleFavorite,
    isFavorite,
    fetchMarketData,
    fetchHotStocks
  }
})
