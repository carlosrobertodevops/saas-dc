'use client'; // ADICIONE ISSE SE USAR HOOKS OU CONTEXT

import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from '@/src/i18n/getMessages';
import {locales, type Locale, toOgLocale} from '@/src/i18n/locales';
import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import LocaleSwitcher from '@/src/components/LocaleSwitcher';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

// CORREÇÃO: Adicione async e await params
export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}): Promise<Metadata> {
  // ✅ AGUARDE os params
  const { locale } = await params;

  return {
    alternates: {
      languages: {
        'pt-BR': `/pt-br`,
        'en-US': `/en-us`,
        'es-ES': `/es-es`
      }
    },
    openGraph: {
      locale: toOgLocale(locale), // ✅ Use locale após await
      alternateLocale: locales.filter(l => l !== locale).map(toOgLocale) // ✅ Use locale após await
    }
  };
}

// CORREÇÃO: Adicione async para o params
export default async function LocaleLayout({
  children, 
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: Locale}>
}) {
  // ✅ AGUARDE os params
  const { locale } = await params;

  if (!locales.includes(locale)) return notFound();
  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="fixed right-4 top-4 z-50">
        <LocaleSwitcher current={locale} />
      </div>
      {children}
    </NextIntlClientProvider>
  );
}

// 'use client'

// import { NextIntlClientProvider } from 'next-intl';
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

// export default async function LocaleLayout({children, params}:{children: React.ReactNode; params:{locale: Locale}}) {
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
