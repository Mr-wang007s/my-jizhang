# Tailwind CSS 迁移指南

## ✅ 已完成

本项目已从 Sass 迁移到 Tailwind CSS，以下是关键改动：

### 1. 依赖安装
```bash
pnpm add -D tailwindcss@3 postcss@8 autoprefixer@10
```

### 2. 配置文件
- `tailwind.config.js` - Tailwind 主题配置，包含 iOS 风格的颜色、间距、圆角等
- `config/index.ts` - 启用 Taro 的 Tailwind 支持
- `src/app.css` - 全局样式文件，包含 Tailwind 指令和自定义工具类

### 3. 主题配置

所有之前在 `src/styles/_variables.scss` 中的设计 token 已迁移到 `tailwind.config.js`：

#### 颜色
- `text-primary` - #000000
- `text-secondary` - #8E8E93
- `text-tertiary` - #C7C7CC
- `bg-card` - rgba(255, 255, 255, 0.8)
- `bg-card-solid` - #FFFFFF

#### 间距
- `p-xs` / `m-xs` - 8px
- `p-sm` / `m-sm` - 12px
- `p-md` / `m-md` - 16px
- `p-lg` / `m-lg` - 24px
- `p-xl` / `m-xl` - 32px

#### 圆角
- `rounded-sm` - 8px
- `rounded-md` - 12px
- `rounded-lg` - 16px
- `rounded-xl` - 24px
- `rounded-xxl` - 32px

#### 阴影
- `shadow-sm` - 细微阴影
- `shadow-md` - 中等阴影
- `shadow-lg` - 大阴影
- `shadow-glass` - 玻璃态阴影
- `shadow-colored` - 彩色阴影（用于主按钮）

### 4. 自定义工具类

在 `src/app.css` 中定义了一些 iOS 风格的自定义工具类：

```css
.glass-effect - 玻璃态效果
.glass-card - 玻璃态卡片
.frosted-glass - 磨砂玻璃效果
.gradient-primary - 主色渐变
.gradient-success - 成功色渐变
.gradient-danger - 危险色渐变
.bg-gradient-fade - 页面背景渐变
.transition-spring - 弹簧动画
.transition-smooth - 平滑过渡
.active-scale - 点击缩放效果
```

### 5. 已迁移页面

- ✅ 首页 (`src/pages/index/index.tsx`) - 完全使用 Tailwind 类名
- ✅ 添加页 (`src/pages/add/index.tsx`) - 完全使用 Tailwind 类名

### 6. 待迁移组件

以下组件仍在使用 Sass，可以逐步迁移：

- `src/components/TypeToggle/index.scss`
- `src/components/FormItem/index.scss`
- `src/components/CategoryIcon/index.scss`
- `src/components/Modal/index.scss`
- `src/components/TransactionItem/index.scss`
- `src/components/CLoading/index.scss`
- `src/pages/statistics/index.scss`
- `src/pages/settings/index.scss`

## 🎨 使用示例

### 基础布局
```tsx
<View className="min-h-screen bg-gradient-fade p-xl">
  <View className="bg-card-solid rounded-xl shadow-md p-lg">
    <Text className="text-lg font-semibold text-text-primary">标题</Text>
  </View>
</View>
```

### 渐变卡片
```tsx
<View className="gradient-primary rounded-xxl p-xl text-white">
  <Text className="text-2xl font-light">当前结余</Text>
  <Text className="text-4xl">¥1,234.56</Text>
</View>
```

### 响应式网格
```tsx
<View className="grid gap-md" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
  <View className="bg-card-solid rounded-xl p-lg">卡片 1</View>
  <View className="bg-card-solid rounded-xl p-lg">卡片 2</View>
</View>
```

### 玻璃态效果
```tsx
<View className="glass-card p-lg backdrop-blur-glass">
  <Text>玻璃态内容</Text>
</View>
```

### 交互效果
```tsx
<View className="active-scale rounded-lg bg-primary p-md" onClick={handleClick}>
  <Text className="text-white">点击我</Text>
</View>
```

## 🔧 开发建议

1. **优先使用 Tailwind 类名**：新组件和页面应直接使用 Tailwind 类名
2. **保持主题一致性**：使用 `tailwind.config.js` 中定义的颜色和间距
3. **自定义样式**：对于复杂样式，在 `src/app.css` 中添加自定义工具类
4. **逐步迁移**：现有 Sass 组件可以在需要修改时逐步迁移到 Tailwind

## 📦 构建验证

运行以下命令验证 Tailwind 配置是否正确：

```bash
# H5 构建
pnpm build:h5

# 微信小程序构建
pnpm build:weapp

# 开发模式
pnpm dev:h5
```

## 🎯 优势

1. **开发效率提升**：直接在 JSX 中使用工具类，无需切换到样式文件
2. **代码可维护性**：减少自定义 CSS，样式更易预测
3. **包体积优化**：Tailwind 会自动清理未使用的样式
4. **设计系统一致性**：通过主题配置保证全局样式统一
5. **更好的 IDE 支持**：Tailwind IntelliSense 插件提供智能提示

## 🚀 下一步

- [ ] 迁移剩余组件的样式
- [ ] 移除未使用的 Sass 文件
- [ ] 更新组件库文档
- [ ] 优化自定义工具类
