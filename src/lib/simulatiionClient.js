import axios from 'axios'

const BASE_PORT = 3000

export async function runExperimentSimulation(experimentId, dockerPort, variables, placedItems) {
  const componentIds = placedItems.map(c => c.componentId)
  const url = `http://localhost:${dockerPort}/simulate`

  try {
    const { data } = await axios.post(url, { variables, componentIds }, { timeout: 5000 })
    return data
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      return {
        status: 'error',
        message: `Container for "${experimentId}" is not running. Start it with: docker compose up ${experimentId}`
      }
    }
    return { status: 'error', message: err.message }
  }
}

export async function checkContainerHealth(dockerPort, experimentId) {
  try {
    const { data } = await axios.get(`http://localhost:${dockerPort}/health`, { timeout: 2000 })
    return { online: true, ...data }
  } catch {
    return { online: false, experiment: experimentId }
  }
}