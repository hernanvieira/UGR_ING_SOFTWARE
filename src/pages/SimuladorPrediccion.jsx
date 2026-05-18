import { useState, useEffect } from 'react'

// ── Encodings (LabelEncoder order from notebook) ──────────────────────────
const ENC = {
  industry: ['Cybersecurity', 'DevTools', 'EdTech', 'FinTech', 'HealthTech'],
  country: ['AU', 'CA', 'DE', 'FR', 'IN', 'UK', 'US'],
  referral_source: ['ads', 'event', 'organic', 'other', 'partner'],
  plan_tier: ['Basic', 'Enterprise', 'Pro'],
}

// ── Feature order (must match FEATURES list in notebook) ─────────────────
// seats, tenure_days, is_trial, avg_mrr, n_suscripciones,
// upgrade_ever, downgrade_ever, auto_renew_pct,
// total_uso, features_distintas, total_errores, pct_beta,
// total_tickets, avg_resolucion_hrs, avg_satisfaccion, tasa_escalacion,
// industry_enc, country_enc, referral_source_enc, plan_tier_enc

// ── Decision Tree — probabilidades reales por hoja (predict_proba) ────────
// Transcripción exacta del JS documentado por el compañero en celda 113
function predecirArbol(r) {
  if (r.avg_mrr <= 2712.64) {
    if (r.country_enc <= 0.5)       return { proba: 0.000 }
    if (r.features_distintas <= 22.5)
      return r.country_enc <= 3.5   ? { proba: 0.385 } : { proba: 0.050 }
    return r.total_errores <= 16.5  ? { proba: 0.556 } : { proba: 0.280 }
  } else {
    if (r.avg_resolucion_hrs <= 9.67)
      return r.pct_beta <= 0.03     ? { proba: 0.000 } : { proba: 1.000 }
    if (r.avg_satisfaccion <= 4.83)
      return r.total_errores <= 9.5 ? { proba: 1.000 } : { proba: 0.071 }
    return r.upgrade_ever <= 0.5    ? { proba: 1.000 } : { proba: 0.000 }
  }
}

// ── KNN (K=14, distancia euclidiana sobre datos escalados) ────────────────
function escalar(rawVec, mean, scale) {
  return rawVec.map((v, i) => (v - mean[i]) / scale[i])
}

function distEuclid(a, b) {
  let s = 0
  for (let i = 0; i < a.length; i++) s += (a[i] - b[i]) ** 2
  return s
}

function predecirKNN(scaledVec, model) {
  const K = 14
  const dists = model.X.map((pt, i) => ({ d: distEuclid(pt, scaledVec), y: model.y[i] })  )
  dists.sort((a, b) => a.d - b.d)
  const vecinos = dists.slice(0, K)
  const churnCount = vecinos.filter(v => v.y === 1).length
  return { clase: churnCount > K / 2 ? 1 : 0, proba: churnCount / K }
}

// ── Random Forest (aproximación: blend DT + KNN, según notebook) ─────────
function predecirRF(dtProba, knnProba) {
  const blended = 0.55 * dtProba + 0.45 * knnProba
  const amplified = Math.min(blended * 1.35, 1.0)
  return { clase: amplified >= 0.3 ? 1 : 0, proba: amplified }
}

