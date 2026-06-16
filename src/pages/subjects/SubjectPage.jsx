import { useParams, useNavigate } from 'react-router-dom'
import { subjects, experiments } from '../../data/experiments'

export default function SubjectPage() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const subject = subjects.find(s => s.id === subjectId)

  if (!subject) return <div style={{ padding: '40px' }}>Subject not found.</div>

  const subjectExperiments = experiments.filter(e => e.subject === subjectId)

  return (
    <div style={styles.page}>
      {/* Hero */}
      <div style={styles.hero}>
        <button onClick={() => navigate('/')} style={styles.back}>← Dashboard</button>
        <div style={styles.heroContent}>
          <span style={styles.heroIcon}>{subject.icon}</span>
          <div>
            <h1 style={styles.heroTitle}>{subject.name}</h1>
            <p style={styles.heroDesc}>{subject.description}</p>
          </div>
        </div>
      </div>

      {/* Level cards */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Select your level</h2>
        <div style={styles.levelGrid}>
          {subject.levels.map(level => {
            const count = subjectExperiments.filter(e => e.level === level).length
            const isOLevel = level === 'o-level'
            return (
              <button
                key={level}
                onClick={() => navigate(`/subject/${subjectId}/${level}`)}
                style={styles.levelCard}
              >
                <div style={{ ...styles.levelBadge, background: isOLevel ? 'var(--green-50)' : '#F0FDF4' }}>
                  <span style={styles.levelBadgeText}>{isOLevel ? 'O' : 'A'}</span>
                </div>
                <div style={styles.levelInfo}>
                  <p style={styles.levelName}>{isOLevel ? 'O Level' : 'A Level'}</p>
                  <p style={styles.levelSub}>
                    {isOLevel ? 'Secondary school foundation' : 'Advanced secondary / pre-university'}
                  </p>
                  <p style={styles.levelCount}>{count} experiment{count !== 1 ? 's' : ''}</p>
                </div>
                <span style={styles.arrow}>→</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* All experiments preview */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>All experiments in {subject.name}</h2>
        <div style={styles.expList}>
          {subjectExperiments.map(exp => (
            <div key={exp.id} style={styles.expRow}
              onClick={() => navigate(`/subject/${subjectId}/${exp.level}/experiments`)}>
              <div style={styles.expRowLeft}>
                <p style={styles.expRowTitle}>{exp.title}</p>
                <p style={styles.expRowDesc}>{exp.description}</p>
              </div>
              <div style={styles.expRowRight}>
                <span style={styles.levelPill}>{exp.level === 'o-level' ? 'O Level' : 'A Level'}</span>
                <span style={styles.duration}>⏱ {exp.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const styles = {
  page: { padding: '32px', maxWidth: '900px' },
  hero: { marginBottom: '32px' },
  back: { background: 'none', border: 'none', color: 'var(--gray-400)', fontSize: '14px', padding: '0 0 16px 0', cursor: 'pointer' },
  heroContent: { display: 'flex', alignItems: 'center', gap: '20px', background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: '28px 32px' },
  heroIcon: { fontSize: '48px', flexShrink: 0 },
  heroTitle: { fontSize: '28px', fontWeight: '700', color: 'var(--gray-800)', marginBottom: '6px' },
  heroDesc: { fontSize: '15px', color: 'var(--gray-600)', lineHeight: '1.6' },
  section: { marginBottom: '32px' },
  sectionTitle: { fontSize: '17px', fontWeight: '700', color: 'var(--gray-800)', marginBottom: '14px' },
  levelGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' },
  levelCard: { display: 'flex', alignItems: 'center', gap: '16px', background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', padding: '20px 22px', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'box-shadow 0.2s' },
  levelBadge: { width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  levelBadgeText: { fontSize: '22px', fontWeight: '800', color: 'var(--green-500)' },
  levelInfo: { flex: 1 },
  levelName: { fontSize: '16px', fontWeight: '700', color: 'var(--gray-800)', marginBottom: '2px' },
  levelSub: { fontSize: '13px', color: 'var(--gray-400)', marginBottom: '6px' },
  levelCount: { fontSize: '13px', color: 'var(--green-500)', fontWeight: '600' },
  arrow: { color: 'var(--gray-400)', fontSize: '18px' },
  expList: { background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', overflow: 'hidden' },
  expRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '16px 20px', borderBottom: '1px solid var(--gray-100)', cursor: 'pointer', transition: 'background 0.15s' },
  expRowLeft: { flex: 1, minWidth: 0 },
  expRowTitle: { fontSize: '14px', fontWeight: '600', color: 'var(--gray-800)', marginBottom: '2px' },
  expRowDesc: { fontSize: '13px', color: 'var(--gray-400)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  expRowRight: { display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 },
  levelPill: { fontSize: '11px', fontWeight: '700', background: 'var(--green-50)', color: 'var(--green-500)', padding: '3px 10px', borderRadius: '999px' },
  duration: { fontSize: '12px', color: 'var(--gray-400)' },
}