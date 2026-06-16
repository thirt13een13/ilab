import express from 'express'
import cors from 'cors'
const app = express()
app.use(cors()); app.use(express.json())
app.get('/health', (_, res) => res.json({ status:'ok', experiment:'acid-base-titration' }))
app.post('/simulate', (req, res) => {
  const { variables={}, componentIds=[] } = req.body
  if (!componentIds.includes('burette'))       return res.json({ status:'incomplete', message:'Add and fill the burette.' })
  if (!componentIds.includes('conical-flask')) return res.json({ status:'incomplete', message:'Add a conical flask with HCl.' })
  if (!componentIds.includes('indicator'))     return res.json({ status:'incomplete', message:'Add phenolphthalein indicator.' })
  if (!componentIds.includes('pipette'))       return res.json({ status:'incomplete', message:'Use a pipette to measure HCl.' })
  const C2=parseFloat(variables.naohConcentration??0.1); const V1=parseFloat(variables.hclVolume??25)
  const C1=0.08+Math.random()*0.04; const V2=(C1*V1)/C2
  const trials=[
    {trial:1,label:'Rough',volume:parseFloat((V2+0.6).toFixed(2)),concordant:false},
    {trial:2,label:'Run 1',volume:parseFloat(V2.toFixed(2)),concordant:true},
    {trial:3,label:'Run 2',volume:parseFloat((V2+0.05).toFixed(2)),concordant:true},
    {trial:4,label:'Run 3',volume:parseFloat((V2-0.05).toFixed(2)),concordant:true}
  ]
  const meanV2=trials.filter(t=>t.concordant).reduce((s,t)=>s+t.volume,0)/3
  res.json({ status:'complete',
    results:{ hclConcentration:C1.toFixed(4), naohVolume:meanV2.toFixed(2), hclVolume:V1.toFixed(1), naohConcentration:C2.toFixed(3) },
    units:{ hclConcentration:'mol/L', naohVolume:'mL', hclVolume:'mL', naohConcentration:'mol/L' },
    labels:{ hclConcentration:'HCl concentration', naohVolume:'Mean NaOH volume', hclVolume:'HCl volume', naohConcentration:'NaOH concentration' },
    graphData:trials, graphAxes:{ x:'trial', y:'volume', xLabel:'Trial', yLabel:'Volume NaOH (mL)' },
    conclusion:`C₁V₁=C₂V₂ → [HCl]=(${C2}×${meanV2.toFixed(2)})/${V1}=${C1.toFixed(4)}mol/L`
  })
})
app.listen(3000, () => console.log('acid-base-titration sim on :3000'))