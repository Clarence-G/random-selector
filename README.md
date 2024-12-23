# 随机选择器 (Random Selector)

一个帮助你做出选择的小工具。无论是今天吃什么、看什么电影，还是做什么周末活动，它都能帮你随机选择。基于 [Next.js](https://nextjs.org) 构建。

## 功能特点

- 🎯 创建自定义类别和选项
- 🎲 支持多类别随机选择
- 💾 本地数据持久化存储
- 📱 响应式设计，支持移动端
- 🎨 现代化 UI 设计
- ✨ 流畅的动画效果

## 开始使用

首先，运行开发服务器：

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

### 使用指南

1. **创建决策类别**
   - 在第一个输入框中输入类别名称（如：午餐、电影等）
   - 点击"创建"按钮添加新类别

2. **添加选项内容**
   - 从下拉菜单选择要添加选项的类别
   - 在输入框中输入具体选项
   - 点击"添加"按钮保存选项

3. **选择决策范围**
   - 点击类别卡片选择/取消要参与随机的类别
   - 可以同时选择多个类别

4. **开始随机**
   - 点击"开始随机选择"按钮
   - 系统会从选中的类别中随机选择一个结果

## 技术栈

- [Next.js](https://nextjs.org/) - React 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [Framer Motion](https://www.framer.com/motion/) - 动画效果
- [Vercel](https://vercel.com/) - 部署平台

本项目使用 [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) 自动优化和加载 [Geist](https://vercel.com/font) 字体。

## 部署

推荐使用 [Vercel 平台](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) 部署，这是 Next.js 的创建者提供的平台。

### 自定义域名设置

1. 在 Vercel 仪表板中选择您的项目
2. 进入 "Settings" -> "Domains"
3. 添加您的域名
4. 按照提示配置 DNS 记录

## 了解更多

要了解更多关于 Next.js 的信息，请查看以下资源：

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 特性和 API
- [Learn Next.js](https://nextjs.org/learn) - 交互式 Next.js 教程

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
