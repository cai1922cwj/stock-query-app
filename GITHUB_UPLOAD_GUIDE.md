# GitHub 上传和部署指南

## 1. 创建GitHub仓库

1. 访问 https://github.com/new
2. 输入仓库名称，例如 `stock-query-app`
3. 选择公开(Public)或私有(Private)
4. 不要勾选 "Initialize this repository with a README"
5. 点击 "Create repository"

## 2. 上传代码到GitHub

在本地项目目录中执行以下命令：

```bash
# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit: Stock Query App"

# 添加远程仓库（替换 YOUR_USERNAME 为你的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/stock-query-app.git

# 推送到GitHub
git push -u origin main
```

## 3. 启用GitHub Pages自动部署

1. 进入GitHub仓库页面
2. 点击 "Settings" 标签
3. 左侧菜单选择 "Pages"
4. 在 "Build and deployment" 部分：
   - Source: 选择 "GitHub Actions"
5. 每次推送到main分支时，GitHub Actions会自动构建并部署

## 4. 访问部署的网站

部署完成后，访问地址为：
```
https://YOUR_USERNAME.github.io/stock-query-app/
```

## 5. 手机访问

1. 在手机浏览器中打开上述网址
2. 可以添加到手机主屏幕作为APP使用：
   - iOS Safari: 点击分享按钮 → "添加到主屏幕"
   - Android Chrome: 菜单 → "添加到主屏幕"

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
stock-query-app/
├── .github/workflows/    # GitHub Actions配置
├── public/               # 静态资源
├── src/
│   ├── api/             # API接口
│   ├── components/      # 组件
│   ├── router/          # 路由配置
│   ├── stores/          # Pinia状态管理
│   ├── utils/           # 工具函数
│   ├── views/           # 页面视图
│   ├── App.vue          # 根组件
│   ├── main.js          # 入口文件
│   └── style.css        # 全局样式
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## 功能说明

- **首页**: 市场指数、自选股、热门股票
- **搜索**: 股票搜索、搜索历史、热门搜索
- **市场**: 各市场指数、涨幅榜、跌幅榜、成交量榜
- **详情**: 实时行情、分时/K线图、公司概况、财务数据
