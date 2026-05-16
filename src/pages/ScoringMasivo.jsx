const RESULTS = [
  { name: 'TechNova Solutions', score: '0.87', risk: 'Alto', riskType: 'red', rec: 'Contactar con oferta' },
  { name: 'DataPro Analytics', score: '0.72', risk: 'Alto', riskType: 'red', rec: 'Ofrecer incentivo' },
  { name: 'WebIntelli SAS', score: '0.48', risk: 'Medio', riskType: 'amber', rec: 'Monitorear alertas' },
  { name: 'Creative Minds', score: '0.31', risk: 'Medio', riskType: 'amber', rec: 'Enviar contenido de valor' },
  { name: 'CloudWare Ltd.', score: '0.14', risk: 'Bajo', riskType: 'green', rec: 'Mantener engagement' },
  { name: 'InnovaTech Group', score: '0.09', risk: 'Bajo', riskType: 'green', rec: 'Mantener engagement' },
]

const PILL_STYLE = {
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

export default function ScoringMasivo({ onNavigate }) {
  return (
    <div className="p-6">
      <p className="text-sm text-slate-500 mb-5">
        Subí un CSV con datos de clientes y obtenés el score de churn predicho.
      </p>

      <div className="flex gap-4">
        {/* Left */}
        <div className="flex-1 space-y-4">
          {/* Upload zone */}
          <div
            className="rounded-xl p-8 text-center border-2 border-dashed"
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

          {/* File item */}
          <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
            <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ background: '#eff6ff' }} />
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-800">clientes_mayo_2024.csv</div>
              <div className="text-xs text-slate-400 mt-0.5">12.842 filas · 2.4 MB</div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: '#ecfdf5', color: '#047857' }}>
              Listo para procesar
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button className="px-5 py-2 rounded-lg text-sm font-medium text-white" style={{ background: '#4f6ef7' }}>
              Procesar lote
            </button>
            <button className="px-4 py-2 rounded-lg text-sm border text-slate-500 bg-white" style={{ borderColor: 'rgba(15,23,42,0.10)' }}>
              Opciones avanzadas
            </button>
          </div>

          {/* Results table */}
          <Card>
            <div className="text-xs font-semibold text-slate-700 mb-3">
              Vista previa de resultados (primeras 6 filas)
            </div>
            <div
              className="grid text-xs text-slate-500 font-medium uppercase tracking-wider px-3 py-2 rounded-t-lg"
              style={{ gridTemplateColumns: '2fr 1fr 1fr 2fr 1fr', background: '#f8fafc', borderBottom: '1px solid rgba(15,23,42,0.06)' }}
            >
              <span>Cliente</span><span>Score</span><span>Riesgo</span><span>Recomendación</span><span>Estado</span>
            </div>
            {RESULTS.map((r) => (
              <div
                key={r.name}
                className="grid items-center px-3 py-2.5 border-b border-slate-100 last:border-0"
                style={{ gridTemplateColumns: '2fr 1fr 1fr 2fr 1fr' }}
              >
                <span className="text-sm text-slate-800">{r.name}</span>
                <span className="text-sm font-semibold text-slate-900">{r.score}</span>
                <span className="text-xs px-2 py-0.5 rounded-full w-fit font-medium" style={PILL_STYLE[r.riskType]}>{r.risk}</span>
                <span className="text-xs text-slate-500">{r.rec}</span>
                <span className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#639922' }} />
                  OK
                </span>
              </div>
            ))}
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="w-56 space-y-3 flex-shrink-0">
          <Card>
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Modelo activo</div>
            <div className="text-sm font-semibold text-slate-800">ChurnGuard v2.1</div>
            <div className="text-xs text-slate-400 mt-0.5">Actualizado: 12/05/2024</div>
          </Card>

          <Card>
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Última ejecución</div>
            {[
              { k: 'Archivo', v: 'clientes_abril_2024.csv' },
              { k: 'Fecha', v: '06/05/2024 14:32' },
              { k: 'Registros', v: '9.842' },
              { k: 'Tiempo total', v: '00:01:24' },
              { k: 'Estado', v: 'Completado', success: true },
            ].map((row) => (
              <div key={row.k} className="flex justify-between py-1.5 border-b border-slate-100 last:border-0">
                <span className="text-xs text-slate-500">{row.k}</span>
                <span className="text-xs font-medium" style={{ color: row.success ? '#047857' : '#0f172a' }}>
                  {row.v}
                </span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}
