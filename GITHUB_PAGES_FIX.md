# GitHub Pages 设置修复指南

## 当前问题分析

从图15可以看出：
- 运行的是 GitHub 默认的 `pages-build-deployment` 工作流
- 这不是我们自定义的 GitHub Actions 工作流
- 说明 Pages Source 设置还是 "Deploy from a branch"

## 正确的设置步骤

### 步骤 1: 进入 Pages 设置

1. 访问：https://github.com/cai1922cwj/stock-query-app/settings/pages

### 步骤 2: 修改 Build and deployment

找到 **"Build and deployment"** 部分：

**当前（错误）：**
```
Source: Deploy from a branch
Branch: main / (root)
```

**必须改成（正确）：**
```
Source: GitHub Actions
```

**操作方法：**
1. 点击 "Deploy from a branch" 下拉框
2. 选择 "GitHub Actions"
3. 页面会自动刷新，显示 GitHub Actions 配置

### 步骤 3: 确认修改成功

修改成功后，Pages 设置页面应该显示：
```
Build and deployment
Source: GitHub Actions

GitHub Actions lets you automate your software workflows. 
Learn more about configuring a publishing source for your site.
```

**不再显示 Branch 选择框！**

### 步骤 4: 触发重新部署

在本地执行：
```bash
cd c:\csaapp
git commit --allow-empty -m "Trigger deployment with GitHub Actions"
git push origin main
```

### 步骤 5: 查看正确的 Actions

访问：https://github.com/cai1922cwj/stock-query-app/actions

**应该看到：**
- 工作流名称：**"Deploy to GitHub Pages"**（左侧有黄色点表示运行中）
- 而不是 "pages build and deployment"

**正确的运行步骤：**
1. ⏳ Checkout
2. ⏳ Set up Node
3. ⏳ Install dependencies
4. ⏳ Build
5. ⏳ Setup Pages
6. ⏳ Upload artifact
7. ⏳ Deploy to GitHub Pages

### 步骤 6: 等待部署完成

- 所有步骤变成 ✅ 绿色
- 访问网站：https://cai1922cwj.github.io/stock-query-app/

---

## 关键区别

| 特征 | 错误的设置 | 正确的设置 |
|------|-----------|-----------|
| Source | Deploy from a branch | **GitHub Actions** |
| 工作流名称 | pages build and deployment | **Deploy to GitHub Pages** |
| 是否编译 | ❌ 否 | ✅ 是 |
| 网站显示 | 空白 | 正常 |

---

## 如果还是找不到 "GitHub Actions" 选项

可能原因：仓库是 Private 且没有 GitHub Pro

**解决方案：**
1. 把仓库改成 Public：
   - Settings → General → Danger Zone → Change repository visibility
   - 选择 "Make public"

2. 或使用替代方案（Netlify）：
   - 访问 https://www.netlify.com/
   - 拖放 dist 文件夹即可部署

---

## 验证清单

- [ ] Pages 设置中 Source 显示 "GitHub Actions"
- [ ] 不再显示 "Branch: main / (root)" 选择框
- [ ] Actions 页面显示 "Deploy to GitHub Pages" 工作流
- [ ] 工作流运行完成后显示绿色 ✅
- [ ] 网站能正常显示内容
