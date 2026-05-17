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

const NIVEL_ESTILO = {
  Alto: { background: '#fff1f2', color: '#be123c' },
  Moderado: { background: '#fffbeb', color: '#b45309' },
  Bajo: { background: '#ecfdf5', color: '#047857' },
}

const RECOMENDACION = {
  Alto: 'Contactar con oferta',
  Moderado: 'Monitorear alertas',
  Bajo: 'Mantener fidelización',
}

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl p-4 border ${className}`} style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
      {children}
    </div>
  )
}

function InfoTooltip({ text }) {
  return (
    <div className="relative group inline-flex flex-shrink-0 ml-1">
      <span
        className="w-3.5 h-3.5 rounded-full flex items-center justify-center cursor-default select-none font-semibold"
        style={{ background: 'rgba(15,23,42,0.07)', color: '#94a3b8', fontSize: 9 }}
      >
        i
      </span>
      <div
        className="absolute right-0 bottom-full mb-1.5 hidden group-hover:block pointer-events-none"
        style={{ width: 200, zIndex: 9999 }}
      >
        <div
          className="rounded-xl p-2.5 text-xs leading-relaxed shadow-xl"
          style={{ background: '#1e2235', color: 'rgba(255,255,255,0.75)' }}
        >
          {text}
        </div>
      </div>
    </div>
  )
}

export default function ScoringMasivo({ onNavigate }) {
  const [filas, setFilas] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/clientes_scored.csv')
      .then(r => r.text())
      .then(text => {
        const datos = parseCSV(text)
        datos.sort((a, b) => Number(b.risk_pct) - Number(a.risk_pct))
        setFilas(datos)
        setCargando(false)
      })
  }, [])

  const alto = filas.filter(r => r.risk_level === 'Alto').length
  const moderado = filas.filter(r => r.risk_level === 'Moderado').length
  const bajo = filas.filter(r => r.risk_level === 'Bajo').length
  const vista = filas.slice(0, 15)

  return (
    <div className="p-4 sm:p-6">
      <p className="text-sm text-slate-500 mb-5">
        Subí un archivo con datos de clientes y obtenés el puntaje de abandono predicho por el modelo.
      </p>

      <div className="flex flex-col lg:flex-row gap-4">

        {/* Columna principal */}
        <div className="flex-1 space-y-4 min-w-0">

          {/* Zona de carga */}
          <div
            className="rounded-xl p-6 sm:p-8 text-center border-2 border-dashed"
            style={{ background: '#f8fafc', borderColor: '#cbd5e1' }}
          >
            <div className="text-3xl mb-2 text-slate-400">↑</div>
            <div className="text-sm font-semibold text-slate-700">Arrastrá o seleccioná un archivo CSV</div>
            <div className="text-xs text-slate-500 mt-1">El archivo debe tener encabezado · Máx. 50.000 filas · 50 MB</div>
            <button
              className="mt-4 px-5 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: '#4f6ef7' }}
            >
              Subir archivo
            </button>
          </div>

          {/* Tabla de resultados */}
          <Card>
            <div className="text-xs font-semibold text-slate-700 mb-3">
              {cargando
                ? 'Cargando datos…'
                : `Vista previa — primeros ${vista.length} clientes por riesgo (de ${filas.length} totales)`}
            </div>

            <div className="overflow-x-auto">
              <div style={{ minWidth: '520px' }}>
                <div
                  className="grid text-xs text-slate-500 font-medium uppercase tracking-wider px-3 py-2 rounded-t-lg"
                  style={{
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr 1fr',
                    background: '#f8fafc',
                    borderBottom: '1px solid rgba(15,23,42,0.06)',
                  }}
                >
                  <span>Cliente</span>
                  <span>Plan</span>
                  <span>Puntaje</span>
                  <span>Riesgo</span>
                  <span>Recomendación</span>
                  <span>Estado</span>
                </div>

                {vista.map((r, i) => (
                  <div
                    key={i}
                    className="grid items-center px-3 py-2.5 border-b border-slate-100 last:border-0"
                    style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr 1fr' }}
                  >
                    <span className="text-sm text-slate-800 truncate pr-2">{r.company_name}</span>
                    <span className="text-xs text-slate-500">{r.plan_tier}</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {(Number(r.risk_pct) / 100).toFixed(2)}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full w-fit font-medium"
                      style={NIVEL_ESTILO[r.risk_level] || {}}
                    >
                      {r.risk_level}
                    </span>
                    <span className="text-xs text-slate-500">{RECOMENDACION[r.risk_level] || '—'}</span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#639922' }} />
                      Listo
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Panel lateral */}
        <div className="w-full lg:w-56 flex-shrink-0 space-y-3">
          <Card>
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Modelo activo</div>
            <div className="text-sm font-semibold text-slate-800">ChurnGuard RF v1.0</div>
            <div className="text-xs text-slate-400 mt-0.5">Bosque aleatorio · 100 estimadores</div>
          </Card>

          <Card>
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Resumen del lote</div>
            {[
              { k: 'Total clientes', v: cargando ? '—' : filas.length.toString() },
              { k: 'Alto riesgo', v: cargando ? '—' : alto.toString(), color: '#be123c' },
              { k: 'Riesgo moderado', v: cargando ? '—' : moderado.toString(), color: '#b45309' },
              { k: 'Riesgo bajo', v: cargando ? '—' : bajo.toString(), color: '#047857' },
            ].map((fila) => (
              <div key={fila.k} className="flex justify-between py-1.5 border-b border-slate-100 last:border-0">
                <span className="text-xs text-slate-500">{fila.k}</span>
                <span className="text-xs font-semibold" style={{ color: fila.color || '#0f172a' }}>
                  {fila.v}
                </span>
              </div>
            ))}
          </Card>

          <Card>
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Parámetros del modelo</div>
            {[
              {
                k: 'Umbral alto',
                v: '≥ 36%',
                info: 'Puntaje mínimo para clasificar un cliente como riesgo alto. Corresponde al 25% de clientes con mayor probabilidad de abandono en el dataset.',
              },
              {
                k: 'Umbral moderado',
                v: '≥ 22%',
                info: 'Puntaje mínimo para riesgo moderado. Entre 22% y 36% el cliente requiere seguimiento pero no intervención urgente.',
              },
              {
                k: 'Clase balanceada',
                v: 'Sí',
                info: 'El modelo fue entrenado dando igual peso a clientes que cancelaron y que no. Evita que ignore los casos de abandono, que son minoría en el dataset.',
              },
              {
                k: 'Umbral de decisión',
                v: '0.30',
                info: 'Probabilidad mínima para que el modelo prediga abandono. Usar 0.30 en vez de 0.50 hace al modelo más sensible y detecta más clientes en riesgo.',
              },
            ].map((fila) => (
              <div key={fila.k} className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
                <span className="flex items-center text-xs text-slate-500">
                  {fila.k}
                  <InfoTooltip text={fila.info} />
                </span>
                <span className="text-xs font-medium text-slate-800">{fila.v}</span>
              </div>
            ))}
          </Card>
        </div>

      </div>
    </div>
  )
}
