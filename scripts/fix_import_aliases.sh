#!/usr/bin/env bash
set -euo pipefail
echo "➡️  Padronizando imports para '@/src/' …"
node - <<'NODE'
const fs=require('fs'); const path=require('path');
const exts=new Set(['.ts','.tsx','.js','.jsx','.mjs']);
function* walk(d){ for(const e of fs.readdirSync(d,{withFileTypes:true})){ const p=path.join(d,e.name); if(e.isDirectory()) yield* walk(p); else if(exts.has(path.extname(e.name))) yield p; } }
for(const f of walk('src')){
  const s=fs.readFileSync(f,'utf8');
  const n=s.replace(/(['"])@\/(?!src\/)/g, '$1@/src/');
  if(n!==s){ fs.writeFileSync(f,n,'utf8'); console.log('fix',f); }
}
NODE
echo "✅ Concluído."