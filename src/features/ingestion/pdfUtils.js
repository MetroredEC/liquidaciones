import { getDocument } from 'pdfjs-dist';

/**
 * Attempts to extract plain text from a PDF file using pdfjs.
 * If parsing fails, the promise will reject and a fallback
 * mechanism can be applied by the caller.
 * @param {File} file
 * @returns {Promise<string>}
 */
export async function parsePdf(file) {
  const data = await file.arrayBuffer();
  const pdf = await getDocument({ data }).promise;
  let text = '';
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    text += strings.join('\n') + '\n';
  }
  return text;
}

/**
 * Basic heuristic to extract rows from a Comprobante PDF. It scans
 * the lines returned by the PDF text extractor looking for
 * sequences that start with a date and contain numeric columns.
 * The final five numeric tokens are assumed to be the monetary
 * columns: Valor Bruto, Comisión, IVA Retenido, IRF Retenido,
 * Neto a Pagar. Lines containing the word 'AJUSTE' are skipped.
 * @param {string} text
 */
export function extractComprobanteData(text) {
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);
  const records = [];
  for (const line of lines) {
    const upper = line.toUpperCase();
    // skip rows that are not data lines
    if (upper.includes('AJUSTE')) continue;
    // detect date at start
    const tokens = line.split(/\s+/);
    const first = tokens[0];
    if (/\d{4}\/\d{2}\/\d{2}/.test(first) || /\d{2}-[A-Z]{3}-\d{4}/.test(first)) {
      // pick the last five numeric looking tokens
      const numericTokens = tokens.filter(t => /[\d,\.]+/.test(t));
      if (numericTokens.length >= 5) {
        const lastFive = numericTokens.slice(-5);
        const [valorBruto, comision, ivaRetenido, irfRetenido, netoPagar] = lastFive.map(n => {
          // unify decimal separators: remove thousand separators (comma) and unify decimal point
          const cleaned = n.replace(/\./g, '').replace(/,/g, '.');
          const num = parseFloat(cleaned);
          return isNaN(num) ? 0 : num;
        });
        // concept is the portion between the date and the numeric values
        const conceptTokens = tokens.slice(0, tokens.length - lastFive.length);
        records.push({
          fechaRecap: conceptTokens[0],
          docRecap: conceptTokens[1] || '',
          concepto: conceptTokens.slice(2).join(' '),
          valorBruto,
          comision,
          ivaRetenido,
          irfRetenido,
          netoPagar,
        });
      }
    }
  }
  return records;
}

/**
 * Parses a Comprobante PDF file and returns an array of record
 * objects. If PDF parsing fails it throws an error to allow the
 * caller to fallback to OCR (not implemented here).
 * @param {File} file
 */
export async function parseComprobantePdf(file) {
  const text = await parsePdf(file);
  return extractComprobanteData(text);
}