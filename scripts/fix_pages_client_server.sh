#!/usr/bin/env sh
set -euf

ROOT="src/app/[locale]"

if [ ! -d "$ROOT" ]; then
  echo "❌ Pasta $ROOT não encontrada. Garanta que suas rotas estejam sob [locale]."
  exit 1
fi

fix_one_page() {
  page="$1"
  dir="$(dirname "$page")"
  base="$(basename "$dir")"

  echo "➡️ Analisando: $page"

  # 1) Remover exports indevidos no page.tsx
  # remove generateStaticParams / generateMetadata do page.tsx (devem ficar no layout)
  tmp="$(mktemp)"
  # shellcheck disable=SC2016
  sed -E '/export[[:space:]]+(async[[:space:]]+)?function[[:space:]]+generateStaticParams/d; /export[[:space:]]+(async[[:space:]]+)?function[[:space:]]+generateMetadata/d' "$page" > "$tmp"
  mv "$tmp" "$page"

  # 2) Se page for Client, migrar conteúdo para *Client.tsx
  first_line="$(head -n 1 "$page" || true)"
  echo "$first_line" | grep -q "^'use client'" || {
    echo "   • page já é Server (sem 'use client')"
    return 0
  }

  # gerar nome do Client a partir do diretório (capitalizado)
  name="$(echo "$base" | sed -E 's/(^|[^a-zA-Z0-9])([a-z])/\1\U\2/g')"
  [ -z "$name" ] && name="Home"
  client="$dir/${name}Client.tsx"

  # evitar overwrite: incrementa sufixo se já existir
  i=2
  while [ -f "$client" ]; do
    client="$dir/${name}Client${i}.tsx"
    i=$((i+1))
  done

  echo "   • Convertendo page -> Server e criando Client: $(basename "$client")"
  mv "$page" "$client"

  # garantir 'use client' no Client
  first_line_client="$(head -n 1 "$client" || true)"
  echo "$first_line_client" | grep -q "^'use client'" || {
    { echo "'use client'"; cat "$client"; } > "${client}.tmp" && mv "${client}.tmp" "$client"
  }

  # recriar page.tsx server que renderiza o Client
  cat > "$page" <<TSX
import ClientView from './$(basename "$client" .tsx)';

export default async function Page() {
  return <ClientView />;
}
TSX
}

# varrer todas as pages sob [locale]
# usa -print0 para lidar com espaços em caminhos
find "$ROOT" -type f -name 'page.tsx' -print0 | while IFS= read -r -d '' p; do
  fix_one_page "$p"
done

echo "✅ Finalizado. Agora rode: npm run dev (ou seu Docker)."