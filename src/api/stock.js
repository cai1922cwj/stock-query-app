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
  
  // 搜索股票 - 支持更多股票代码
  searchStocks: async (keyword) => {
    // 扩展的股票数据库
    const mockStocks = [
      // A股 - 指数
      { code: 'sh000001', name: '上证指数', market: 'A股' },
      { code: 'sz399001', name: '深证成指', market: 'A股' },
      { code: 'sz399006', name: '创业板指', market: 'A股' },
      { code: 'sh000016', name: '上证50', market: 'A股' },
      { code: 'sh000300', name: '沪深300', market: 'A股' },
      { code: 'sz399005', name: '中小板指', market: 'A股' },
      
      // A股 - 热门股票
      { code: 'sh600519', name: '贵州茅台', market: 'A股' },
      { code: 'sz000858', name: '五粮液', market: 'A股' },
      { code: 'sh601398', name: '工商银行', market: 'A股' },
      { code: 'sz000001', name: '平安银行', market: 'A股' },
      { code: 'sh600036', name: '招商银行', market: 'A股' },
      { code: 'sh601318', name: '中国平安', market: 'A股' },
      { code: 'sh600276', name: '恒瑞医药', market: 'A股' },
      { code: 'sz000333', name: '美的集团', market: 'A股' },
      { code: 'sz000651', name: '格力电器', market: 'A股' },
      { code: 'sh600887', name: '伊利股份', market: 'A股' },
      { code: 'sh601012', name: '隆基绿能', market: 'A股' },
      { code: 'sz002594', name: '比亚迪', market: 'A股' },
      { code: 'sh600309', name: '万华化学', market: 'A股' },
      { code: 'sh603288', name: '海天味业', market: 'A股' },
      { code: 'sz300750', name: '宁德时代', market: 'A股' },
      { code: 'sh688981', name: '中芯国际', market: 'A股' },
      { code: 'sz002415', name: '海康威视', market: 'A股' },
      { code: 'sh600900', name: '长江电力', market: 'A股' },
      { code: 'sh601888', name: '中国中免', market: 'A股' },
      { code: 'sz000568', name: '泸州老窖', market: 'A股' },
      { code: 'sh600809', name: '山西汾酒', market: 'A股' },
      { code: 'sz002142', name: '宁波银行', market: 'A股' },
      { code: 'sh600030', name: '中信证券', market: 'A股' },
      { code: 'sz000002', name: '万科A', market: 'A股' },
      { code: 'sh601166', name: '兴业银行', market: 'A股' },
      { code: 'sz000063', name: '中兴通讯', market: 'A股' },
      { code: 'sh600438', name: '通威股份', market: 'A股' },
      { code: 'sz002230', name: '科大讯飞', market: 'A股' },
      { code: 'sh601668', name: '中国建筑', market: 'A股' },
      { code: 'sz300059', name: '东方财富', market: 'A股' },
      { code: 'sh600028', name: '中国石化', market: 'A股' },
      { code: 'sh601857', name: '中国石油', market: 'A股' },
      { code: 'sh600938', name: '中国海油', market: 'A股' },
      { code: 'sh601728', name: '中国电信', market: 'A股' },
      { code: 'sh600050', name: '中国联通', market: 'A股' },
      { code: 'sh601728', name: '中国移动', market: 'A股' },
      
      // 用户提到的股票
      { code: 'sz002053', name: '云南能投', market: 'A股' },
      { code: 'sh600725', name: '云维股份', market: 'A股' },
      
      // 更多A股
      { code: 'sh600519', name: '贵州茅台', market: 'A股' },
      { code: 'sz000001', name: '平安银行', market: 'A股' },
      { code: 'sh600000', name: '浦发银行', market: 'A股' },
      { code: 'sz000002', name: '万科A', market: 'A股' },
      { code: 'sh600004', name: '白云机场', market: 'A股' },
      { code: 'sz000006', name: '深振业A', market: 'A股' },
      { code: 'sh600007', name: '中国国贸', market: 'A股' },
      { code: 'sz000008', name: '神州高铁', market: 'A股' },
      { code: 'sh600009', name: '上海机场', market: 'A股' },
      { code: 'sz000009', name: '中国宝安', market: 'A股' },
      
      // 港股
      { code: 'hk00700', name: '腾讯控股', market: '港股' },
      { code: 'hk09988', name: '阿里巴巴-SW', market: '港股' },
      { code: 'hk03690', name: '美团-W', market: '港股' },
      { code: 'hk01810', name: '小米集团-W', market: '港股' },
      { code: 'hk09618', name: '京东集团-SW', market: '港股' },
      { code: 'hk01299', name: '友邦保险', market: '港股' },
      { code: 'hk02318', name: '中国平安', market: '港股' },
      { code: 'hk03988', name: '中国银行', market: '港股' },
      { code: 'hk01398', name: '工商银行', market: '港股' },
      { code: 'hk00939', name: '建设银行', market: '港股' },
      { code: 'hk01288', name: '农业银行', market: '港股' },
      { code: 'hk03968', name: '招商银行', market: '港股' },
      { code: 'hk02331', name: '李宁', market: '港股' },
      { code: 'hk02020', name: '安踏体育', market: '港股' },
      { code: 'hk01898', name: '中煤能源', market: '港股' },
      { code: 'hk00883', name: '中国海洋石油', market: '港股' },
      { code: 'hk00386', name: '中国石油化工', market: '港股' },
      { code: 'hk00857', name: '中国石油股份', market: '港股' },
      { code: 'hk00762', name: '中国联通', market: '港股' },
      { code: 'hk00728', name: '中国电信', market: '港股' },
      { code: 'hk00941', name: '中国移动', market: '港股' },
      { code: 'hk01038', name: '长江基建', market: '港股' },
      { code: 'hk00005', name: '汇丰控股', market: '港股' },
      { code: 'hk00001', name: '长和', market: '港股' },
      
      // 美股
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
      { code: 'usXPEV', name: '小鹏汽车', market: '美股' },
      { code: 'usMETA', name: 'Meta', market: '美股' },
      { code: 'usNFLX', name: '奈飞', market: '美股' },
      { code: 'usAMD', name: 'AMD', market: '美股' },
      { code: 'usINTC', name: '英特尔', market: '美股' },
      { code: 'usCRM', name: 'Salesforce', market: '美股' },
      { code: 'usADBE', name: 'Adobe', market: '美股' },
      { code: 'usORCL', name: '甲骨文', market: '美股' },
      { code: 'usIBM', name: 'IBM', market: '美股' },
      { code: 'usUBER', name: '优步', market: '美股' },
      { code: 'usLYFT', name: 'Lyft', market: '美股' },
      { code: 'usABNB', name: '爱彼迎', market: '美股' },
      { code: 'usCOIN', name: 'Coinbase', market: '美股' },
      { code: 'usPLTR', name: 'Palantir', market: '美股' },
      { code: 'usSNOW', name: 'Snowflake', market: '美股' },
      { code: 'usZM', name: 'Zoom', market: '美股' },
      { code: 'usROKU', name: 'Roku', market: '美股' },
      { code: 'usSQ', name: 'Block', market: '美股' },
      { code: 'usPYPL', name: 'PayPal', market: '美股' },
      { code: 'usV', name: 'Visa', market: '美股' },
      { code: 'usMA', name: '万事达', market: '美股' },
      { code: 'usJPM', name: '摩根大通', market: '美股' },
      { code: 'usBAC', name: '美国银行', market: '美股' },
      { code: 'usWFC', name: '富国银行', market: '美股' },
      { code: 'usGS', name: '高盛', market: '美股' },
      { code: 'usMS', name: '摩根士丹利', market: '美股' },
      { code: 'usC', name: '花旗集团', market: '美股' },
      { code: 'usBRK', name: '伯克希尔', market: '美股' },
      { code: 'usJNJ', name: '强生', market: '美股' },
      { code: 'usPFE', name: '辉瑞', market: '美股' },
      { code: 'usMRNA', name: 'Moderna', market: '美股' },
      { code: 'usPFE', name: '辉瑞', market: '美股' },
      { code: 'usUNH', name: '联合健康', market: '美股' },
      { code: 'usABBV', name: '艾伯维', market: '美股' },
      { code: 'usT', name: 'AT&T', market: '美股' },
      { code: 'usVZ', name: 'Verizon', market: '美股' },
      { code: 'usTMUS', name: 'T-Mobile', market: '美股' },
      { code: 'usDIS', name: '迪士尼', market: '美股' },
      { code: 'usCMCSA', name: '康卡斯特', market: '美股' },
      { code: 'usNKE', name: '耐克', market: '美股' },
      { code: 'usSBUX', name: '星巴克', market: '美股' },
      { code: 'usMCD', name: '麦当劳', market: '美股' },
      { code: 'usKO', name: '可口可乐', market: '美股' },
      { code: 'usPEP', name: '百事', market: '美股' },
      { code: 'usWMT', name: '沃尔玛', market: '美股' },
      { code: 'usTGT', name: '塔吉特', market: '美股' },
      { code: 'usHD', name: '家得宝', market: '美股' },
      { code: 'usLOW', name: '劳氏', market: '美股' },
      { code: 'usCOST', name: '好市多', market: '美股' },
      { code: 'usTSLA', name: '特斯拉', market: '美股' },
      { code: 'usF', name: '福特汽车', market: '美股' },
      { code: 'usGM', name: '通用汽车', market: '美股' },
      { code: 'usTM', name: '丰田汽车', market: '美股' },
      { code: 'usHMC', name: '本田汽车', market: '美股' },
      { code: 'usXOM', name: '埃克森美孚', market: '美股' },
      { code: 'usCVX', name: '雪佛龙', market: '美股' },
      { code: 'usCOP', name: '康菲石油', market: '美股' },
      { code: 'usOXY', name: '西方石油', market: '美股' },
      { code: 'usBA', name: '波音', market: '美股' },
      { code: 'usLMT', name: '洛克希德马丁', market: '美股' },
      { code: 'usRTX', name: '雷神技术', market: '美股' },
      { code: 'usGE', name: '通用电气', market: '美股' },
      { code: 'usCAT', name: '卡特彼勒', market: '美股' },
      { code: 'usDE', name: '迪尔', market: '美股' },
      { code: 'usMMM', name: '3M', market: '美股' },
      { code: 'usHON', name: '霍尼韦尔', market: '美股' },
      { code: 'usUPS', name: '联合包裹', market: '美股' },
      { code: 'usFDX', name: '联邦快递', market: '美股' }
    ]
    
    if (!keyword) return []
    
    const lowerKeyword = keyword.toLowerCase()
    const results = mockStocks.filter(stock => 
      stock.name.includes(keyword) || 
      stock.code.toLowerCase().includes(lowerKeyword)
    )
    
    // 如果用户输入的是纯数字，假设是A股代码，自动添加前缀
    if (/^\d{6}$/.test(keyword)) {
      const shCode = 'sh' + keyword
      const szCode = 'sz' + keyword
      const shStock = mockStocks.find(s => s.code === shCode)
      const szStock = mockStocks.find(s => s.code === szCode)
      
      if (shStock && !results.find(r => r.code === shCode)) {
        results.unshift(shStock)
      }
      if (szStock && !results.find(r => r.code === szCode)) {
        results.unshift(szStock)
      }
    }
    
    return results
  },
  
 // 获取市场概览
