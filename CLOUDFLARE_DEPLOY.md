# Cloudflare Pages 部署说明

这个项目是 React + Vite，不能直接把源码版 `index.html` 当静态文件发布。

Cloudflare Pages 需要这样设置：

- Framework preset: `React (Vite)` 或 `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Node.js version: `18` 或更高

如果使用 Cloudflare Pages Direct Upload：

```bash
npm install
npm run build
```

然后只上传生成的 `dist` 文件夹内容。

如果使用 Wrangler：

```bash
npm run deploy:cloudflare
```

注意：GitHub 仓库必须包含 `src` 文件夹，否则 Cloudflare 无法构建 React 代码。
