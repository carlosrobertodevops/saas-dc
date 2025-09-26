#!/usr/bin/env sh
set -e
TARGET_PAGE="${1:-}"
if [ -z "$TARGET_PAGE" ]; then
  echo "uso: $0 <caminho/para/page.tsx>"
  echo "ex.: $0 src/app/[locale]/dashboard/page.tsx"
  exit 1
fi
if [ ! -f "$TARGET_PAGE" ]; then
  echo "❌ não encontrei: $TARGET_PAGE"; exit 1
fi
DIR="$(dirname "$TARGET_PAGE")"
CLIENT="$DIR/PageClient.tsx"
echo "➡️ Forçando Server Page: $TARGET_PAGE"
echo "   • movendo conteúdo -> $CLIENT"
mv "$TARGET_PAGE" "$CLIENT"
FIRST="$(head -n 1 "$CLIENT" 2>/dev/null || echo '')"
case "$FIRST" in "'use client'"|'"use client"') : ;; *) { echo "'use client'"; cat "$CLIENT"; } > "${CLIENT}.tmp" && mv "${CLIENT}.tmp" "$CLIENT" ;; esac
cat > "$TARGET_PAGE" <<'TSX'
import PageClient from './PageClient';

export default async function Page() {
  return <PageClient />;
}
TSX
echo "✅ Ok. Suba o app: npm run dev"
