# 🎡 Lucky Draw (Customizable Wheel of Fortune)

A modern, fully customizable, and cross-platform synchronized Lucky Draw web application built with React, Vite, Tailwind CSS, and Express.

[中文文档说明请向下滚动 / Scroll down for Chinese documentation]

## ✨ Features

- **Interactive Wheel**: Smooth spinning animation with confetti celebration effects.
- **Cross-Platform Synchronization**: Built-in lightweight Express server stores data in a local `data.json` file, ensuring all connected clients see the same prizes and history in real-time.
- **Bilingual Support**: Seamlessly switch between English and Chinese (zh-CN) UI.
- **Secure Admin Panel**: Password-protected dashboard to manage the application.
- **Customizable Prizes**: Add, remove, and edit prizes. Customize names, weights (probabilities), background colors, and text colors.
- **Global Settings**: Easily change the site name, icon, main title, and subtitle directly from the UI.
- **Draw History**: Displays a list of recent winners.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion (for animations), Lucide React (icons).
- **Backend**: Node.js, Express (Lightweight JSON file-based storage).
- **Build Tool**: ESBuild (Bundles the backend into a single zero-dependency file for production).

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)

### Installation

1. Clone the repository and navigate to the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### Production Build & Deployment

This project is configured to bundle both the frontend and backend into a highly optimized production build.

1. Build the project:
   ```bash
   npm run build
   ```
   *This compiles the React frontend into the `dist/` directory and bundles the Express server into `dist/server.cjs`.*

2. Start the production server:
   ```bash
   npm run start
   ```
   *Note: The server will run on port 3000. Ensure your firewall allows inbound traffic on this port.*

### Deploying with PM2 (Recommended for VPS)

To keep the server running continuously in the background on a Linux/Windows server:

1. Install PM2 globally:
   ```bash
   npm install -g pm2
   ```
2. Start the application:
   ```bash
   pm2 start dist/server.cjs --name "lucky-draw"
   ```
3. Save the process list to restart on server reboot:
   ```bash
   pm2 save
   pm2 startup
   ```

## 📁 Data Storage

All application data (prizes, settings, history) is stored in a `data.json` file generated in the root directory upon the first run. 
- **Backup**: Simply copy the `data.json` file.
- **Reset**: Delete the `data.json` file and restart the server to restore default settings.

## 🔐 Default Credentials

- **Admin Password**: `admin123` (You can change this in the Admin Panel).

## 📄 License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** license. 

You are free to:
- **Share & Deploy**: Copy, redistribute, and deploy the application for your own personal use.

Under the following terms:
- **Attribution**: You must give appropriate credit and provide a link to the original author's GitHub repository.
- **NonCommercial**: You may **NOT** use the material for commercial purposes or profit.

---

# 🎡 大转盘抽奖系统 (Lucky Draw)

一个现代、完全可定制且支持跨平台数据同步的大转盘抽奖 Web 应用。

## ✨ 核心功能

- **交互式转盘**：流畅的旋转动画与中奖后的五彩纸屑庆祝效果。
- **跨平台数据同步**：内置轻量级 Express 服务器，数据存储在本地 `data.json` 文件中，确保所有设备实时同步奖项和抽奖记录。
- **双语支持**：无缝切换英文与中文 (zh-CN) 界面。
- **安全的管理后台**：受密码保护的控制面板。
- **自定义奖项**：自由添加、删除和编辑奖项。支持自定义名称、权重（中奖概率）、背景颜色和文字颜色。
- **全局设置**：直接在界面上修改网站名称、图标、主标题和副标题。
- **历史记录**：前台展示最近的中奖名单。

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 本地开发
```bash
npm run dev
```

### 生产环境打包与部署
1. **打包项目**：
   ```bash
   npm run build
   ```
2. **启动服务**：
   ```bash
   npm run start
   ```
   *(默认运行在 3000 端口，请确保服务器防火墙已放行该端口)*

### 使用 PM2 后台运行 (推荐)
```bash
npm install -g pm2
pm2 start dist/server.cjs --name "lucky-draw"
pm2 save
pm2 startup
```

## 🔐 默认凭证
- **管理员密码**：`admin123`（可在管理后台中修改）

## 📄 版权与开源协议 (License)

本项目采用 **[署名-非商业性使用 4.0 国际 (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/)** 协议进行许可。

- **允许**：自由转发、分享、部署以及个人使用。
- **必须署名**：使用或分发本项目时，必须明确注明来源，并附上原作者的 GitHub 链接。
- **禁止商用**：**严禁**将本项目用于任何商业盈利目的。
