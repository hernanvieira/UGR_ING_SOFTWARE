const GLOBAL = {
  tickets: 4,
  satisfaccion: 3.69,
  autoRenew: 0.80,
  features: 27.6,
  errores: 28.2,
  resolucionHrs: 35.7,
  tenure: 340,
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

const ACTIONS_MAP = {
  Alto: [
    { title: 'Contactar al cliente', sub: 'Conversación proactiva en las próximas 48h', priority: 'Alta prioridad', danger: true },
    { title: 'Ofrecer incentivo personalizado', sub: 'Descuento o upgrade según perfil de uso', priority: 'Alta prioridad', danger: true },
    { title: 'Escalar a ejecutivo de cuenta', sub: 'Asignar atención dedicada', priority: 'Media prioridad', danger: false },
  ],
  Moderado: [
    { title: 'Monitorear métricas semanalmente', sub: 'Seguimiento de uso y satisfacción', priority: 'Media prioridad', danger: false },
    { title: 'Enviar contenido de valor', sub: 'Casos de uso y mejores prácticas', priority: 'Media prioridad', danger: false },
    { title: 'Revisar tickets pendientes', sub: 'Asegurar resolución dentro del SLA', priority: 'Baja prioridad', danger: false },
  ],
  Bajo: [
    { title: 'Mantener engagement', sub: 'Programa de fidelización activo', priority: 'Baja prioridad', danger: false },
    { title: 'Explorar oportunidad de upgrade', sub: 'Identificar potencial de upsell', priority: 'Baja prioridad', danger: false },
  ],
}

function getFactors(c) {
  const factors = []
  if (Number(c.avg_satisfaccion) < GLOBAL.satisfaccion)
    factors.push({ label: 'Baja satisfacción del cliente', severity: 'high' })
  if (Number(c.total_tickets) > GLOBAL.tickets)
    factors.push({ label: 'Alto volumen de tickets de soporte', severity: 'high' })
  if (Number(c.avg_resolucion_hrs) > GLOBAL.resolucionHrs)
    factors.push({ label: 'Tiempos de resolución elevados', severity: 'high' })
  if (Number(c.features_distintas) < GLOBAL.features)
    factors.push({ label: 'Bajo uso de funcionalidades', severity: 'medium' })
  if (Number(c.auto_renew_pct) < GLOBAL.autoRenew)
    factors.push({ label: 'Sin auto-renovación activa', severity: 'medium' })
  if (Number(c.tenure_days) < GLOBAL.tenure)
    factors.push({ label: 'Cliente relativamente nuevo', severity: 'low' })
  return factors
}

function initials(name) {
  return (name || '').split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase()
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

const SEVERITY_COLOR = { high: '#E24B4A', medium: '#EF9F27', low: '#94a3b8' }

export default function DetalleCliente({ onNavigate, navData }) {
  const c = navData

  if (!c) {
    return (
      <div className="p-6">
        <button
          onClick={() => onNavigate?.('clientes')}
          className="text-xs text-slate-400 hover:text-slate-600 mb-4 transition-colors"
        >
          ← Volver a clientes en riesgo
        </button>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-sm font-semibold text-slate-700 mb-1">Ningún cliente seleccionado</div>
          <div className="text-xs text-slate-400 max-w-xs">
            Seleccioná un cliente desde la pantalla de Clientes en riesgo para ver su detalle.
          </div>
          <button
            onClick={() => onNavigate?.('clientes')}
            className="mt-5 px-5 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: '#4f6ef7' }}
          >
            Ir a Clientes en riesgo
          </button>
        </div>
      </div>
    )
  }

  const riskPct = Number(c.risk_pct)
  const riskColor = RISK_COLOR[c.risk_level] || '#94a3b8'
  const factors = getFactors(c)
  const actions = ACTIONS_MAP[c.risk_level] || ACTIONS_MAP.Moderado
  const tenureMonths = Math.round(Number(c.tenure_days) / 30)

  const stats = [
    { label: 'Plan', value: c.plan_tier },
    { label: 'MRR', value: `$${Number(c.avg_mrr).toLocaleString()}` },
    { label: 'Antigüedad', value: `${tenureMonths} meses` },
    { label: 'Tickets', value: c.total_tickets, danger: Number(c.total_tickets) > GLOBAL.tickets },
    { label: 'Satisfacción', value: `${Number(c.avg_satisfaccion).toFixed(1)}/5`, danger: Number(c.avg_satisfaccion) < GLOBAL.satisfaccion },
    { label: 'Industria', value: c.industry },
  ]

  const alertMsg = {
    Alto: 'Acción recomendada: contactar en las próximas 48h',
    Moderado: 'Acción recomendada: monitorear métricas semanalmente',
    Bajo: 'Perfil saludable · Mantener engagement regular',
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => onNavigate?.('clientes')}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          ← Volver a clientes en riesgo
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: '#4f6ef7' }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 2.5C2 1.67 2.67 1 3.5 1h1.18c.36 0 .68.22.81.55l.7 1.74a.9.9 0 0 1-.2 1L5.4 5.07c.6 1.12 1.4 1.93 2.52 2.53l.77-.59a.9.9 0 0 1 1-.2l1.74.7c.33.13.56.45.56.81V9.5C12 10.33 11.33 11 10.5 11A8.5 8.5 0 0 1 2 2.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          </svg>
          Contactar cliente
        </button>
      </div>

      {/* Top row */}
      <div className="grid grid-cols-2 gap-4 mb-4 mt-3">
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
              style={{ background: '#4f6ef7' }}
            >
              {initials(c.company_name)}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">{c.company_name}</div>
              <div className="text-xs text-slate-400 mt-0.5">{c.industry} · {c.country}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {stats.map((s) => (
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
          <div className="text-5xl font-semibold text-center py-3" style={{ color: riskColor }}>
            {riskPct}%
          </div>
          <div className="text-xs text-slate-400 text-center mb-2">probabilidad estimada</div>
          <div className="flex justify-center mb-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={RISK_STYLE[c.risk_level] || {}}>
              Riesgo {c.risk_level}
            </span>
          </div>
          <div
            className="rounded-lg px-3 py-2 text-xs"
            style={RISK_STYLE[c.risk_level] || { background: '#f8fafc', color: '#64748b' }}
          >
            {alertMsg[c.risk_level] || ''}
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardTitle>Factores que explican el riesgo</CardTitle>
          {factors.length === 0 ? (
            <div className="text-xs text-slate-400 py-2">Sin factores de riesgo significativos detectados.</div>
          ) : factors.map((f, i) => (
            <div key={i} className="flex items-center gap-2 py-2 border-b border-slate-100 last:border-0">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: SEVERITY_COLOR[f.severity] }}
              />
              <span className="text-sm text-slate-700">{f.label}</span>
            </div>
          ))}
        </Card>

        <Card>
          <CardTitle>Acciones recomendadas</CardTitle>
          {actions.map((a, i) => (
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
