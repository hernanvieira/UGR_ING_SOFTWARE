import { useState } from 'react'

// KPIs por período — derivados de churn_mensual.csv y ravenstack_analitico.csv
// Último mes = Dic 2024 | Trimestre = Q4 2024 (Oct–Dic) | Año = promedio 2024
const KPIS_BY_PERIOD = [
  // Último mes (Dic 2024: 23.4% · Nov 2024: 14.08%)
  [
    { label: 'Churn rate', value: '23.4%', delta: '+9.3pp vs. mes anterior', up: true },
    { label: 'MRR en riesgo', value: '$68.4k', delta: '+$28.6k vs. mes anterior', up: true },
    { label: 'Clientes recuperados', value: '276', delta: '19.4% de alto riesgo', up: false },
    { label: 'Retención lograda', value: '15.2%', delta: '-3.4pp vs. mes anterior', up: true },
  ],
  // Último trimestre (Q4 2024 promedio: 17.4% · Q3 2024 promedio: 10.9%)
  [
    { label: 'Churn rate', value: '17.4%', delta: '+6.5pp vs. trimestre anterior', up: true },
    { label: 'MRR en riesgo', value: '$54.7k', delta: '+$16.8k vs. trimestre anterior', up: true },
    { label: 'Clientes recuperados', value: '312', delta: '21.1% de alto riesgo', up: false },
    { label: 'Retención lograda', value: '17.4%', delta: '-2.1pp vs. trimestre anterior', up: true },
  ],
  // Último año (promedio 2024: 11.1% · promedio 2023: 5.3%)
  [
    { label: 'Churn rate', value: '11.1%', delta: '+5.8pp vs. año anterior', up: true },
    { label: 'MRR en riesgo', value: '$44.8k', delta: '+$12.2k vs. año anterior', up: true },
    { label: 'Clientes recuperados', value: '342', delta: '22.1% de alto riesgo', up: false },
    { label: 'Retención lograda', value: '18.6%', delta: '+2.9pp vs. año anterior', up: false },
  ],
]

// Datos reales de churn_mensual.csv — altura normalizada sobre el máximo (23.4%)
const MONTHLY_DATA = [
  { mes: 'Ene 23', rate: 5.88 },
  { mes: 'Mar 23', rate: 9.09 },
  { mes: 'Abr 23', rate: 4.29 },
  { mes: 'May 23', rate: 3.12 },
  { mes: 'Jun 23', rate: 4.59 },
  { mes: 'Jul 23', rate: 4.88 },
  { mes: 'Ago 23', rate: 5.04 },
  { mes: 'Sep 23', rate: 3.70 },
  { mes: 'Oct 23', rate: 5.49 },
  { mes: 'Nov 23', rate: 5.31 },
  { mes: 'Dic 23', rate: 7.05 },
  { mes: 'Ene 24', rate: 8.23 },
  { mes: 'Feb 24', rate: 3.91 },
  { mes: 'Mar 24', rate: 8.48 },
  { mes: 'Abr 24', rate: 8.20 },
  { mes: 'May 24', rate: 8.26 },
  { mes: 'Jun 24', rate: 11.49 },
  { mes: 'Jul 24', rate: 9.36 },
  { mes: 'Ago 24', rate: 10.63 },
  { mes: 'Sep 24', rate: 12.62 },
  { mes: 'Oct 24', rate: 14.63 },
  { mes: 'Nov 24', rate: 14.08 },
  { mes: 'Dic 24', rate: 23.40 },
]
// Azul < 8% | Ámbar 8–12% | Rojo > 12%
function barColor(rate) {
  if (rate > 12) return '#E24B4A'
  if (rate >= 8) return '#EF9F27'
  return '#378ADD'
}

const PERIODS = [
  { label: 'Último mes', slice: -1 },
  { label: 'Último trimestre', slice: -3 },
  { label: 'Último año', slice: -12 },
]

