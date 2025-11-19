# 🎨 Neo-Brutalism 记账应用重构指南

## 设计理念：数字账本美学

**核心概念**: 将传统账本的严肃感与数字朋克的前卫性结合，创造独特的 Neo-Brutalism 风格

### 美学方向
- **字体系统**: 
  - `JetBrains Mono` (等宽编程字体) - 用于数字、标题
  - `IBM Plex Sans` - 用于正文
  
- **配色方案**:
  - 主色：黑色 (#000000) + 白色 (#FFFFFF)
  - 强调色：霓虹黄 (#FFE500)、电光绿 (#00FF00)、危险红 (#FF0000)
  
- **视觉特征**:
  - 厚重边框 (4px-8px)
  - 硬阴影 (6px 6px 0)
  - 倾斜角度 (skew transformations)
  - 网格背景
  - 扫描线效果
  - ASCII 装饰
  - 故障艺术动画

---

## 📱 首页重构 (index.tsx)

### 布局结构

```
[MY_WALLET] 标题
> 2025.11.20 时间戳

┌────────────────────────────┐
│  CURRENT_BALANCE:          │
│  ¥12,345.67                │ 霓虹黄背景
│  ↓ OUT: ¥5000  ↑ IN: ¥8000│
└────────────────────────────┘

┌──────────────┐ ┌──────────────┐
│ MONTH_OUT    │ │ MONTH_IN     │ 倾斜卡片
│ ¥3,000       │ │ ¥5,000       │ 
└──────────────┘ └──────────────┘

┌────────────────────────────┐
│ TODAY_STATS                │
│ ¥500                       │
└────────────────────────────┘

▶ 今天
┌────────────────────────────┐
│ [交易列表]                 │
└────────────────────────────┘

┌────────────────────────────┐
│ ADD_RECORD              +  │ 固定底部
└────────────────────────────┘
```

### 关键样式类

```tsx
// 头部
<Text className="text-4xl font-mono-brutal">{'[MY_WALLET]'}</Text>
<Text className="text-sm font-mono text-brutal-gray">{'>'} {date}</Text>

// 余额卡片
<View className="bg-neon-yellow border-brutal p-8">
  <Text className="text-6xl font-mono-brutal glitch">{balance}</Text>
</View>

// 统计卡片 (倾斜)
<View className="bg-brutal-white border-brutal-sm skew-brutal-reverse">
  <Text className="text-2xl font-mono-brutal text-expense">{amount}</Text>
</View>

// 黑色反差卡片
<View className="bg-brutal-black shadow-brutal-green">
  <Text className="text-neon-green">{income}</Text>
</View>

// 浮动按钮
<View className="bg-neon-yellow border-brutal active-brutal">
  <Text className="font-mono-brutal">ADD_RECORD</Text>
  <Text className="text-4xl">+</Text>
</View>
```

---

## 🔧 添加/编辑页面重构 (add.tsx)

### 布局结构

```
[NEW_RECORD] / [EDIT_RECORD]
> TYPE: EXPENSE / INCOME

┌────────────────────────────┐
│     INPUT_AMOUNT:          │
│     ¥ ______               │ 超大输入框
└────────────────────────────┘

▶ CATEGORY
┌──┐┌──┐┌──┐┌──┐
│餐││交││购││娱│ 图标网格
└──┘└──┘└──┘└──┘

▶ DATE
[今天] [昨天] [前天] [...]

▶ NOTE
┌────────────────────────────┐
│ _______                    │
└────────────────────────────┘

┌────────────────────────────┐
│ [SAVE_RECORD]           ✓ │
└────────────────────────────┘
```

### 关键组件

**类型切换器 (TypeToggle)**
```tsx
<View className="border-brutal-sm bg-brutal-white">
  <View className="bg-neon-yellow">EXPENSE</View>
  <View>INCOME</View>
</View>
```

**金额输入**
```tsx
<View className="border-brutal-neon p-8">
  <Text className="text-8xl font-mono-brutal">¥</Text>
  <Input className="text-8xl font-mono" />
</View>
```

**分类图标**
```tsx
<View className="border-brutal-sm bg-brutal-white w-20 h-20 active-brutal">
  <Text className="text-4xl">{emoji}</Text>
</View>
```

**日期按钮**
```tsx
<View className="border-brutal-sm active-brutal active-brutal-shadow">
  <Text className="font-mono-brutal">今天</Text>
</View>
```

---

## 🎨 组件重构

### TransactionItem

```tsx
<View className="border-b-4 border-brutal-black p-4 active-brutal">
  <View className="flex items-center gap-4">
    {/* 图标 */}
    <View className="w-16 h-16 border-brutal-sm bg-neon-yellow">
      <Text className="text-3xl">{icon}</Text>
    </View>
    
    {/* 信息 */}
    <View className="flex-1">
      <Text className="font-mono-brutal">{category}</Text>
      <Text className="font-mono text-xs text-brutal-gray">{note}</Text>
    </View>
    
    {/* 金额 */}
    <View>
      <Text className="text-2xl font-mono-brutal text-expense">-¥{amount}</Text>
      <Text className="font-mono text-xs">{time}</Text>
    </View>
  </View>
</View>
```

### CategoryIcon

```tsx
<View className="w-20 h-20 border-brutal-sm bg-brutal-white active-brutal active-brutal-shadow">
  <Text className="text-4xl">{emoji}</Text>
  <Text className="font-mono text-xs">{name}</Text>
</View>

// 选中状态
<View className="border-brutal-neon glow-yellow">
  ...
</View>
```

### Modal

```tsx
<View className="bg-brutal-black/80 backdrop-blur">
  <View className="bg-brutal-white border-brutal-lg m-6">
    {/* 头部 */}
    <View className="border-b-4 border-brutal-black p-4">
      <Text className="font-mono-brutal text-2xl">SELECT_CATEGORY</Text>
      <Text className="absolute right-4 text-3xl" onClick={onClose}>×</Text>
    </View>
    
    {/* 内容 */}
    <View className="p-6 grid grid-cols-4 gap-4">
      {categories.map(...)}
    </View>
  </View>
</View>
```

### TypeToggle

```tsx
<View className="border-brutal-sm bg-brutal-white p-1 inline-flex">
  <View className={`p-4 ${active && 'bg-neon-yellow border-brutal-sm'}`}>
    <Text className="font-mono-brutal">EXPENSE</Text>
  </View>
  <View className={`p-4 ${active && 'bg-neon-green border-brutal-sm'}`}>
    <Text className="font-mono-brutal">INCOME</Text>
  </View>
</View>
```

---

## 🎬 动画效果

### 入场动画

```css
/* 从下滑入 */
.slide-in-up {
  animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* 从左滑入 */
.slide-in-left {
  animation: slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* 交错延迟 */
.stagger-1 { animation-delay: 0.05s; }
.stagger-2 { animation-delay: 0.1s; }
.stagger-3 { animation-delay: 0.15s; }
```

### 交互动画

```css
/* 按下效果 - 移动阴影 */
.active-brutal {
  active:translate-x-1 active:translate-y-1
}

.active-brutal-shadow {
  active:shadow-none
}

/* 故障效果 */
.glitch {
  animation: glitch 3s infinite;
}

@keyframes glitch {
  0%, 90%, 100% { transform: translate(0); }
  92% { transform: translate(-2px, 2px); }
  94% { transform: translate(2px, -2px); }
}
```

---

## 📐 CSS 工具类总结

### 边框和阴影
```css
.border-brutal         → border: 4px solid #000 + shadow: 6px 6px 0 #000
.border-brutal-sm      → border: 3px solid #000 + shadow: 4px 4px 0 #000
.border-brutal-lg      → border: 6px solid #000 + shadow: 8px 8px 0 #000
.border-brutal-neon    → border: 4px solid #000 + shadow: 6px 6px 0 #FFE500
.border-brutal-green   → shadow: 6px 6px 0 #00FF00
.border-brutal-red     → shadow: 6px 6px 0 #FF0000
```

### 背景色
```css
.bg-brutal-black   → #000000
.bg-brutal-white   → #FFFFFF
.bg-neon-yellow    → #FFE500
.bg-neon-green     → #00FF00
```

### 文字颜色
```css
.text-brutal-black → #000000
.text-brutal-white → #FFFFFF
.text-brutal-gray  → #808080
.text-neon-yellow  → #FFE500
.text-neon-green   → #00FF00
.text-income       → #00FF00
.text-expense      → #FF0000
```

### 字体
```css
.font-mono         → JetBrains Mono
.font-mono-brutal  → JetBrains Mono + bold + tight letter-spacing
.font-sans         → IBM Plex Sans
```

### 变形
```css
.skew-brutal         → skewY(-2deg)
.skew-brutal-reverse → skewY(2deg)
```

### 特效
```css
.bg-grid      → 网格背景图案
.scanlines    → 扫描线动画
.glitch       → 故障效果
.glow-yellow  → 霓虹黄发光
.glow-green   → 电光绿发光
```

---

## 🚀 实施步骤

### 第一步：删除所有 SCSS 文件
```bash
# 删除所有组件 SCSS
Remove-Item src/components/**/*.scss
Remove-Item src/pages/**/*.scss
Remove-Item src/styles/*.scss
```

### 第二步：更新 Tailwind 配置
- 添加自定义颜色
- 添加自定义字体
- 添加自定义间距
- 添加自定义阴影

### 第三步：重构组件
1. TransactionItem - 移除 SCSS，纯 Tailwind + inline styles
2. CategoryIcon - 移除 SCSS
3. Modal - 移除 SCSS
4. TypeToggle - 移除 SCSS
5. FormItem - 移除 SCSS

### 第四步：重构页面
1. index.tsx - 完全重写为 Neo-Brutalism 风格
2. add.tsx - 完全重写
3. statistics.tsx - 重写(如需要)
4. settings.tsx - 重写(如需要)

---

## ✨ 设计亮点

1. **极简但不简单**: 黑白为主，霓虹色为点缀
2. **终端美学**: 等宽字体 + ASCII 字符 + 代码感
3. **厚重边框**: 4-8px 粗边框，强烈视觉冲击
4. **硬阴影**: 非模糊阴影，营造浮雕效果
5. **倾斜元素**: 打破规整，增加动感
6. **故障动画**: 数字朋克氛围
7. **扫描线**: 复古 CRT 显示器效果
8. **网格背景**: 数字网格空间感

---

## 🎯 与众不同的地方

❌ **不要的**:
- 柔和渐变
- 圆润边角
- 温和配色
- 模糊阴影
- 优雅字体

✅ **要做的**:
- 高对比度
- 直角硬边
- 霓虹强调
- 硬质阴影
- 编程字体
- 倾斜角度
- 故障效果
- 终端美学

---

## 📱 响应式考虑

由于是 Taro 小程序，采用 rpx 单位确保跨设备一致性：
- 边框：使用 px 保持清晰度
- 字体：使用绝对大小值
- 间距：使用 Tailwind spacing scale
- 容器：使用百分比或 flex

---

*这是一个大胆、前卫、充满个性的设计方向。它避免了所有通用 AI 美学的陷阱，创造出令人难忘的独特体验。*
