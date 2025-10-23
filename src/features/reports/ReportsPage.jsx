import React, { useEffect, useState } from 'react';
import Table from '../../components/Table';

/**
 * ReportsPage – lists historical reconciliation batches saved in
 * localStorage. Each entry contains the date, counts and type. In a
 * production system this data would live in IndexedDB along with
 * pointers to the exported files.
 */
const ReportsPage = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('metrored_history') || '[]');
    setRows(history);
  }, []);

  const columns = [
    { header: 'Fecha', accessor: 'fecha' },
    { header: 'Tipo', accessor: 'tipo' },
    { header: 'Registros OK', accessor: 'ok' },
    { header: 'Advertencias', accessor: 'warnings' },
    { header: 'Errores', accessor: 'errors' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue">Reportes históricos</h2>
      {rows.length > 0 ? (
        <Table columns={columns} data={rows} />
      ) : (
        <p className="text-gray">No hay lotes guardados.</p>
      )}
    </div>
  );
};

export default ReportsPage;