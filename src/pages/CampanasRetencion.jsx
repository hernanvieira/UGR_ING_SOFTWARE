import React, { useMemo, useEffect } from 'react';
import DataTable from '../components/table/DataTable';
import useLoadDataset from '../hooks/useLoadDataset';

const KPIS = [
  { label: 'Campañas activas', value: '5', sub: '2 finalizan pronto' },
  { label: 'Clientes objetivo', value: '2,846', sub: '+12.4% vs. período anterior' },
  { label: 'Tasa de respuesta', value: '27.3%', sub: '+3.7pp vs. período anterior' },
  { label: 'Retención lograda', value: '18.6%', sub: '+2.9pp vs. período anterior' },
]

const STATUS_STYLE = {
  green: { background: '#ecfdf5', color: '#047857' },
  blue: { background: '#eff6ff', color: '#1d4ed8' },
  gray: { background: '#f1f5f9', color: '#64748b' },
}

const FORM_FIELDS = ['Segmento', 'Criterio de riesgo', 'Acción', 'Responsable', 'Fecha de inicio']

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl p-4 border ${className}`} style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
      {children}
    </div>
  )
}

export default function CampanasRetencion({ onNavigate }) {
  const { data: campaigns, isLoading, error, execute } = useLoadDataset();

  useEffect(() => {
    execute('processed/campanas');
  }, [execute]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Campaña',
        cell: ({ row }) => (
          <div>
            <div className="text-sm font-medium text-slate-800">{row.original.name}</div>
            <div className="text-xs text-slate-400 mt-0.5">{row.original.sub}</div>
          </div>
        ),
      },
      {
        accessorKey: 'segment',
        header: 'Segmento',
        cell: ({ getValue }) => <span className="text-xs text-slate-500">{getValue()}</span>,
      },
      {
        accessorKey: 'clients',
        header: 'Clientes',
        cell: ({ getValue }) => <span className="text-sm text-slate-700">{getValue()?.toLocaleString()}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => (
          <span className="text-xs px-2 py-0.5 rounded-full w-fit inline-block font-medium" style={STATUS_STYLE[row.original.statusType]}>
            {row.original.status}
          </span>
        ),
      },
      {
        accessorKey: 'owner',
        header: 'Responsable',
        cell: ({ getValue }) => <span className="text-sm text-slate-700">{getValue()}</span>,
      },
      {
        accessorKey: 'progress',
        header: 'Avance',
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 pr-2">
            <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${row.original.progress}%`, background: '#4f6ef7' }} />
            </div>
            <span className="text-xs text-slate-400 w-7">{row.original.progress}%</span>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-6">
      <p className="text-sm text-slate-500 mb-5">
        Diseñá y ejecutá campañas para reducir el churn basado en predicciones.
      </p>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {KPIS.map((k) => (
          <div key={k.label} className="bg-white rounded-xl px-4 py-3 border" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
            <div className="text-xs text-slate-500 mb-1">{k.label}</div>
            <div className="text-2xl font-semibold text-slate-900">{k.value}</div>
            <div className="text-xs text-emerald-600 mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        {/* Campaigns table */}
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-slate-700 mb-3">Campañas activas y programadas</div>
          <DataTable
            columns={columns}
            data={campaigns}
            isLoading={isLoading}
            error={error}
            defaultPageSize={5}
          />
        </div>

        {/* Form */}
        <div className="w-52 flex-shrink-0">
          <Card>
            <div className="text-xs font-semibold text-slate-700 mb-3">Nueva campaña</div>
            {FORM_FIELDS.map((field) => (
              <div key={field} className="mb-3">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{field}</div>
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

