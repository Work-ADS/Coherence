import type { TokenRow } from '../tokens-table';

/**
 * One category in a doc page's tokens block — surfaced as a segmented-control option.
 */
export interface DocTokenCategory {
  /** Value key (used as the segmented-control `value` and React state key). */
  value: string;
  /** Display label shown in the segmented control. */
  label: string;
  /** Rows rendered in the tokens table when this category is active. */
  rows: TokenRow[];
}
