import React, { useEffect, useState } from 'react';
import Table from '../../components/Table';
import { sumBy } from 'lodash';

/**
 * ReconcilePage – applies business rules to the ingested data in order
 * to determine which records are reconciled (OK), which have
 * warnings and which are errors. The page presents the results
 * separated into tabs and persists a summary for display on the
 * dashboard.
 */
const ReconcilePage = () => {
  const [data, setData] = useState([]);
  const [results, setResults] = useState({ ok: [], warnings: [], errors: [] });
  const [activeTab, setActiveTab] = useState('ok');

  useEffect(() => {
    // load ingestion results
    const raw = JSON.parse(localStorage.getItem('metrored_ingestion') || '[]');
    setData(raw);
    if (raw.length > 0) {
      runReconciliation(raw);
    }
  }, []);

  /**
   * Applies very simplified reconciliation rules. A real
   * implementation should consider matching records from multiple
   * sources using fuzzy matching, tolerances and the business rules
   * defined in the instructivo. Here we implement just a few
   * illustrative checks.
   */
  const runReconciliation = records => {
    const ok = [];
    const warnings = [];
    const errors = [];
    for (const rec of records) {
      // Only attempt numeric checks if the required fields exist
      if (
        rec.valorBruto != null &&
        rec.comision != null &&
        rec.ivaRetenido != null &&
        rec.irfRetenido != null &&
        rec.netoPagar != null
      ) {
        const expectedNeto =
          rec.valorBruto - rec.comision - rec.ivaRetenido - rec.irfRetenido;
        const diff = Math.abs(expectedNeto - rec.netoPagar);
        if (diff <= 0.02) {
          ok.push({ ...rec, difference: diff });
        } else {
          errors.push({ ...rec, difference: diff, detail: 'Neto no cuadra' });
        }
      } else {
        // missing fields; place into warnings
        warnings.push({ ...rec, detail: 'Campos incompletos' });
      }
    }
    setResults({ ok, warnings, errors });
    // persist summary for dashboard
    const total = records.length;
    const porcentaje = total === 0 ? 0 : Math.round((ok.length / total) * 100);
    const conciliado = sumBy(ok, rec => rec.netoPagar || 0);
    const pendientes = errors.length + warnings.length;
    const summary = {
      porcentaje,
      conciliado,
      pendientes,
      topCausa: errors.length > 0 ? 'Neto no cuadra' : warnings.length > 0 ? 'Campos incompletos' : '-',
    };
    localStorage.setItem('metrored_summary', JSON.stringify(summary));
    localStorage.setItem('metrored_reconciliation', JSON.stringify({ ok, warnings, errors }));
  };

  const tabs = [
    { id: 'ok', label: `OK (${results.ok.length})` },
    { id: 'warnings', label: `Advertencias (${results.warnings.length})` },
    { id: 'errors', label: `Errores (${results.errors.length})` },
  ];
  const currentData = results[activeTab] || [];
  const columns = currentData.length
    ? Object.keys(currentData[0]).map(key => ({ header: key, accessor: key }))
    : [];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue">Conciliación</h2>
      <div className="flex space-x-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t ${
              activeTab === tab.id ? 'bg-blue text-white' : 'bg-grayLight text-blue'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {currentData.length > 0 ? (
        <Table columns={columns} data={currentData.slice(0, 100)} />
      ) : (
        <p className="text-gray">No hay registros en esta pestaña.</p>
      )}
    </div>
  );
};

export default ReconcilePage;