import express from 'express'
import cors from 'cors'
const app = express()
app.use(cors()); app.use(express.json())
app.get('/health', (_, res) => res.json({ status:'ok', experiment:'enthalpy-neutralisation' }))
app.post('/simulate', (req, res) => {
  const { variables={}, componentIds=[] } = req.body
  if (!componentIds.includes('poly-cup'))      return res.json({ status:'incomplete', message:'Add a polystyrene calorimeter cup.' })
  if (!componentIds.includes('thermometer-e')) return res.json({ status:'incomplete', message:'Add a thermometer.' })
  if (!componentIds.includes('stirrer'))       return res.json({ status:'incomplete', message:'Add a glass stirrer.' })
  const C_acid=parseFloat(variables.hclConc??1); const V=0.05
  const moles=C_acid*V; const deltaH=-57100*(0.95+Math.random()*0.1)
  const q=moles*Math.abs(deltaH); const deltaT=q/(100*4.18)
  const T0=22; const Tmax=T0+deltaT
  const graphData=[]
  for(let v=0;v<=55;v+=5){ const t=v<=25?T0+(deltaT*v/25):Tmax-((v-25)*0.08); graphData.push({volume:v,temperature:parseFloat(t.toFixed(2))}) }
  res.json({ status:'complete',
    results:{ deltaT:deltaT.toFixed(2), heatReleased:q.toFixed(1), moles:moles.toFixed(4), deltaH:(deltaH/1000).toFixed(2) },
    units:{ deltaT:'°C', heatReleased:'J', moles:'mol', deltaH:'kJ/mol' },
    labels:{ deltaT:'Temperature rise', heatReleased:'Heat released', moles:'Moles H₂O', deltaH:'Molar enthalpy' },
    graphData, graphAxes:{ x:'volume', y:'temperature', xLabel:'Volume NaOH (mL)', yLabel:'Temperature (°C)' },
    conclusion:`ΔT=${deltaT.toFixed(2)}°C. q=${q.toFixed(1)}J. ΔH=${(deltaH/1000).toFixed(2)}kJ/mol (theoretical: -57.1kJ/mol)`
  })
})
app.listen(3000, () => console.log('enthalpy-neutralisation sim on :3000'))