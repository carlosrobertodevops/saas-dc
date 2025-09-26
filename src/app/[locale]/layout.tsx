// src/app/[locale]/layout.tsx
import type {Metadata} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, unstable_setRequestLocale} from 'next-intl/server';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return [{locale: 'pt-br'}, {locale: 'en-us'}, {locale: 'es-es'}];
}

export async function generateMetadata({params}:{params:{locale: string}}): Promise<Metadata> {
  const {locale} = params;
  return {
    alternates: {
      languages: {'pt-BR': '/pt-br', 'en-US': '/en-us', 'es-ES': '/es-es'}
    },
    openGraph: {
      locale: locale.replace('-', '_'),
      alternateLocale: ['pt-br','en-us','es-es']
        .filter(l => l !== locale)
        .map(l => l.replace('-', '_'))
    }
  };
}

export default async function LocaleLayout({
  children, params: {locale}
}: {children: React.ReactNode; params:{locale:'pt-br'|'en-us'|'es-es'}}) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages(); // já usa src/app/i18n.ts
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

// import {NextIntlClientProvider} from 'next-intl';
// import {getMessages} from '@/src/i18n/getMessages';
// import {locales, type Locale, toOgLocale} from '@/src/i18n/locales';
// import {notFound} from 'next/navigation';
// import type {Metadata} from 'next';
// import LocaleSwitcher from '@/src/components/LocaleSwitcher';

// export const dynamic = 'force-dynamic';

// export function generateStaticParams() {
//   return locales.map((locale) => ({locale}));
// }

// export async function generateMetadata({params}:{params:{locale: Locale}}): Promise<Metadata> {
//   return {
//     alternates: {
//       languages: {
//         'pt-BR': `/pt-br`,
//         'en-US': `/en-us`,
//         'es-ES': `/es-es`
//       }
//     },
//     openGraph: {
//       locale: toOgLocale(params.locale),
//       alternateLocale: locales.filter(l=>l!==params.locale).map(toOgLocale)
//     }
//   };
// }

// export default async function LocaleLayout({
//   children, params
// }: Readonly<{children: React.ReactNode; params:{locale: Locale}}>) {
//   const {locale} = params;
//   if (!locales.includes(locale)) return notFound();
//   const messages = await getMessages(locale);
//   return (
//     <NextIntlClientProvider locale={locale} messages={messages}>
//       <div className="fixed right-4 top-4 z-50"><LocaleSwitcher current={locale} /></div>
//       {children}
//     </NextIntlClientProvider>
//   );
// }