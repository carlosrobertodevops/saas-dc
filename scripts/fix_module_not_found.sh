#!/usr/bin/env bash
set -euo pipefail

# Fix "Module not found: Can't resolve '@/src/app/models/HistorySchema'"
# - Normaliza imports para '@/src/...'
# - Corrige caminhos inexistentes tentando:
#   1) ajuste de casing (HistorySchema vs historySchema vs HIstorySchema)
#   2) trocar '/app/lib/*' -> '/lib/*' se existir em src/lib
#   3) trocar '/app/models/*' -> '/models/*' se existir em src/models
#
# Uso:
#   chmod +x fix_module_not_found.sh
#   ./fix_module_not_found.sh
#
# Depois:
#   npm run dev  (ou seu Docker)
#
# Requer: node >= 16

if [ ! -d "src" ]; then
  echo "❌ Rode na raiz do projeto (onde existe a pasta src)"; exit 1;
fi

node - <<'NODE'
const fs=require('fs');
const path=require('path');

const exts=['.ts','.tsx','.js','.jsx','.mjs','.cjs'];
const indexExts=exts.map(e=>'/index'+e);
const SRC=path.resolve('src');

function* walk(dir){
  for (const ent of fs.readdirSync(dir,{withFileTypes:true})) {
    const p=path.join(dir, ent.name);
    if (ent.isDirectory()) yield* walk(p);
    else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(ent.name)) yield p;
  }
}

function fileExistsExact(p){
  try { fs.accessSync(p); return true; } catch { return false; }
}

function findCaseInsensitive(targetAbs){
  // Find a file case-insensitively by walking down the segments
  const rel = path.relative(SRC, targetAbs);
  const segments = rel.split(path.sep);
  let cur = SRC;
  for (const seg of segments) {
    if (!seg) continue;
    const list = fs.readdirSync(cur);
    const found = list.find(name => name.toLowerCase() === seg.toLowerCase());
    if (!found) return null;
    cur = path.join(cur, found);
  }
  return cur;
}

function resolveWithVariants(aliasPath){ // '@/src/...' (no quotes)
  const rel = aliasPath.replace(/^@\/src\//, '');
  const baseAbs = path.join(SRC, rel);
  const candidates = [
    baseAbs, ...exts.map(e=>baseAbs+e),
    ...indexExts.map(ix=>baseAbs+ix)
  ];
  for (const c of candidates) if (fileExistsExact(c)) return c;
  // try case-insensitive
  for (const c of candidates) {
    const ci = findCaseInsensitive(c);
    if (ci && fileExistsExact(ci)) return ci;
  }
  return null;
}

function tryAlternativeLocations(aliasPath){
  // 1) '/app/lib/*' -> '/lib/*'
  if (aliasPath.startsWith('@/src/app/lib/')) {
    const alt='@/src/lib/'+aliasPath.split('@/src/app/lib/')[1];
    const r=resolveWithVariants(alt);
    if (r) return alt;
  }
  // 2) '/app/models/*' -> '/models/*'
  if (aliasPath.startsWith('@/src/app/models/')) {
    const alt='@/src/models/'+aliasPath.split('@/src/app/models/')[1];
    const r=resolveWithVariants(alt);
    if (r) return alt;
  }
  return null;
}

function correctCasing(aliasPath){
  const abs = resolveWithVariants(aliasPath);
  if (!abs) return null;
  const relFromSrc = path.relative(SRC, abs).split(path.sep).join('/');
  return '@/src/'+relFromSrc.replace(/\/index\.(ts|tsx|js|jsx|mjs|cjs)$/,''); // prefer folder import if index
}

let changed=0, fixed=0, moved=0;
for (const file of walk(SRC)) {
  let src=fs.readFileSync(file,'utf8');
  let out=src;
  // normalize '@/'
  out = out.replace(/(['"])@\/(?!src\/)/g, '$1@/src/');
  // try to correct unresolved alias imports
  out = out.replace(/(['"])(@\/src\/[^'"]+)\1/g, (m,q,aliasPath)=>{
    const corrected = correctCasing(aliasPath);
    if (corrected) { fixed++; return q+corrected+q; }
    const alt = tryAlternativeLocations(aliasPath);
    if (alt) { moved++; return q+alt+q; }
    return m;
  });
  if (out!==src){
    fs.writeFileSync(file,out,'utf8');
    changed++;
    console.log('fix:', path.relative(process.cwd(), file));
  }
}
console.log(`\nSummary: files changed=${changed}, casing fixed=${fixed}, moved paths=${moved}`);
NODE

echo "✅ Concluído. Agora rode: npm run dev (ou seu Docker)"
