import { useState, useEffect, useRef } from 'react'

// Overall population averages from ravenstack_analitico.csv (n=500)
const GLOBAL = {
  tickets: 4,
  satisfaccion: 3.69,
  autoRenew: 0.80,
  features: 27.6,
  errores: 28.2,
  resolucionHrs: 35.7,
  tenure: 340,
  churnRate: 0.22,
}

function parseCSV(text) {
  const lines = text.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim())
  return lines.slice(1).map(line => {
    const vals = line.split(',')
    const obj = {}
    headers.forEach((h, i) => { obj[h] = (vals[i] || '').trim() })
    return obj
  })
}

function formatPlan(tier) {
  return { Basic: 'Básico', Pro: 'Pro', Enterprise: 'Enterprise' }[tier] || tier
}

function formatTenure(days) {
  const d = +days || 0
  if (d < 30) return `${d} días`
  if (d < 365) return `${Math.round(d / 30)} meses`
  return `${(d / 365).toFixed(1)} años`
}

function avg(clients, key) {
  return clients.reduce((s, c) => s + (+c[key] || 0), 0) / clients.length
}

function topPlanOf(clients) {
  const count = {}
  clients.forEach(c => { count[c.plan_tier] = (count[c.plan_tier] || 0) + 1 })
  return formatPlan(Object.entries(count).sort((a, b) => b[1] - a[1])[0][0])
}

function buildIndustryGroups(clients) {
  const groups = {}
  for (const c of clients) {
    if (!groups[c.industry]) groups[c.industry] = []
    groups[c.industry].push(c)
  }
  return groups
}

function aggregateGroup(industry, clients) {
  const n = clients.length
  const churned = clients.filter(c => c.target === '1').length
  return {
    industry,
    total: n,
    churned,
    churnRate: churned / n,
    avgTickets: avg(clients, 'total_tickets'),
    avgSatisfaccion: avg(clients, 'avg_satisfaccion'),
    avgAutoRenew: avg(clients, 'auto_renew_pct'),
    avgFeatures: avg(clients, 'features_distintas'),
    avgErrores: avg(clients, 'total_errores'),
    avgResolucion: avg(clients, 'avg_resolucion_hrs'),
    avgTenure: avg(clients, 'tenure_days'),
    topPlan: topPlanOf(clients),
  }
}

function getRiskLevel(churnRate) {
  if (churnRate >= 0.25) return {
    label: 'Riesgo alto', bg: '#fff1f2', color: '#be123c',
    msg: 'Esta industria presenta una tasa de churn significativamente por encima del promedio global.',
  }
  if (churnRate >= 0.18) return {
    label: 'Riesgo moderado', bg: '#fffbeb', color: '#b45309',
    msg: 'Esta industria muestra señales de alerta. Se recomienda revisar el fit del producto para este segmento.',
  }
  return {
    label: 'Riesgo bajo', bg: '#f0fdf4', color: '#15803d',
    msg: 'Esta industria tiene una tasa de churn por debajo del promedio. Mantener estrategia actual.',
  }
}

function getFactors(seg) {
  const factors = []

  if (seg.avgTickets > GLOBAL.tickets + 1.5)
    factors.push({ text: 'Tickets de soporte elevados', sub: `Promedio ${seg.avgTickets.toFixed(1)} vs. global ${GLOBAL.tickets}`, color: '#E24B4A' })
  else if (seg.avgTickets < GLOBAL.tickets - 1.5)
    factors.push({ text: 'Bajo volumen de soporte', sub: `Promedio ${seg.avgTickets.toFixed(1)} vs. global ${GLOBAL.tickets} — indicador positivo`, color: '#378ADD' })

  if (seg.avgSatisfaccion < GLOBAL.satisfaccion - 0.5)
    factors.push({ text: 'Satisfacción por debajo del promedio', sub: `${seg.avgSatisfaccion.toFixed(2)}/5 vs. global ${GLOBAL.satisfaccion.toFixed(2)}`, color: '#E24B4A' })
  else if (seg.avgSatisfaccion > GLOBAL.satisfaccion + 0.5)
    factors.push({ text: 'Alta satisfacción del segmento', sub: `${seg.avgSatisfaccion.toFixed(2)}/5 vs. global ${GLOBAL.satisfaccion.toFixed(2)}`, color: '#378ADD' })

  if (seg.avgAutoRenew < GLOBAL.autoRenew - 0.08)
    factors.push({ text: 'Baja tasa de auto-renovación', sub: `${(seg.avgAutoRenew * 100).toFixed(1)}% vs. global ${(GLOBAL.autoRenew * 100).toFixed(1)}%`, color: '#E24B4A' })
  else if (seg.avgAutoRenew > GLOBAL.autoRenew + 0.05)
    factors.push({ text: 'Alta tasa de auto-renovación', sub: `${(seg.avgAutoRenew * 100).toFixed(1)}% vs. global ${(GLOBAL.autoRenew * 100).toFixed(1)}%`, color: '#378ADD' })

  if (seg.avgFeatures < GLOBAL.features - 4)
    factors.push({ text: 'Bajo uso de funcionalidades', sub: `${seg.avgFeatures.toFixed(1)} funciones vs. global ${GLOBAL.features.toFixed(1)}`, color: '#E24B4A' })
  else if (seg.avgFeatures > GLOBAL.features + 4)
    factors.push({ text: 'Alto uso de funcionalidades', sub: `${seg.avgFeatures.toFixed(1)} funciones vs. global ${GLOBAL.features.toFixed(1)} — mayor engagement`, color: '#378ADD' })

  if (seg.avgErrores > GLOBAL.errores + 8)
    factors.push({ text: 'Alta tasa de errores técnicos', sub: `${seg.avgErrores.toFixed(1)} errores vs. global ${GLOBAL.errores.toFixed(1)}`, color: '#E24B4A' })

  if (seg.avgResolucion > GLOBAL.resolucionHrs + 8)
    factors.push({ text: 'Tiempos de resolución elevados', sub: `${seg.avgResolucion.toFixed(1)}h vs. global ${GLOBAL.resolucionHrs.toFixed(1)}h`, color: '#E24B4A' })
  else if (seg.avgResolucion < GLOBAL.resolucionHrs - 8)
    factors.push({ text: 'Resolución de soporte eficiente', sub: `${seg.avgResolucion.toFixed(1)}h vs. global ${GLOBAL.resolucionHrs.toFixed(1)}h`, color: '#378ADD' })

  if (seg.avgTenure < GLOBAL.tenure - 60)
    factors.push({ text: 'Antigüedad promedio baja', sub: `${formatTenure(seg.avgTenure)} vs. global ${formatTenure(GLOBAL.tenure)}`, color: '#E24B4A' })
  else if (seg.avgTenure > GLOBAL.tenure + 60)
    factors.push({ text: 'Alta antigüedad del segmento', sub: `${formatTenure(seg.avgTenure)} vs. global ${formatTenure(GLOBAL.tenure)}`, color: '#378ADD' })

  return factors.slice(0, 5)
}