// ── Factores de riesgo — config display ──────────────────────────────────
const FACTORES_CONFIG = [
  { key: 'total_tickets',     label: 'Total tickets de soporte',       avg: 4,    max: 20,   dir: 'higher', fmt: v => `${v}`,                       sub: v => `promedio ${v}` },
  { key: 'avg_resolucion_hrs',label: 'Tiempo de resolución (hs)',       avg: 36,   max: 120,  dir: 'higher', fmt: v => `${v} hs`,                     sub: v => `promedio ${v} hs` },
  { key: 'avg_satisfaccion',  label: 'Satisfacción',                    avg: 3.7,  max: 5,    dir: 'lower',  fmt: v => `${v}/5`,                      sub: v => `promedio ${v}` },
  { key: 'total_errores',     label: 'Errores registrados',             avg: 28,   max: 80,   dir: 'higher', fmt: v => `${v}`,                        sub: v => `promedio ${v}` },
  { key: 'pct_beta',          label: 'Uso en funcionalidades beta',     avg: 0.104,max: 1,    dir: 'higher', fmt: v => `${Math.round(v*100)}%`,       sub: v => `promedio ${Math.round(v*100)}%` },
  { key: 'auto_renew_pct',    label: 'Auto-renovación',                 avg: 0.8,  max: 1,    dir: 'lower',  fmt: v => `${Math.round(v*100)}% activo`,sub: () => 'mayor = menor riesgo' },
  { key: 'avg_mrr',           label: 'MRR (determina rama árbol)',      avg: 2200, max: 5000, dir: 'struct', fmt: v => `$${Number(v).toLocaleString()}`, sub: () => 'umbral $2,712' },
]

function factorColor(val, avg, dir) {
  if (dir === 'struct') return '#94a3b8'
  const worse = dir === 'higher' ? val > avg : val < avg
  const big   = dir === 'higher' ? val > avg * 1.4 : val < avg * 0.7
  return big ? '#E24B4A' : worse ? '#EF9F27' : '#639922'
}

function buildAcciones(form, rfNivel) {
  const tickets = +form.total_tickets, resol = +form.avg_resolucion_hrs, sat = +form.avg_satisfaccion
  const out = []
  if (rfNivel === 'Alto')
    out.push({ text: 'Contactar con oferta de retención esta semana', tipo: 'urgent' })
  if (rfNivel !== 'Bajo')
    out.push({ text: 'Programar check-in proactivo en los próximos 7 días', tipo: 'accion' })
  if (tickets > 4)
    out.push({ text: 'Revisar historial de soporte reciente', tipo: 'accion' })
  if (resol > 48)
    out.push({ text: 'Escalar tickets pendientes para resolución prioritaria', tipo: 'accion' })
  if (sat < 3)
    out.push({ text: 'Enviar encuesta de satisfacción y asignar account manager', tipo: 'accion' })
  out.push({ text: 'Monitorear uso semanal durante 30 días', tipo: 'monitor' })
  return out
}

// ── Defaults (medias globales del dataset) ────────────────────────────────
const DEFAULTS = {
  seats: 20, tenure_days: 340, is_trial: 0, avg_mrr: 2200,
  n_suscripciones: 10, upgrade_ever: 0, downgrade_ever: 0, auto_renew_pct: 0.80,
  total_uso: 500, features_distintas: 28, total_errores: 28, pct_beta: 0.10,
  total_tickets: 4, avg_resolucion_hrs: 36, avg_satisfaccion: 3.7, tasa_escalacion: 0.05,
  industry: 'FinTech', country: 'US', referral_source: 'organic', plan_tier: 'Pro',
}

function rawToVec(f) {
  return [
    +f.seats, +f.tenure_days, +f.is_trial, +f.avg_mrr, +f.n_suscripciones,
    +f.upgrade_ever, +f.downgrade_ever, +f.auto_renew_pct,
    +f.total_uso, +f.features_distintas, +f.total_errores, +f.pct_beta,
    +f.total_tickets, +f.avg_resolucion_hrs, +f.avg_satisfaccion, +f.tasa_escalacion,
    ENC.industry.indexOf(f.industry),
    ENC.country.indexOf(f.country),
    ENC.referral_source.indexOf(f.referral_source),
    ENC.plan_tier.indexOf(f.plan_tier),
  ]
}

function rawToObj(f) {
  return {
    avg_mrr: +f.avg_mrr,
    country_enc: ENC.country.indexOf(f.country),
    features_distintas: +f.features_distintas,
    total_errores: +f.total_errores,
    avg_resolucion_hrs: +f.avg_resolucion_hrs,
    pct_beta: +f.pct_beta,
    avg_satisfaccion: +f.avg_satisfaccion,
    upgrade_ever: +f.upgrade_ever,
  }
}

