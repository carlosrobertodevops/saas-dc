#!/usr/bin/env sh
set -e

DIR="src/app/[locale]/dashboard"
PAGE="$DIR/page.tsx"
echo "🔎 Auditando $DIR …"

if [ ! -f "$PAGE" ]; then
  echo "❌ Não encontrei $PAGE"; exit 1
fi

echo "\n— Topo do page.tsx —"
head -n 10 "$PAGE" || true

echo "\n— 'use client' no page.tsx? —"
grep -n "^'use client'" "$PAGE" || echo "✔ NÃO (server)"

echo "\n— Exports de geração NO page.tsx —"
grep -nE 'export[[:space:]]+(async[[:space:]]+)?function[[:space:]]+generate(StaticParams|Metadata)' "$PAGE" || echo "✔ nenhum"

echo "\n— Arquivos client (com 'use client') dentro de $DIR —"
grep -RIl --include=\*.tsx "^'use client'" "$DIR" || echo "✔ nenhum"

echo "\n— Arquivos no $DIR que exportam generate* —"
grep -RIn --include=\*.tsx -E 'export[[:space:]]+(async[[:space:]]+)?function[[:space:]]+generate(StaticParams|Metadata)' "$DIR" || echo "✔ nenhum"

echo "\n— Listagem do diretório —"
ls -la "$DIR" || true

echo "\n✔ Audit concluída."