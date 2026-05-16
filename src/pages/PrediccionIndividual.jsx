const FIELDS = [
  { label: 'Cliente', value: 'TechNova Solutions S.A.' },
  { label: 'Plan', value: 'Básico' },
  { label: 'Antigüedad', value: '8 meses' },
  { label: 'Uso mensual', value: '24 días activos' },
  { label: 'Tickets soporte (30 días)', value: '6' },
  { label: 'Satisfacción (NPS)', value: '4 / 10' },
  { label: 'Auto-renovación', value: 'No' },
]

const FACTORS = [
  { text: 'Alto número de tickets de soporte', sub: '6 tickets vs. promedio 2.1', color: '#E24B4A' },
  { text: 'Bajo nivel de satisfacción (NPS)', sub: '4/10, por debajo del promedio 6.8', color: '#E24B4A' },
  { text: 'Sin auto-renovación activa', sub: '+28% de riesgo', color: '#E24B4A' },
  { text: 'Antigüedad moderada', sub: '8 meses reduce levemente el riesgo', color: '#378ADD' },
]

const ACTIONS = [
  'Contactar al cliente en los próximos 3 días',
  'Revisar y resolver tickets abiertos',
  'Ofrecer capacitación personalizada',
  'Evaluar incentivo de retención',
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

export default function PrediccionIndividual({ onNavigate }) {
  return (
    <div className="p-6">
      <p className="text-sm text-slate-500 mb-5">
        Ingresá o revisá los datos del cliente para estimar su probabilidad de churn.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {/* Left */}
        <Card>
          <CardTitle>Datos del cliente</CardTitle>
          {FIELDS.map((f) => (
            <div key={f.label} className="mb-3">
              <div className="text-xs text-slate-500 mb-1">{f.label}</div>
              <div
                className="text-sm text-slate-800 rounded-lg px-3 py-2 border"
                style={{ background: '#f5f7fb', borderColor: 'rgba(15,23,42,0.10)' }}
              >
                {f.value}
              </div>
            </div>
          ))}
          <button
            className="w-full mt-1 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: '#4f6ef7' }}
          >
            Calcular riesgo
          </button>
        </Card>

        {/* Right */}
        <div className="space-y-4">
          <Card>
            <CardTitle>Resultado de la predicción</CardTitle>
            <div className="flex flex-col items-center py-2">
              <svg width="140" height="80" viewBox="0 0 140 80">
                <path d="M10,70 A60,60 0 0,1 130,70" fill="none" stroke="#e5e5e5" strokeWidth="10" strokeLinecap="round" />
                <path d="M10,70 A60,60 0 0,1 130,70" fill="none" stroke="url(#g)" strokeWidth="10" strokeLinecap="round" strokeDasharray="188" strokeDashoffset="56" />
                <defs>
                  <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#639922" />
                    <stop offset="40%" stopColor="#EF9F27" />
                    <stop offset="100%" stopColor="#E24B4A" />
                  </linearGradient>
                </defs>
                <text x="70" y="65" textAnchor="middle" fontSize="22" fontWeight="500" fill="#E24B4A">72%</text>
              </svg>
              <div className="text-xs text-slate-500 mt-1">Probabilidad de churn</div>
              <span className="mt-2 text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#fff1f2', color: '#be123c' }}>
                Alto riesgo
              </span>
            </div>
            <div className="mt-3 rounded-lg px-3 py-2 text-xs" style={{ background: '#fff1f2', color: '#be123c' }}>
              Este cliente tiene alta probabilidad de cancelar en los próximos 30 días.
            </div>
          </Card>

          <Card>
            <CardTitle>Factores clave</CardTitle>
            <div className="space-y-2">
              {FACTORS.map((f, i) => (
                <div key={i} className="flex items-start gap-2 py-1.5 border-b border-slate-100 last:border-0">
                  <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: f.color }} />
                  <div>
                    <div className="text-sm text-slate-800">{f.text}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle>Acciones recomendadas</CardTitle>
            <div className="space-y-1">
              {ACTIONS.map((a, i) => (
                <div key={i} className="flex items-start gap-2 py-1.5 border-b border-slate-100 last:border-0">
                  <span className="w-3.5 h-3.5 rounded-full flex-shrink-0 mt-0.5" style={{ background: '#ecfdf5' }} />
                  <span className="text-sm text-slate-700">{a}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
