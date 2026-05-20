export interface TokenRow {
  property: string;
  token: string;
  /** Semantic token this resolves to (optional for backwards compat) */
  semantic?: string;
  /** Primitive value / CSS variable at the leaf */
  primitive?: string;
  note?: string;
}
