'use server';

/**
 * @fileOverview A tax rate consistency checker AI agent.
 *
 * - checkTaxRateConsistency - A function that handles the tax rate consistency process.
 * - TaxRateConsistencyInput - The input type for the checkTaxRateConsistency function.
 * - TaxRateConsistencyOutput - The return type for the checkTaxRateConsistency function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TaxRateConsistencyInputSchema = z.object({
  taxRateLabels: z.array(z.string()).describe('An array of tax rate labels from the application.'),
  localStorageKeys: z.array(z.string()).describe('An array of keys currently stored in local storage.'),
});
export type TaxRateConsistencyInput = z.infer<typeof TaxRateConsistencyInputSchema>;

const TaxRateConsistencyOutputSchema = z.object({
  discrepancies: z.array(
    z.object({
      label: z.string().optional().describe('The tax rate label with a discrepancy.'),
      localStorageKey: z.string().optional().describe('The local storage key with a discrepancy.'),
      type: z.enum(['label_only', 'key_only', 'mismatch']).describe('The type of discrepancy found.'),
      resolutionSuggestion: z.string().describe('A suggestion on how to resolve the discrepancy.'),
    })
  ).describe('An array of discrepancies found between tax rate labels and local storage keys.'),
  summary: z.string().describe('A summary of the tax rate consistency check.'),
});
export type TaxRateConsistencyOutput = z.infer<typeof TaxRateConsistencyOutputSchema>;

export async function checkTaxRateConsistency(input: TaxRateConsistencyInput): Promise<TaxRateConsistencyOutput> {
  return checkTaxRateConsistencyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'taxRateConsistencyPrompt',
  input: {schema: TaxRateConsistencyInputSchema},
  output: {schema: TaxRateConsistencyOutputSchema},
  prompt: `You are an expert at identifying discrepancies between tax rate labels and local storage keys in a web application.

  Your goal is to identify any inconsistencies that might cause issues with tax rate calculations.

  You will receive two arrays: taxRateLabels and localStorageKeys.

  taxRateLabels: These are the labels associated with the tax rates currently used in the application.
  localStorageKeys: These are the keys found in the user's local storage.

  Identify any discrepancies, and classify them into one of the following types:

  - label_only: A tax rate label exists but there is no corresponding key in local storage.
  - key_only: A local storage key exists but there is no corresponding tax rate label.
  - mismatch: A tax rate label and a local storage key seem related, but their values or meanings do not match based on their names.

  For each discrepancy, provide a resolutionSuggestion that explains how to fix the issue. Be specific and actionable.

  Finally, provide a summary of the tax rate consistency check, highlighting the number and types of discrepancies found.

  Tax Rate Labels: {{{taxRateLabels}}}
  Local Storage Keys: {{{localStorageKeys}}}
  `,
});

const checkTaxRateConsistencyFlow = ai.defineFlow(
  {
    name: 'checkTaxRateConsistencyFlow',
    inputSchema: TaxRateConsistencyInputSchema,
    outputSchema: TaxRateConsistencyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
