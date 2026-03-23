import axios from 'axios'

// 使用腾讯股票API（免费、实时）
const BASE_URL = 'https://qt.gtimg.cn'

// 创建axios实例
const request = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 解析股票数据
const parseStockData = (data) => {
  const stocks = []
  const lines = data.split(';').filter(line => line.trim())
  
  for (const line of lines) {
    const match = line.match(/v_(\w+)="([^"]+)"/)
    if (match) {
      const code = match[1]
      const fields = match[2].split('~')
      
      if (fields.length > 40) {
        const stock = {
          code: code,
          name: fields[1],
          price: parseFloat(fields[3]),
          preClose: parseFloat(fields[4]),
          open: parseFloat(fields[5]),
          high: parseFloat(fields[33]),
          low: parseFloat(fields[34]),
          volume: parseInt(fields[36]),
          amount: parseFloat(fields[37]),
          change: parseFloat(fields[32]),
          changePercent: parseFloat(fields[32]) / parseFloat(fields[4]) * 100,
          pe: fields[39],
          pb: fields[46],
          marketCap: fields[44],
          turnover: fields[38],
          updateTime: fields[30]
        }
        stocks.push(stock)
      }
    }
  }
  
  return stocks
}

export const stockApi = {
  // 获取实时行情
  getRealtimeQuote: async (codes) => {
    const codeStr = Array.isArray(codes) ? codes.join(',') : codes
    const url = `${BASE_URL}/q=${codeStr}`
    
    try {
      const response = await request.get(url, {
        responseType: 'text',
        transformResponse: [(data) => data]
      })
      return parseStockData(response.data)
    } catch (error) {
      console.error('获取行情失败:', error)
      throw error
    }
  },
  
  // 搜索股票
  searchStocks: async (keyword) => {
    // 模拟搜索结果（实际项目中可以接入真实的搜索API）
    const mockStocks = [
      { code: 'sh000001', name: '上证指数', market: 'A股' },
      { code: 'sz399001', name: '深证成指', market: 'A股' },
      { code: 'sh600519', name: '贵州茅台', market: 'A股' },
      { code: 'sz000858', name: '五粮液', market: 'A股' },
      { code: 'sh601398', name: '工商银行', market: 'A股' },
      { code: 'sz000001', name: '平安银行', market: 'A股' },
      { code: 'hk00700', name: '腾讯控股', market: '港股' },
      { code: 'hk09988', name: '阿里巴巴-SW', market: '港股' },
      { code: 'hk03690', name: '美团-W', market: '港股' },
      { code: 'usAAPL', name: '苹果', market: '美股' },
      { code: 'usTSLA', name: '特斯拉', market: '美股' },
      { code: 'usNVDA', name: '英伟达', market: '美股' },
      { code: 'usMSFT', name: '微软', market: '美股' },
      { code: 'usGOOGL', name: '谷歌', market: '美股' },
      { code: 'usAMZN', name: '亚马逊', market: '美股' },
      { code: 'usBABA', name: '阿里巴巴', market: '美股' },
      { code: 'usJD', name: '京东', market: '美股' },
      { code: 'usNIO', name: '蔚来', market: '美股' },
      { code: 'usLI', name: '理想汽车', market: '美股' },
      { code: 'usXPEV', name: '小鹏汽车', market: '美股' }
    ]
    
    if (!keyword) return []
    
    const lowerKeyword = keyword.toLowerCase()
    return mockStocks.filter(stock => 
      stock.name.includes(keyword) || 
      stock.code.toLowerCase().includes(lowerKeyword)
    )
  },
  
  // 获取市场概览
  getMarketOverview: async () => {
    const codes = ['sh000001', 'sz399001', 'sz399006', 'hk00700', 'usAAPL']
    try {
      const stocks = await stockApi.getRealtimeQuote(codes)
      return {
        shanghai: stocks.find(s => s.code === 'sh000001'),
        shenzhen: stocks.find(s => s.code === 'sz399001'),
        chinext: stocks.find(s => s.code === 'sz399006'),
        hangseng: stocks.find(s => s.code === 'hk00700'),
        nasdaq: stocks.find(s => s.code === 'usAAPL')
      }
    } catch (error) {
      // 返回模拟数据
      return {
        shanghai: { name: '上证指数', price: 3050.32, changePercent: 0.52 },
        shenzhen: { name: '深证成指', price: 9876.54, changePercent: -0.23 },
        chinext: { name: '创业板指', price: 1987.65, changePercent: 1.15 },
        hangseng: { name: '恒生指数', price: 16543.21, changePercent: 0.88 },
        nasdaq: { name: '纳斯达克', price: 14567.89, changePercent: 1.23 }
      }
    }
  },
  
  // 获取热门股票
  getHotStocks: async () => {
    const codes = ['sh600519', 'sz000858', 'sh601398', 'hk00700', 'hk09988', 'usTSLA', 'usNVDA']
    try {
      return await stockApi.getRealtimeQuote(codes)
    } catch (error) {
      return [
        { code: 'sh600519', name: '贵州茅台', price: 1688.88, changePercent: 1.25 },
        { code: 'sz000858', name: '五粮液', price: 156.78, changePercent: -0.85 },
        { code: 'sh601398', name: '工商银行', price: 4.56, changePercent: 0.22 },
        { code: 'hk00700', name: '腾讯控股', price: 298.4, changePercent: 2.15 },
        { code: 'hk09988', name: '阿里巴巴-SW', price: 78.9, changePercent: -1.25 },
        { code: 'usTSLA', name: '特斯拉', price: 248.5, changePercent: 3.42 },
        { code: 'usNVDA', name: '英伟达', price: 875.28, changePercent: 4.12 }
      ]
    }
  },
  
  // 获取股票详情
  getStockDetail: async (code) => {
    try {
      const stocks = await stockApi.getRealtimeQuote([code])
      if (stocks.length > 0) {
        return {
          ...stocks[0],
          // 模拟公司概况数据
          companyInfo: {
            fullName: stocks[0].name + '股份有限公司',
            industry: '科技/金融/消费',
            founded: '2000-01-01',
            website: 'www.example.com',
            address: '中国北京市',
            employees: '10000+',
            business: '主营业务描述...'
          },
          // 模拟财务数据
          finance: {
            totalRevenue: '1000亿',
            netProfit: '200亿',
            totalAssets: '5000亿',
            roe: '15%',
            debtRatio: '40%'
          }
        }
      }
      return null
    } catch (error) {
      // 返回模拟数据
      return {
        code: code,
        name: '模拟股票',
        price: 100.00,
        preClose: 98.50,
        open: 99.00,
        high: 102.00,
        low: 98.00,
        volume: 1000000,
        amount: 100000000,
        change: 1.50,
        changePercent: 1.52,
        pe: '20',
        pb: '3',
        marketCap: '1000亿',
        companyInfo: {
          fullName: '模拟股份有限公司',
          industry: '科技',
          founded: '2010-01-01',
          website: 'www.example.com',
          address: '中国',
          employees: '5000',
          business: '主营业务'
        },
        finance: {
          totalRevenue: '100亿',
          netProfit: '20亿',
          totalAssets: '500亿',
          roe: '15%',
          debtRatio: '35%'
        }
      }
    }
  },
  
  // 获取分时数据
  getIntraday: async (code) => {
    // 返回模拟分时数据
    const data = []
    let price = 100
    for (let i = 0; i < 240; i++) {
      price = price + (Math.random() - 0.5) * 2
      data.push({
        time: `${9 + Math.floor(i / 60)}:${String(i % 60).padStart(2, '0')}`,
        price: price,
        volume: Math.floor(Math.random() * 10000)
      })
    }
    return data
  },
  
  // 获取K线数据
  getKline: async (code, period = 'day') => {
    // 返回模拟K线数据
    const data = []
    let price = 100
    const days = period === 'day' ? 60 : period === 'week' ? 52 : 24
    
    for (let i = 0; i < days; i++) {
      const open = price
      const close = price + (Math.random() - 0.5) * 10
      const high = Math.max(open, close) + Math.random() * 5
      const low = Math.min(open, close) - Math.random() * 5
      
      data.push({
        date: `2024-${String(Math.floor(i / 30) + 1).padStart(2, '0')}-${String((i % 30) + 1).padStart(2, '0')}`,
        open: open,
        close: close,
        high: high,
        low: low,
        volume: Math.floor(Math.random() * 1000000)
      })
      
      price = close
    }
    return data
  }
}
