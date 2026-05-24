import { useState } from "react";
import { students } from "./data/students.js";
import TechBackground from "./components/TechBackground.jsx";
import StudentNameCard from "./components/StudentNameCard.jsx";

const cardMeta = [
  { project: "贪吃蛇小游戏", tag: "Python", tone: "cyan" },
  { project: "创意练习场", tag: "Scratch", tone: "violet" },
  { project: "星球探险记", tag: "Scratch", tone: "violet" },
  { project: "太空射击战", tag: "小游戏", tone: "cyan" },
  { project: "3D 方块世界", tag: "Web 3D", tone: "cyan" },
  { project: "循环总结", tag: "HTML", tone: "violet" },
];

const categories = ["全部", "Scratch", "Python", "小游戏", "动画作品", "更多"];

const stats = [
  { value: `${students.length}+`, label: "学生入口总数" },
  { value: "100%", label: "作品文件保留" },
  { value: "3D", label: "科技展厅视觉" },
  { value: "Cloud", label: "Pages 在线展示" },
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState("全部");

  const showcaseStudents = students.map((student, index) => ({
    ...student,
    ...cardMeta[index % cardMeta.length],
    position: index,
  }));

  const leftCards = showcaseStudents.slice(0, Math.ceil(showcaseStudents.length / 2));
  const rightCards = showcaseStudents.slice(Math.ceil(showcaseStudents.length / 2));

  return (
    <main className="app-shell">
      <TechBackground />

      <header className="top-nav" aria-label="主导航">
        <a className="brand-lockup" href="/" aria-label="返回首页">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span>学生编程作品展示</span>
        </a>

        <nav className="nav-links" aria-label="页面栏目">
          <a href="/" className="active">
            首页
          </a>
          <a href="#gallery">作品广场</a>
          <a href="#ranking">排行榜</a>
          <a href="#guide">创作指南</a>
          <a href="#about">关于我们</a>
        </nav>

        <div className="nav-actions">
          <label className="search-shell">
            <span className="sr-only">搜索学生或作品</span>
            <input type="search" placeholder="搜索学生或作品..." />
            <span className="search-icon" aria-hidden="true" />
          </label>
          <a className="login-button" href="#login">
            登录 / 注册
          </a>
        </div>
      </header>

      <section className="hero-stage" aria-labelledby="page-title">
        <div className="hero-title">
          <span className="title-frame" aria-hidden="true" />
          <h1 id="page-title">学生编程作品展示</h1>
          <p>探索每位同学的创意程序</p>
        </div>

        <div className="showcase-field" id="gallery">
          <div className="card-column card-column--left">
            {leftCards.map((student) => (
              <StudentNameCard key={student.path} student={student} />
            ))}
          </div>

          <div className="holo-core" aria-hidden="true">
            <div className="holo-cube">
              <span className="cube-face cube-face--front" />
              <span className="cube-face cube-face--back" />
              <span className="cube-face cube-face--right" />
              <span className="cube-face cube-face--left" />
              <span className="cube-face cube-face--top" />
              <span className="cube-face cube-face--bottom" />
            </div>
            <span className="holo-ring holo-ring--one" />
            <span className="holo-ring holo-ring--two" />
            <span className="data-rain data-rain--one" />
            <span className="data-rain data-rain--two" />
          </div>

          <div className="card-column card-column--right">
            {rightCards.map((student) => (
              <StudentNameCard key={student.path} student={student} />
            ))}
          </div>
        </div>

        <div className="category-dock" aria-label="作品分类" id="guide">
          {categories.map((category) => (
            <button
              className={activeCategory === category ? "active" : ""}
              type="button"
              key={category}
              onClick={() => setActiveCategory(category)}
            >
              <span className="dock-icon" aria-hidden="true" />
              {category}
            </button>
          ))}
        </div>

        <aside className="stats-panel" id="ranking" aria-label="展厅数据">
          {stats.map((item) => (
            <div className="stat-item" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
          <a className="upload-card" href="#gallery">
            <strong>立即上传作品</strong>
            <span>分享你的创意程序</span>
          </a>
        </aside>
      </section>

      <footer className="site-footer" id="about">
        Powered by Lemon Maker Coding School
      </footer>
    </main>
  );
}
