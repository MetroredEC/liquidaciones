import React, { useEffect, useState } from 'react';
import Table from '../../components/Table';

/**
 * AuditPage – displays the audit trail recorded in localStorage.
 * Each log entry should contain a timestamp, user, action and
 * details. For the purposes of this demo the audit trail is not
 * automatically populated; however helper functions could push
 * entries on important events.
 */
const AuditPage = () => {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('metrored_audit') || '[]');
    setLogs(stored);
  }, []);
  const columns = [
    { header: 'Fecha', accessor: 'timestamp' },
    { header: 'Usuario', accessor: 'user' },
    { header: 'Acción', accessor: 'action' },
    { header: 'Detalle', accessor: 'detail' },
  ];
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue">Auditoría</h2>
      {logs.length > 0 ? (
        <Table columns={columns} data={logs} />
      ) : (
        <p className="text-gray">No hay registros de auditoría.</p>
      )}
    </div>
  );
};

export default AuditPage;