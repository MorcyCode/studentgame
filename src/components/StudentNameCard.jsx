export default function StudentNameCard({ name, path, index = 0 }) {
  return (
    <a
      className="student-card"
      href={path}
      style={{ "--card-delay": `${180 + index * 90}ms` }}
      aria-label={`进入 ${name} 的作品`}
    >
      <span className="student-card__ring" aria-hidden="true" />
      <span className="student-card__glow" aria-hidden="true" />
      <span className="student-card__name">{name}</span>
    </a>
  );
}
