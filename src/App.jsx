import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import PrediccionIndividual from './pages/PrediccionIndividual'
import ClientesEnRiesgo from './pages/ClientesEnRiesgo'
import DetalleCliente from './pages/DetalleCliente'
import ScoringMasivo from './pages/ScoringMasivo'
import CampanasRetencion from './pages/CampanasRetencion'
import AnalisisFeatures from './pages/AnalisisFeatures'

const VIEWS = [
  {
    key: 'dashboard',
    label: 'Dashboard ejecutivo',
    description: 'Vista general de métricas clave de abandono. Para dirección y líderes de área.',
    component: Dashboard,
  },
  {
    key: 'prediccion',
    label: 'Predicción por industrias',
    badge: 'Soporte / Ejecutivos de cuenta',
    badgeStyle: { background: '#eff6ff', color: '#1d4ed8' },
    description: 'Análisis detallado de riesgo para un segmento específico. Para ejecutivos de cuenta antes de intervenir en un sector.',
    component: PrediccionIndividual,
  },
  {
    key: 'clientes',
    label: 'Clientes en riesgo',
    badge: 'Soporte · Marketing',
    badgeStyle: { background: '#fffbeb', color: '#b45309' },
    description: 'Listado de clientes ordenados por probabilidad de abandono con filtros. Para soporte y marketing al priorizar intervenciones.',
    component: ClientesEnRiesgo,
  },
  {
    key: 'detalle',
    label: 'Detalle cliente',
    badge: 'Soporte · Ejecutivos de cuenta',
    badgeStyle: { background: '#EEEDFE', color: '#3C3489' },
    description: 'Perfil completo de un cliente: puntaje de riesgo, factores y acciones recomendadas. Se accede desde Clientes en riesgo.',
    component: DetalleCliente,
  },
  {
    key: 'scoring',
    label: 'Evaluación masiva',
    badge: 'Desarrollo · Dirección',
    badgeStyle: { background: '#E1F5EE', color: '#0F6E56' },
    description: 'Procesamiento masivo para obtener el puntaje de abandono de toda la base de clientes. Para equipos técnicos y dirección.',
    component: ScoringMasivo,
  },
  {
    key: 'campanas',
    label: 'Campañas de retención',
    badge: 'Marketing',
    badgeStyle: { background: '#FAECE7', color: '#993C1D' },
    description: 'Gestión de campañas segmentadas por industria, plan y nivel de riesgo. Para el equipo de marketing.',
    component: CampanasRetencion,
  },
  {
    key: 'analisis',
    label: 'Análisis de producto',
    badge: 'Área de desarrollo',
    badgeStyle: { background: '#EEEDFE', color: '#3C3489' },
    description: 'Variables del producto asociadas a la retención o al abandono según el modelo. Para el equipo de desarrollo.',
    component: AnalisisFeatures,
  },
]

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [navData, setNavData] = useState(null)

  const activeView = VIEWS.find((v) => v.key === currentView) || VIEWS[0]
  const PageComponent = activeView.component

  function navigate(key, data = null) {
    setCurrentView(key)
    setNavData(data)
    setSidebarOpen(false)
  }

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Backdrop mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar: overlay en mobile, estático en desktop */}
      <div
        className={`
          fixed inset-y-0 left-0 z-30 flex-shrink-0
          transition-transform duration-200
          md:relative md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar activeKey={currentView} onNavigate={navigate} />
      </div>

      {/* Área principal */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">

        {/* Header */}
        <header
          className="flex items-center justify-between px-4 sm:px-6 py-3 border-b flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(8px)',
            borderColor: 'rgba(15,23,42,0.08)',
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburguesa — solo mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden flex-shrink-0 p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
              aria-label="Abrir menú"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <h1 className="text-sm sm:text-base font-semibold text-slate-800 leading-tight truncate">
              {activeView.label}
            </h1>
            {activeView.description && (
              <div className="relative group flex-shrink-0">
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center cursor-default select-none font-semibold"
                  style={{ background: 'rgba(15,23,42,0.06)', color: '#94a3b8', fontSize: 10 }}
                >
                  i
                </span>
                <div
                  className="absolute left-0 top-6 hidden group-hover:block pointer-events-none"
                  style={{ width: 240, zIndex: 9999 }}
                >
                  <div
                    className="rounded-xl p-3 text-xs leading-relaxed shadow-xl"
                    style={{ background: '#1e2235', color: 'rgba(255,255,255,0.72)' }}
                  >
                    {activeView.description}
                  </div>
                </div>
              </div>
            )}
          </div>
          {activeView.badge && (
            <span
              className="hidden sm:inline text-xs px-2.5 py-1 rounded-full flex-shrink-0 ml-3"
              style={activeView.badgeStyle}
            >
              {activeView.badge}
            </span>
          )}
        </header>

        {/* Contenido scrolleable */}
        <main className="flex-1 overflow-y-auto" style={{ background: '#f8fafc' }}>
          <PageComponent onNavigate={navigate} navData={navData} />
        </main>
      </div>
    </div>
  )
}
