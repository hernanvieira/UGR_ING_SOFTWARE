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

const ESTADO_ESTILO = {
  Activa: { background: '#ecfdf5', color: '#047857' },
  Programada: { background: '#eff6ff', color: '#1d4ed8' },
  Finalizada: { background: '#f1f5f9', color: '#64748b' },
}

const CAMPOS_FORMULARIO = ['Segmento', 'Criterio de riesgo', 'Acción', 'Responsable', 'Fecha de inicio']

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl p-4 border ${className}`} style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
      {children}
    </div>
  )
}

export default function CampanasRetencion({ onNavigate }) {
  const [campanas, setCampanas] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/campanas.csv')
      .then(r => r.text())
      .then(text => {
        setCampanas(parseCSV(text))
        setCargando(false)
      })
  }, [])

  const activas = campanas.filter(c => c.status === 'Activa').length
  const totalObjetivo = campanas.reduce((s, c) => s + Number(c.clients_targeted || 0), 0)
  const totalRetenidos = campanas.reduce((s, c) => s + Number(c.clients_retained || 0), 0)
  const totalMRR = campanas.reduce((s, c) => s + Number(c.mrr_saved_usd || 0), 0)

  const indicadores = [
    { label: 'Campañas activas', value: activas, sub: `${campanas.length} en total` },
    { label: 'Clientes objetivo', value: totalObjetivo, sub: 'En todas las campañas' },
    { label: 'Clientes retenidos', value: totalRetenidos, sub: 'Activas y finalizadas' },
    { label: 'Ingresos salvaguardados', value: `$${totalMRR.toLocaleString()}`, sub: 'MRR acumulado' },
  ]

  return (
    <div className="p-4 sm:p-6">
      <p className="text-sm text-slate-500 mb-5">
        Diseñá y ejecutá campañas para reducir el abandono basado en predicciones.
      </p>

      {/* Indicadores */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {indicadores.map((k) => (
          <div key={k.label} className="bg-white rounded-xl px-4 py-3 border" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
            <div className="text-xs text-slate-500 mb-1">{k.label}</div>
            <div className="text-2xl font-semibold text-slate-900">{cargando ? '—' : k.value}</div>
            <div className="text-xs text-slate-400 mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4">

        {/* Tabla de campañas */}
        <div className="flex-1 min-w-0">
          <Card>
            <div className="text-xs font-semibold text-slate-700 mb-3">Campañas de retención</div>

            <div className="overflow-x-auto">
              <div style={{ minWidth: '560px' }}>
                <div
                  className="grid text-xs text-slate-500 font-medium uppercase tracking-wider px-3 py-2 rounded-t-lg"
                  style={{
                    gridTemplateColumns: '2fr 1.5fr 0.8fr 1fr 1fr 1.2fr',
                    background: '#f8fafc',
                    borderBottom: '1px solid rgba(15,23,42,0.06)',
                  }}
                >
                  <span>Campaña</span>
                  <span>Segmento</span>
                  <span>Clientes</span>
                  <span>Estado</span>
                  <span>Responsable</span>
                  <span>Avance</span>
                </div>

                {cargando ? (
                  <div className="px-3 py-8 text-sm text-slate-400 text-center">Cargando datos…</div>
                ) : campanas.map((c, i) => (
                  <div
                    key={i}
                    className="grid items-center px-3 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                    style={{ gridTemplateColumns: '2fr 1.5fr 0.8fr 1fr 1fr 1.2fr' }}
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-800">{c.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{c.description}</div>
                    </div>
                    <span className="text-xs text-slate-500">{c.segment}</span>
                    <span className="text-sm text-slate-700">{Number(c.clients_targeted).toLocaleString()}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full w-fit"
                      style={ESTADO_ESTILO[c.status] || {}}
                    >
                      {c.status}
                    </span>
                    <span className="text-sm text-slate-700">{c.owner}</span>
                    <div className="flex items-center gap-1.5 pr-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${c.progress_pct}%`, background: '#4f6ef7' }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 w-7">{c.progress_pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Formulario nueva campaña */}
        <div className="w-full lg:w-52 flex-shrink-0">
          <Card>
            <div className="text-xs font-semibold text-slate-700 mb-3">Nueva campaña</div>
            {CAMPOS_FORMULARIO.map((campo) => (
              <div key={campo} className="mb-3">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{campo}</div>
                <select
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border text-slate-500"
                  style={{ borderColor: 'rgba(15,23,42,0.10)', background: '#f8fafc' }}
                >
                  <option>Seleccionar…</option>
                </select>
              </div>
            ))}
            <button
              className="w-full py-2 rounded-lg text-xs font-semibold text-white mt-1 transition-opacity hover:opacity-90"
              style={{ background: '#4f6ef7' }}
            >
              Crear campaña
            </button>
          </Card>
        </div>

      </div>
    </div>
  )
}
