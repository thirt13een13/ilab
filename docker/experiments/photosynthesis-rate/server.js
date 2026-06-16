import express from 'express'
import cors from 'cors'
const app = express()
app.use(cors()); app.use(express.json())
app.get('/health', (_, res) => res.json({ status:'ok', experiment:'photosynthesis-rate' }))
app.post('/simulate', (req, res) => {
  const { variables={}, componentIds=[] } = req.body
  if (!componentIds.includes('elodea'))      return res.json({ status:'incomplete', message:'Add an Elodea sprig.' })
  if (!componentIds.includes('lamp'))        return res.json({ status:'incomplete', message:'Add a light source.' })
  if (!componentIds.includes('stopwatch-p')) return res.json({ status:'incomplete', message:'Add a stopwatch.' })
  const d=parseFloat(variables.lightDistance??10); const temp=parseFloat(variables.temperature??25)
  const intensity=10000/(d*d); const tempFactor=Math.pow(2,(temp-25)/10)
  const bubbles=Math.round(intensity*tempFactor*0.8)
  const graphData=[]
  for(let dist=5;dist<=50;dist+=5){ const I=10000/(dist*dist); graphData.push({distance:dist,bubbles:Math.round(I*tempFactor*0.8),intensity:parseFloat(I.toFixed(1))}) }
  res.json({ status:'complete',
    results:{ distance:d.toFixed(0), bubblesPerMin:bubbles.toString(), lightIntensity:intensity.toFixed(1), temperature:temp.toFixed(0) },
    units:{ distance:'cm', bubblesPerMin:'/min', lightIntensity:'lux', temperature:'°C' },
    labels:{ distance:'Lamp distance', bubblesPerMin:'Bubbles per minute', lightIntensity:'Light intensity', temperature:'Temperature' },
    graphData, graphAxes:{ x:'distance', y:'bubbles', xLabel:'Distance (cm)', yLabel:'Bubbles/min' },
    conclusion:`At ${d}cm: ${bubbles}bubbles/min. Rate ∝ 1/d² as light intensity falls with distance.`
  })
})
app.listen(3000, () => console.log('photosynthesis-rate sim on :3000'))