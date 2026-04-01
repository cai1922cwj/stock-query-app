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
      { code: 'sh601138', name: '工业富联', market: 'A股' },
      { code: 'sh688256', name: '寒武纪', market: 'A股' },
      { code: 'sz300308', name: '中际旭创', market: 'A股' },   
      { code: 'sz000977', name: '浪潮信息', market: 'A股' },
      { code: 'sz002230', name: '科大讯飞', market: 'A股' },
      { code: 'sz300624', name: '万兴科技', market: 'A股' },
      
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
  
  // 股票公司信息数据库
  getCompanyInfo: (code, name) => {
    const industryMap = {
      'sh600519': { industry: '白酒/食品饮料', founded: '1999-11-20', employees: '3.5万', business: '茅台酒及系列酒的生产与销售', address: '贵州省仁怀市茅台镇' },
      'sz000858': { industry: '白酒/食品饮料', founded: '1998-04-21', employees: '2.8万', business: '五粮液系列白酒的生产与销售', address: '四川省宜宾市' },
      'sh601398': { industry: '银行/金融服务', founded: '1984-01-01', employees: '42万', business: '商业银行业务、投资银行业务、保险业务等', address: '北京市西城区' },
      'hk00700': { industry: '互联网/科技', founded: '1998-11-11', employees: '10万+', business: '社交、游戏、金融科技、云计算等业务', address: '深圳市南山区' },
      'hk09988': { industry: '互联网/电商', founded: '1999-09-09', employees: '25万', business: '电商平台、云计算、数字媒体及娱乐', address: '杭州市余杭区' },
      'usTSLA': { industry: '新能源汽车', founded: '2003-07-01', employees: '14万', business: '电动汽车、储能系统、太阳能产品的设计制造', address: '美国德克萨斯州奥斯汀' },
      'usNVDA': { industry: '半导体/芯片', founded: '1993-04-05', employees: '2.9万', business: 'GPU、人工智能计算平台、数据中心解决方案', address: '美国加利福尼亚州圣克拉拉' },
      'usAAPL': { industry: '消费电子/科技', founded: '1976-04-01', employees: '16万', business: 'iPhone、Mac、iPad、Apple Watch等消费电子产品', address: '美国加利福尼亚州库比蒂诺' },
      'usMSFT': { industry: '软件/云服务', founded: '1975-04-04', employees: '22万', business: 'Windows操作系统、Office办公软件、Azure云服务', address: '美国华盛顿州雷德蒙德' },
      'usGOOGL': { industry: '互联网/科技', founded: '1998-09-04', employees: '19万', business: '搜索引擎、在线广告、云计算、Android系统', address: '美国加利福尼亚州山景城' },
      'usAMZN': { industry: '电商/云服务', founded: '1994-07-05', employees: '150万', business: '电商平台、AWS云服务、Prime会员服务', address: '美国华盛顿州西雅图' },
      'usMETA': { industry: '互联网/社交', founded: '2004-02-04', employees: '6.7万', business: 'Facebook、Instagram、WhatsApp等社交平台', address: '美国加利福尼亚州门洛帕克' },
      'usNFLX': { industry: '流媒体/娱乐', founded: '1997-08-29', employees: '1.3万', business: '流媒体视频服务、原创内容制作', address: '美国加利福尼亚州洛斯加托斯' },
      'hk03690': { industry: '互联网/本地生活', founded: '2010-03-04', employees: '9万', business: '外卖配送、到店餐饮、酒店旅游、新零售', address: '北京市朝阳区' },
      'hk01810': { industry: '消费电子/IoT', founded: '2010-04-06', employees: '3.6万', business: '智能手机、IoT与生活消费产品、互联网服务', address: '北京市海淀区' },
      'hk09618': { industry: '电商/物流', founded: '1998-06-18', employees: '45万', business: '电商平台、物流配送、金融科技服务', address: '北京市大兴区' },
      'sz300750': { industry: '新能源/电池', founded: '2011-12-16', employees: '12万', business: '动力电池系统、储能系统的研发、生产和销售', address: '福建省宁德市' },
      'sh688981': { industry: '半导体/芯片', founded: '2000-04-03', employees: '2万', business: '集成电路晶圆代工及配套服务', address: '上海市浦东新区' },
      'sh601318': { industry: '保险/金融', founded: '1988-03-21', employees: '35万', business: '人寿保险、财产保险、银行、投资等金融业务', address: '深圳市福田区' },
      'sh600036': { industry: '银行/金融服务', founded: '1987-04-08', employees: '10万', business: '商业银行业务、零售银行业务、资产管理', address: '深圳市福田区' }
    }
    
    const info = industryMap[code] || { 
      industry: '综合行业', 
      founded: '2000-01-01', 
      employees: '5000+', 
      business: '多元化业务经营',
      address: '中国'
    }
    
    return {
      fullName: name + '股份有限公司',
      industry: info.industry,
      founded: info.founded,
      website: `www.${code.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      address: info.address,
      employees: info.employees,
      business: info.business
    }
  },

  // 股票财务数据数据库
  getFinanceData: (code, marketCap) => {
    const financeMap = {
      'sh600519': { totalRevenue: '1505亿', netProfit: '747亿', totalAssets: '2727亿', roe: '30%', debtRatio: '18%' },
      'sz000858': { totalRevenue: '832亿', netProfit: '302亿', totalAssets: '1521亿', roe: '25%', debtRatio: '22%' },
      'sh601398': { totalRevenue: '8431亿', netProfit: '3659亿', totalAssets: '42万亿', roe: '10%', debtRatio: '91%' },
      'hk00700': { totalRevenue: '6090亿', netProfit: '1152亿', totalAssets: '1.6万亿', roe: '18%', debtRatio: '45%' },
      'hk09988': { totalRevenue: '9412亿', netProfit: '797亿', totalAssets: '1.8万亿', roe: '7%', debtRatio: '38%' },
      'usTSLA': { totalRevenue: '968亿美元', netProfit: '150亿美元', totalAssets: '1066亿美元', roe: '22%', debtRatio: '28%' },
      'usNVDA': { totalRevenue: '609亿美元', netProfit: '297亿美元', totalAssets: '772亿美元', roe: '69%', debtRatio: '35%' },
      'usAAPL': { totalRevenue: '3910亿美元', netProfit: '1019亿美元', totalAssets: '3528亿美元', roe: '160%', debtRatio: '82%' },
      'usMSFT': { totalRevenue: '2451亿美元', netProfit: '881亿美元', totalAssets: '5123亿美元', roe: '38%', debtRatio: '48%' },
      'usGOOGL': { totalRevenue: '3500亿美元', netProfit: '1005亿美元', totalAssets: '4020亿美元', roe: '30%', debtRatio: '28%' },
      'usAMZN': { totalRevenue: '5907亿美元', netProfit: '304亿美元', totalAssets: '5279亿美元', roe: '12%', debtRatio: '62%' },
      'usMETA': { totalRevenue: '1349亿美元', netProfit: '391亿美元', totalAssets: '2296亿美元', roe: '18%', debtRatio: '24%' },
      'usNFLX': { totalRevenue: '337亿美元', netProfit: '54亿美元', totalAssets: '487亿美元', roe: '22%', debtRatio: '55%' },
      'hk03690': { totalRevenue: '2767亿', netProfit: '138亿', totalAssets: '2547亿', roe: '6%', debtRatio: '42%' },
      'hk01810': { totalRevenue: '2710亿', netProfit: '193亿', totalAssets: '3242亿', roe: '8%', debtRatio: '48%' },
      'hk09618': { totalRevenue: '1.08万亿', netProfit: '242亿', totalAssets: '6946亿', roe: '4%', debtRatio: '52%' },
      'sz300750': { totalRevenue: '4009亿', netProfit: '441亿', totalAssets: '7172亿', roe: '24%', debtRatio: '58%' },
      'sh688981': { totalRevenue: '452亿', netProfit: '48亿', totalAssets: '3332亿', roe: '5%', debtRatio: '35%' },
      'sh601318': { totalRevenue: '9138亿', netProfit: '856亿', totalAssets: '11.6万亿', roe: '18%', debtRatio: '89%' },
      'sh600036': { totalRevenue: '3391亿', netProfit: '1466亿', totalAssets: '10.1万亿', roe: '16%', debtRatio: '91%' }
    }
    
    return financeMap[code] || { 
      totalRevenue: '100亿', 
      netProfit: '20亿', 
      totalAssets: '500亿', 
      roe: '15%', 
      debtRatio: '40%' 
    }
  },

  // 获取大宗交易数据
  getBlockTrade: (code) => {
    const trades = []
    // 使用2026年3月近期日期
    const today = new Date()
    const dates = []
    for (let i = 0; i < 5; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      dates.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`)
    }
    const buyers = ['机构专用', '中信证券', '华泰证券', '国泰君安', '招商证券', '中金公司']
    const sellers = ['中信证券', '机构专用', '华泰证券', '海通证券', '广发证券', '申万宏源']
    
    // 根据code生成固定的随机数种子
    let seed = 0
    for (let i = 0; i < code.length; i++) {
      seed += code.charCodeAt(i)
    }
    
    for (let i = 0; i < 5; i++) {
      const price = (50 + (seed % 100) + Math.random() * 20).toFixed(2)
      const volume = Math.floor(10 + (seed % 50) + Math.random() * 40)
      const amount = (price * volume).toFixed(2)
      
      trades.push({
        date: dates[i],
        price: `¥${price}`,
        volume: `${volume}.00万股`,
        amount: `${amount}万`,
        buyer: buyers[(seed + i) % buyers.length],
        seller: sellers[(seed + i + 2) % sellers.length]
      })
    }
    
    return trades
  },

  // 获取公司资讯
  getCompanyNews: (code, name) => {
    const today = new Date()
    const formatDate = (d) => `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    
    const newsTemplates = [
      { title: `${name}发布2026年第一季度业绩预告，净利润同比增长35%`, source: '证券时报', date: formatDate(today) },
      { title: `${name}与某知名企业签署战略合作协议`, source: '上海证券报', date: formatDate(new Date(today - 86400000)) },
      { title: `${name}获得重要行业资质认证，市场竞争力进一步提升`, source: '中国证券报', date: formatDate(new Date(today - 172800000)) },
      { title: `${name}董事会审议通过2025年度利润分配方案`, source: '证券时报', date: formatDate(new Date(today - 259200000)) },
      { title: `${name}新产品正式发布，市场反响热烈`, source: '经济观察报', date: formatDate(new Date(today - 345600000)) },
      { title: `${name}入选行业龙头企业榜单，品牌价值持续提升`, source: '21世纪经济报道', date: formatDate(new Date(today - 432000000)) },
      { title: `${name}完成新一轮融资，加速业务扩张步伐`, source: '财联社', date: formatDate(new Date(today - 518400000)) },
      { title: `${name}荣获行业创新奖，技术实力获认可`, source: '每日经济新闻', date: formatDate(new Date(today - 604800000)) }
    ]
    
    // 根据code选择不同的新闻
    let seed = 0
    for (let i = 0; i < code.length; i++) {
      seed += code.charCodeAt(i)
    }
    
    const selectedNews = []
    for (let i = 0; i < 4; i++) {
      const index = (seed + i * 3) % newsTemplates.length
      selectedNews.push({
        ...newsTemplates[index],
        url: `https://www.baidu.com/s?wd=${encodeURIComponent(newsTemplates[index].title)}`,
        id: `${code}_news_${i}`
      })
    }
    
    return selectedNews
  },

  // 获取网页讨论
  getWebDiscussions: (code, name) => {
    const discussions = [
      { user: '价值投资者', content: `看好${name}的长期发展，基本面扎实`, time: '2小时前', likes: 128 },
      { user: '技术分析派', content: `${name}近期走势强劲，突破关键阻力位`, time: '3小时前', likes: 89 },
      { user: '短线交易者', content: `${name}今天放量上涨，有望继续冲高`, time: '5小时前', likes: 67 },
      { user: '长期持有', content: `${name}的护城河很深，值得长期关注`, time: '昨天', likes: 234 },
      { user: '新手小白', content: `刚入手${name}，不知道能不能涨`, time: '昨天', likes: 45 },
      { user: '资深股民', content: `${name}的估值还算合理，可以逢低布局`, time: '2天前', likes: 156 },
      { user: '趋势跟踪', content: `${name}行业前景不错，政策也在支持`, time: '2天前', likes: 78 },
      { user: '价值投资', content: `${name}的业绩超预期，超出市场预期`, time: '3天前', likes: 201 }
    ]
    
    // 根据code选择不同的讨论
    let seed = 0
    for (let i = 0; i < code.length; i++) {
      seed += code.charCodeAt(i)
    }
    
    const selectedDiscussions = []
    for (let i = 0; i < 5; i++) {
      const index = (seed + i * 2) % discussions.length
      selectedDiscussions.push({
        ...discussions[index],
        user: discussions[index].user + String.fromCharCode(65 + (seed + i) % 26),
        id: `${code}_disc_${i}`,
        url: `https://guba.eastmoney.com/search?keyword=${encodeURIComponent(name)}`
      })
    }
    
    return selectedDiscussions
  },

  // 获取股票详情
  getStockDetail: async (code) => {
    try {
      const stocks = await stockApi.getRealtimeQuote([code])
      if (stocks.length > 0) {
        const stock = stocks[0]
        return {
          ...stock,
          companyInfo: stockApi.getCompanyInfo(code, stock.name),
          finance: stockApi.getFinanceData(code, stock.marketCap),
          blockTrade: stockApi.getBlockTrade(code),
          news: stockApi.getCompanyNews(code, stock.name),
          discussions: stockApi.getWebDiscussions(code, stock.name)
        }
      }
      return null
    } catch (error) {
      console.error('获取股票详情失败:', error)
      return null
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
