#!/usr/bin/env bash
set -euo pipefail

ROOT="src/app/[locale]"
if [ ! -d "$ROOT" ]; then
  echo "❌ Pasta $ROOT não encontrada."
  exit 1
fi

echo "🔎 Pages com 'use client' na primeira linha:"
grep -RIl --include=page.tsx "^'use client'" "$ROOT" || echo "✔ Nenhuma"

echo
echo "🔎 Pages que exportam generateStaticParams / generateMetadata:"
grep -RIn --include=page.tsx -E 'export[[:space:]]+(async[[:space:]]+)?function[[:space:]]+generate(StaticParams|Metadata)' "$ROOT" || echo "✔ Nenhuma"

echo
echo "ℹ️ Lembrete: essas funções devem ficar no layout.tsx do respectivo segmento."
