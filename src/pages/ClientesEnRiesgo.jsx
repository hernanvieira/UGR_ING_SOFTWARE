const KPIS = [
  { label: 'Alto riesgo', value: '687', sub: '14.0% del total de clientes', color: '#be123c' },
  { label: 'Riesgo medio', value: '1,582', sub: '32.4% del total de clientes', color: '#b45309' },
  { label: 'Cuentas intervenidas', value: '342', sub: '22.1% de alto riesgo', color: '#047857' },
]

const CLIENTS = [
  { name: 'TechNova Solutions', id: 'C-10458', plan: 'Básico', pct: 78, color: '#E24B4A', risk: 'Alto', riskType: 'red', date: '05/06', exec: 'Laura G.', primary: true },
  { name: 'DataPro Analytics', id: 'C-10421', plan: 'Esencial', pct: 67, color: '#E24B4A', risk: 'Alto', riskType: 'red', date: '02/06', exec: 'Carlos R.', primary: false },
  { name: 'WebIntelli SAS', id: 'C-10387', plan: 'Pro', pct: 62, color: '#E24B4A', risk: 'Alto', riskType: 'red', date: '31/05', exec: 'Laura G.', primary: false },
  { name: 'Creative Minds', id: 'C-10312', plan: 'Básico', pct: 58, color: '#EF9F27', risk: 'Medio', riskType: 'amber', date: '01/06', exec: 'Javier M.', primary: true },
  { name: 'CloudWare Ltd.', id: 'C-10298', plan: 'Esencial', pct: 54, color: '#EF9F27', risk: 'Medio', riskType: 'amber', date: '03/06', exec: 'Sofía H.', primary: false },
]

const PILL_STYLE = {
  red: { background: '#fff1f2', color: '#be123c' },
  amber: { background: '#fffbeb', color: '#b45309' },
}

export default function ClientesEnRiesgo({ onNavigate }) {
  return (
    <div className="p-6">
      <p className="text-sm text-slate-500 mb-5">
        Identificá y priorizá los clientes con mayor probabilidad de churn.
      </p>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {KPIS.map((k) => (
          <div key={k.label} className="bg-white rounded-xl px-4 py-3 border" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
            <div className="text-xs text-slate-500 mb-1">{k.label}</div>
            <div className="text-2xl font-semibold" style={{ color: k.color }}>{k.value}</div>
            <div className="text-xs text-slate-400 mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {['Plan: Todos', 'Nivel de riesgo: Todos', 'Ejecutivo: Todos'].map((f) => (
          <select key={f} className="text-xs px-3 py-1.5 rounded-lg border bg-white text-slate-500" style={{ borderColor: 'rgba(15,23,42,0.10)' }}>
            <option>{f}</option>
          </select>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
        <div
          className="grid text-xs text-slate-500 font-medium uppercase tracking-wider px-4 py-2.5"
          style={{ gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr 1.2fr 1fr', background: '#f8fafc', borderBottom: '1px solid rgba(15,23,42,0.06)' }}
        >
          <span>Cliente</span>
          <span>Plan</span>
          <span>Probabilidad</span>
          <span>Riesgo</span>
          <span>Última activ.</span>
          <span>Ejecutivo</span>
          <span>Acción</span>
        </div>

        {CLIENTS.map((c) => (
          <div
            key={c.id}
            className="grid items-center px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
            style={{ gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr 1.2fr 1fr' }}
          >
            <div>
              <div className="text-sm font-medium text-slate-900">{c.name}</div>
              <div className="text-xs text-slate-400">ID: {c.id}</div>
            </div>
            <span className="text-sm text-slate-500">{c.plan}</span>
            <div className="flex items-center gap-2 pr-4">
              <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: c.color }} />
              </div>
              <span className="text-xs text-slate-600 w-8">{c.pct}%</span>
            </div>
            <span className="text-xs px-2 py-1 rounded-full font-medium w-fit" style={PILL_STYLE[c.riskType]}>
              {c.risk}
            </span>
            <span className="text-sm text-slate-500">{c.date}</span>
            <span className="text-sm text-slate-700">{c.exec}</span>
            <button
              className="text-xs px-2.5 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-80"
              style={c.primary
                ? { background: '#4f6ef7', color: '#fff' }
                : { background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }
              }
            >
              {c.primary ? 'Contactar' : 'Ver detalle'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
