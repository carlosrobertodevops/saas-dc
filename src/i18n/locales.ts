export const locales = ['pt-br', 'en-us', 'es-es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'pt-br';

// (útil para SEO OpenGraph)
export function toOgLocale(locale: Locale) {
  switch (locale) {
    case 'pt-br':
      return 'pt_BR';
    case 'en-us':
      return 'en_US';
    case 'es-es':
      return 'es_ES';
  }
}