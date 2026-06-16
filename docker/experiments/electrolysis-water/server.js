import express from 'express'
import cors from 'cors'
const app = express()
app.use(cors()); app.use(express.json())
app.get('/health', (_, res) => res.json({ status:'ok', experiment:'electrolysis-water' }))
app.post('/simulate', (req, res) => {
  const { variables={}, componentIds=[] } = req.body
  if (!componentIds.includes('electrolysis-cell')) return res.json({ status:'incomplete', message:'Add the electrolysis cell.' })
  if (!componentIds.includes('dc-supply'))         return res.json({ status:'incomplete', message:'Add a DC power supply.' })
  if (!componentIds.includes('electrodes'))        return res.json({ status:'incomplete', message:'Add electrodes.' })
  if (!componentIds.includes('ammeter-e'))         return res.json({ status:'incomplete', message:'Add an ammeter.' })
  const I=parseFloat(variables.current??2); const t_min=parseFloat(variables.electrolysisTime??10)
  const Q=I*t_min*60; const F=96485; const me=Q/F
  const volH2=(me/2*24000).toFixed(1); const volO2=(me/4*24000).toFixed(1)
  const graphData=[]
  for(let m=5;m<=30;m+=5){ const q=I*m*60; const mme=q/F; graphData.push({time:m,hydrogen:parseFloat((mme/2*24000).toFixed(1)),oxygen:parseFloat((mme/4*24000).toFixed(1))}) }
  res.json({ status:'complete',
    results:{ current:I.toFixed(1), charge:Q.toFixed(1), hydrogenVol:volH2, oxygenVol:volO2 },
    units:{ current:'A', charge:'C', hydrogenVol:'mL', oxygenVol:'mL' },
    labels:{ current:'Current', charge:'Total charge', hydrogenVol:'H₂ volume', oxygenVol:'O₂ volume' },
    graphData, graphAxes:{ x:'time', y:'hydrogen', xLabel:'Time (min)', yLabel:'Gas volume (mL)' },
    conclusion:`${Q.toFixed(0)}C passed. H₂:${volH2}mL, O₂:${volO2}mL. Ratio 2:1 ✓`
  })
})
app.listen(3000, () => console.log('electrolysis-water sim on :3000'))