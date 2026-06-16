import express from 'express'
import cors from 'cors'
const app = express()
app.use(cors()); app.use(express.json())
app.get('/health', (_, res) => res.json({ status:'ok', experiment:'capacitor-charging' }))
app.post('/simulate', (req, res) => {
  const { variables={}, componentIds=[] } = req.body
  if (!componentIds.includes('capacitor'))   return res.json({ status:'incomplete', message:'Add a capacitor.' })
  if (!componentIds.includes('resistor-c'))  return res.json({ status:'incomplete', message:'Add a resistor.' })
  if (!componentIds.includes('dc-supply-c')) return res.json({ status:'incomplete', message:'Add a DC power supply.' })
  if (!componentIds.includes('voltmeter-c')) return res.json({ status:'incomplete', message:'Add a voltmeter across the capacitor.' })
  if (!componentIds.includes('switch-c'))    return res.json({ status:'incomplete', message:'Add a switch.' })
  const C_uF=parseFloat(variables.capacitance??470); const R_kO=parseFloat(variables.rcResistance??10)
  const C=C_uF*1e-6; const R=R_kO*1000; const tau=R*C; const V0=9
  const graphData=[]
  for(let t=0;t<=tau*5;t+=tau*0.2) graphData.push({ time:parseFloat(t.toFixed(2)), voltage:parseFloat((V0*(1-Math.exp(-t/tau))).toFixed(3)) })
  res.json({ status:'complete',
    results:{ capacitance:C_uF.toFixed(0), resistance:R_kO.toFixed(0), timeConstant:tau.toFixed(3), voltageAt1Tau:(V0*0.632).toFixed(3) },
    units:{ capacitance:'μF', resistance:'kΩ', timeConstant:'s', voltageAt1Tau:'V' },
    labels:{ capacitance:'Capacitance', resistance:'Resistance', timeConstant:'Time constant τ=RC', voltageAt1Tau:'Voltage at t=τ (63.2%)' },
    graphData, graphAxes:{ x:'time', y:'voltage', xLabel:'Time (s)', yLabel:'Voltage (V)' },
    conclusion:`τ=RC=${R_kO}kΩ×${C_uF}μF=${tau.toFixed(3)}s. At t=τ, capacitor reaches 63.2% of 9V=${(V0*0.632).toFixed(3)}V.`
  })
})
app.listen(3000, () => console.log('capacitor-charging sim on :3000'))