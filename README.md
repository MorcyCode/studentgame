# 学生编程作品展示

这是一个学生作品展示入口主页。首页采用 3D 科技感宇宙展厅视觉，学生卡片点击后进入对应作品文件夹。

## 本地运行

```bash
npm install
npm run dev
```

## 打包

```bash
npm run build
```

## 部署到 Cloudflare Pages

```bash
npm run build
npx wrangler pages deploy dist --project-name studentgame
```

## 新增学生方法

修改 `src/data/students.js`，新增一项：

```js
{
  name: "新学生",
  path: "/newstudent/",
}
```

然后在仓库根目录创建对应作品文件夹：

```text
newstudent/
```

把学生作品放进去，例如：

```text
newstudent/index.html
```

如果新增了静态作品文件夹，也需要在 `vite.config.mjs` 的 `studentFolders` 数组里加入文件夹名，这样 `npm run build` 会把作品一起复制到 `dist/`。

## 已有学生入口

- `/hank/`
- `/mavis/`
- `/qiu/`
- `/seven/`
- `/wang/`
- `/wrong/`
