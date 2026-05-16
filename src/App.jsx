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
    badge: 'Mayo 2024',
    badgeStyle: { background: '#f1f5f9', color: '#64748b' },
    component: Dashboard,
  },
  {
    key: 'prediccion',
    label: 'Predicción individual',
    badge: 'Soporte / Ejecutivos de cuenta',
    badgeStyle: { background: '#eff6ff', color: '#1d4ed8' },
    component: PrediccionIndividual,
  },
  {
    key: 'clientes',
    label: 'Clientes en riesgo',
    badge: 'Soporte · Marketing',
    badgeStyle: { background: '#fffbeb', color: '#b45309' },
    component: ClientesEnRiesgo,
  },
  {
    key: 'detalle',
    label: 'Detalle cliente',
    badge: 'Soporte · Ejecutivos de cuenta',
    badgeStyle: { background: '#EEEDFE', color: '#3C3489' },
    component: DetalleCliente,
  },
  {
    key: 'scoring',
    label: 'Scoring masivo',
    badge: 'Desarrollo · Dirección',
    badgeStyle: { background: '#E1F5EE', color: '#0F6E56' },
    component: ScoringMasivo,
  },
  {
    key: 'campanas',
    label: 'Campañas de retención',
    badge: 'Marketing',
    badgeStyle: { background: '#FAECE7', color: '#993C1D' },
    component: CampanasRetencion,
  },
  {
    key: 'analisis',
    label: 'Análisis de producto',
    badge: 'Área de desarrollo',
    badgeStyle: { background: '#EEEDFE', color: '#3C3489' },
    component: AnalisisFeatures,
  },
]

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard')

  const activeView = VIEWS.find((v) => v.key === currentView) || VIEWS[0]
  const PageComponent = activeView.component

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar activeKey={currentView} onNavigate={setCurrentView} />

      {/* Área principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header discreto */}
        <header
          className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(8px)',
            borderColor: 'rgba(15,23,42,0.08)',
          }}
        >
          <div>
            <h1 className="text-base font-semibold text-slate-800 leading-tight">
              {activeView.label}
            </h1>
          </div>
          {activeView.badge && (
            <span
              className="text-xs px-2.5 py-1 rounded-full"
              style={activeView.badgeStyle}
            >
              {activeView.badge}
            </span>
          )}
        </header>

        {/* Contenido scrolleable */}
        <main className="flex-1 overflow-y-auto" style={{ background: '#f8fafc' }}>
          <PageComponent onNavigate={setCurrentView} />
        </main>
      </div>
    </div>
  )
}
