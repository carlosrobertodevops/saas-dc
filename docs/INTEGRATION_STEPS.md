# i18n Bootstrap for `saas-dc` (Next.js App Router + next-intl)

This bundle includes:
- `src/messages/{pt-br,en-us,es-es}.json`
- `src/i18n/locales.ts`, `src/i18n/getMessages.ts`
- `src/components/LocaleSwitcher.tsx`
- `middleware.ts` (redirect `/` -> `/pt-br` and enforce locale segment)

## Install
```bash
npm i next-intl
```

## App structure
Create per-locale routing:
```
src/app/[locale]/layout.tsx
src/app/[locale]/page.tsx
```

### Example `src/app/[locale]/layout.tsx`
```tsx
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from '@/i18n/getMessages';
import {locales, type Locale, toOgLocale} from '@/i18n/locales';
import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import LocaleSwitcher from '@/components/LocaleSwitcher';

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
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LocaleSwitcher current={locale} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

## Use translations
```tsx
'use client';
import {useTranslations} from 'next-intl';

export default function Example() {
  const t = useTranslations('Common');
  return <button>{t('cancel')}</button>;
}
```

## Replace hardcoded strings
Search & replace gradually, using namespaces `Navbar`, `Home`, `Common`, `LanguageSelector`. The expanded JSONs already include many detected labels.
```
t('Navbar.signIn')
t('Navbar.signUp')
t('Common.cancel')
t('Common.delete')
...
```
