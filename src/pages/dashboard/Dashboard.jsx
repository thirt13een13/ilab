import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'
import { subjects, experiments } from '../../data/experiments'

const difficultyColor = {
  Beginner: { bg: '#EAF3DE', color: '#3B6D11' },
  Intermediate: { bg: '#FEF9C3', color: '#854D0E' },
  Advanced: { bg: '#FEE2E2', color: '#991B1B' },
}

export default function Dashboard() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? 'Student'
  const recentExperiments = experiments.slice(0, 4)

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.greeting}>Good day, {firstName} 👋</h1>
          <p style={styles.sub}>What would you like to explore today?</p>
        </div>
        <div style={styles.badge}>
          <span style={styles.badgeDot} />
          Lab is open
        </div>
      </div>

      {/* Stats row */}
      <div style={styles.statsRow}>
        {[
          { label: 'Subjects', value: subjects.length },
          { label: 'Experiments available', value: experiments.length },
          { label: 'Completed', value: 0 },
          { label: 'Hours in lab', value: 0 },
        ].map(s => (
          <div key={s.label} style={styles.statCard}>
            <p style={styles.statValue}>{s.value}</p>
            <p style={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Subject cards */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Subjects</h2>
        <div style={styles.subjectGrid}>
          {subjects.map(subject => {
            const count = experiments.filter(e => e.subject === subject.id).length
            return (
              <button
                key={subject.id}
                onClick={() => navigate(`/subject/${subject.id}`)}
                style={styles.subjectCard}
              >
                <div style={styles.subjectIconWrap}>
                  <span style={styles.subjectIcon}>{subject.icon}</span>
                </div>
                <div>
                  <p style={styles.subjectName}>{subject.name}</p>
                  <p style={styles.subjectCount}>{count} experiment{count !== 1 ? 's' : ''}</p>
                </div>
                <span style={styles.arrow}>→</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Recent experiments */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Available experiments</h2>
        <div style={styles.expGrid}>
          {recentExperiments.map(exp => {
            const dc = difficultyColor[exp.difficulty]
            return (
              <div key={exp.id} style={styles.expCard}
                onClick={() => navigate(`/subject/${exp.subject}/${exp.level}/experiments`)}
              >
                <div style={styles.expTop}>
                  <span style={{ ...styles.diffBadge, background: dc.bg, color: dc.color }}>
                    {exp.difficulty}
                  </span>
                  <span style={styles.duration}>⏱ {exp.duration}</span>
                </div>
                <p style={styles.expTitle}>{exp.title}</p>
                <p style={styles.expDesc}>{exp.description}</p>
                <div style={styles.topics}>
                  {exp.topics.map(t => (
                    <span key={t} style={styles.topic}>{t}</span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

const styles = {
  page: { padding: '32px', maxWidth: '1100px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' },
  greeting: { fontSize: '26px', fontWeight: '700', color: 'var(--gray-800)', marginBottom: '4px' },
  sub: { fontSize: '15px', color: 'var(--gray-600)' },
  badge: { display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--green-50)', color: 'var(--green-500)', padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: '600', border: '1px solid var(--green-100)' },
  badgeDot: { width: '7px', height: '7px', borderRadius: '50%', background: 'var(--green-500)', animation: 'pulse 2s infinite' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' },
  statCard: { background: '#fff', borderRadius: 'var(--radius-md)', padding: '18px 20px', border: '1px solid var(--gray-200)' },
  statValue: { fontSize: '28px', fontWeight: '700', color: 'var(--green-500)', lineHeight: 1 },
  statLabel: { fontSize: '13px', color: 'var(--gray-600)', marginTop: '4px' },
  section: { marginBottom: '36px' },
  sectionTitle: { fontSize: '17px', fontWeight: '700', color: 'var(--gray-800)', marginBottom: '14px' },
  subjectGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' },
  subjectCard: { display: 'flex', alignItems: 'center', gap: '14px', background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', padding: '18px 20px', cursor: 'pointer', textAlign: 'left', transition: 'box-shadow 0.2s, border-color 0.2s' },
  subjectIconWrap: { width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', background: 'var(--green-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  subjectIcon: { fontSize: '22px' },
  subjectName: { fontSize: '15px', fontWeight: '600', color: 'var(--gray-800)' },
  subjectCount: { fontSize: '13px', color: 'var(--gray-400)', marginTop: '2px' },
  arrow: { marginLeft: 'auto', color: 'var(--gray-400)', fontSize: '18px' },
  expGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' },
  expCard: { background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', padding: '18px 20px', cursor: 'pointer', transition: 'box-shadow 0.2s' },
  expTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  diffBadge: { fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '999px' },
  duration: { fontSize: '12px', color: 'var(--gray-400)' },
  expTitle: { fontSize: '15px', fontWeight: '600', color: 'var(--gray-800)', marginBottom: '6px' },
  expDesc: { fontSize: '13px', color: 'var(--gray-600)', lineHeight: '1.5', marginBottom: '12px' },
  topics: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  topic: { fontSize: '11px', background: 'var(--gray-100)', color: 'var(--gray-600)', padding: '3px 10px', borderRadius: '999px', border: '1px solid var(--gray-200)' },
}