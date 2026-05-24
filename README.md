# 柠檬创客 · 学生作品星际展厅

这是一个学生作品展示入口主页，首页只展示学生名字卡片，点击后进入学生作品文件夹。

## 本地运行

```bash
npm install
npm run dev
```

## 打包

```bash
npm run build
```

## 新增学生方法

修改 `src/data/students.js`，新增：

```js
{
  name: "新学生",
  path: "/newstudent/"
}
```

然后在仓库根目录创建对应作品文件夹：

```text
newstudent/
```

并把学生作品放进去，例如：

```text
newstudent/index.html
```

## 已有学生入口

- `/hank/`
- `/mavis/`
- `/qiu/`
- `/seven/`
- `/wang/`
- `/wrong/`
