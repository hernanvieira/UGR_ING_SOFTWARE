import { useState, useEffect } from 'react'

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/)
  function parseLine(line) {
    const vals = []
    let cur = ''
    let inQ = false
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ }
      else if (ch === ',' && !inQ) { vals.push(cur); cur = '' }
      else cur += ch
    }
    vals.push(cur)
    return vals
  }
  const headers = parseLine(lines[0]).map(h => h.trim())
  return lines.slice(1).filter(l => l.trim()).map(line => {
    const vals = parseLine(line)
    const obj = {}
    headers.forEach((h, i) => { obj[h] = (vals[i] || '').trim() })
    return obj
  })
}

const RISK_STYLE = {
  Alto: { background: '#fff1f2', color: '#be123c' },
  Moderado: { background: '#fffbeb', color: '#b45309' },
  Bajo: { background: '#ecfdf5', color: '#047857' },
}

const RISK_COLOR = {
  Alto: '#E24B4A',
  Moderado: '#EF9F27',
  Bajo: '#639922',
}

export default function ClientesEnRiesgo({ onNavigate }) {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterRisk, setFilterRisk] = useState('Todos')
  const [filterPlan, setFilterPlan] = useState('Todos')
  const [filterIndustry, setFilterIndustry] = useState('Todos')

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/clientes_scored.csv')
      .then(r => r.text())
      .then(text => {
        const rows = parseCSV(text)
        rows.sort((a, b) => Number(b.risk_pct) - Number(a.risk_pct))
        setClients(rows)
        setLoading(false)
      })
  }, [])

  const industries = ['Todos', ...Array.from(new Set(clients.map(c => c.industry).filter(Boolean))).sort()]
  const plans = ['Todos', ...Array.from(new Set(clients.map(c => c.plan_tier).filter(Boolean))).sort()]

  const filtered = clients.filter(c => {
    if (filterRisk !== 'Todos' && c.risk_level !== filterRisk) return false
    if (filterPlan !== 'Todos' && c.plan_tier !== filterPlan) return false
    if (filterIndustry !== 'Todos' && c.industry !== filterIndustry) return false
    return true
  })

  const altoCount = clients.filter(c => c.risk_level === 'Alto').length
  const modCount = clients.filter(c => c.risk_level === 'Moderado').length
  const totalCount = clients.length

  const kpis = [
    {
      label: 'Alto riesgo',
      value: altoCount,
      sub: totalCount ? `${((altoCount / totalCount) * 100).toFixed(1)}% del total` : '—',
      color: '#be123c',
    },
    {
      label: 'Riesgo moderado',
      value: modCount,
      sub: totalCount ? `${((modCount / totalCount) * 100).toFixed(1)}% del total` : '—',
      color: '#b45309',
    },
    {
      label: 'Total analizados',
      value: totalCount,
      sub: 'Clientes en la plataforma',
      color: '#0f172a',
    },
  ]

  const hasFilter = filterRisk !== 'Todos' || filterPlan !== 'Todos' || filterIndustry !== 'Todos'

  return (
    <div className="p-6">
      <p className="text-sm text-slate-500 mb-5">
        Identificá y priorizá los clientes con mayor probabilidad de churn.
      </p>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-xl px-4 py-3 border" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
            <div className="text-xs text-slate-500 mb-1">{k.label}</div>
            <div className="text-2xl font-semibold" style={{ color: k.color }}>
              {loading ? '—' : k.value}
            </div>
            <div className="text-xs text-slate-400 mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap items-center">
        <select
          value={filterRisk}
          onChange={e => setFilterRisk(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-lg border bg-white text-slate-500"
          style={{ borderColor: 'rgba(15,23,42,0.10)' }}
        >
          {['Todos', 'Alto', 'Moderado', 'Bajo'].map(v => <option key={v}>{v}</option>)}
        </select>
        <select
          value={filterPlan}
          onChange={e => setFilterPlan(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-lg border bg-white text-slate-500"
          style={{ borderColor: 'rgba(15,23,42,0.10)' }}
        >
          {plans.map(v => <option key={v}>{v}</option>)}
        </select>
        <select
          value={filterIndustry}
          onChange={e => setFilterIndustry(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-lg border bg-white text-slate-500"
          style={{ borderColor: 'rgba(15,23,42,0.10)' }}
        >
          {industries.map(v => <option key={v}>{v}</option>)}
        </select>
        {hasFilter && (
          <span className="text-xs text-slate-400">{filtered.length} resultados</span>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
        <div
          className="grid text-xs text-slate-500 font-medium uppercase tracking-wider px-4 py-2.5"
          style={{
            gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1fr 1fr',
            background: '#f8fafc',
            borderBottom: '1px solid rgba(15,23,42,0.06)',
          }}
        >
          <span>Cliente</span>
          <span>Plan</span>
          <span>Industria</span>
          <span>Probabilidad</span>
          <span>Riesgo</span>
          <span>Acción</span>
        </div>

        {loading ? (
          <div className="px-4 py-10 text-sm text-slate-400 text-center">Cargando datos…</div>
        ) : filtered.slice(0, 50).map((c, i) => {
          const pct = Number(c.risk_pct)
          const color = RISK_COLOR[c.risk_level] || '#94a3b8'
          return (
            <div
              key={i}
              className="grid items-center px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
              style={{ gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1fr 1fr' }}
            >
              <div className="text-sm font-medium text-slate-900 truncate pr-2">{c.company_name}</div>
              <span className="text-sm text-slate-500">{c.plan_tier}</span>
              <span className="text-xs text-slate-500">{c.industry}</span>
              <div className="flex items-center gap-2 pr-4">
                <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                </div>
                <span className="text-xs text-slate-600 w-8">{pct}%</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full font-medium w-fit" style={RISK_STYLE[c.risk_level] || {}}>
                {c.risk_level}
              </span>
              <button
                onClick={() => onNavigate?.('detalle', c)}
                className="text-xs px-2.5 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-80"
                style={c.risk_level === 'Alto'
                  ? { background: '#4f6ef7', color: '#fff' }
                  : { background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }
                }
              >
                Ver detalle
              </button>
            </div>
          )
        })}
      </div>

      {!loading && filtered.length > 50 && (
        <div className="text-xs text-slate-400 text-center mt-3">
          Mostrando 50 de {filtered.length} clientes · Usá los filtros para acotar la búsqueda
        </div>
      )}
    </div>
  )
}
