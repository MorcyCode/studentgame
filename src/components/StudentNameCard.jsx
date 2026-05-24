export default function StudentNameCard({ student }) {
  return (
    <a
      className={`student-card student-card--${student.tone}`}
      href={student.path}
      style={{ "--card-delay": `${180 + student.position * 90}ms` }}
      aria-label={`进入 ${student.name} 的作品`}
    >
      <span className="avatar-orb" aria-hidden="true">
        {student.name.slice(0, 1)}
      </span>
      <span className="student-card__content">
        <strong>{student.name}</strong>
        <span>{student.project}</span>
        <em>{student.tag}</em>
      </span>
      <span className="card-arrow" aria-hidden="true" />
    </a>
  );
}
