# 🍎 iOS Glass Card 设计指南

## 设计理念：玻璃卡片美学

**核心概念**: 打造类似 iOS 原生应用的现代感界面，使用毛玻璃效果、浮动卡片和流畅动画，创造精致优雅的用户体验。

### 美学方向

#### 字体系统
- **SF Pro Display** (iOS 系统字体) - 用于标题
- **SF Pro Text** - 用于正文
- 备选方案: `-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui`

#### 配色方案
```css
/* 主色调 */
--ios-white: #FFFFFF
--ios-gray-50: #F9FAFB
--ios-gray-100: #F3F4F6
--ios-gray-200: #E5E7EB
--ios-gray-300: #D1D5DB
--ios-gray-500: #6B7280
--ios-gray-700: #374151
--ios-gray-900: #111827

/* 功能色 */
--ios-blue: #007AFF
--ios-green: #34C759
--ios-red: #FF3B30
--ios-orange: #FF9500
--ios-purple: #AF52DE

/* 玻璃效果 */
--glass-bg: rgba(255, 255, 255, 0.8)
--glass-border: rgba(255, 255, 255, 0.18)
--glass-shadow: rgba(0, 0, 0, 0.1)
```

#### 视觉特征
- **毛玻璃背景** - backdrop-filter: blur(20px)
- **浮动卡片** - box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1)
- **圆角设计** - border-radius: 16px ~ 24px
- **流畅动画** - cubic-bezier(0.4, 0.0, 0.2, 1)
- **微妙渐变** - 浅色线性渐变
- **细腻阴影** - 多层阴影叠加
- **弹性交互** - scale + translate 组合动画

---

## 📱 首页重构 (index.tsx)

### 布局结构

```
╔══════════════════════════════╗
║  我的钱包                    ║  玻璃头部
║  2025年11月20日             ║
╚══════════════════════════════╝

┌────────────────────────────┐
│  💰 当前余额                │
│  ¥12,345.67                │  渐变卡片
│  ↗ 收入 ¥8000  ↘ 支出 ¥5000│  
└────────────────────────────┘

┌──────────────┐ ┌──────────────┐
│ 📊 本月支出   │ │ 💵 本月收入   │  浮动卡片
│ ¥3,000       │ │ ¥5,000       │  
│ 较上月 ↓ 10% │ │ 较上月 ↑ 15% │
└──────────────┘ └──────────────┘

┌────────────────────────────┐
│ 📅 今日统计                 │  玻璃卡片
│ ¥500 · 3笔                 │
└────────────────────────────┘

╔══════════════════════════════╗
║  今天                        ║  分组标题
╚══════════════════════════════╝

┌────────────────────────────┐
│ 🍜 午餐          -¥38.00    │  交易卡片
│ 备注: 沙县小吃              │  (可滑动删除)
│ 12:30                       │
├────────────────────────────┤
│ 🚇 地铁          -¥6.00     │
│ 14:20                       │
└────────────────────────────┘

╔══════════════════════════════╗
║  ✨ 记一笔              [+]  ║  浮动操作栏
╚══════════════════════════════╝
```

### 核心样式类

```tsx
// 玻璃背景容器
<View className="glass-card rounded-2xl p-6 backdrop-blur-2xl">
  <Text className="text-2xl font-semibold">当前余额</Text>
</View>

// 渐变余额卡片
<View className="gradient-card rounded-3xl p-8 shadow-xl">
  <Text className="text-6xl font-bold text-white">{balance}</Text>
</View>

// 浮动统计卡片
<View className="floating-card rounded-xl p-5 hover-lift">
  <Text className="text-sm text-gray-500">本月支出</Text>
  <Text className="text-3xl font-bold">{amount}</Text>
</View>

// 交易列表项
<View className="transaction-card rounded-2xl p-4 bg-white/80 backdrop-blur">
  <View className="flex items-center">
    <View className="icon-badge w-12 h-12 rounded-full bg-blue-100">
      <Text className="text-2xl">🍜</Text>
    </View>
    <Text className="text-lg font-medium">午餐</Text>
  </View>
</View>

// 浮动操作栏
<View className="floating-action-bar glass-bg rounded-3xl p-5 shadow-2xl">
  <Text className="text-xl font-semibold">记一笔</Text>
  <View className="action-button w-12 h-12 rounded-full bg-blue-500">
    <Text className="text-white text-2xl">+</Text>
  </View>
</View>
```

---

## ✏️ 添加/编辑页面重构 (add.tsx)

### 布局结构

