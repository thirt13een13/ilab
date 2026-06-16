import express from 'express'
import cors from 'cors'
const app = express()
app.use(cors()); app.use(express.json())
app.get('/health', (_, res) => res.json({ status:'ok', experiment:'osmosis-potato' }))
app.post('/simulate', (req, res) => {
  const { variables={}, componentIds=[] } = req.body
  if (!componentIds.includes('potato'))  return res.json({ status:'incomplete', message:'Add potato cylinders.' })
  if (!componentIds.includes('balance')) return res.json({ status:'incomplete', message:'Add a balance to measure mass.' })
  if (!componentIds.some(id=>id.startsWith('beaker'))) return res.json({ status:'incomplete', message:'Add sucrose solutions.' })
  if (!componentIds.includes('timer-o')) return res.json({ status:'incomplete', message:'Add a timer.' })
  const isotonic=18; const conc=parseFloat(variables.concentration??0)
  const change=(isotonic-conc)/isotonic*35
  const graphData=[0,10,20,30,40,50].map(c=>({ concentration:c, massChange:parseFloat(((isotonic-c)/isotonic*35).toFixed(1)) }))
  res.json({ status:'complete',
    results:{ concentration:conc.toFixed(0), massChange:change.toFixed(1), isotonicPoint:isotonic.toFixed(0), direction:conc<isotonic?'INTO cell':conc>isotonic?'OUT of cell':'No net movement' },
    units:{ concentration:'%', massChange:'%', isotonicPoint:'%', direction:'' },
    labels:{ concentration:'Sucrose concentration', massChange:'% mass change', isotonicPoint:'Isotonic point', direction:'Water movement' },
    graphData, graphAxes:{ x:'concentration', y:'massChange', xLabel:'Sucrose (%)', yLabel:'% Mass change' },
    conclusion:`At ${conc}% sucrose, mass ${change>=0?'increased':'decreased'} by ${Math.abs(change).toFixed(1)}%. Isotonic ≈${isotonic}%.`
  })
})
app.listen(3000, () => console.log('osmosis-potato sim on :3000'))