const KPIS = [
  { label: 'Features analizadas', value: '24', sub: 'En el período seleccionado' },
  { label: 'Features de alto riesgo', value: '6', sub: 'Uso correlacionado con churn', color: '#be123c' },
  { label: 'Features de retención', value: '9', sub: 'Uso correlacionado con permanencia', color: '#047857' },
]

const RETENTION = [
  { name: 'Dashboard analytics', sub: 'Clientes activos: 78%', pct: 92, val: '−38%', impact: 'Alto impacto' },
  { name: 'Integraciones API', sub: 'Clientes activos: 65%', pct: 78, val: '−29%', impact: 'Alto impacto' },
  { name: 'Reportes automáticos', sub: 'Clientes activos: 54%', pct: 61, val: '−22%', impact: 'Medio' },
  { name: 'Colaboración en equipo', sub: 'Clientes activos: 41%', pct: 48, val: '−17%', impact: 'Medio' },
]

const CHURN = [
  { name: 'Onboarding wizard', sub: 'Completado: 34% de los churned', pct: 88, val: '+41%', impact: 'Crítico', type: 'red' },
  { name: 'Notificaciones push', sub: 'Activas: 28% de los churned', pct: 66, val: '+31%', impact: 'Alto', type: 'red' },
  { name: 'Exportación de datos', sub: 'Usada: 19% de los churned', pct: 48, val: '+22%', impact: 'Medio', type: 'amber' },
  { name: 'Configuración avanzada', sub: 'Accedida: 12% de los churned', pct: 30, val: '+14%', impact: 'Medio', type: 'amber' },
]

const INSIGHTS = [
  { title: 'Mejorar el onboarding wizard — impacto crítico', body: 'Solo el 34% de los clientes que churnearon completaron el wizard. Simplificar el flujo o activar un asistente proactivo podría reducir la tasa de abandono temprana.' },
  { title: 'Promover el Dashboard analytics desde el día 1', body: 'Los clientes que usan esta feature tienen un 38% menos de churn. Destacarla en la pantalla de inicio o en el onboarding aumentaría el engagement.' },
  { title: 'Revisar la feature de notificaciones push', body: 'Baja adopción entre los churned. Puede indicar problemas de UX o que los usuarios no perciben su valor. Vale realizar entrevistas.' },
]

const IMPACT_STYLE = {
  red: { background: '#fff1f2', color: '#be123c' },
  amber: { background: '#fffbeb', color: '#b45309' },
  green: { background: '#ecfdf5', color: '#047857' },
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

function FeatureRow({ name, sub, pct, val, impact, barColor, valColor, impactType }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
      <div className="flex-1">
        <div className="text-sm text-slate-800">{name}</div>
        <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
      </div>
      <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden flex-shrink-0">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: barColor }} />
      </div>
      <span className="text-xs w-9 text-right font-medium flex-shrink-0" style={{ color: valColor }}>{val}</span>
      <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={IMPACT_STYLE[impactType || 'green']}>{impact}</span>
    </div>
  )
}

export default function AnalisisFeatures({ onNavigate }) {
  return (
    <div className="p-6">
      <p className="text-sm text-slate-500 mb-5">
        ¿Qué funcionalidades retienen clientes y cuáles están asociadas al churn?
      </p>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {KPIS.map((k) => (
          <div key={k.label} className="bg-white rounded-xl px-4 py-3 border" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
            <div className="text-xs text-slate-500 mb-1">{k.label}</div>
            <div className="text-2xl font-semibold" style={{ color: k.color || '#0f172a' }}>{k.value}</div>
            <div className="text-xs text-slate-400 mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {['Plan: Todos', 'Industria: Todas', 'Período: Último trimestre'].map((f) => (
          <select key={f} className="text-xs px-3 py-1.5 rounded-lg border bg-white text-slate-500" style={{ borderColor: 'rgba(15,23,42,0.10)' }}>
            <option>{f}</option>
          </select>
        ))}
      </div>

      {/* Feature tables */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card>
          <CardTitle>Features que retienen clientes (uso → menor churn)</CardTitle>
          {RETENTION.map((f) => (
            <FeatureRow key={f.name} {...f} barColor="#639922" valColor="#047857" impactType="green" />
          ))}
        </Card>

        <Card>
          <CardTitle>Features asociadas al churn (bajo uso → mayor riesgo)</CardTitle>
          {CHURN.map((f) => (
            <FeatureRow key={f.name} {...f} barColor="#E24B4A" valColor="#be123c" impactType={f.type} />
          ))}
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardTitle>Insights accionables para el equipo de desarrollo</CardTitle>
        {INSIGHTS.map((ins, i) => (
          <div key={i} className="py-3 border-b border-slate-100 last:border-0">
            <div className="text-sm font-semibold text-slate-800">{ins.title}</div>
            <div className="text-sm text-slate-500 mt-1 leading-relaxed">{ins.body}</div>
          </div>
        ))}
      </Card>
    </div>
  )
}
