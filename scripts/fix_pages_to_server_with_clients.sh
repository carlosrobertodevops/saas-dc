#!/usr/bin/env sh
# POSIX-safe
set -e

fix_one() {
  TARGET_PAGE="$1"
  CLIENT_NAME="$2"   # ex.: HomeClient ou DashboardClient

  if [ ! -f "$TARGET_PAGE" ]; then
    echo "⚠️  pulando (não existe): $TARGET_PAGE"
    return 0
  fi

  DIR="$(dirname "$TARGET_PAGE")"
  CLIENT_FILE="$DIR/$CLIENT_NAME.tsx"

  echo "➡️ Convertendo $TARGET_PAGE -> server + $CLIENT_NAME (client)"

  # 1) mover o conteúdo atual do page.tsx para o Client
  mv "$TARGET_PAGE" "$CLIENT_FILE"

  # 2) garantir 'use client' no Client
  FIRST="$(head -n 1 "$CLIENT_FILE" 2>/dev/null || echo '')"
  case "$FIRST" in
    "'use client'"|'"use client"') : ;;
    *) { echo "'use client'"; cat "$CLIENT_FILE"; } > "${CLIENT_FILE}.tmp" && mv "${CLIENT_FILE}.tmp" "$CLIENT_FILE" ;;
  esac

  # 3) remover quaisquer exports generate* do Client (não podem existir em arquivos client)
  tmp="$(mktemp)"
  sed -E '/export[[:space:]]+(async[[:space:]]+)?function[[:space:]]+generateStaticParams/d; /export[[:space:]]+(async[[:space:]]+)?function[[:space:]]+generateMetadata/d' "$CLIENT_FILE" > "$tmp"
  mv "$tmp" "$CLIENT_FILE"

  # 4) recriar page.tsx como server stub
  BASENAME="$CLIENT_NAME"
  cat > "$TARGET_PAGE" <<TSX
export const dynamic = 'force-dynamic';
import $BASENAME from './$BASENAME';

export default async function Page() {
  return <$BASENAME />;
}
TSX
}

# Corrige as duas páginas principais
fix_one "src/app/[locale]/page.tsx" "HomeClient"
fix_one "src/app/[locale]/dashboard/page.tsx" "DashboardClient"

# (Defensivo) remove generate* de qualquer .tsx dentro de [locale]/dashboard e [locale] root
for DIR in "src/app/[locale]/dashboard" "src/app/[locale]"; do
  if [ -d "$DIR" ]; then
    find "$DIR" -type f -name "*.tsx" -print0 | while IFS= read -r -d '' f; do
      tmp="$(mktemp)"
      sed -E '/export[[:space:]]+(async[[:space:]]+)?function[[:space:]]+generateStaticParams/d; /export[[:space:]]+(async[[:space:]]+)?function[[:space:]]+generateMetadata/d' "$f" > "$tmp"
      mv "$tmp" "$f"
    done
  fi
done

# limpar cache/build
echo "🧹 Limpando .next…"
rm -rf .next

echo "✅ Páginas ajustadas. Agora rode: npm run dev  (ou seu docker-compose dev)"