// Valores reales calculados desde ravenstack_analitico.csv
// Basic: 37/168 churned (22%) · $83.2k en riesgo (21.3% del MRR del plan)
// Pro:   39/178 churned (21.9%) · $80.4k en riesgo (19.9%)
// Enterprise: 34/154 churned (22.1%) · $65.5k en riesgo (19.3%)
const MRR_PLAN = [
  { label: 'Básico', pct: 21.3, val: '$83.2k', color: '#E24B4A' },
  { label: 'Pro', pct: 19.9, val: '$80.4k', color: '#EF9F27' },
  { label: 'Enterprise', pct: 19.3, val: '$65.5k', color: '#378ADD' },
]

const MRR_PLAN_INFO =
  'Los tres planes tienen una tasa de churn casi idéntica (~22%). El plan contratado no es un factor diferenciador del riesgo: la pérdida de clientes está distribuida de forma pareja. Esto sugiere que el problema es transversal al producto, no específico de un segmento de precio.'

// Datos reales de churn_por_industria.csv
const INDUSTRIES = [
  { name: 'DevTools', pct: '31.0%', type: 'red' },
  { name: 'FinTech', pct: '22.3%', type: 'red' },
  { name: 'HealthTech', pct: '21.9%', type: 'red' },
  { name: 'EdTech', pct: '16.5%', type: 'amber' },
  { name: 'Cybersecurity', pct: '16.0%', type: 'amber' },
]

const INDUSTRIES_INFO =
  'Muestra las industrias donde los clientes cancelan con más frecuencia. Que una industria aparezca arriba no significa que esos clientes sean malos pagadores: indica que el producto no está resolviendo bien sus necesidades específicas, o que la competencia ofrece una mejor propuesta para ese sector. DevTools lidera con 31%, casi el doble que Cybersecurity (16%), lo que sugiere que vale la pena revisar el fit del producto para ese segmento.'

const CAMPAIGNS_INFO =
  'Registra las intervenciones activas del equipo de Customer Success sobre clientes detectados en riesgo. Cada campaña muestra cuántos clientes fueron retenidos y cuánto MRR se salvó. Una campaña "Aún no iniciada" representa MRR que todavía está en riesgo si no se actúa.'

const CAMPAIGNS = [
  { name: 'Rescate Pro', detail: '342 retenidos · $12.4k MRR' },
  { name: 'Follow-up Enterprise', detail: '98 retenidos · $9.1k MRR' },
  { name: 'Win-back inactivos', detail: '64 retenidos · $3.8k MRR' },
  { name: 'Bono Fidelidad Q2', detail: 'Aún no iniciada', muted: true },
]

const PILL = {
  red: 'bg-red-50 text-red-700',
  amber: 'bg-amber-50 text-amber-700',
  green: 'bg-emerald-50 text-emerald-700',
}

const KPIS_INFO = {
  'Churn rate':
    'Porcentaje de clientes que cancelaron su suscripción en el período. Un aumento sostenido indica problemas de retención.',
  'MRR en riesgo':
    'Ingreso mensual recurrente (MRR) de clientes con alta probabilidad de cancelar, según el modelo predictivo.',
  'Clientes recuperados':
    'Clientes que, estando en riesgo de churn, fueron retenidos gracias a intervenciones del equipo de Customer Success.',
  'Retención lograda':
    'Porcentaje de clientes en riesgo que permanecieron activos luego de recibir una intervención de retención.',
}

function InfoTooltip({ text, align = 'center' }) {
  const box =
    align === 'right'
      ? 'right-0'
      : align === 'left'
        ? 'left-0'
        : 'left-1/2 -translate-x-1/2'
  const arrow =
    align === 'right'
      ? 'right-2'
      : align === 'left'
        ? 'left-2'
        : 'left-1/2 -translate-x-1/2'

  return (
    <div className="relative group flex items-center">
      <svg
        width="13" height="13" viewBox="0 0 16 16" fill="none"
        className="text-slate-300 hover:text-slate-400 transition-colors cursor-default"
      >
        <circle cx="8" cy="8" r="7.5" stroke="currentColor" />
        <path d="M8 7v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="5" r="0.75" fill="currentColor" />
      </svg>
      <div className={`absolute ${box} top-5 w-52 bg-slate-800 text-white text-xs rounded-lg px-3 py-2 invisible group-hover:visible z-20 shadow-xl leading-relaxed`}>
        {text}
        <div className={`absolute -top-1 ${arrow} w-2 h-2 bg-slate-800 rotate-45`} />
      </div>
    </div>
  )
}

