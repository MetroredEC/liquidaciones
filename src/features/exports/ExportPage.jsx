import React, { useEffect, useState } from 'react';
import { getTemplates } from '../../auth/authService';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import CryptoJS from 'crypto-js';

/**
 * ExportPage – allows the user to select a BC template and
 * generate both the accounting file and an error/warning log. Files
 * are compiled into a ZIP archive along with SHA‑256 hashes to
 * guarantee integrity.
 */
const ExportPage = () => {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    setTemplates(getTemplates());
  }, []);

  const handleExport = async () => {
    if (!selected) {
      setStatus('Seleccione una plantilla.');
      return;
    }
    setStatus('Generando archivos…');
    const rec = JSON.parse(localStorage.getItem('metrored_reconciliation') || '{}');
    const template = templates.find(t => t.id === selected);
    if (!template) {
      setStatus('Plantilla no encontrada.');
      return;
    }
    const ok = rec.ok || [];
    const warnings = rec.warnings || [];
    const errors = rec.errors || [];
    // Build BC data rows
    const bcRows = ok.map((r, i) => {
      const row = {};
      // Set defaults
      for (const col of template.columns) {
        row[col] = template.defaults[col] || '';
      }
      // Map some fields from the record
      row['Document No.'] = r.docRecap || `DOC-${i + 1}`;
      row['Posting Date'] = r.fechaRecap || '';
      row['Amount'] = r.netoPagar || 0;
      row['Description'] = r.concepto || '';
      row['External Doc No.'] = r.docRecap || '';
      return row;
    });
    const bcSheet = XLSX.utils.json_to_sheet(bcRows);
    const bcWb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(bcWb, bcSheet, 'ArchivoBC');
    const bcBuffer = XLSX.write(bcWb, { type: 'array', bookType: 'xlsx' });
    // Build log rows
    const logRows = [];
    let idCounter = 1;
    for (const r of warnings) {
      logRows.push({
        Tipo: 'Advertencia',
        Origen: r.concepto || '',
        Id: idCounter++,
        Regla: r.detail || '',
        Detalle: '',
        Diferencia: r.difference || '',
        Severidad: 'Media',
        Sugerencia: 'Revisar',
        Responsable: '',
        SLA: '48h',
      });
    }
    for (const r of errors) {
      logRows.push({
        Tipo: 'Error',
        Origen: r.concepto || '',
        Id: idCounter++,
        Regla: r.detail || '',
        Detalle: '',
        Diferencia: r.difference || '',
        Severidad: 'Alta',
        Sugerencia: 'Corregir',
        Responsable: '',
        SLA: '24h',
      });
    }
    const logSheet = XLSX.utils.json_to_sheet(logRows);
    const logWb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(logWb, logSheet, 'Log');
    const logBuffer = XLSX.write(logWb, { type: 'array', bookType: 'xlsx' });
    // Compute hashes
    const bcWordArray = CryptoJS.lib.WordArray.create(bcBuffer);
    const logWordArray = CryptoJS.lib.WordArray.create(logBuffer);
    const bcHash = CryptoJS.SHA256(bcWordArray).toString();
    const logHash = CryptoJS.SHA256(logWordArray).toString();
    const hashes = {
      bcHash,
      logHash,
      generatedAt: new Date().toISOString(),
    };
    // Create ZIP
    const zip = new JSZip();
    zip.file('ArchivoBC.xlsx', bcBuffer);
    zip.file('Log.xlsx', logBuffer);
    zip.file('hashes.json', JSON.stringify(hashes, null, 2));
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `conciliacion-${selected.toLowerCase()}.zip`);
    setStatus('Descarga completada.');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue">Exportar archivos</h2>
      <div>
        <label className="block mb-2">Seleccione plantilla BC:</label>
        <select
          value={selected}
          onChange={e => setSelected(e.target.value)}
          className="border px-3 py-2 rounded w-full max-w-sm"
        >
          <option value="">-- Seleccione --</option>
          {templates.map(t => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleExport}
        className="px-4 py-2 bg-blue text-white rounded hover:bg-cyan"
      >
        Descargar ZIP
      </button>
      {status && <p className="text-sm text-gray-700">{status}</p>}
    </div>
  );
};

export default ExportPage;