function getActions(seg) {
  const actions = []
  const cr = seg.churnRate

  if (cr >= 0.25) actions.push('Priorizar este segmento en la estrategia de retención inmediata')
  else if (cr >= 0.18) actions.push('Incluir en el plan de retención del próximo trimestre')
  else actions.push('Mantener monitoreo mensual del segmento')

  if (seg.avgTickets > GLOBAL.tickets + 1.5) actions.push('Investigar causas raíz del alto volumen de soporte en este segmento')
  if (seg.avgSatisfaccion < GLOBAL.satisfaccion - 0.5) actions.push('Realizar encuesta de satisfacción específica para la industria')
  if (seg.avgAutoRenew < GLOBAL.autoRenew - 0.08) actions.push('Implementar campaña de activación de auto-renovación')
  if (seg.avgFeatures < GLOBAL.features - 4) actions.push('Ofrecer proceso de incorporación extendido y capacitación en funcionalidades')
  if (seg.avgResolucion > GLOBAL.resolucionHrs + 8) actions.push('Asignar equipo de soporte dedicado para este segmento')
  if (cr >= 0.25) actions.push('Evaluar fit del producto para las necesidades específicas de la industria')

  return actions.slice(0, 5)
}

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl p-4 border ${className}`} style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
      {children}
    </div>
  )
}

function CardTitle({ children }) {
  return <div className="text-xs font-semibold text-slate-700 mb-3">{children}</div>
}

export default function PrediccionIndividual({ onNavigate }) {
  const [industryGroups, setIndustryGroups] = useState({})
  const [search, setSearch] = useState('')
  const [picked, setPicked] = useState(null)
  const [analyzed, setAnalyzed] = useState(null)
  const [showDrop, setShowDrop] = useState(false)
  const [loading, setLoading] = useState(true)
  const dropRef = useRef(null)

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/ravenstack_analitico.csv')
      .then(r => r.text())
      .then(text => {
        setIndustryGroups(buildIndustryGroups(parseCSV(text)))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    function handler(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setShowDrop(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const allIndustries = Object.keys(industryGroups).sort()

  const filtered = search.length >= 1
    ? allIndustries.filter(ind => ind.toLowerCase().includes(search.toLowerCase()))
    : allIndustries

  function selectIndustry(ind) {
    setPicked(ind)
    setSearch(ind)
    setShowDrop(false)
  }

  function handleAnalyze() {
    if (!picked || !industryGroups[picked]) return
    setAnalyzed(aggregateGroup(picked, industryGroups[picked]))
  }

  const riskLevel = analyzed ? getRiskLevel(analyzed.churnRate) : null
  const factors = analyzed ? getFactors(analyzed) : []
  const actions = analyzed ? getActions(analyzed) : []
  const pct = analyzed ? Math.round(analyzed.churnRate * 100) : null
  const gaugeOffset = analyzed ? Math.round(188 * (1 - analyzed.churnRate)) : 188

  const stats = analyzed
    ? [
        { label: 'Total de clientes', value: analyzed.total.toLocaleString() },
        { label: 'Plan más frecuente', value: analyzed.topPlan },
        { label: 'Antigüedad promedio', value: formatTenure(analyzed.avgTenure) },
        { label: 'Satisfacción', value: `${analyzed.avgSatisfaccion.toFixed(2)} / 5` },
        { label: 'Tickets promedio', value: analyzed.avgTickets.toFixed(1) },
        { label: 'Auto-renovación', value: `${(analyzed.avgAutoRenew * 100).toFixed(1)}%` },
        { label: 'Funcionalidades usadas', value: analyzed.avgFeatures.toFixed(1) },
        { label: 'Clientes que cancelaron', value: `${analyzed.churned} de ${analyzed.total}` },
      ]
    : []

  return (
    <div className="p-4 sm:p-6">
      <p className="text-sm text-slate-500 mb-5">
        Seleccioná una industria para analizar el riesgo de churn de ese segmento.
      </p>

      {/* Search section */}
      <Card className="mb-4">
        <CardTitle>Buscar industria</CardTitle>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1" ref={dropRef}>
            <input
              type="text"
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setPicked(null)
                setAnalyzed(null)
                setShowDrop(true)
              }}
              onFocus={() => setShowDrop(true)}
              placeholder={loading ? 'Cargando datos…' : 'Ej: DevTools, FinTech, HealthTech…'}
              disabled={loading}
              className="w-full text-sm text-slate-800 rounded-lg px-3 py-2.5 border outline-none focus:ring-1 transition-colors disabled:opacity-50"
              style={{ background: '#f5f7fb', borderColor: 'rgba(15,23,42,0.10)' }}
            />
            {showDrop && filtered.length > 0 && (
              <div
                className="absolute z-10 top-full mt-1 w-full bg-white rounded-lg border shadow-lg overflow-hidden"
                style={{ borderColor: 'rgba(15,23,42,0.10)' }}
              >
                {filtered.map(ind => (
                  <button
                    key={ind}
                    onClick={() => selectIndustry(ind)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                  >
                    <span className="text-sm font-medium text-slate-800">{ind}</span>
                    <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                      {industryGroups[ind]?.length ?? 0} clientes
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!picked}
            className="sm:flex-shrink-0 py-2.5 px-6 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: picked ? '#4f6ef7' : '#9ca3af', cursor: picked ? 'pointer' : 'not-allowed' }}
          >
            Analizar segmento
          </button>
        </div>
      </Card>

      {/* Results */}
      {analyzed && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Left: datos del segmento */}
          <Card>
            {/* Encabezado del segmento */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-base font-semibold text-slate-900">{analyzed.industry}</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {analyzed.total} clientes · Plan predominante: {analyzed.topPlan}
                </div>
              </div>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ml-3"
                style={{ background: riskLevel.bg, color: riskLevel.color }}
              >
                {riskLevel.label}
              </span>
            </div>

            {/* Grilla de métricas */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {stats.map(s => (
                <div key={s.label} className="rounded-lg px-3 py-2.5" style={{ background: '#f8fafc' }}>
                  <div className="text-xs text-slate-400">{s.label}</div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5">{s.value}</div>
                </div>
              ))}
            </div>

            {/* Mensaje de riesgo */}
            <div
              className="rounded-lg px-3 py-2 text-xs"
              style={{ background: riskLevel.bg, color: riskLevel.color }}
            >
              {riskLevel.msg}
            </div>
          </Card>

          {/* Right: predicción */}
          <div className="space-y-4">
            <Card>
              <CardTitle>Tasa de abandono del segmento</CardTitle>
              <div className="flex flex-col items-center py-2">
                <svg width="140" height="80" viewBox="0 0 140 80">
                  <path d="M10,70 A60,60 0 0,1 130,70" fill="none" stroke="#e5e5e5" strokeWidth="10" strokeLinecap="round" />
                  <path
                    d="M10,70 A60,60 0 0,1 130,70"
                    fill="none"
                    stroke="url(#gauge-grad)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="188"
                    strokeDashoffset={gaugeOffset}
                  />
                  <defs>
                    <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#639922" />
                      <stop offset="40%" stopColor="#EF9F27" />
                      <stop offset="100%" stopColor="#E24B4A" />
                    </linearGradient>
                  </defs>
                  <text x="70" y="65" textAnchor="middle" fontSize="22" fontWeight="500" fill={riskLevel.color}>
                    {pct}%
                  </text>
                </svg>
                <div className="text-xs text-slate-500 mt-1">clientes que cancelaron en el período</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Promedio global: {Math.round(GLOBAL.churnRate * 100)}%
                </div>
              </div>
            </Card>

            <Card>
              <CardTitle>Factores clave del segmento</CardTitle>
              {factors.length === 0 ? (
                <div className="text-xs text-slate-400">No se detectaron factores significativos.</div>
              ) : (
                <div className="space-y-2">
                  {factors.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 py-1.5 border-b border-slate-100 last:border-0">
                      <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: f.color }} />
                      <div>
                        <div className="text-sm text-slate-800">{f.text}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{f.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <CardTitle>Acciones recomendadas</CardTitle>
              <div className="space-y-1">
                {actions.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 py-1.5 border-b border-slate-100 last:border-0">
                    <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: '#639922' }} />
                    <span className="text-sm text-slate-700">{a}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
