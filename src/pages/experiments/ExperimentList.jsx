import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { subjects, experiments } from '../../data/experiments'

const difficultyColor = {
  Beginner: { bg: '#EAF3DE', color: '#3B6D11' },
  Intermediate: { bg: '#FEF9C3', color: '#854D0E' },
  Advanced: { bg: '#FEE2E2', color: '#991B1B' },
}

export default function ExperimentList() {
  const { subjectId, level } = useParams()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const subject = subjects.find(s => s.id === subjectId)
  const levelLabel = level === 'o-level' ? 'O Level' : 'A Level'

  const filtered = experiments.filter(e => {
    const matchSubject = e.subject === subjectId
    const matchLevel = e.level === level
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || e.difficulty === filter
    return matchSubject && matchLevel && matchSearch && matchFilter
  })

  if (!subject) return <div style={{ padding: '40px' }}>Not found.</div>

  return (
    <div style={styles.page}>
      <button onClick={() => navigate(`/subject/${subjectId}/${level}`)} style={styles.back}>
        ← {levelLabel}
      </button>

      <div style={styles.header}>
        <div>
          <p style={styles.crumb}>{subject.icon} {subject.name} / {levelLabel}</p>
          <h1 style={styles.title}>Experiments</h1>
        </div>
      </div>

      {/* Search + filter bar */}
      <div style={styles.toolbar}>
        <input
          style={styles.search}
          type="text"
          placeholder="Search experiments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div style={styles.filters}>
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <p style={styles.resultCount}>{filtered.length} experiment{filtered.length !== 1 ? 's' : ''}</p>

      {/* Experiment cards */}
      <div style={styles.grid}>
        {filtered.map(exp => {
          const dc = difficultyColor[exp.difficulty]
          return (
            <div
              key={exp.id}
              style={styles.card}
              onClick={() => navigate(`/subject/${subjectId}/${level}/${exp.id}/workspace`)}
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
              <button style={styles.startBtn}>
                🧪 Start experiment
              </button>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div style={styles.empty}>
          <p style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</p>
          <p style={{ fontWeight: '600', color: 'var(--gray-800)' }}>No experiments found</p>
          <p style={{ fontSize: '13px', color: 'var(--gray-400)', marginTop: '4px' }}>
            Try a different search or filter
          </p>
        </div>
      )}
    </div>
  )
}

const styles = {
  page: { padding: '32px', maxWidth: '1000px' },
  back: { background: 'none', border: 'none', color: 'var(--gray-400)', fontSize: '14px', padding: '0 0 20px 0', cursor: 'pointer' },
  header: { marginBottom: '20px' },
  crumb: { fontSize: '13px', color: 'var(--gray-400)', marginBottom: '4px' },
  title: { fontSize: '26px', fontWeight: '700', color: 'var(--gray-800)' },
  toolbar: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' },
  search: { flex: 1, minWidth: '200px', padding: '10px 14px', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', fontSize: '14px', outline: 'none', color: 'var(--gray-800)' },
  filters: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  filterBtn: { padding: '8px 14px', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: '500', background: '#fff', color: 'var(--gray-600)', cursor: 'pointer', transition: 'all 0.15s' },
  filterActive: { background: 'var(--green-50)', border: '1.5px solid var(--green-200)', color: 'var(--green-500)', fontWeight: '700' },
  resultCount: { fontSize: '13px', color: 'var(--gray-400)', marginBottom: '16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' },
  card: { background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px', transition: 'box-shadow 0.2s' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  diffBadge: { fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '999px' },
  duration: { fontSize: '12px', color: 'var(--gray-400)' },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: 'var(--gray-800)' },
  cardDesc: { fontSize: '13px', color: 'var(--gray-600)', lineHeight: '1.55', flex: 1 },
  topics: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  topic: { fontSize: '11px', background: 'var(--gray-100)', color: 'var(--gray-600)', padding: '3px 10px', borderRadius: '999px', border: '1px solid var(--gray-200)' },
  startBtn: { marginTop: '4px', padding: '10px', background: 'var(--green-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textAlign: 'center' },
  empty: { textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' },
}