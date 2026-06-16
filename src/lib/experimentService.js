import { supabase } from './supabase'

export async function fetchSubjects() {
  const { data, error } = await supabase
    .from('subjects')
    .select(`*, subject_levels(level_id, levels(id,label,description))`)
    .order('display_order')
  if (error) throw error
  return data.map(s => ({ ...s, levels: s.subject_levels.map(sl => sl.levels) }))
}

export async function fetchExperiments(subjectId, levelId) {
  const { data, error } = await supabase
    .from('experiments')
    .select('*')
    .eq('subject_id', subjectId)
    .eq('level_id', levelId)
    .eq('is_active', true)
    .order('display_order')
  if (error) throw error
  return data
}

export async function fetchExperimentsBySubject(subjectId) {
  const { data, error } = await supabase
    .from('experiments')
    .select('*')
    .eq('subject_id', subjectId)
    .eq('is_active', true)
    .order('level_id, display_order')
  if (error) throw error
  return data
}

export async function fetchExperimentConfig(experimentId) {
  const [expRes, compRes, varRes, ruleRes] = await Promise.all([
    supabase.from('experiments').select('*').eq('id', experimentId).single(),
    supabase.from('experiment_components').select('*').eq('experiment_id', experimentId).order('display_order'),
    supabase.from('experiment_variables').select('*').eq('experiment_id', experimentId).order('display_order'),
    supabase.from('simulation_rules').select('*').eq('experiment_id', experimentId).single(),
  ])
  if (expRes.error) throw expRes.error
  const exp = expRes.data
  return {
    id: exp.id,
    title: exp.title,
    subject: exp.subject_id,
    level: exp.level_id,
    theory: exp.theory,
    formula: exp.formula,
    steps: exp.steps ?? [],
    dockerPort: exp.docker_port,
    components: (compRes.data ?? []).map(c => ({
      id: c.id, label: c.label, icon: c.icon,
      description: c.description, type: c.type, value: c.value,
    })),
    variables: Object.fromEntries(
      (varRes.data ?? []).map(v => [v.id, {
        label: v.label, min: v.min_value, max: v.max_value,
        step: v.step_value, default: v.default_value, unit: v.unit,
      }])
    ),
    simulationRule: ruleRes.data ? {
      requiredComponents: ruleRes.data.required_components,
      formulaType: ruleRes.data.formula_type,
      graphAxes: {
        x: ruleRes.data.graph_x_key, y: ruleRes.data.graph_y_key,
        xLabel: ruleRes.data.graph_x_label, yLabel: ruleRes.data.graph_y_label,
      }
    } : null,
  }
}

export async function fetchExperimentCounts() {
  const { data, error } = await supabase
    .from('experiments').select('subject_id').eq('is_active', true)
  if (error) throw error
  const counts = {}
  data.forEach(r => { counts[r.subject_id] = (counts[r.subject_id] ?? 0) + 1 })
  return counts
}