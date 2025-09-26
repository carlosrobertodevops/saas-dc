#!/usr/bin/env sh
set -e

LAYOUT="src/app/[locale]/layout.tsx"

if [ ! -f "$LAYOUT" ]; then
  echo "❌ Não encontrei $LAYOUT"; exit 1
fi

echo "➡️ Reescrevendo $LAYOUT como Server Component…"
cat > "$LAYOUT" <<'TSX'
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
TSX

# Remover qualquer 'use client' perdido e duplicatas comentadas no layout (defensivo)
sed -i.bak -E "1{/^'use client'|^\"use client\"/d}" "$LAYOUT" || true
sed -i.bak -E '/^\/\/ .*/d' "$LAYOUT" || true
rm -f "$LAYOUT.bak"

echo "🧹 Limpando build anterior…"
rm -rf .next

echo "📦 Instalando dependências…"
if [ -f package-lock.json ]; then npm ci; else npm i; fi

echo "🏗️ Build…"
npm run build

echo "🚀 Start (produção)."
npm run start