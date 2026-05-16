import Sidebar from './Sidebar'

export default function AppScreen({ title, badge, badgeStyle, activeNav, onNavigate, children }) {
  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{ borderColor: 'rgba(15,23,42,0.10)', background: '#eef2ff' }}
    >
      <div
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ background: '#fff', borderColor: 'rgba(15,23,42,0.10)' }}
      >
        <span className="text-sm font-medium text-slate-800">{title}</span>
        {badge && (
          <span className="text-xs px-2.5 py-0.5 rounded-full" style={badgeStyle}>
            {badge}
          </span>
        )}
      </div>
      <div className="flex" style={{ minHeight: 520 }}>
        <Sidebar activeKey={activeNav} onNavigate={onNavigate} />
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  )
}
