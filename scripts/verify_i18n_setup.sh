#!/usr/bin/env bash
set -euo pipefail

echo "🔎 Verificando setup i18n…"

# 1) arquivos essenciais
missing=0
for f in \
  "src/app/[locale]/layout.tsx" \
  "src/i18n/locales.ts" \
  "src/i18n/getMessages.ts" \
  "middleware.ts" \
  "src/messages/en-us.json" \
  "src/messages/pt-br.json" \
  "src/messages/es-es.json" \
; do
  if [ ! -f "$f" ]; then
    echo "❌ Faltando: $f"; missing=1
  else
    echo "✔ $f"
  fi
done

# 2) tsconfig alias
if [ -f tsconfig.json ]; then
  if node -e "const j=require('./tsconfig.json');process.exit(j.compilerOptions?.paths?.['@/src/*']?0:1)"; then
    echo "✔ tsconfig alias '@/src/*' OK"
  else
    echo "❌ tsconfig: faltando paths['@/src/*']"
    missing=1
  fi
fi

# 3) páginas fora de [locale] usando useTranslations (pode quebrar contexto)
echo "🔎 Páginas fora de [locale] que usam useTranslations:"
grep -RIl --include=\*.tsx 'useTranslations' src/app | grep -v 'src/app/\[locale\]/' || echo "✔ Nenhuma"

# 4) components client sem 'use client'
echo "🔎 Arquivos com useTranslations mas sem 'use client' na 1a linha:"
while IFS= read -r f; do
  head -n1 "$f" | grep -q "'use client'" || echo "⚠️  $f"
done < <(grep -RIl --include=\*.tsx 'useTranslations' src | tr -d '\r')

# 5) imports sem '@/src/'
echo "🔎 Imports iniciando por '@/', mas sem 'src':"
grep -RIn --include=\*.{ts,tsx,js,jsx,mjs} "from '@/[^s]" src || echo "✔ OK"

if [ "$missing" -eq 0 ]; then
  echo "✅ Verificação concluída sem erros críticos."
else
  echo "⚠️ Existem itens a corrigir."
  exit 2
fi
