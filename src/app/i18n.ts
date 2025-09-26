// src/i18n.ts
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// Defina os locales suportados
const locales = ['en', 'pt-br', 'es'];

export default getRequestConfig(async ({locale}) => {
  // Validar se o locale é suportado
  if (!locales.includes(locale as any)) {
    notFound();
  }

  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});