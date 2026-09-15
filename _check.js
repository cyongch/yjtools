const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = 'D:/造价AI/前端工具';
const files = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'vendor') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(html|js)$/.test(e.name) && !e.name.startsWith('_')) files.push(p);
  }
}
walk(root);

let bad = 0, ok = 0, checked = 0;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const chunks = [];
  if (f.endsWith('.js')) {
    chunks.push(src);
  } else {
    const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
    let m;
    while ((m = re.exec(src))) chunks.push(m[1]);
    if (!/<\/html>\s*$/.test(src)) console.log('WARN ' + f + ' 结尾不完整');
    for (const tag of ['id="drop"', 'assets/style.css']) {
      if (!src.includes(tag) && f.includes('tools')) console.log('WARN ' + f + ' 缺少 ' + tag);
    }
  }
  chunks.forEach((c, i) => {
    checked++;
    if (!c.trim()) return;
    try { new vm.Script(c, { filename: f + '#' + i }); ok++; }
    catch (e) { bad++; console.log('FAIL  ' + path.relative(root, f) + '  block#' + i + '  ' + e.message); }
  });
}
console.log('');
console.log('文件 ' + files.length + ' 个 / 脚本块 ' + checked + ' 个：通过 ' + ok + '，失败 ' + bad);
