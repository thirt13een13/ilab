
import { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay
} from '@dnd-kit/core'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

import {
  runExperimentSimulation,
  checkContainerHealth
} from '../../lib/simulationClient'

// ─────────────────────────────────────────────
// Draggable Component
// ─────────────────────────────────────────────
function DraggableComponent({ component }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `tray-${component.id}`,
    data: { component },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        ...styles.trayItem,
        opacity: isDragging ? 0.4 : 1,
        cursor: 'grab',
      }}
    >
      <span>{component.icon}</span>
      <div>
        <p>{component.label}</p>
        <small>{component.description}</small>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Canvas Item
// ─────────────────────────────────────────────
function PlacedItem({ item, onRemove }) {
  return (
    <div style={{ ...styles.placedItem, left: item.x, top: item.y }}>
      <span>{item.icon}</span>
      <p>{item.label}</p>
      <button onClick={() => onRemove(item.id)}>×</button>
    </div>
  )
}

// ─────────────────────────────────────────────
// Canvas
// ─────────────────────────────────────────────
function Canvas({ placedItems, isOver }) {
  const { setNodeRef } = useDroppable({ id: 'canvas' })

  return (
    <div
      ref={setNodeRef}
      style={{
        ...styles.canvas,
        background: isOver ? '#eefbee' : '#fafafa',
      }}
    >
      {placedItems.length === 0 && (
        <div style={styles.empty}>
          Drag components here
        </div>
      )}

      {placedItems.map(item => (
        <PlacedItem key={item.id} item={item} />
      ))}

      {/* ───── Wire Layer (placeholder for next upgrade) ───── */}
      <svg style={styles.wireLayer}>
        {/* Future: render connections here */}
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────
// Main Workspace
// ─────────────────────────────────────────────
export default function Workspace() {
  const { experimentId, subjectId, level } = useParams()
  const navigate = useNavigate()

  // 🔥 DB CONFIG (replaces experimentConfigs)
  const [config, setConfig] = useState(null)

  const [placedItems, setPlacedItems] = useState([])
  const [activeComponent, setActiveComponent] = useState(null)
  const [isOver, setIsOver] = useState(false)

  // variables loaded dynamically
  const [variables, setVariables] = useState({})

  const [result, setResult] = useState(null)
  const [containerStatus, setContainerStatus] = useState(null)

  // ───── NEW: wire system placeholder ─────
  const [connections, setConnections] = useState([])

  // ─────────────────────────────────────────
  // LOAD CONFIG FROM BACKEND
  // ─────────────────────────────────────────
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch(`/api/experiments/${experimentId}`)
        const data = await res.json()
        setConfig(data)
      } catch (err) {
        console.error('Failed loading config:', err)
      }
    }

    if (experimentId) loadConfig()
  }, [experimentId])

  // ─────────────────────────────────────────
  // INIT VARIABLES AFTER CONFIG LOAD
  // ─────────────────────────────────────────
  useEffect(() => {
    if (!config?.variables) return

    setVariables(
      Object.fromEntries(
        Object.entries(config.variables).map(([k, v]) => [
          k,
          v.default,
        ])
      )
    )
  }, [config])

  // ─────────────────────────────────────────
  // CHECK CONTAINER HEALTH
  // ─────────────────────────────────────────
  useEffect(() => {
    if (!config?.dockerPort) return

    checkContainerHealth(config.dockerPort, experimentId)
      .then(setContainerStatus)
  }, [config, experimentId])

  // ─────────────────────────────────────────
  // DRAG HANDLERS
  // ─────────────────────────────────────────
  const handleDragStart = useCallback((event) => {
    setActiveComponent(event.active.data.current?.component)
  }, [])

  const handleDragOver = useCallback((event) => {
    setIsOver(event.over?.id === 'canvas')
  }, [])

  const handleDragEnd = useCallback((event) => {
    setIsOver(false)
    setActiveComponent(null)

    if (event.over?.id !== 'canvas') return

    const component = event.active.data.current?.component
    if (!component) return

    setPlacedItems(prev => [
      ...prev,
      {
        id: `${component.id}-${Date.now()}`,
        ...component,
        x: 80,
        y: 80,
      },
    ])
  }, [])

  // ─────────────────────────────────────────
  // RUN SIMULATION
  // ─────────────────────────────────────────
  async function handleRun() {
    if (!config?.dockerPort) return

    setResult({ status: 'loading' })

    const sim = await runExperimentSimulation(
      experimentId,
      config.dockerPort,
      variables,
      placedItems,
      connections // 🔥 ready for future wire system
    )

    setResult(sim)
  }

  const handleRemove = (id) => {
    setPlacedItems(prev => prev.filter(i => i.id !== id))
    setResult(null)
  }

  const handleReset = () => {
    setPlacedItems([])
    setConnections([])
    setResult(null)
  }

  const handleVariableChange = (key, val) => {
    setVariables(prev => ({ ...prev, [key]: parseFloat(val) }))
    setResult(null)
  }

  // ─────────────────────────────────────────
  // LOADING STATE
  // ─────────────────────────────────────────
  if (!config) {
    return <div style={{ padding: 20 }}>Loading experiment...</div>
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div style={styles.workspace}>

        {/* Container warning */}
        {containerStatus && !containerStatus.online && (
          <div style={styles.warn}>
            ⚠️ Container offline: docker compose up {experimentId} -d
          </div>
        )}

        {/* LEFT PANEL */}
        <div style={styles.left}>
          {config.components.map(c => (
            <DraggableComponent key={c.id} component={c} />
          ))}
        </div>

        {/* CENTER CANVAS */}
        <div style={styles.center}>
          <Canvas
            placedItems={placedItems}
            isOver={isOver}
          />
        </div>

        {/* RIGHT PANEL */}
        <div style={styles.right}>
          <h3>Simulation</h3>

          <button onClick={handleRun}>▶ Run</button>

          {result?.status === 'loading' && <p>Running...</p>}

          {result?.status === 'complete' && (
            <pre>{JSON.stringify(result.results, null, 2)}</pre>
          )}

          <button onClick={handleReset}>Clear</button>
        </div>

      </div>

      {/* Drag preview */}
      <DragOverlay>
        {activeComponent && (
          <div style={styles.overlay}>
            {activeComponent.icon} {activeComponent.label}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const styles = {
  workspace: {
    display: 'flex',
    height: '100vh'
  },

  left: {
    width: 220,
    background: '#fff',
    padding: 10
  },

  center: {
    flex: 1,
    padding: 10
  },

  right: {
    width: 280,
    background: '#fff',
    padding: 10
  },

  canvas: {
    height: '100%',
    border: '1px solid #ddd',
    position: 'relative'
  },

  empty: {
    padding: 20,
    color: '#888'
  },

  wireLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none'
  },

  warn: {
    position: 'absolute',
    top: 10,
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#FEF9C3',
    padding: 8,
    borderRadius: 6,
    fontSize: 12,
    zIndex: 50
  },

  overlay: {
    padding: 10,
    background: '#fff',
    border: '1px solid #ddd'
  }
}