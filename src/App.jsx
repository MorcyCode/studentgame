import { students } from "./data/students.js";
import TechBackground from "./components/TechBackground.jsx";
import StudentNameCard from "./components/StudentNameCard.jsx";

export default function App() {
  return (
    <main className="app-shell">
      <TechBackground />

      <section className="hero-panel" aria-labelledby="page-title">
        <div className="title-block">
          <h1 id="page-title">柠檬创客 · 学生作品星际展厅</h1>
          <p>每一个孩子，都是正在发光的小小创造者</p>
        </div>

        <div className="portal-grid" aria-label="学生作品入口">
          {students.map((student, index) => (
            <StudentNameCard
              key={student.path}
              name={student.name}
              path={student.path}
              index={index}
            />
          ))}
        </div>
      </section>

      <footer className="site-footer">Powered by Lemon Maker Coding School</footer>
    </main>
  );
}
