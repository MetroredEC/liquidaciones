import React, { useEffect, useState } from 'react';
import KPIWidget from '../components/KPIWidget';

/**
 * Dashboard page – displays summary KPIs derived from the
 * reconciliation runs. It retrieves aggregated metrics from
 * localStorage and presents them using KPIWidget components.
 */
const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    porcentaje: 0,
    conciliado: 0,
    pendientes: 0,
    topCausa: '-'
  });

  useEffect(() => {
    // Attempt to load reconciliation summary from localStorage.
    const data = JSON.parse(localStorage.getItem('metrored_summary') || 'null');
    if (data) {
      setMetrics(data);
    }
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue mb-2">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIWidget label="% Conciliado" value={`${metrics.porcentaje}%`} color="cyan" />
        <KPIWidget label="$ Conciliado" value={`$${metrics.conciliado.toFixed?.(2) || metrics.conciliado}`} color="blue" />
        <KPIWidget label="Pendientes > 48h" value={metrics.pendientes} color="gray" />
        <KPIWidget label="Top causa" value={metrics.topCausa} color="cyan" />
      </div>
    </div>
  );
};

export default Dashboard;