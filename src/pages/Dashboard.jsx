const KPIS = [
  { label: 'Churn rate', value: '8.4%', delta: '+1.2pp vs. mes anterior', up: true },
  { label: 'MRR en riesgo', value: '$42.1k', delta: '+$6.3k vs. mes anterior', up: true },
  { label: 'Clientes recuperados', value: '342', delta: '22.1% de alto riesgo', up: false },
  { label: 'Retención lograda', value: '18.6%', delta: '+2.9pp vs. mes anterior', up: false },
]

const MONTHLY_BARS = [35, 42, 38, 50, 45, 60, 55, 70, 68, 80, 85, 100]
const MONTHLY_COLORS = Array(8).fill('#378ADD').concat(Array(4).fill('#E24B4A'))

const MRR_PLAN = [
  { label: 'Básico', pct: 72, val: '$18.4k', color: '#E24B4A' },
  { label: 'Pro', pct: 45, val: '$14.2k', color: '#EF9F27' },
  { label: 'Enterprise', pct: 25, val: '$9.5k', color: '#378ADD' },
]

const INDUSTRIES = [
  { name: 'FinTech', pct: '12.3%', type: 'red' },
  { name: 'EdTech', pct: '10.8%', type: 'red' },
  { name: 'DevTools', pct: '7.4%', type: 'amber' },
  { name: 'HealthTech', pct: '6.1%', type: 'amber' },
  { name: 'E-commerce', pct: '3.2%', type: 'green' },
]

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
  return (
    <div className="p-6">
      <div className="mb-5">
        <p className="text-sm text-slate-500">Visión general del estado de retención de clientes</p>
      </div>

      {/* Period filter */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xs text-slate-500">Período:</span>
        {['Último mes', 'Último trimestre', 'Último año'].map((p, i) => (
          <button
            key={p}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              i === 1
                ? 'bg-slate-100 border-slate-300 text-slate-800'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {KPIS.map((kpi) => (
          <Card key={kpi.label}>
            <div className="text-xs text-slate-500 mb-1">{kpi.label}</div>
            <div className="text-2xl font-semibold text-slate-900">{kpi.value}</div>
            <div className={`text-xs mt-1 ${kpi.up ? 'text-rose-600' : 'text-emerald-700'}`}>
              {kpi.delta}
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card>
          <div className="text-xs font-semibold text-slate-700 mb-3">Churn rate mensual</div>
          <div className="flex items-end gap-1 h-20">
            {MONTHLY_BARS.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t"
                style={{ height: `${h}%`, background: MONTHLY_COLORS[i] }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-slate-400">Jun 2023</span>
            <span className="text-xs text-slate-400">May 2024</span>
          </div>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-slate-700 mb-3">MRR en riesgo por plan</div>
          <div className="space-y-2">
            {MRR_PLAN.map((row) => (
              <div key={row.label} className="flex items-center gap-2">
                <span className="text-xs text-slate-500 w-16 text-right">{row.label}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${row.pct}%`, background: row.color }}
                  />
                </div>
                <span className="text-xs text-slate-500 w-10">{row.val}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <div className="text-xs font-semibold text-slate-700 mb-3">Industrias con mayor churn</div>
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
          <div className="text-xs font-semibold text-slate-700 mb-3">
            Impacto de campañas activas
          </div>
          {CAMPAIGNS.map((row) => (
            <div
              key={row.name}
              className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0"
            >
              <span className="text-sm font-medium text-slate-700">{row.name}</span>
              <span className={`text-xs ${row.muted ? 'text-slate-400' : 'text-slate-500'}`}>
                {row.detail}
              </span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
