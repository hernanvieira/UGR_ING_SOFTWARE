const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard ejecutivo', icon: '◈' },
  { key: 'prediccion', label: 'Predicción por industrias', icon: '◎' },
  { key: 'clientes', label: 'Clientes en riesgo', icon: '◉' },
  { key: 'detalle', label: 'Detalle cliente', icon: '◐' },
  { key: 'scoring', label: 'Evaluación masiva', icon: '◧' },
  { key: 'campanas', label: 'Campañas', icon: '◆' },
  { key: 'analisis', label: 'Análisis de producto', icon: '◑' },
]

export default function Sidebar({ activeKey, onNavigate }) {
  return (
    <aside
      className="flex flex-col flex-shrink-0 h-screen"
      style={{ width: 220, background: '#1e2235' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: '#4f6ef7' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M6 1L11 10H1L6 1Z" fill="white" />
          </svg>
        </div>
        <div>
          <div className="text-white font-semibold text-sm leading-none">ChurnGuard</div>
          <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            RavenStack
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />

      {/* Nav */}
      <nav className="flex-1 px-2 py-1 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = activeKey === item.key
          return (
            <button
              key={item.key}
              onClick={() => onNavigate?.(item.key)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-all duration-100"
              style={{
                color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                background: active ? 'rgba(79,110,247,0.18)' : 'transparent',
                fontWeight: active ? 500 : 400,
              }}
            >
              <span
                className="flex-shrink-0 text-base leading-none"
                style={{ color: active ? '#4f6ef7' : 'rgba(255,255,255,0.3)', fontSize: 10 }}
              >
                ●
              </span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-5 py-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
          CRISP-DM · Demo
        </div>
      </div>
    </aside>
  )
}
