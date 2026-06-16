import express from 'express'
import cors from 'cors'
const app = express()
app.use(cors()); app.use(express.json())
app.get('/health', (_, res) => res.json({ status: 'ok', experiment: 'hookes-law' }))
app.post('/simulate', (req, res) => {
  const { variables = {}, componentIds = [] } = req.body
  if (!componentIds.includes('stand'))  return res.json({ status:'incomplete', message:'Set up the retort stand first.' })
  if (!componentIds.includes('spring')) return res.json({ status:'incomplete', message:'Hang a spring from the stand.' })
  if (!componentIds.some(id => id.startsWith('mass'))) return res.json({ status:'incomplete', message:'Add at least one mass.' })
  if (!componentIds.includes('ruler'))  return res.json({ status:'incomplete', message:'Add a ruler to measure extension.' })
  const massG = parseFloat(variables.mass ?? 100)
  const k     = parseFloat(variables.springConstant ?? 10)
  const F     = (massG / 1000) * 9.81
  const x     = F / k
  const graphData = []
  for (let m = 100; m <= 1000; m += 100) {
    const f = (m/1000)*9.81
    graphData.push({ force: parseFloat(f.toFixed(3)), extension: parseFloat((f/k).toFixed(4)) })
  }
  res.json({ status:'complete',
    results: { mass:massG.toFixed(0), force:F.toFixed(3), extension:x.toFixed(4), springConstant:k.toFixed(1) },
    units:   { mass:'g', force:'N', extension:'m', springConstant:'N/m' },
    labels:  { mass:'Mass', force:'Force applied', extension:'Spring extension', springConstant:'Spring constant' },
    graphData, graphAxes:{ x:'force', y:'extension', xLabel:'Force (N)', yLabel:'Extension (m)' },
    conclusion:`With ${massG}g: F=${F.toFixed(3)}N, x=${x.toFixed(4)}m. k=F/x=${k}N/m ✓`
  })
})
app.listen(3000, () => console.log('hookes-law sim on :3000'))