import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import Dropzone from '../../components/Dropzone';
import Table from '../../components/Table';
import { parseComprobantePdf } from './pdfUtils';

/**
 * UploadPage – provides the user interface for uploading source
 * files (Excel, CSV or PDF) and performs client‑side parsing. The
 * parsed data is stored in localStorage for later use in the
 * reconciliation flow.
 */
const UploadPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /**
   * Parses an Excel/CSV file into an array of objects. The first row
   * is assumed to contain headers. Values are normalized to trim
   * whitespace.
   */
  const parseSpreadsheet = async file => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'csv') {
      return new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: results => {
            resolve(results.data.map(row => {
              const obj = {};
              for (const key of Object.keys(row)) {
                obj[key.trim()] = typeof row[key] === 'string' ? row[key].trim() : row[key];
              }
              return obj;
            }));
          },
          error: err => reject(err),
        });
      });
    } else {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      return json;
    }
  };

  /**
   * Handles files dropped or selected by the user. Each file is
   * parsed according to its extension. Parsed records are merged
   * into a single array. Errors during parsing are captured and
   * surfaced to the user.
   */
  const handleFiles = async fileList => {
    setLoading(true);
    setError(null);
    let all = [];
    for (const file of fileList) {
      const ext = file.name.split('.').pop().toLowerCase();
      try {
        if (['xlsx', 'xls', 'csv'].includes(ext)) {
          const data = await parseSpreadsheet(file);
          all = all.concat(data);
        } else if (ext === 'pdf') {
          const data = await parseComprobantePdf(file);
          all = all.concat(data);
        } else {
          setError(`Tipo de archivo no soportado: ${file.name}`);
        }
      } catch (e) {
        console.error(e);
        setError(`Error al procesar ${file.name}: ${e.message}`);
      }
    }
    setRecords(all);
    setLoading(false);
    // persist results for reconciliation
    localStorage.setItem('metrored_ingestion', JSON.stringify(all));
  };

  const goToReconcile = () => {
    navigate('/reconciliation');
  };

  const columns = records.length
    ? Object.keys(records[0]).map(key => ({ header: key, accessor: key }))
    : [];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue">Carga de archivos</h2>
      <Dropzone onFiles={handleFiles} accept=".xlsx,.xls,.csv,.pdf" />
      {loading && <p className="text-gray-700">Procesando archivos…</p>}
      {error && <p className="text-red-600">{error}</p>}
      {records.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-blue">Vista previa ({records.length} registros)</h3>
          <Table columns={columns} data={records.slice(0, 50)} />
          {records.length > 50 && <p className="text-sm text-gray">Mostrando primeros 50 registros…</p>}
          <button
            onClick={goToReconcile}
            className="mt-2 px-4 py-2 bg-blue text-white rounded hover:bg-cyan">
            Continuar a conciliación
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadPage;