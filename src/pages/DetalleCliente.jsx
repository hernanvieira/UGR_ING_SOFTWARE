const STATS = [
  { label: 'Plan', value: 'Básico' },
  { label: 'MRR', value: '$1,250' },
  { label: 'Antigüedad', value: '16 meses' },
  { label: 'Tickets abiertos', value: '5', danger: true },
]

const FACTORS = [
  { label: 'Baja satisfacción (NPS)', pct: 100, weight: '32%', color: '#E24B4A' },
  { label: 'Tickets escalados', pct: 81, weight: '26%', color: '#E24B4A' },
  { label: 'Bajo uso del producto', pct: 69, weight: '22%', color: '#E24B4A' },
  { label: 'Renovación manual', pct: 37, weight: '12%', color: '#EF9F27' },
  { label: 'Facturación vencida', pct: 25, weight: '8%', color: '#EF9F27' },
]

const HISTORY = [
  { text: 'Ticket escalado', date: '03 jun. 2024 · 10:24', color: '#E24B4A' },
  { text: 'Disminución de uso (−42%)', date: '28 may. 2024 · 15:12', color: '#EF9F27' },
  { text: 'NPS recibido: 4/10', date: '20 may. 2024 · 09:47', color: '#378ADD' },
  { text: 'Pago recibido', date: '05 may. 2024 · 11:03', color: '#639922' },
  { text: 'Cliente creado', date: '05 ene. 2023 · 08:30', color: '#94a3b8' },
]

const ACTIONS = [
  { title: 'Contactar al cliente', sub: 'Conversación proactiva', priority: 'Alta prioridad', danger: true },
  { title: 'Ofrecer incentivo', sub: 'Oferta especial alineada a su uso', priority: 'Media prioridad', danger: false },
  { title: 'Monitorear uso y satisfacción', sub: 'Seguimiento semanal', priority: 'Media prioridad', danger: false },
]

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

export default function DetalleCliente({ onNavigate }) {
  return (
    <div className="p-6">
      <button
        onClick={() => onNavigate?.('clientes')}
        className="text-xs text-slate-400 hover:text-slate-600 mb-2 transition-colors"
      >
        ← Volver a clientes en riesgo
      </button>
      <p className="text-sm text-slate-500 mb-5">
        Vista completa del cliente y factores de riesgo de churn.
      </p>

      {/* Top row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0" style={{ background: '#4f6ef7' }}>
              TN
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                TechNova Solutions
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: '#ecfdf5', color: '#047857' }}>
                  Activo
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Cliente desde 05/01/2023 · ID: 10234</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-lg px-3 py-2" style={{ background: '#f8fafc' }}>
                <div className="text-xs text-slate-400">{s.label}</div>
                <div className="text-sm font-semibold mt-0.5" style={{ color: s.danger ? '#be123c' : '#0f172a' }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>Probabilidad de churn</CardTitle>
          <div className="text-5xl font-semibold text-center py-3" style={{ color: '#E24B4A' }}>86%</div>
          <div className="text-xs text-slate-400 text-center mb-2">probabilidad estimada</div>
          <div className="flex justify-center mb-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#fff1f2', color: '#be123c' }}>
              Riesgo alto
            </span>
          </div>
          <div className="rounded-lg px-3 py-2 text-xs" style={{ background: '#fff1f2', color: '#be123c' }}>
            Acción recomendada: contactar en los próximos 48h
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardTitle>Factores que explican el riesgo</CardTitle>
          {FACTORS.map((f) => (
            <div key={f.label} className="flex items-center gap-2 py-2 border-b border-slate-100 last:border-0">
              <span className="text-xs text-slate-700 flex-1">{f.label}</span>
              <div className="w-14 bg-slate-100 rounded-full h-1.5 overflow-hidden flex-shrink-0">
                <div className="h-full rounded-full" style={{ width: `${f.pct}%`, background: f.color }} />
              </div>
              <span className="text-xs text-slate-400 w-7 text-right">{f.weight}</span>
            </div>
          ))}
        </Card>

        <Card>
          <CardTitle>Historial reciente</CardTitle>
          {HISTORY.map((h, i) => (
            <div key={i} className="flex items-start gap-2.5 py-2 border-b border-slate-100 last:border-0">
              <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: h.color }} />
              <div>
                <div className="text-sm text-slate-800">{h.text}</div>
                <div className="text-xs text-slate-400 mt-0.5">{h.date}</div>
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <CardTitle>Acciones recomendadas</CardTitle>
          {ACTIONS.map((a, i) => (
            <div key={i} className="py-2 border-b border-slate-100 last:border-0">
              <div className="text-sm font-medium text-slate-800">{a.title}</div>
              <div className="text-xs text-slate-400 mt-0.5">{a.sub}</div>
              <div className="text-xs mt-1 font-medium" style={{ color: a.danger ? '#be123c' : '#b45309' }}>
                {a.priority}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
