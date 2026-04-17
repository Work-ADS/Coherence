export interface BrandManifest {
  name: string;
  action: Partial<
    Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900', string>
  >;
  fontDisplay?: string;
  fontText?: string;
  logoLight?: string;
  logoDark?: string;
}

export const defaultBrand: BrandManifest = {
  name: 'default',
  action: {}, // falls through to semantic defaults
};
