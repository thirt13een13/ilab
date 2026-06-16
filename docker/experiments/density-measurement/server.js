import express from 'express'
import cors from 'cors'
const app = express()
app.use(cors()); app.use(express.json())
app.get('/health', (_, res) => res.json({ status:'ok', experiment:'density-measurement' }))
app.post('/simulate', (req, res) => {
  const { variables={}, componentIds=[] } = req.body
  if (!componentIds.includes('balance-d'))    return res.json({ status:'incomplete', message:'Add a balance to measure mass.' })
  if (!componentIds.includes('cylinder'))     return res.json({ status:'incomplete', message:'Add a measuring cylinder.' })
  if (!componentIds.includes('water-beaker')) return res.json({ status:'incomplete', message:'Add water for displacement.' })
  const massG=parseFloat(variables['mass-d']??100); const volML=parseFloat(variables['volume-d']??100)
  const density=massG/volML
  const materials=[
    {name:'Water',density:1.0},{name:'Aluminium',density:2.7},{name:'Iron',density:7.87},
    {name:'Copper',density:8.96},{name:'Lead',density:11.34},{name:'Gold',density:19.32}
  ]
  const closest=materials.reduce((a,b)=>Math.abs(b.density-density)<Math.abs(a.density-density)?b:a)
  const graphData=materials.map(m=>({name:m.name,density:m.density}))
  res.json({ status:'complete',
    results:{ mass:massG.toFixed(1), volume:volML.toFixed(1), density:density.toFixed(3), likelyMaterial:closest.name },
    units:{ mass:'g', volume:'mL', density:'g/mL', likelyMaterial:'' },
    labels:{ mass:'Mass', volume:'Volume (by displacement)', density:'Density', likelyMaterial:'Likely material' },
    graphData, graphAxes:{ x:'name', y:'density', xLabel:'Material', yLabel:'Density (g/mL)' },
    conclusion:`ρ=m/V=${massG}/${volML}=${density.toFixed(3)}g/mL. Closest known material: ${closest.name} (${closest.density}g/mL).`
  })
})
app.listen(3000, () => console.log('density-measurement sim on :3000'))