# PK Progress - React + TypeScript + Vite

PK 进度管理系统，使用 React + TypeScript + Vite + Ant Design 构建。

## 环境变量配置

### 开发环境

复制 `.env.example` 文件为 `.env`：

```bash
cp .env.example .env
```

### 生产环境

创建 `.env.production` 文件：

```bash
VITE_API_BASE_URL=https://your-production-api.com
```

### 环境变量说明

- `VITE_API_BASE_URL`: API 服务器地址
  - 开发环境: `http://localhost:5001`
  - 生产环境: `https://your-production-api.com`

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 预览

```bash
npm run preview
```

## 技术栈

- React 19
- TypeScript
- Vite
- Ant Design
- Tailwind CSS
- SCSS Modules