getMarketOverview: async () => {
  // 使用正确的腾讯API代码格式
  const codes = ['sh000001', 'sz399001', 'sz399006', 'hkHSI', 'usIXIC']
  try {
    const stocks = await stockApi.getRealtimeQuote(codes)
    return {
      shanghai: stocks.find(s => s.code === 'sh000001'),
      shenzhen: stocks.find(s => s.code === 'sz399001'),
      chinext: stocks.find(s => s.code === 'sz399006'),
      hangseng: stocks.find(s => s.code === 'hkHSI'),
      nasdaq: stocks.find(s => s.code === 'usIXIC')
    }
  } catch (error) {
    console.error('获取市场数据失败:', error)
    // 返回模拟数据，确保字段完整
    return {
      shanghai: { code: 'sh000001', name: '上证指数', price: 3050.32, changePercent: 0.52 },
      shenzhen: { code: 'sz399001', name: '深证成指', price: 9876.54, changePercent: -0.23 },
      chinext: { code: 'sz399006', name: '创业板指', price: 1987.65, changePercent: 1.15 },
      hangseng: { code: 'hkHSI', name: '恒生指数', price: 16543.21, changePercent: 0.88 },
      nasdaq: { code: 'usIXIC', name: '纳斯达克', price: 14567.89, changePercent: 1.23 }
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
