# 网站不显示问题排查指南

## 你的地址
https://cai1922cwj.github.io/stock-query-app/

## 常见原因及解决方法

### 1. 检查 GitHub Actions 是否成功运行

**步骤：**
1. 访问 https://github.com/cai1922cwj/stock-query-app/actions
2. 查看最新的工作流运行记录
3. 确认显示 ✅ 绿色对勾（成功）

**如果显示 ❌ 红色叉号：**
- 点击进入失败的运行记录
- 查看错误日志
- 常见错误：
  - `npm ci` 失败 → 需要上传 `package-lock.json`
  - 构建失败 → 检查代码语法错误

### 2. 检查是否正确上传了 package-lock.json

**必须上传的文件：**
```bash
git add package-lock.json
git commit -m "Add package-lock.json"
git push origin main
```

**如果没有 package-lock.json，创建一个：**
```bash
npm install
# 这会生成 package-lock.json
git add package-lock.json
git commit -m "Add package-lock.json"
git push origin main
```

### 3. 检查仓库设置

**确认 Pages 设置：**
1. 访问 https://github.com/cai1922cwj/stock-query-app/settings/pages
2. 确认显示：
   - Source: **GitHub Actions**
   - 绿色提示框：Your site is live at ...

**如果没有绿色提示框：**
- 说明部署还未成功
- 等待几分钟或重新触发部署

### 4. 检查 index.html 是否在 dist 目录

**本地测试构建：**
```bash
npm install
npm run build
ls dist/
# 应该看到：
# - index.html
# - assets/
```

### 5. 强制刷新浏览器

**清除缓存：**
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`
- 或按 `F12` 打开开发者工具，右键刷新按钮选择"清空缓存并硬性重新加载"

---

## 快速修复步骤

### 步骤 1: 确保所有文件已上传

```bash
cd c:\csaapp

# 检查 git 状态
git status

# 添加所有更改
git add .

# 提交
git commit -m "Fix GitHub Pages deployment"

# 推送
git push origin main
```

### 步骤 2: 等待部署完成

1. 访问 https://github.com/cai1922cwj/stock-query-app/actions
2. 等待最新的运行显示 ✅ 绿色对勾
3. 通常需要 1-3 分钟

### 步骤 3: 验证部署

1. 访问 https://cai1922cwj.github.io/stock-query-app/
2. 按 `Ctrl + Shift + R` 强制刷新
3. 按 `F12` 打开开发者工具，检查 Console 是否有错误

---

## 如果还是不行

### 检查 1: 确认仓库是 Public

1. 访问 https://github.com/cai1922cwj/stock-query-app
2. 确认右上角显示 Public（不是 Private）

### 检查 2: 手动检查部署的文件

1. 访问 https://github.com/cai1922cwj/stock-query-app/deployments
2. 点击最新的部署
3. 查看部署的文件列表

### 检查 3: 查看浏览器控制台错误

1. 访问你的网站
2. 按 `F12` 打开开发者工具
3. 切换到 Console 标签
4. 告诉我显示什么错误（红色文字）

---

## 紧急备用方案

如果 GitHub Actions 一直失败，可以使用手动部署：

### 方案 A: 使用 gh-pages 分支

```bash
# 安装 gh-pages
npm install --save-dev gh-pages

# 在 package.json 中添加：
"scripts": {
  "deploy": "gh-pages -d dist"
}

# 构建并部署
npm run build
npm run deploy
```

### 方案 B: 上传到 Netlify（更简单）

1. 访问 https://www.netlify.com/
2. 拖放 dist 文件夹即可部署

---

## 请提供以下信息以便进一步帮助

1. GitHub Actions 运行状态截图（成功/失败）
2. 浏览器控制台错误截图（F12 → Console）
3. 运行 `git status` 的输出结果
