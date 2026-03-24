# 修复 GitHub Actions 不显示的问题

## 问题原因

图17显示的还是 `pages build and deployment`，说明 GitHub 没有检测到我们自定义的 `deploy.yml` 工作流文件。

## 解决步骤

### 步骤 1: 确认文件已上传到 GitHub

1. 访问：https://github.com/cai1922cwj/stock-query-app/tree/main/.github/workflows
2. 确认能看到 `deploy.yml` 文件

**如果看不到文件**，说明没有上传成功，需要上传。

### 步骤 2: 在 GitHub 网页上手动创建工作流文件

如果文件不存在，按以下步骤创建：

1. 访问：https://github.com/cai1922cwj/stock-query-app
2. 点击 **"Add file"** → **"Create new file"**
3. 文件名输入：`.github/workflows/deploy.yml`
4. 复制以下内容粘贴：

```yaml
# 简单的 GitHub Pages 部署工作流
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
          
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

5. 点击 **"Commit new file"**
6. 确认提交到 **main** 分支

### 步骤 3: 验证 Actions 已启用

1. 访问：https://github.com/cai1922cwj/stock-query-app/actions
2. 现在应该看到两个工作流：
   - **Deploy to GitHub Pages** （我们自定义的）
   - pages build and deployment （GitHub 默认的）

### 步骤 4: 手动触发工作流

1. 在 Actions 页面，点击 **"Deploy to GitHub Pages"**
2. 点击右侧的 **"Run workflow"** 下拉按钮
3. 选择 **Branch: main**
4. 点击绿色的 **"Run workflow"** 按钮

### 步骤 5: 等待部署完成

1. 刷新 Actions 页面
2. 看到黄色的运行状态点
3. 等待所有步骤变成 ✅ 绿色
4. 访问网站查看效果

---

## 备用方案：使用 GitHub Desktop 上传

如果你本地有 GitHub Desktop：

1. 打开 GitHub Desktop
2. 选择 `stock-query-app` 仓库
3. 确认能看到 `.github/workflows/deploy.yml` 文件的更改
4. 填写提交信息："Add GitHub Actions workflow"
5. 点击 **Commit to main**
6. 点击 **Push origin**

---

## 备用方案：使用 VS Code 上传

如果你使用 VS Code：

1. 打开项目文件夹 `c:\csaapp`
2. 点击左侧源代码管理图标（分支图标）
3. 看到更改列表，点击 **+** 暂存所有更改
4. 输入提交信息："Add GitHub Actions workflow"
5. 点击 **提交** 按钮
6. 点击 **推送** 按钮

---

## 关键检查点

- [ ] GitHub 仓库中有 `.github/workflows/deploy.yml` 文件
- [ ] Actions 页面显示 "Deploy to GitHub Pages" 工作流
- [ ] 能手动触发 "Deploy to GitHub Pages" 工作流
- [ ] 工作流运行成功（全部绿色 ✅）
- [ ] 网站能正常显示

请按步骤操作，遇到问题告诉我！
