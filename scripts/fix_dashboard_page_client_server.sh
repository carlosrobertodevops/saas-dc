#!/usr/bin/env sh
# Script POSIX-safe: não usa "set -u" para evitar "unbound variable"
set -e

PAGE="src/app/[locale]/dashboard/page.tsx"
CLIENT="src/app/[locale]/dashboard/DashboardClient.tsx"

echo "➡️ Verificando caminho: $PAGE"
if [ ! -f "$PAGE" ]; then
  echo "❌ Não encontrei $PAGE"
  exit 1
fi

echo "➡️ Removendo exports (generateStaticParams/Metadata) do $PAGE…"
tmp="$(mktemp)"
# Remove linhas que exportam generateStaticParams ou generateMetadata
# (ficam no layout, não no page)
sed -E '/export[[:space:]]+(async[[:space:]]+)?function[[:space:]]+generateStaticParams/d; /export[[:space:]]+(async[[:space:]]+)?function[[:space:]]+generateMetadata/d' "$PAGE" > "$tmp"
mv "$tmp" "$PAGE"

# Checa se a primeira linha é 'use client'
FIRST_LINE="$(head -n 1 "$PAGE" 2>/dev/null || echo '')"
if printf '%s' "$FIRST_LINE" | grep -q "^'use client'"; then
  echo "➡️ $PAGE é Client — migrando para $CLIENT e criando page Server…"

  # Move o page.tsx atual para o Client
  # Se já existe, cria um nome alternativo
  TARGET="$CLIENT"
  if [ -f "$TARGET" ]; then
    i=2
    while [ -f "src/app/[locale]/dashboard/DashboardClient${i}.tsx" ]; do
      i=$((i+1))
    done
    TARGET="src/app/[locale]/dashboard/DashboardClient${i}.tsx"
  fi

  mv "$PAGE" "$TARGET"

  # Garante 'use client' na primeira linha do client
  FIRST_CLIENT_LINE="$(head -n 1 "$TARGET" 2>/dev/null || echo '')"
  if ! printf '%s' "$FIRST_CLIENT_LINE" | grep -q "^'use client'"; then
    { echo "'use client'"; cat "$TARGET"; } > "${TARGET}.tmp" && mv "${TARGET}.tmp" "$TARGET"
  fi

  # Recria o page.tsx server que renderiza o Client
  BASENAME="$(basename "$TARGET" .tsx)"
  cat > "$PAGE" <<TSX
import ${BASENAME} from './${BASENAME}';

export default async function Page() {
  return <${BASENAME} />;
}
TSX

  echo "✅ Concluído: $PAGE agora é Server e usa ./${BASENAME} (Client)."
else
  echo "✔ $PAGE já é Server (sem 'use client'). Nada a mudar."
fi