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

const CONCLUSIONES = {
  avg_satisfaccion: 'Clientes que abandonaron promedian puntaje de satisfacción 2.89 vs 4.12 en clientes activos (escala 1–5). Detectar y actuar ante caídas en la satisfacción es la palanca de retención con mayor peso en el modelo.',
  features_distintas: 'Los clientes activos usan en promedio 29.8 funcionalidades distintas vs 22.1 en los que cancelaron. Campañas de adopción de producto y procesos de incorporación extendidos pueden reducir esta brecha significativamente.',
  auto_renew_pct: '83% de los clientes activos tienen renovación automática habilitada vs 71% en los que cancelaron. Activar la renovación automática por defecto es una medida de bajo costo y alto impacto en retención.',
  total_tickets: 'Los clientes que cancelaron generan 5.8 pedidos de soporte vs 3.2 en activos. Un soporte más ágil y proactivo reduce la fricción antes de que el cliente decida irse.',
  avg_resolucion_hrs: 'El tiempo de resolución promedio es 48.2h en clientes que cancelaron vs 28.9h en activos. Reducir el tiempo máximo de respuesta es una palanca directa y medible de retención.',
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

function FilaVariable({ f, maxImportancia, barColor, valColor }) {
  const pct = Math.round((Number(f.importance_rf) / maxImportancia) * 100)
  return (
    <div className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="text-sm text-slate-800 truncate">{f.display_name}</div>
        <div className="text-xs text-slate-400 mt-0.5">
          Con abandono: {f.churn_avg} · Activos: {f.active_avg}
        </div>
      </div>
      <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden flex-shrink-0">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: barColor }} />
      </div>
      <span className="text-xs w-9 text-right font-medium flex-shrink-0" style={{ color: valColor }}>
        {f.delta_pct}
      </span>
    </div>
  )
}

export default function AnalisisFeatures({ onNavigate }) {
  const [variables, setVariables] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/analisis_features.csv')
      .then(r => r.text())
      .then(text => {
        setVariables(parseCSV(text))
        setCargando(false)
      })
  }, [])

  const retencion = variables
    .filter(f => f.category === 'retention')
    .sort((a, b) => Number(b.importance_rf) - Number(a.importance_rf))

  const riesgo = variables
    .filter(f => f.category === 'churn')
    .sort((a, b) => Number(b.importance_rf) - Number(a.importance_rf))

  const maxImportancia = Math.max(...variables.map(f => Number(f.importance_rf)), 0.01)

  const indicadores = [
    { label: 'Variables analizadas', value: variables.length, sub: 'Bosque aleatorio (Random Forest)', color: '#0f172a' },
    { label: 'Variables de retención', value: retencion.length, sub: 'Correlacionadas con permanencia', color: '#047857' },
    { label: 'Variables de riesgo', value: riesgo.length, sub: 'Correlacionadas con abandono', color: '#be123c' },
  ]

  const variablesConclusion = Object.keys(CONCLUSIONES)
    .map(id => variables.find(f => f.feature_id === id))
    .filter(Boolean)

  return (
    <div className="p-4 sm:p-6">
      <p className="text-sm text-slate-500 mb-5">
        ¿Qué funcionalidades retienen clientes y cuáles están asociadas al abandono?
      </p>

      {/* Indicadores */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {indicadores.map((k) => (
          <div key={k.label} className="bg-white rounded-xl px-4 py-3 border" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
            <div className="text-xs text-slate-500 mb-1">{k.label}</div>
            <div className="text-2xl font-semibold" style={{ color: k.color }}>
              {cargando ? '—' : k.value}
            </div>
            <div className="text-xs text-slate-400 mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      {cargando ? (
        <div className="text-sm text-slate-400 text-center py-10">Cargando datos…</div>
      ) : (
        <>
          {/* Tablas de variables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <Card>
              <CardTitle>Variables que retienen clientes (menor abandono)</CardTitle>
              {retencion.map(f => (
                <FilaVariable
                  key={f.feature_id}
                  f={f}
                  maxImportancia={maxImportancia}
                  barColor="#639922"
                  valColor="#047857"
                />
              ))}
            </Card>

            <Card>
              <CardTitle>Variables asociadas al abandono (mayor riesgo)</CardTitle>
              {riesgo.map(f => (
                <FilaVariable
                  key={f.feature_id}
                  f={f}
                  maxImportancia={maxImportancia}
                  barColor="#E24B4A"
                  valColor="#be123c"
                />
              ))}
            </Card>
          </div>

          {/* Conclusiones */}
          <Card>
            <CardTitle>Conclusiones accionables para el equipo de desarrollo</CardTitle>
            {variablesConclusion.map(f => (
              <div key={f.feature_id} className="py-3 border-b border-slate-100 last:border-0">
                <div className="text-sm font-semibold text-slate-800">{f.display_name}</div>
                <div className="text-sm text-slate-500 mt-1 leading-relaxed">{CONCLUSIONES[f.feature_id]}</div>
              </div>
            ))}
          </Card>
        </>
      )}
    </div>
  )
}