```
╔══════════════════════════════╗
║  ✨ 快速记一笔               ║  玻璃头部
║  📅 2025年11月20日 星期三    ║
╚══════════════════════════════╝

┌────────────────────────────┐
│  支出 ⚪ ○ 收入             │  切换开关
└────────────────────────────┘

╔══════════════════════════════╗
║                              ║
║      ¥ 0.00                 ║  超大金额输入
║      ────────                ║  
╚══════════════════════════════╝

┌────────────────────────────┐
│  ⭐ 常用分类                 │
├────────────────────────────┤
│  🍜  🚇  🛒  🎮             │  图标网格
│  餐饮 交通 购物 娱乐         │
└────────────────────────────┘

┌────────────────────────────┐
│  📊 详细信息                 │
├────────────────────────────┤
│  分类     午餐          >   │
│  日期     今天          >   │
│  备注     添加备注...        │
└────────────────────────────┘

┌────────────────────────────┐
│  ⏰ 日期快捷键               │
├────────────────────────────┤
│  [今天]  [昨天]  [前天]  ... │
└────────────────────────────┘

╔══════════════════════════════╗
║         ✅ 保存               ║  底部按钮
╚══════════════════════════════╝
```

### 核心样式

```tsx
// 类型切换器 (iOS 风格)
<View className="segmented-control glass-card rounded-full p-1 flex">
  <View className={`segment ${active && 'bg-white shadow-sm'} rounded-full px-6 py-2`}>
    <Text className={`font-semibold ${active ? 'text-red-500' : 'text-gray-500'}`}>
      支出
    </Text>
  </View>
  <View className="segment rounded-full px-6 py-2">
    <Text className="text-gray-500">收入</Text>
  </View>
</View>

// 金额输入卡片
<View className="amount-input-card glass-card rounded-3xl p-10 text-center">
  <Text className="text-7xl font-light text-gray-900">¥</Text>
  <Input 
    className="text-7xl font-light text-center border-none"
    placeholder="0.00"
  />
</View>

// 常用分类网格
<View className="category-grid glass-card rounded-2xl p-6">
  <Text className="text-lg font-semibold mb-4">⭐ 常用分类</Text>
  <View className="grid grid-cols-4 gap-4">
    <View className="category-item text-center">
      <View className="icon-container w-16 h-16 rounded-2xl bg-blue-100 mx-auto">
        <Text className="text-3xl">🍜</Text>
      </View>
      <Text className="text-sm mt-2">餐饮</Text>
    </View>
  </View>
</View>

// 信息列表
<View className="info-list glass-card rounded-2xl overflow-hidden">
  <View className="info-item flex justify-between p-4 border-b border-gray-100">
    <Text className="text-gray-600">分类</Text>
    <View className="flex items-center gap-2">
      <Text className="text-gray-900 font-medium">午餐</Text>
      <Text className="text-gray-400">›</Text>
    </View>
  </View>
</View>

// 快捷日期按钮
<View className="date-shortcuts glass-card rounded-2xl p-4">
  <View className="flex gap-3">
    <View className={`shortcut-btn ${active && 'bg-blue-500 text-white'} rounded-xl px-5 py-3`}>
      <Text className="font-semibold">今天</Text>
    </View>
    <View className="shortcut-btn bg-white rounded-xl px-5 py-3">
      <Text className="text-gray-600">昨天</Text>
    </View>
  </View>
</View>

// 保存按钮
<View className="save-button bg-blue-500 rounded-2xl p-5 shadow-lg active:scale-95">
  <Text className="text-white text-xl font-semibold text-center">✅ 保存</Text>
</View>
```

---

## 🎨 组件重构

### TransactionItem (交易项)

```tsx
<View className="transaction-item glass-card rounded-2xl p-4 mb-3 active:scale-98 transition">
  <View className="flex items-center gap-4">
    {/* 图标徽章 */}
    <View className="icon-badge w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
      <Text className="text-3xl">{icon}</Text>
    </View>
    
    {/* 信息区 */}
    <View className="flex-1">
      <Text className="text-lg font-semibold text-gray-900">{category}</Text>
      {note && (
        <Text className="text-sm text-gray-500 mt-1">{note}</Text>
      )}
      <Text className="text-xs text-gray-400 mt-1">{time}</Text>
    </View>
    
    {/* 金额 */}
    <View className="text-right">
      <Text className={`text-2xl font-bold ${isExpense ? 'text-red-500' : 'text-green-500'}`}>
        {isExpense ? '-' : '+'}¥{amount}
      </Text>
    </View>
  </View>
</View>
```

### CategoryIcon (分类图标)

