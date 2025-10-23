import { z } from 'zod';

/**
 * Defines a Zod schema for a reconciled record extracted from a
 * Comprobante PDF. Use this to validate input data prior to
 * reconciliation. If new fields are added they should be added
 * here.
 */
export const comprobanteRecordSchema = z.object({
  fechaRecap: z.string(),
  docRecap: z.string().optional(),
  concepto: z.string().optional(),
  valorBruto: z.number().nonnegative(),
  comision: z.number().nonnegative(),
  ivaRetenido: z.number().nonnegative(),
  irfRetenido: z.number().nonnegative(),
  netoPagar: z.number(),
});

/**
 * Validates an array of records against the Comprobante schema and
 * returns the valid records. Invalid records are omitted and can
 * be surfaced via the errors array.
 * @param {any[]} data
 */
export function validateComprobanteRecords(data) {
  const valid = [];
  const errors = [];
  data.forEach((item, index) => {
    const result = comprobanteRecordSchema.safeParse(item);
    if (result.success) {
      valid.push(result.data);
    } else {
      errors.push({ index, errors: result.error.errors });
    }
  });
  return { valid, errors };
}