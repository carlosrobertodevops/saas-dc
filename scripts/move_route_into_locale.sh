#!/usr/bin/env bash
set -euo pipefail
route="${1:-}"
if [ -z "$route" ]; then
  echo "Uso: $0 <nome-da-rota>   (ex.: $0 pricing)"
  exit 1
fi
if [ ! -d "src/app/$route" ]; then
  echo "❌ Não encontrei src/app/$route"
  exit 1
fi
mkdir -p src/app/[locale]
echo "➡️  Movendo src/app/$route -> src/app/[locale]/$route …"
git mv "src/app/$route" "src/app/[locale]/$route" 2>/dev/null || mv "src/app/$route" "src/app/[locale]/$route"
echo "✅ Feito."