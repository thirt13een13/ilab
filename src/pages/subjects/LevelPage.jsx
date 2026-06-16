import { useParams, useNavigate } from 'react-router-dom'
import { subjects, experiments } from '../../data/experiments'

const difficultyColor = {
  Beginner: { bg: '#EAF3DE', color: '#3B6D11' },
  Intermediate: { bg: '#FEF9C3', color: '#854D0E' },
  Advanced: { bg: '#FEE2E2', color: '#991B1B' },
}

export default function LevelPage() {
  const { subjectId, level } = useParams()
  const navigate = useNavigate()
  const subject = subjects.find(s => s.id === subjectId)
  const levelExperiments = experiments.filter(e => e.subject === subjectId && e.level === level)
  const levelLabel = level === 'o-level' ? 'O Level' : 'A Level'

  if (!subject) return <div style={{ padding: '40px' }}>Subject not found.</div>

  return (
    <div style={styles.page}>
      <button onClick={() => navigate(`/subject/${subjectId}`)} style={styles.back}>
        ← {subject.name}
      </button>

      <div style={styles.header}>
        <div>
          <div style={styles.crumb}>{subject.icon} {subject.name}</div>
          <h1 style={styles.title}>{levelLabel} Experiments</h1>
          <p style={styles.sub}>{levelExperiments.length} experiments available</p>
        </div>
        <button
          onClick={() => navigate(`/subject/${subjectId}/${level}/experiments`)}
          style={styles.viewAllBtn}
        >
          View all experiments →
        </button>
      </div>

      <div style={styles.grid}>
        {levelExperiments.map(exp => {
          const dc = difficultyColor[exp.difficulty]
          return (
            <div
              key={exp.id}
              style={styles.card}
              onClick={() => navigate(`/subject/${subjectId}/${level}/experiments`)}
            >
              <div style={styles.cardTop}>
                <span style={{ ...styles.diffBadge, background: dc.bg, color: dc.color }}>
                  {exp.difficulty}
                </span>
                <span style={styles.duration}>⏱ {exp.duration}</span>
              </div>
              <h3 style={styles.cardTitle}>{exp.title}</h3>
              <p style={styles.cardDesc}>{exp.description}</p>
              <div style={styles.topics}>
                {exp.topics.map(t => (
                  <span key={t} style={styles.topic}>{t}</span>
                ))}
              </div>
              <div style={styles.cardFooter}>
                <span style={styles.startBtn}>Start experiment →</span>
              </div>
            </div>
          )
        })}
      </div>

      {levelExperiments.length === 0 && (
        <div style={styles.empty}>
          <p>No experiments yet for {subject.name} {levelLabel}.</p>
          <p style={{ fontSize: '13px', color: 'var(--gray-400)', marginTop: '6px' }}>Check back soon.</p>
        </div>
      )}
    </div>
  )
}

const styles = {
  page: { padding: '32px', maxWidth: '1000px' },
  back: { background: 'none', border: 'none', color: 'var(--gray-400)', fontSize: '14px', padding: '0 0 20px 0', cursor: 'pointer' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' },
  crumb: { fontSize: '13px', color: 'var(--gray-400)', marginBottom: '6px' },
  title: { fontSize: '26px', fontWeight: '700', color: 'var(--gray-800)', marginBottom: '4px' },
  sub: { fontSize: '14px', color: 'var(--gray-600)' },
  viewAllBtn: { background: 'var(--green-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px 18px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' },
  card: { background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', padding: '20px', cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.15s', display: 'flex', flexDirection: 'column', gap: '10px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  diffBadge: { fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '999px' },
  duration: { fontSize: '12px', color: 'var(--gray-400)' },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: 'var(--gray-800)' },
  cardDesc: { fontSize: '13px', color: 'var(--gray-600)', lineHeight: '1.55', flex: 1 },
  topics: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  topic: { fontSize: '11px', background: 'var(--gray-100)', color: 'var(--gray-600)', padding: '3px 10px', borderRadius: '999px', border: '1px solid var(--gray-200)' },
  cardFooter: { borderTop: '1px solid var(--gray-100)', paddingTop: '10px', marginTop: '4px' },
  startBtn: { fontSize: '13px', fontWeight: '600', color: 'var(--green-500)' },
  empty: { textAlign: 'center', padding: '60px 20px', color: 'var(--gray-600)', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' },
}