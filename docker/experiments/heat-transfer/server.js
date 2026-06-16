import express from 'express'
import cors from 'cors'
const app = express()
app.use(cors()); app.use(express.json())
app.get('/health', (_, res) => res.json({ status:'ok', experiment:'heat-transfer' }))
app.post('/simulate', (req, res) => {
  const { variables={}, componentIds=[] } = req.body
  if (!componentIds.includes('bunsen'))      return res.json({ status:'incomplete', message:'Add a Bunsen burner as heat source.' })
  if (!componentIds.includes('thermometer')) return res.json({ status:'incomplete', message:'Add a thermometer to measure temperature.' })
  const t=parseFloat(variables.heatTime??5); const T0=22; const k=0.08
  const graphData=[]
  for(let m=0;m<=10;m+=0.5) graphData.push({ time:m, conduction:parseFloat((T0+25*(1-Math.exp(-k*m))).toFixed(2)), convection:parseFloat((T0+20*(1-Math.exp(-k*0.7*m))).toFixed(2)), radiation:parseFloat((T0+15*(1-Math.exp(-k*0.5*m))).toFixed(2)) })
  const Tc=T0+25*(1-Math.exp(-k*t)); const Tv=T0+20*(1-Math.exp(-k*0.7*t)); const Tr=T0+15*(1-Math.exp(-k*0.5*t))
  res.json({ status:'complete',
    results:{ time:t.toFixed(0), conductionTemp:Tc.toFixed(2), convectionTemp:Tv.toFixed(2), radiationTemp:Tr.toFixed(2) },
    units:{ time:'min', conductionTemp:'°C', convectionTemp:'°C', radiationTemp:'°C' },
    labels:{ time:'Heating time', conductionTemp:'Conduction temp', convectionTemp:'Convection temp', radiationTemp:'Radiation temp' },
    graphData, graphAxes:{ x:'time', y:'conduction', xLabel:'Time (min)', yLabel:'Temperature (°C)' },
    conclusion:`After ${t}min: Conduction=${Tc.toFixed(1)}°C, Convection=${Tv.toFixed(1)}°C, Radiation=${Tr.toFixed(1)}°C. Conduction is fastest through solid metal.`
  })
})
app.listen(3000, () => console.log('heat-transfer sim on :3000'))