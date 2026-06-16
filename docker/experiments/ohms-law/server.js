import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (_, res) => res.json({ status: 'ok', experiment: 'ohms-law' }))

app.post('/simulate', (req, res) => {
  const { variables = {}, componentIds = [] } = req.body

  if (!componentIds.includes('battery'))
    return res.json({ status: 'incomplete', message: 'Add a battery to the circuit.' })
  if (!componentIds.some(id => ['resistor','variable-resistor'].includes(id)))
    return res.json({ status: 'incomplete', message: 'Add at least one resistor.' })
  if (!componentIds.includes('ammeter'))
    return res.json({ status: 'incomplete', message: 'Add an ammeter to measure current.' })

  const V = parseFloat(variables.voltage ?? 9)
  const R = parseFloat(variables.resistance ?? 100)
  const I = V / R
  const P = V * I

  const graphData = []
  for (let r = 10; r <= 500; r += 30)
    graphData.push({ resistance: r, current: parseFloat((V/r).toFixed(4)), voltage: V })

  res.json({
    status: 'complete',
    results: {
      voltage: V.toFixed(2),
      resistance: R.toFixed(1),
      current: I.toFixed(4),
      power: P.toFixed(3)
    },
    units:  { voltage:'V', resistance:'Ω', current:'A', power:'W' },
    labels: { voltage:'Voltage', resistance:'Resistance', current:'Current', power:'Power' },
    graphData,
    graphAxes: { x:'resistance', y:'current', xLabel:'Resistance (Ω)', yLabel:'Current (A)' },
    conclusion: `At ${V}V with ${R}Ω → I = ${I.toFixed(4)}A. Verified: V=IR → ${(I*R).toFixed(2)}V ✓`
  })
})

app.listen(3000, () => console.log('ohms-law sim running on :3000'))