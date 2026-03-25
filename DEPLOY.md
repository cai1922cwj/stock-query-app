# 部署指南

## 更新内容

本次更新包含以下改进：

1. ✅ **彩色渐变背景** - 添加紫色渐变背景，提升视觉效果
2. ✅ **市场指数曲线** - 在市场指数卡片中添加迷你趋势图
3. ✅ **扩展股票搜索** - 支持更多股票代码（包括002053、600725等）
4. ✅ **增加热门搜索** - 从8只增加到24只股票
5. ✅ **美化UI** - 添加毛玻璃效果、阴影、动画等

## 部署步骤

### 步骤 1: 上传所有更改到 GitHub

在本地项目目录执行：

```bash
cd c:\csaapp

# 添加所有更改
git add .

# 提交更改
git commit -m "Update UI: gradient background, stock search, mini charts"

# 推送到 GitHub
git push origin main
```

### 步骤 2: 等待自动部署

1. 访问 https://github.com/cai1922cwj/stock-query-app/actions
2. 等待 **Deploy to GitHub Pages** 工作流完成（绿色 ✅）
3. 通常需要 1-3 分钟

### 步骤 3: 验证更新

1. 访问 https://cai1922cwj.github.io/stock-query-app/
2. 强制刷新页面（Ctrl + Shift + R）
3. 检查以下更新：
   - [ ] 背景是否为紫色渐变
   - [ ] 市场指数是否显示曲线图
   - [ ] 搜索是否能找到002053、600725等股票
   - [ ] 热门搜索是否显示24只股票

## 如果部署失败

### 检查 GitHub Actions 状态

1. 访问 https://github.com/cai1922cwj/stock-query-app/actions
2. 查看最新的运行记录
3. 如果显示 ❌ 红色，点击查看错误日志

### 常见错误及解决

**错误 1: `npm install` 失败**
```bash
# 本地重新安装依赖
npm install
# 然后重新提交 package-lock.json
git add package-lock.json
git commit -m "Update package-lock.json"
git push origin main
```

**错误 2: 构建失败**
- 检查代码语法错误
- 确保所有文件已正确保存

**错误 3: 页面没有更新**
```bash
# 强制刷新浏览器缓存
# Windows: Ctrl + Shift + R
# Mac: Cmd + Shift + R
```

## 手动部署（备用方案）

如果 GitHub Actions 一直失败，可以使用 Netlify：

1. 访问 https://www.netlify.com/
2. 注册/登录账号
3. 点击 "Add new site" → "Deploy manually"
4. 拖放 `c:\csaapp\dist` 文件夹（需要先运行 `npm run build` 生成）

## 验证清单

- [ ] 所有文件已上传到 GitHub
- [ ] GitHub Actions 运行成功
- [ ] 网站能正常访问
- [ ] 背景显示紫色渐变
- [ ] 市场指数显示数据和曲线
- [ ] 搜索功能正常工作
- [ ] 热门搜索显示24只股票
