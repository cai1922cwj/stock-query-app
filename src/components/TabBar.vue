<template>
  <nav class="tab-bar">
    <router-link to="/" class="tab-item" :class="{ active: $route.path === '/' }">
      <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
      <span class="tab-label">首页</span>
    </router-link>
    
    <router-link to="/market" class="tab-item" :class="{ active: $route.path === '/market' }">
      <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
      </svg>
      <span class="tab-label">行情</span>
    </router-link>
    
    <router-link to="/search" class="tab-item" :class="{ active: $route.path === '/search' }">
      <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <span class="tab-label">搜索</span>
    </router-link>
  </nav>
</template>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  color: #666;
  text-decoration: none;
  transition: all 0.3s ease;
}

.tab-item.active {
  color: #667eea;
  font-weight: 600;
}

.tab-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
}

.tab-label {
  font-size: 12px;
}
</style>
