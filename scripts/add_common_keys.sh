#!/usr/bin/env bash
set -euo pipefail
echo "➡️  Garantindo chaves básicas em src/messages/{pt-br,en-us,es-es}.json …"
mkdir -p src/messages
for loc in en-us pt-br es-es; do
  file="src/messages/$loc.json"
  if [ ! -f "$file" ]; then echo "{}" > "$file"; fi
  node - "$file" <<'NODE'
const fs=require('fs');
const file=process.argv[1];
const j=JSON.parse(fs.readFileSync(file,'utf8'));
j.Common=j.Common||{};
j.Common.cancel=j.Common.cancel|| (file.includes('pt-br')?'Cancelar': file.includes('es-es')?'Cancelar':'Cancel');
j.Common.delete=j.Common.delete|| (file.includes('pt-br')?'Excluir': file.includes('es-es')?'Eliminar':'Delete');
j.Common.deleting=j.Common.deleting|| (file.includes('pt-br')?'Excluindo...': file.includes('es-es')?'Eliminando...':'Deleting...');
j.Common.goBackToDashboard=j.Common.goBackToDashboard|| (file.includes('pt-br')?'Voltar para o painel': file.includes('es-es')?'Volver al panel':'Go Back To Dashboard');
fs.writeFileSync(file, JSON.stringify(j,null,2));
console.log('✔ updated', file);
NODE
done
echo "✅ Mensagens básicas garantidas."