function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-white rounded-xl p-4 border ${className}`}
      style={{ borderColor: 'rgba(15,23,42,0.08)' }}
    >
      {children}
    </div>
  )
}

export default function Dashboard({ onNavigate }) {
  const [periodIdx, setPeriodIdx] = useState(2)

  const visibleData = MONTHLY_DATA.slice(PERIODS[periodIdx].slice)
  const maxRate = Math.max(...visibleData.map((d) => d.rate))
  const kpis = KPIS_BY_PERIOD[periodIdx]

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4">
        <p className="text-sm text-slate-500">Visión general del estado de retención de clientes</p>
      </div>

      {/* Period filter */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="text-xs text-slate-500">Período:</span>
        {PERIODS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => setPeriodIdx(i)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${i === periodIdx
                ? 'bg-slate-100 border-slate-300 text-slate-800'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* KPI grid: 2 cols mobile → 4 cols desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {kpis.map((kpi, i) => {
          const align = i === 0 ? 'left' : i === kpis.length - 1 ? 'right' : 'center'
          return (
            <Card key={kpi.label}>
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs text-slate-500">{kpi.label}</div>
                <InfoTooltip text={KPIS_INFO[kpi.label]} align={align} />
              </div>
              <div className="text-xl sm:text-2xl font-semibold text-slate-900">{kpi.value}</div>
              <div className={`text-xs mt-1 ${kpi.up ? 'text-rose-600' : 'text-emerald-700'}`}>
                {kpi.delta}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts: 1 col mobile → 2 cols desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        <Card>
          <div className="text-xs font-semibold text-slate-700 mb-3">Churn rate mensual</div>
          <div className="flex items-end gap-[2px] h-20">
            {visibleData.map((d) => (
              <div
                key={d.mes}
                className="flex-1 rounded-t cursor-default"
                style={{ height: `${(d.rate / maxRate) * 100}%`, background: barColor(d.rate) }}
                title={`${d.mes}: ${d.rate}%`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-slate-400">{visibleData[0].mes}</span>
            <span className="text-xs text-slate-400">{visibleData[visibleData.length - 1].mes}</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-1.5">Riesgo de pérdida de clientes:</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: '#378ADD' }} />
                {'<8% — Riesgo bajo'}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: '#EF9F27' }} />
                8–12% — Riesgo moderado
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: '#E24B4A' }} />
                {'>12% — Riesgo alto'}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-slate-700">MRR en riesgo por plan</div>
            <InfoTooltip text={MRR_PLAN_INFO} align="right" />
          </div>
          <div className="space-y-2">
            {MRR_PLAN.map((row) => (
              <div key={row.label} className="flex items-center gap-2">
                <span className="text-xs text-slate-500 w-16 text-right">{row.label}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${row.pct}%`, background: row.color }} />
                </div>
                <span className="text-xs text-slate-500 w-14 text-right">{row.val} · {row.pct}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom: 1 col mobile → 2 cols desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-slate-700">Industrias con mayor churn</div>
            <InfoTooltip text={INDUSTRIES_INFO} align="left" />
          </div>
          {INDUSTRIES.map((row) => (
            <div
              key={row.name}
              className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0"
            >
              <span className="text-sm text-slate-700">{row.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PILL[row.type]}`}>
                {row.pct}
              </span>
            </div>
          ))}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-slate-700">Impacto de campañas activas</div>
            <InfoTooltip text={CAMPAIGNS_INFO} align="right" />
          </div>
          {CAMPAIGNS.map((row) => (
            <div
              key={row.name}
              className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-100 last:border-0"
            >
              <span className="text-sm font-medium text-slate-700 truncate">{row.name}</span>
              <span className={`text-xs flex-shrink-0 ${row.muted ? 'text-slate-400' : 'text-slate-500'}`}>
                {row.detail}
              </span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
