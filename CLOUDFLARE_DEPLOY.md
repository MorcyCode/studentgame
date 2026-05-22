# Cloudflare Pages 部署说明

这个项目支持两种 Cloudflare Pages 发布方式：

1. 推荐方式：使用 Vite 构建
   - Framework preset: `React (Vite)` 或 `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`
   - Node.js version: `18` 或更高

2. 兜底方式：直接发布仓库根目录
   - 根目录 `index.html` 内置了静态首页兜底内容
   - 即使 Cloudflare 没有运行 Vite build，首页也会显示学生入口

如果使用 Wrangler：

```bash
npm install
npm run build
npm run deploy:cloudflare
```