```tsx
<View 
  className={`category-icon w-20 h-20 rounded-2xl flex items-center justify-center
    ${active 
      ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg scale-105' 
      : 'bg-gradient-to-br from-gray-50 to-gray-100'
    } 
    transition-all active:scale-95`}
  onClick={onClick}
>
  <Text className={`text-4xl ${active && 'animate-bounce-subtle'}`}>
    {icon}
  </Text>
</View>

{/* 小尺寸 */}
<View className="w-12 h-12 rounded-xl bg-blue-100">
  <Text className="text-2xl">{icon}</Text>
</View>

{/* 大尺寸 */}
<View className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-100 to-purple-100 shadow-md">
  <Text className="text-5xl">{icon}</Text>
</View>
```

### Modal (模态框)

```tsx
<View className="modal-overlay fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end justify-center z-50">
  {/* 内容卡片 */}
  <View className="modal-content glass-card rounded-t-3xl w-full max-h-[80vh] slide-up">
    {/* 拖动指示器 */}
    <View className="drag-indicator w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-4" />
    
    {/* 头部 */}
    <View className="modal-header px-6 pb-4 border-b border-gray-100">
      <Text className="text-2xl font-bold text-gray-900">{title}</Text>
      <View 
        className="close-button absolute right-4 top-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:scale-90"
        onClick={onClose}
      >
        <Text className="text-gray-600 text-xl">×</Text>
      </View>
    </View>
    
    {/* 内容区 */}
    <View className="modal-body p-6 overflow-y-auto">
      {children}
    </View>
  </View>
</View>
```

### TypeToggle (类型切换)

```tsx
<View className="type-toggle glass-card rounded-full p-1 flex gap-1 w-fit">
  <View 
    className={`toggle-option px-6 py-2 rounded-full transition-all
      ${value === 'expense' 
        ? 'bg-white shadow-sm' 
        : 'bg-transparent'
      }`}
    onClick={() => onChange('expense')}
  >
    <Text className={`font-semibold transition-colors
      ${value === 'expense' ? 'text-red-500' : 'text-gray-500'}`}>
      支出
    </Text>
  </View>
  
  <View 
    className={`toggle-option px-6 py-2 rounded-full transition-all
      ${value === 'income' 
        ? 'bg-white shadow-sm' 
        : 'bg-transparent'
      }`}
    onClick={() => onChange('income')}
  >
    <Text className={`font-semibold transition-colors
      ${value === 'income' ? 'text-green-500' : 'text-gray-500'}`}>
      收入
    </Text>
  </View>
</View>
```

### FormItem (表单项)

```tsx
<View className="form-item flex items-center justify-between p-4 bg-white/60 backdrop-blur rounded-xl border border-gray-100 active:bg-white/80 transition">
  <View className="flex items-center gap-3">
    {icon && (
      <View className="form-icon w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
        {icon}
      </View>
    )}
    <Text className="text-base text-gray-600">{label}</Text>
  </View>
  
  <View className="flex items-center gap-2">
    {type === 'input' ? (
      <Input 
        className="text-right text-base text-gray-900 font-medium border-none"
        value={value}
        placeholder={placeholder}
      />
    ) : (
      <Text className="text-base text-gray-900 font-medium">{value || placeholder}</Text>
    )}
    {showArrow && (
      <Text className="text-gray-400 text-xl">›</Text>
    )}
  </View>
</View>
```

### CLoading (加载组件)

```tsx
<View className="loading-container fixed inset-0 bg-white/90 backdrop-blur-xl flex items-center justify-center z-50">
  <View className="loading-content text-center">
    {/* iOS 风格加载动画 */}
    <View className="loading-spinner w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
    
    <Text className="text-lg text-gray-600 font-medium">{text}</Text>
  </View>
</View>
```

---

## 🎬 动画效果

### 页面过渡

```css
/* 淡入上滑 */
.fade-slide-up {
  animation: fadeSlideUp 0.6s cubic-bezier(0.4, 0.0, 0.2, 1) both;
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 交错动画 */
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }
```

### 交互动画

```css
/* 弹性缩放 */
.scale-spring {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-spring:active {
  transform: scale(0.96);
}

/* 悬浮提升 */
.hover-lift {
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

/* 微妙跳动 */
.bounce-subtle {
  animation: bounceSubtle 2s ease-in-out infinite;
}

@keyframes bounceSubtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
```

### 模态框动画

```css
/* 从底部滑入 */
.slide-up {
  animation: slideUp 0.4s cubic-bezier(0.4, 0.0, 0.2, 1) both;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

/* 遮罩淡入 */
.fade-in {
  animation: fadeIn 0.3s ease-out both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

---

## 📐 Tailwind 配置

### 自定义工具类

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'ios-blue': '#007AFF',
        'ios-green': '#34C759',
        'ios-red': '#FF3B30',
        'ios-orange': '#FF9500',
        'ios-purple': '#AF52DE',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'ios': '0 10px 30px rgba(0, 0, 0, 0.1)',
        'ios-lg': '0 20px 50px rgba(0, 0, 0, 0.15)',
        'ios-xl': '0 30px 60px rgba(0, 0, 0, 0.2)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
      },
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui'],
      },
    },
  },
  plugins: [],
}
```

