import express from 'express'
import cors from 'cors'
const app = express()
app.use(cors()); app.use(express.json())
app.get('/health', (_, res) => res.json({ status:'ok', experiment:'photoelectric-effect' }))
app.post('/simulate', (req, res) => {
  const { variables={}, componentIds=[] } = req.body
  if (!componentIds.includes('photo-cell'))   return res.json({ status:'incomplete', message:'Add the photoelectric cell.' })
  if (!componentIds.includes('uv-lamp'))      return res.json({ status:'incomplete', message:'Add a UV lamp.' })
  if (!componentIds.includes('galvanometer')) return res.json({ status:'incomplete', message:'Add a galvanometer.' })
  if (!componentIds.includes('variable-psu')) return res.json({ status:'incomplete', message:'Add a variable power supply.' })
  const h=6.626e-34; const e=1.602e-19; const phi=2.3*e
  const freq=parseFloat(variables.frequency??5.5)*1e14
  const thresholdFreq=phi/h
  if(freq<thresholdFreq) return res.json({ status:'complete',
    results:{ frequency:(freq/1e14).toFixed(2), stoppingVoltage:'0', thresholdFreq:(thresholdFreq/1e14).toFixed(2), note:'Below threshold — no emission' },
    units:{ frequency:'×10¹⁴Hz', stoppingVoltage:'V', thresholdFreq:'×10¹⁴Hz', note:'' },
    labels:{ frequency:'Frequency', stoppingVoltage:'Stopping voltage', thresholdFreq:'Threshold frequency', note:'' },
    graphData:[], graphAxes:{ x:'frequency', y:'stoppingVoltage', xLabel:'Frequency (×10¹⁴Hz)', yLabel:'Stopping voltage (V)' },
    conclusion:`f=${(freq/1e14).toFixed(2)}×10¹⁴Hz is below threshold. No photoelectrons emitted.`
  })
  const Vs=(h*freq-phi)/e
  const graphData=[]
  for(let f=4;f<=8;f+=0.5){ const vs=f*1e14>thresholdFreq?(h*f*1e14-phi)/e:0; graphData.push({frequency:f,stoppingVoltage:parseFloat(vs.toFixed(4))}) }
  res.json({ status:'complete',
    results:{ frequency:(freq/1e14).toFixed(2), stoppingVoltage:Vs.toFixed(4), kineticEnergy:(Vs).toFixed(4), workFunction:(phi/e).toFixed(2) },
    units:{ frequency:'×10¹⁴Hz', stoppingVoltage:'V', kineticEnergy:'eV', workFunction:'eV' },
    labels:{ frequency:'Frequency', stoppingVoltage:'Stopping voltage', kineticEnergy:'Max KE', workFunction:'Work function φ' },
    graphData, graphAxes:{ x:'frequency', y:'stoppingVoltage', xLabel:'Frequency (×10¹⁴Hz)', yLabel:'Stopping voltage (V)' },
    conclusion:`At f=${(freq/1e14).toFixed(2)}×10¹⁴Hz: Vs=${Vs.toFixed(4)}V. Gradient=h/e=${(h/e).toExponential(3)} ✓`
  })
})
app.listen(3000, () => console.log('photoelectric-effect sim on :3000'))