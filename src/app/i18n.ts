// src/app/i18n.ts
import {getRequestConfig} from 'next-intl/server';

const locales = ['pt-br', 'en-us', 'es-es'] as const;
const fallback = 'pt-br' as const;

export default getRequestConfig(async ({locale}) => {
  const safe = (locales as readonly string[]).includes(locale) ? locale : fallback;
  // importa os JSONs de src/messages/{pt-br,en-us,es-es}.json
  const messages = (await import(`../messages/${safe}.json`)).default;
  return {messages};
});

// // src/i18n.ts
// import {getRequestConfig} from 'next-intl/server';
// import {notFound} from 'next/navigation';

// // Defina os locales suportados
// const locales = ['en', 'pt-br', 'es'];

// export default getRequestConfig(async ({locale}) => {
//   // Validar se o locale é suportado
//   if (!locales.includes(locale as any)) {
//     notFound();
//   }

//   return {
//     messages: (await import(`../messages/${locale}.json`)).default
//   };
// });