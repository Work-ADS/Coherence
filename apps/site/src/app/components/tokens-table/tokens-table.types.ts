export interface TokenRow {
  property: string;
  token: string;
  /** Semantic token this resolves to (optional for backwards compat) */
  semantic?: string;
  /** Primitive value / CSS variable at the leaf */
  primitive?: string;
  /** Raw value shown to programmers. When omitted, the table resolves the token live. */
  value?: string;
  note?: string;
}
