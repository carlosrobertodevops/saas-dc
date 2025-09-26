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

export async function generateMetadata({params}:{params:{locale: Locale}}): Promise<Metadata> {
  return {
    alternates: {
      languages: {
        'pt-BR': `/pt-br`,
        'en-US': `/en-us`,
        'es-ES': `/es-es`
      }
    },
    openGraph: {
      locale: toOgLocale(params.locale),
      alternateLocale: locales.filter(l=>l!==params.locale).map(toOgLocale)
    }
  };
}

export default async function LocaleLayout({
  children, params
}: Readonly<{children: React.ReactNode; params:{locale: Locale}}>) {
  const {locale} = params;
  if (!locales.includes(locale)) return notFound();
  const messages = await getMessages(locale);
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="fixed right-4 top-4 z-50"><LocaleSwitcher current={locale} /></div>
      {children}
    </NextIntlClientProvider>
  );
}