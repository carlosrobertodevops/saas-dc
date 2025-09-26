#!/usr/bin/env sh
# POSIX-safe
set -e

DIR="src/app/[locale]/dashboard"
PAGE="$DIR/page.tsx"
CLIENT="$DIR/PageClient.tsx"

echo "➡️ Verificando paths…"
[ -d "$DIR" ] || { echo "❌ Pasta não existe: $DIR"; exit 1; }
[ -f "$PAGE" ] || { echo "❌ Não encontrei $PAGE"; exit 1; }

echo "➡️ Movendo conteúdo do page.tsx para PageClient.tsx…"
mv "$PAGE" "$CLIENT"

# Garante 'use client' no Client
FIRST="$(head -n 1 "$CLIENT" 2>/dev/null || echo '')"
case "$FIRST" in
  "'use client'"|'"use client"') : ;;
  *) { echo "'use client'"; cat "$CLIENT"; } > "${CLIENT}.tmp" && mv "${CLIENT}.tmp" "$CLIENT" ;;
esac

echo "➡️ Criando page.tsx (Server stub)…"
cat > "$PAGE" <<'TSX'
export const dynamic = 'force-dynamic';
import PageClient from './PageClient';

export default async function Page() {
  return <PageClient />;
}
TSX

echo "➡️ Removendo QUALQUER export generate* dentro de $DIR (inclusive no Client)…"
# remove exports de generateStaticParams/generateMetadata de todos os .tsx do diretório
find "$DIR" -type f -name "*.tsx" -print0 | while IFS= read -r -d '' f; do
  tmp="$(mktemp)"
  sed -E '/export[[:space:]]+(async[[:space:]]+)?function[[:space:]]+generateStaticParams/d; /export[[:space:]]+(async[[:space:]]+)?function[[:space:]]+generateMetadata/d' "$f" > "$tmp"
  mv "$tmp" "$f"
done

echo "🧹 Limpando cache do Next (.next)…"
sudo rm -rf .next

echo "✅ Hard fix aplicado no dashboard. Agora suba o app:"
echo "   npm run dev"
echo "   # ou docker-compose -f docker-compose.local.yaml up --build"