### 玻璃效果类

```css
/* app.css */

/* 玻璃卡片 */
.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* 深色玻璃 */
.glass-card-dark {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 渐变卡片 */
.gradient-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-card-green {
  background: linear-gradient(135deg, #34C759 0%, #30D158 100%);
}

.gradient-card-red {
  background: linear-gradient(135deg, #FF3B30 0%, #FF9500 100%);
}

/* 浮动卡片 */
.floating-card {
  background: #FFFFFF;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.floating-card:active {
  transform: translateY(2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* 图标徽章 */
.icon-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(0, 122, 255, 0.2) 100%);
}

/* 分割线 */
.divider-gradient {
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.1) 50%, transparent 100%);
}
```

---

## 🎯 设计原则

### ✅ 要做的

1. **精致圆角**: 16px - 24px 圆角，营造柔和感
2. **层次分明**: 使用阴影和毛玻璃区分层级
3. **流畅动画**: 0.3s - 0.6s 过渡，使用缓动函数
4. **留白充足**: padding 16px - 24px
5. **微妙渐变**: 浅色渐变作为点缀
6. **高度可读**: 字号 14px - 18px，行高 1.5
7. **弹性交互**: scale(0.95) - scale(1.05)
8. **系统字体**: 使用 SF Pro 或系统默认

### ❌ 不要做的

1. ❌ 过度模糊（blur > 40px）
2. ❌ 强烈对比色
3. ❌ 复杂图案背景
4. ❌ 过多装饰元素
5. ❌ 生硬的直角
6. ❌ 过快或过慢的动画
7. ❌ 密集的信息排布
8. ❌ 不统一的视觉语言

---

## 📱 响应式设计

### 断点系统

```css
/* Taro 小程序适配 */
@media screen and (max-width: 750px) {
  /* 小屏幕 */
  .container { padding: 12px; }
  .card { border-radius: 12px; }
  .text-xl { font-size: 18px; }
}

@media screen and (min-width: 751px) {
  /* 平板 */
  .container { padding: 24px; }
  .card { border-radius: 16px; }
}
```

### 适配建议

- 使用 `rpx` 单位确保跨设备一致
- 圆角使用固定 `px` 值保持比例
- 字体使用相对单位 `rem` / `em`
- 间距使用 Tailwind spacing scale
- 图标使用 `em` 单位跟随文字大小

---

## 🎨 完整色彩系统

```css
/* 主题色 */
--primary: #007AFF;
--success: #34C759;
--warning: #FF9500;
--danger: #FF3B30;
--info: #AF52DE;

/* 灰度 */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;

/* 半透明 */
--overlay-light: rgba(0, 0, 0, 0.3);
--overlay-dark: rgba(0, 0, 0, 0.6);
--glass-bg: rgba(255, 255, 255, 0.8);
--glass-border: rgba(255, 255, 255, 0.18);
```

---

## ✨ 实施步骤

### 第一步：更新 Tailwind 配置
```bash
# 添加自定义颜色、圆角、阴影
# 启用 backdrop-filter 支持
```

### 第二步：创建基础玻璃效果类
```bash
# 在 app.css 中添加 .glass-card 等工具类
```

### 第三步：重构组件
1. TransactionItem - 玻璃卡片 + 圆角图标
2. CategoryIcon - 渐变背景 + 弹性动画
3. Modal - 底部滑入 + 毛玻璃遮罩
4. TypeToggle - 分段控制器
5. FormItem - 细线边框 + 箭头指示

### 第四步：重构页面
1. index.tsx - 渐变余额卡 + 浮动统计
2. add.tsx - 大号输入 + 常用分类
3. 添加页面过渡动画
4. 优化交互反馈

---

## 🎁 额外建议

### 微交互
- 按钮：按下缩小至 96%
- 卡片：悬浮提升 4px
- 列表项：滑动删除带回弹
- 输入框：聚焦时边框渐变动画

### 加载状态
- 骨架屏：渐变扫光效果
- 加载器：iOS 原生 spinner
- 下拉刷新：弹性动画

### 反馈提示
- Toast：从顶部滑入
- 确认框：缩放淡入
- 错误提示：抖动动画

---

*这是一个优雅、现代、符合 iOS 设计规范的界面方案。通过毛玻璃效果和流畅动画，打造出精致的用户体验。*
