#!/usr/bin/env bash
set -euo pipefail

# Apply full next-intl setup, move dashboard under [locale], fix Windows components,
# create messages, and normalize imports to '@/src/*'.

# 0) Ensure repo root
if [ ! -f "package.json" ] || [ ! -d "src/app" ]; then
  echo "❌ Run this at the REPO ROOT (must have package.json and src/app/)."
  exit 1
fi

echo "➡️  Creating required folders…"
mkdir -p src/i18n src/messages src/components src/app/[locale]

# 1) next-intl
if ! grep -q '"next-intl"' package.json; then
  echo "➡️  Installing next-intl (skip if already installed)…"
  npm i next-intl
fi

# 2) tsconfig alias
if [ -f tsconfig.json ]; then
  echo "➡️  Updating tsconfig.json alias '@/src/*'…"
  node - <<'NODE'
const fs=require('fs');
const p='tsconfig.json';
const j=JSON.parse(fs.readFileSync(p,'utf8'));
j.compilerOptions=j.compilerOptions||{};
j.compilerOptions.paths=j.compilerOptions.paths||{};
j.compilerOptions.paths['@/src/*']=['./src/*'];
fs.writeFileSync(p, JSON.stringify(j,null,2));
console.log('✔ tsconfig.json updated');
NODE
fi

# 3) i18n utils
echo "➡️  Writing src/i18n/* …"
cat > src/i18n/locales.ts <<'TS'
export const locales = ['pt-br', 'en-us', 'es-es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'pt-br';

export function toOgLocale(locale: Locale) {
  switch (locale) {
    case 'pt-br': return 'pt_BR';
    case 'en-us': return 'en_US';
    case 'es-es': return 'es_ES';
  }
}
TS

cat > src/i18n/getMessages.ts <<'TS'
import {Locale} from '@/src/i18n/locales';

export async function getMessages(locale: Locale) {
  switch (locale) {
    case 'en-us':
      return (await import('@/src/messages/en-us.json')).default;
    case 'es-es':
      return (await import('@/src/messages/es-es.json')).default;
    case 'pt-br':
    default:
      return (await import('@/src/messages/pt-br.json')).default;
  }
}
TS

# 4) LocaleSwitcher
echo "➡️  Writing src/components/LocaleSwitcher.tsx …"
cat > src/components/LocaleSwitcher.tsx <<'TSX'
'use client';
import {usePathname, useRouter} from 'next/navigation';
import {locales, type Locale} from '@/src/i18n/locales';

export default function LocaleSwitcher({current}:{current: Locale}) {
  const pathname = usePathname();
  const router = useRouter();
  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as Locale;
    if (!pathname) return;
    const parts = pathname.split('/');
    parts[1] = next;
    router.push(parts.join('/'));
  }
  return (
    <select onChange={onChange} value={current} aria-label="Change language">
      {locales.map((loc) => (
        <option key={loc} value={loc}>{loc}</option>
      ))}
    </select>
  );
}
TSX

# 5) middleware
echo "➡️  Writing middleware.ts …"
cat > middleware.ts <<'TS'
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {locales, defaultLocale} from './src/i18n/locales';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;
  if (PUBLIC_FILE.test(pathname) || pathname.startsWith('/api') || pathname.startsWith('/_next')) return;

  const hasLocale = locales.some((loc) => pathname.startsWith(`/${loc}`));
  if (!hasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/((?!_next|.*\\..*|api).*)']
};
TS

# 6) layout por locale
echo "➡️  Writing src/app/[locale]/layout.tsx …"
cat > src/app/[locale]/layout.tsx <<'TSX'
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

export default async function LocaleLayout({children, params}:{children: React.ReactNode; params:{locale: Locale}}) {
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

# 7) move dashboard
if [ -d "src/app/dashboard" ]; then
  echo "➡️  Moving src/app/dashboard -> src/app/[locale]/dashboard …"
  rm -rf src/app/[locale]/dashboard
  mkdir -p src/app/[locale]
  git mv src/app/dashboard src/app/[locale]/dashboard 2>/dev/null || mv src/app/dashboard src/app/[locale]/dashboard
fi

# 8) copy home under [locale] if missing
if [ -f "src/app/page.tsx" ] && [ ! -f "src/app/[locale]/page.tsx" ]; then
  echo "➡️  Copying Home to src/app/[locale]/page.tsx …"
  cp src/app/page.tsx src/app/[locale]/page.tsx
fi

# 9) ensure 'use client' + t() in Windows components
fix_file() {
  local file="$1"
  [ -f "$file" ] || return 0
  echo "➡️  Patching $file …"
  if ! head -n1 "$file" | grep -q "'use client'"; then
    (echo "'use client';"; cat "$file") > "$file.tmp" && mv "$file.tmp" "$file"
  fi
  if ! grep -q "useTranslations" "$file"; then
    sed -i.bak 's/import { FaCheck } from "react-icons\/fa";/import { FaCheck } from "react-icons\/fa";\nimport { useTranslations } from "next-intl";/' "$file" || true
    sed -i.bak "s/export default function PaymentWindow() {/export default function PaymentWindow() {\n  const t = useTranslations('Common');/" "$file" || true
    sed -i.bak "s/export default function ConfirmationWindow() {/export default function ConfirmationWindow() {\n  const t = useTranslations('Common');/" "$file" || true
  fi
  sed -i.bak "s/Go Back To Dashboard/{t('goBackToDashboard')}/g" "$file" || true
  sed -i.bak "s/'> *Cancel/'>{t('cancel')}/g" "$file" || true
  sed -i.bak "s/'Deleting\.\.\.';/t('deleting');/g" "$file" || true
  sed -i.bak "s/'Delete'\;/t('delete');/g" "$file" || true
  rm -f "$file.bak"
}

fix_file "src/app/Windows/PayementWindow.tsx"
fix_file "src/app/Windows/DeleteConfirmationWindow.tsx"

# 10) ensure messages exist (minimal)
for loc in en-us pt-br es-es; do
  if [ ! -f "src/messages/$loc.json" ]; then
    echo "➡️  Creating src/messages/$loc.json (minimal)…"
    cat > "src/messages/$loc.json" <<'JSON'
{
  "Common": {
    "cancel": "Cancel",
    "delete": "Delete",
    "deleting": "Deleting...",
    "goBackToDashboard": "Go Back To Dashboard"
  }
}
JSON
  fi
done

# 11) normalize imports to '@/src/'
echo "➡️  Normalizing imports to '@/src/' …"
node - <<'NODE'
const fs=require('fs'); const path=require('path');
const exts=new Set(['.ts','.tsx','.js','.jsx','.mjs']);
function* walk(d){ for(const e of fs.readdirSync(d,{withFileTypes:true})){ const p=path.join(d,e.name); if(e.isDirectory()) yield* walk(p); else if(exts.has(path.extname(e.name))) yield p; } }
for(const f of walk('src')){
  const s=fs.readFileSync(f,'utf8');
  const n=s.replace(/(['"])@\/(?!src\/)/g, '$1@/src/');
  if(n!==s){ fs.writeFileSync(f,n,'utf8'); console.log('fix',f); }
}
NODE

echo "✅ Done. Start the app: npm run dev (or your Docker build/run)"