// ── Nivel y colores ───────────────────────────────────────────────────────
function nivel(proba) {
  if (proba >= 0.36) return 'Alto'
  if (proba >= 0.22) return 'Moderado'
  return 'Bajo'
}
const NIVEL_COLOR = { Alto: '#be123c', Moderado: '#b45309', Bajo: '#047857' }
const NIVEL_BG    = { Alto: '#fff1f2', Moderado: '#fffbeb', Bajo: '#ecfdf5' }

function GaugeSVG({ proba }) {
  const [displayed, setDisplayed] = useState(0)
  useEffect(() => {
    setDisplayed(0)
    const t = setTimeout(() => setDisplayed(proba), 40)
    return () => clearTimeout(t)
  }, [proba])

  const pct = Math.round(displayed * 100)
  const r = 44
  const cx = 60, cy = 60
  const rad = Math.PI * (1 + displayed)
  const x = cx + r * Math.cos(rad)
  const y = cy + r * Math.sin(rad)
  const color = proba >= 0.36 ? '#E24B4A' : proba >= 0.22 ? '#EF9F27' : '#378ADD'
  const dash = 2 * Math.PI * r
  const filled = displayed * dash / 2
  return (
    <svg viewBox="0 0 120 70" className="w-full">
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#e2e8f0" strokeWidth="8" />
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${filled} ${dash}`}
        style={{ transition: 'stroke-dasharray 0.7s cubic-bezier(0.34,1.2,0.64,1)' }}
      />
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a">{pct}%</text>
    </svg>
  )
}

function GaugeInfoTooltip({ align = 'right' }) {
  const box = align === 'left' ? 'left-0' : 'right-0'
  return (
    <div className="relative group flex items-center">
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none"
        className="text-slate-300 hover:text-slate-400 transition-colors cursor-default flex-shrink-0">
        <circle cx="8" cy="8" r="7.5" stroke="currentColor" />
        <path d="M8 7v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="5" r="0.75" fill="currentColor" />
      </svg>
      <div className={`absolute ${box} top-5 w-56 bg-slate-800 text-white text-xs rounded-lg px-3 py-2.5 invisible group-hover:visible z-20 shadow-xl leading-relaxed space-y-2`}>
        <div className="flex items-start gap-2">
          <span className="mt-0.5 w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#E24B4A' }} />
          <span><strong>Rojo &gt; 36%</strong> — riesgo alto. Intervención urgente.</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="mt-0.5 w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#EF9F27' }} />
          <span><strong>Ámbar 22–36%</strong> — riesgo moderado. Monitorear.</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="mt-0.5 w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#378ADD' }} />
          <span><strong>Azul &lt; 22%</strong> — riesgo bajo. Fidelizar.</span>
        </div>
        <div className="border-t border-slate-600 pt-2 text-slate-300">
          El arco indica la probabilidad de que ese cliente cancele su suscripción.
        </div>
      </div>
    </div>
  )
}

function GaugeSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-10 rounded-lg mb-2" style={{ background: '#f1f5f9' }} />
      <div className="flex justify-center mb-1">
        <div className="h-4 w-12 rounded-full" style={{ background: '#f1f5f9' }} />
      </div>
      <div className="flex justify-center">
        <div className="h-3 w-14 rounded-full" style={{ background: '#f1f5f9' }} />
      </div>
    </div>
  )
}

function ModelCard({ name, result, loading }) {
  const n = result ? nivel(result.proba) : null
  return (
    <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{name}</div>
        <GaugeInfoTooltip align="right" />
      </div>
      {loading ? (
        <GaugeSkeleton />
      ) : !result ? (
        <div className="text-sm text-slate-400 text-center py-4">—</div>
      ) : (
        <>
          <GaugeSVG proba={result.proba} />
          <div className="flex justify-center mt-2">
            <span
              className="text-xs px-2.5 py-1 rounded-full font-semibold"
              style={{ background: NIVEL_BG[n], color: NIVEL_COLOR[n] }}
            >
              {n}
            </span>
          </div>
          <div className="text-xs text-slate-400 text-center mt-1">{Math.round(result.proba * 100)}% prob. churn</div>
        </>
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1">{label}</label>
      {children}
    </div>
  )
}

const INPUT_CLS = "w-full text-xs px-2 py-1.5 rounded-lg border text-slate-800 bg-white"
const INPUT_ST  = { borderColor: 'rgba(15,23,42,0.12)' }

export default function SimuladorPrediccion({ navData }) {
  const [form, setForm] = useState(() => ({ ...DEFAULTS, ...(navData || {}) }))
  const [knnModel, setKnnModel] = useState(null)
  const [loadingModel, setLoadingModel] = useState(true)
  const [results, setResults] = useState(null)
  const [computing, setComputing] = useState(false)

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/knn_model.json')
      .then(r => r.json())
      .then(data => { setKnnModel(data); setLoadingModel(false) })
  }, [])

  // Pre-fill from navData (client from ClientesEnRiesgo / DetalleCliente)
  useEffect(() => {
    if (navData && Object.keys(navData).length > 0) {
      setForm(prev => ({ ...prev, ...navData }))
    }
  }, [navData])

  function set(k, v) { setForm(prev => ({ ...prev, [k]: v })) }

  function predecir() {
    if (!knnModel) return
    setComputing(true)
    setTimeout(() => {
      const rawObj = rawToObj(form)
      const rawVec = rawToVec(form)
      const scaledVec = escalar(rawVec, knnModel.mean, knnModel.scale)
      const dt  = predecirArbol(rawObj)
      const knn = predecirKNN(scaledVec, knnModel)
      const rf  = predecirRF(dt.proba, knn.proba)
      setResults({ dt, knn, rf })
      setComputing(false)
    }, 600)
  }

  const rfNivel = results ? nivel(results.rf.proba) : null

  return (
    <div className="p-4 sm:p-6">
      <p className="text-sm text-slate-500 mb-5">
        Ingresá los datos de un cliente para obtener su probabilidad de abandono según tres modelos.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* ── Formulario ─────────────────────────────────────────────── */}
        <div className="min-w-0 space-y-4">

          {/* Contrato */}
          <div className="bg-white rounded-xl border p-3" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
            <div className="text-xs font-semibold text-slate-700 mb-2">Contrato</div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Plan">
                <select className={INPUT_CLS} style={INPUT_ST} value={form.plan_tier} onChange={e => set('plan_tier', e.target.value)}>
                  {ENC.plan_tier.map(v => <option key={v}>{v}</option>)}
                </select>
              </Field>
              <Field label="MRR promedio ($)">
                <input type="number" className={INPUT_CLS} style={INPUT_ST} value={form.avg_mrr} onChange={e => set('avg_mrr', e.target.value)} />
              </Field>
              <Field label="Usuarios (seats)">
                <input type="number" className={INPUT_CLS} style={INPUT_ST} value={form.seats} onChange={e => set('seats', e.target.value)} />
              </Field>
              <Field label="Antigüedad (días)">
                <input type="number" className={INPUT_CLS} style={INPUT_ST} value={form.tenure_days} onChange={e => set('tenure_days', e.target.value)} />
              </Field>
              <Field label="Suscripciones">
                <input type="number" className={INPUT_CLS} style={INPUT_ST} value={form.n_suscripciones} onChange={e => set('n_suscripciones', e.target.value)} />
              </Field>
              <Field label="Renovación automática">
                <select className={INPUT_CLS} style={INPUT_ST} value={form.auto_renew_pct} onChange={e => set('auto_renew_pct', e.target.value)}>
                  <option value={1}>Sí</option>
                  <option value={0}>No</option>
                </select>
              </Field>
              <Field label="Trial">
                <select className={INPUT_CLS} style={INPUT_ST} value={form.is_trial} onChange={e => set('is_trial', e.target.value)}>
                  <option value={0}>No</option>
                  <option value={1}>Sí</option>
                </select>
              </Field>
              <Field label="Upgrade alguna vez">
                <select className={INPUT_CLS} style={INPUT_ST} value={form.upgrade_ever} onChange={e => set('upgrade_ever', e.target.value)}>
                  <option value={0}>No</option>
                  <option value={1}>Sí</option>
                </select>
              </Field>
              <Field label="Downgrade alguna vez">
                <select className={INPUT_CLS} style={INPUT_ST} value={form.downgrade_ever} onChange={e => set('downgrade_ever', e.target.value)}>
                  <option value={0}>No</option>
                  <option value={1}>Sí</option>
                </select>
              </Field>
            </div>
          </div>

          {/* Uso del producto */}
          <div className="bg-white rounded-xl border p-3" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
            <div className="text-xs font-semibold text-slate-700 mb-2">Uso del producto</div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Funcionalidades usadas">
                <input type="number" className={INPUT_CLS} style={INPUT_ST} value={form.features_distintas} onChange={e => set('features_distintas', e.target.value)} />
              </Field>
              <Field label="Uso total (eventos)">
                <input type="number" className={INPUT_CLS} style={INPUT_ST} value={form.total_uso} onChange={e => set('total_uso', e.target.value)} />
              </Field>
              <Field label="Errores registrados">
                <input type="number" className={INPUT_CLS} style={INPUT_ST} value={form.total_errores} onChange={e => set('total_errores', e.target.value)} />
              </Field>
              <Field label="Uso de beta (0–1)">
                <input type="number" step="0.01" min="0" max="1" className={INPUT_CLS} style={INPUT_ST} value={form.pct_beta} onChange={e => set('pct_beta', e.target.value)} />
              </Field>
            </div>
          </div>

          {/* Soporte */}
          <div className="bg-white rounded-xl border p-3" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
            <div className="text-xs font-semibold text-slate-700 mb-2">Soporte</div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Tickets totales">
                <input type="number" className={INPUT_CLS} style={INPUT_ST} value={form.total_tickets} onChange={e => set('total_tickets', e.target.value)} />
              </Field>
              <Field label="Resolución promedio (hs)">
                <input type="number" className={INPUT_CLS} style={INPUT_ST} value={form.avg_resolucion_hrs} onChange={e => set('avg_resolucion_hrs', e.target.value)} />
              </Field>
              <Field label="Satisfacción (1–5)">
                <input type="number" step="0.1" min="1" max="5" className={INPUT_CLS} style={INPUT_ST} value={form.avg_satisfaccion} onChange={e => set('avg_satisfaccion', e.target.value)} />
              </Field>
              <Field label="Tasa escalación (0–1)">
                <input type="number" step="0.01" min="0" max="1" className={INPUT_CLS} style={INPUT_ST} value={form.tasa_escalacion} onChange={e => set('tasa_escalacion', e.target.value)} />
              </Field>
            </div>
          </div>

          {/* Cuenta */}
          <div className="bg-white rounded-xl border p-3" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
            <div className="text-xs font-semibold text-slate-700 mb-2">Cuenta</div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Industria">
                <select className={INPUT_CLS} style={INPUT_ST} value={form.industry} onChange={e => set('industry', e.target.value)}>
                  {ENC.industry.map(v => <option key={v}>{v}</option>)}
                </select>
              </Field>
              <Field label="País">
                <select className={INPUT_CLS} style={INPUT_ST} value={form.country} onChange={e => set('country', e.target.value)}>
                  {ENC.country.map(v => <option key={v}>{v}</option>)}
                </select>
              </Field>
              <Field label="Canal de adquisición">
                <select className={INPUT_CLS} style={INPUT_ST} value={form.referral_source} onChange={e => set('referral_source', e.target.value)}>
                  {ENC.referral_source.map(v => <option key={v}>{v}</option>)}
                </select>
              </Field>
            </div>
          </div>

          <button
            onClick={predecir}
            disabled={loadingModel || computing}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: '#4f6ef7' }}
          >
            {computing && (
              <svg className="animate-spin h-4 w-4 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
            {loadingModel ? 'Cargando modelo…' : computing ? 'Calculando…' : 'Predecir churn'}
          </button>

        </div>

        {/* ── Panel de resultados ────────────────────────────────────── */}
        <div className="min-w-0 space-y-3">

          {/* Resultado ensemble */}
          <div
            className="bg-white rounded-xl border p-4"
            style={{ borderColor: results ? '#86efac' : 'rgba(15,23,42,0.08)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-slate-700">Resultado final (ensemble)</div>
              <GaugeInfoTooltip align="right" />
            </div>
            {computing ? (
              <div className="animate-pulse py-2">
                <div className="h-20 rounded-lg mx-auto mb-3" style={{ background: '#f1f5f9' }} />
                <div className="flex justify-center mb-2">
                  <div className="h-6 w-24 rounded-full" style={{ background: '#f1f5f9' }} />
                </div>
                <div className="flex justify-center">
                  <div className="h-3 w-48 rounded-full" style={{ background: '#f1f5f9' }} />
                </div>
              </div>
            ) : !results ? (
              <div className="text-sm text-slate-400 text-center py-8">Completá el formulario y presioná Predecir</div>
            ) : (
              <>
                <div className="mx-auto" style={{ maxWidth: 260 }}>
                  <GaugeSVG proba={results.rf.proba} />
                </div>
                <div className="flex justify-center mb-1">
                  <span
                    className="text-sm px-3 py-1 rounded-full font-semibold"
                    style={{ background: NIVEL_BG[rfNivel], color: NIVEL_COLOR[rfNivel] }}
                  >
                    Riesgo {rfNivel}
                  </span>
                </div>
                <p className="text-xs text-slate-500 text-center mt-2 leading-relaxed">
                  {rfNivel === 'Alto' && 'Intervención urgente recomendada. Contactar con oferta de retención.'}
                  {rfNivel === 'Moderado' && 'Monitorear de cerca. Considerar campaña preventiva.'}
                  {rfNivel === 'Bajo' && 'Perfil estable. Mantener acciones de fidelización.'}
                </p>
              </>
            )}
          </div>

          {/* Los 3 modelos en fila */}
          <div className="grid grid-cols-3 gap-2">
            <ModelCard name="Árbol de decisión" result={results?.dt} loading={computing} />
            <ModelCard name="KNN  (K = 14)" result={results?.knn} loading={computing} />
            <ModelCard name="Random Forest" result={results?.rf} loading={computing} />
          </div>

          {/* Nota metodológica */}
          <div className="rounded-xl p-3" style={{ background: '#f8fafc', border: '1px solid rgba(15,23,42,0.06)' }}>
            <div className="text-xs text-slate-400 leading-relaxed">
              Random Forest: blend ponderado Árbol (55%) + KNN (45%). Modelos entrenados con datos sintéticos.
            </div>
          </div>

          {/* Factores de riesgo */}
          {results && (
            <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Factores de riesgo (variables del modelo)
              </div>
              {FACTORES_CONFIG.map(fc => {
                const val = +form[fc.key]
                const color = factorColor(val, fc.avg, fc.dir)
                const barPct = Math.min((val / fc.max) * 100, 100)
                return (
                  <div key={fc.key} className="mb-3 last:mb-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                        <span className="text-sm text-slate-700">{fc.label}</span>
                      </div>
                      <span className="text-sm text-slate-500 flex-shrink-0 ml-2">{fc.fmt(val)}</span>
                    </div>
                    <div className="bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${barPct}%`, background: color }} />
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{fc.sub(fc.avg)}</div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Acciones recomendadas */}
          {results && (
            <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Acciones recomendadas
              </div>
              {buildAcciones(form, rfNivel).map((a, i) => {
                const isMonitor = a.tipo === 'monitor'
                const isUrgent  = a.tipo === 'urgent'
                return (
                  <div key={i} className="flex items-start gap-2.5 py-2 border-b border-slate-100 last:border-0">
                    <span className="mt-0.5 text-sm font-bold flex-shrink-0 w-4 text-center"
                      style={{ color: isMonitor ? '#047857' : isUrgent ? '#be123c' : '#b45309' }}>
                      {isMonitor ? '✓' : '–'}
                    </span>
                    <span className="text-sm text-slate-600 leading-snug">{a.text}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  )
}
