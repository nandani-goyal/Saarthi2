/**
 * useSchemesMutation.ts
 *
 * A custom React Query mutation hook for fetching eligible schemes.
 *
 * --- What is a "mutation" in React Query? ---
 * In React Query terminology:
 *   - "query"    = read data automatically (like fetching on page load)
 *   - "mutation" = trigger data change or fetch on demand (like a form submit)
 *
 * Since we only fetch schemes AFTER the user submits the form,
 * we use a mutation instead of a query.
 *
 * This hook gives us:
 *   - `mutateAsync(formData)` → triggers the fetch
 *   - `isPending`             → true while the request is in-flight (show spinner)
 *   - `isError`               → true if the request failed (show error banner)
 *   - `error`                 → the actual Error object with a message
 *   - `reset`                 → clears the error so the user can try again
 */

import { useMutation } from "@tanstack/react-query";
import { getEligibleSchemes } from "@/lib/schemeService";

// The shape of each scheme returned by the backend
export interface Scheme {
  name: string;
  benefits: string[];
  score: number;
  eligibility: Record<string, unknown>;
}

// The shape we pass into the mutation
export interface EligibilityFormData {
  age: number;
  state: string;
  pregnant: boolean;
  breastfeeding: boolean;
  hasHealthInsurance: boolean;
  name?: string;
  income?: string;
  familySize?: string;
  district?: string;
}

export function useSchemesMutation() {
  return useMutation<Scheme[], Error, EligibilityFormData>({
    /**
     * mutationFn is the actual async function that runs when you call
     * `mutateAsync(formData)`. It must return a Promise.
     */
    mutationFn: async (formData: EligibilityFormData) => {
      const schemes = await getEligibleSchemes(formData);

      // getEligibleSchemes can return undefined if the backend is down
      if (!schemes) {
        throw new Error("No response from server. Is the backend running on port 3000?");
      }

      return schemes;
    },

    /**
     * retry: 1 means React Query will automatically retry ONCE if the request
     * fails before showing an error. This handles transient network hiccups.
     */
    retry: 1,
  });
}
