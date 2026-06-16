import express from 'express'
import cors from 'cors'
const app = express()
app.use(cors()); app.use(express.json())
app.get('/health', (_, res) => res.json({ status:'ok', experiment:'simple-pendulum' }))
app.post('/simulate', (req, res) => {
  const { variables={}, componentIds=[] } = req.body
  if (!componentIds.includes('bob'))       return res.json({ status:'incomplete', message:'Add the pendulum bob.' })
  if (!componentIds.includes('string'))    return res.json({ status:'incomplete', message:'Attach a string to the bob.' })
  if (!componentIds.includes('clamp'))     return res.json({ status:'incomplete', message:'Set up a clamp stand.' })
  if (!componentIds.includes('stopwatch')) return res.json({ status:'incomplete', message:'Add a stopwatch.' })
  const L_cm=parseFloat(variables.length??50); const L=L_cm/100; const g=9.81
  const T=2*Math.PI*Math.sqrt(L/g)
  const graphData=[]
  for(let l=10;l<=100;l+=5){ const t=2*Math.PI*Math.sqrt(l/100/g); graphData.push({length:l,period:parseFloat(t.toFixed(4)),periodSquared:parseFloat((t*t).toFixed(4))}) }
  res.json({ status:'complete',
    results:{ length:L_cm.toFixed(0), period:T.toFixed(4), periodSquared:(T*T).toFixed(4), g:g.toFixed(2) },
    units:{ length:'cm', period:'s', periodSquared:'s²', g:'m/s²' },
    labels:{ length:'Pendulum length', period:'Period T', periodSquared:'T²', g:'g (from gradient)' },
    graphData, graphAxes:{ x:'length', y:'period', xLabel:'Length (cm)', yLabel:'Period (s)' },
    conclusion:`For L=${L_cm}cm: T=${T.toFixed(4)}s, T²=${(T*T).toFixed(4)}s². Gradient of T² vs L → g≈9.81m/s² ✓`
  })
})
app.listen(3000, () => console.log('simple-pendulum sim on :3000'))