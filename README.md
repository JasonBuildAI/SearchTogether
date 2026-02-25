# 小黄聚合搜索

一个功能完善的前后端聚合搜索项目，集成了 GitHub 仓库搜索、文章、视频和商品搜索功能。

## 🌟 功能特点

- 🔍 **多类型聚合搜索** - 支持 GitHub 仓库、文章、视频、商品搜索
- 🐙 **GitHub 真实搜索** - 接入 GitHub API，搜索真实的开源仓库
- 🎨 **美观的 UI 设计** - 渐变色界面，现代简约风格
- 🏷️ **分类筛选** - 支持按类型筛选搜索结果
- 🔥 **热门搜索** - 快速访问热门关键词
- 📱 **响应式布局** - 完美适配各种屏幕尺寸
- ⚡ **实时搜索体验** - 流畅的交互体验

## 🛠️ 技术栈

### 后端
- **Node.js** - JavaScript 运行时
- **Express** - Web 应用框架
- **Axios** - HTTP 客户端（用于调用 GitHub API）
- **CORS** - 跨域资源共享

### 前端
- **Vue 3** - 渐进式 JavaScript 框架（Composition API）
- **Vite** - 新一代前端构建工具
- **Axios** - HTTP 客户端
- **CSS3** - 现代化样式设计

## 📂 项目结构

```
juheliulan/
├── backend/                    # 后端服务目录
│   ├── package.json            # 后端依赖配置
│   └── server.js               # Express 服务器主文件
├── frontend/                   # 前端应用目录
│   ├── package.json            # 前端依赖配置
│   ├── vite.config.js          # Vite 配置文件
│   ├── index.html              # HTML 入口文件
│   └── src/                    # 源代码目录
│       ├── main.js             # 应用入口
│       ├── App.vue             # 主组件
│       └── style.css           # 样式文件
├── package.json                # 根目录配置文件
└── README.md                   # 项目文档
```

## 🚀 快速开始

### 前置要求
- Node.js (建议 v16 或更高版本)
- npm 或 yarn 包管理器

### 1. 安装依赖

在项目根目录运行以下命令安装所有依赖：

```bash
npm run install:all
```

或者分别安装后端和前端依赖：

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 2. 启动后端服务

在项目根目录运行：

```bash
npm run dev:backend
```

或者在 backend 目录下运行：

```bash
cd backend
npm start
```

后端服务将在 `http://localhost:3000` 启动（或 3001，如果 3000 被占用）

### 3. 启动前端服务

打开新的终端，在项目根目录运行：

```bash
npm run dev:frontend
```

或者在 frontend 目录下运行：

```bash
cd frontend
npm run dev
```

前端服务将在 `http://localhost:5173` 启动

### 4. 访问应用

在浏览器中打开 `http://localhost:5173` 即可开始使用！

## 📡 API 接口文档

### 健康检查
检查服务是否正常运行

```
GET /api/health
```

**响应示例：**
```json
{
  "status": "ok",
  "message": "小黄聚合搜索服务正常运行"
}
```

### 搜索接口
执行聚合搜索

```
GET /api/search?q=关键词&type=类型
```

**参数：**
- `q` (必填): 搜索关键词
- `type` (可选): 搜索类型
  - `all` - 全部类型（默认）
  - `github` - 仅 GitHub 仓库
  - `article` - 仅文章
  - `video` - 仅视频
  - `product` - 仅商品

**响应示例：**
```json
{
  "query": "react",
  "total": 15,
  "results": [
    {
      "id": 10270250,
      "title": "facebook/react",
      "url": "https://github.com/facebook/react",
      "source": "GitHub",
      "type": "github",
      "snippet": "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
      "stars": 220000,
      "forks": 45000,
      "language": "JavaScript"
    }
  ]
}
```

### 热门搜索
获取热门搜索关键词

```
GET /api/hot
```

**响应示例：**
```json
{
  "hotKeywords": [
    "JavaScript",
    "Vue",
    "React",
    "Node.js",
    "TypeScript",
    "算法",
    "系统设计",
    "Python",
    "Java"
  ]
}
```

## 🎯 使用说明

1. **输入搜索关键词**
   - 在搜索框中输入你想搜索的内容
   - 支持中文和英文关键词

2. **执行搜索**
   - 点击"搜索"按钮，或者直接按回车键

3. **筛选结果**
   - 使用顶部的筛选标签查看特定类型的结果
   - 支持：全部、GitHub、文章、视频、商品

4. **快速搜索**
   - 点击热门搜索标签，快速搜索热门关键词

5. **查看详情**
   - 点击任意搜索结果，会在新标签页中打开原链接

## 🏗️ 构建生产版本

### 构建前端
```bash
npm run build:frontend
```

前端构建产物将生成在 `frontend/dist` 目录

## 💡 扩展开发

### 添加新的搜索源

在 `backend/server.js` 中添加新的搜索函数，例如：

```javascript
async function searchOtherSource(query) {
  // 实现你的搜索逻辑
  return results;
}
```

然后在 `/api/search` 路由中调用它。

### 修改样式

在 `frontend/src/style.css` 中自定义样式，轻松修改主题颜色、布局等。

### GitHub API 速率限制

注意 GitHub Search API 有速率限制：
- 未认证：60 次/小时
- 认证后：30 次/分钟

如需更高的请求限额，可以在 `backend/server.js` 中添加 GitHub Personal Access Token。

## 📝 更新日志

### v1.1.0 (2026-02-25)
- ✨ 集成 GitHub 仓库搜索
- 🐙 添加 GitHub 筛选标签
- ⭐ 显示仓库 Star、Fork、语言信息
- 🔧 优化搜索结果排序

### v1.0.0 (2026-02-25)
- 🎉 初始版本发布
- ✅ 基础搜索功能
- 🎨 美观的 UI 界面
- 📱 响应式设计

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License - 详见 LICENSE 文件

## 👤 作者

小黄

---

**享受搜索的乐趣！** 🚀
