/**
 * All amounts in this system are integers in SANTIM (1 ETB = 100 santim).
 * Never floats. Conversion to display units happens only at the edges.
 */

export const SANTIM_PER_BIRR = 100;

export function birrToSantim(birr: number): number {
  const santim = Math.round(birr * SANTIM_PER_BIRR);
  if (!Number.isSafeInteger(santim) || santim < 0) {
    throw new Error(`Invalid birr amount: ${birr}`);
  }
  return santim;
}

export function santimToBirr(santim: number): number {
  return santim / SANTIM_PER_BIRR;
}

/** Format santim as a display string, e.g. 45000 -> "450.00 ETB" */
export function formatSantim(santim: number, currency = "ETB"): string {
  return `${(santim / SANTIM_PER_BIRR).toFixed(2)} ${currency}`;
}

/** Chapa's API takes decimal birr strings ("450.00"). */
export function santimToGatewayAmount(santim: number): string {
  return (santim / SANTIM_PER_BIRR).toFixed(2);
}
