'use server';

import { checkTaxRateConsistency, TaxRateConsistencyInput, TaxRateConsistencyOutput } from '@/ai/flows/tax-rate-consistency';

export async function runCheckTaxRateConsistency(
  input: TaxRateConsistencyInput
): Promise<TaxRateConsistencyOutput> {
  try {
    const result = await checkTaxRateConsistency(input);
    return result;
  } catch (error) {
    console.error('Error running tax rate consistency check:', error);
    throw new Error('Failed to check tax rate consistency.');
  }
}
