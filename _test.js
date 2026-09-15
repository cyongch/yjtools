/* 逻辑自检：用最小 DOM 桩在 Node 中真实执行站点脚本，断言渲染结果与核心算法 */
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = 'D:/造价AI/前端工具';
let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS  ' + name); }
  else { fail++; console.log('  FAIL  ' + name + (extra ? '  → ' + extra : '')); }
}

function mkEl(id) {
  return {
    id: id || '', innerHTML: '', textContent: '', value: '', className: '',
    style: {}, dataset: {}, hidden: false,
    classList: { add() {}, remove() {}, contains() { return false; } },
    addEventListener() {}, appendChild() {}, remove() {}, click() {},
    querySelector() { return null; }, querySelectorAll() { return []; }
  };
}

const els = {};
const chips = [
  { dataset: { cat: 'all' }, classList: { add() {}, remove() {}, contains() { return false; } }, addEventListener() {} },
  { dataset: { cat: 'text' }, classList: { add() {}, remove() {}, contains() { return false; } }, addEventListener() {} }
];

const context = {
  console,
  setTimeout, clearTimeout,
  TextEncoder, TextDecoder,
  Blob: function () {}, URL: { createObjectURL() { return ''; }, revokeObjectURL() {} }
};
context.window = context;
context.document = {
  readyState: 'complete',
  body: mkEl('body'),
  getElementById(id) { if (!els[id]) els[id] = mkEl(id); return els[id]; },
  querySelector(sel) { return sel === '.chip.on' ? chips[0] : null; },
  querySelectorAll(sel) { return sel === '.chip' ? chips : []; },
  createElement() { return mkEl(''); },
  addEventListener() {}
};
context.navigator = {};
context.location = { hash: '' };

vm.createContext(context);
for (const f of ['assets/tools-data.js', 'assets/app.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), context, { filename: f });
}

function countCards() { return (els['grid'].innerHTML.match(/class="card"/g) || []).length; }

console.log('\n[1] 首页渲染');
const grid = els['grid'];
const cardCount = countCards();
ok('工具卡片数量 = 36', cardCount === 36, '实际 ' + cardCount);
ok('计数文本 = 36', String(els['count'].textContent) === '36', '实际 ' + els['count'].textContent);
ok('卡片含可点击链接', grid.innerHTML.includes('href="tools/json-format/index.html"'));
ok('新工具卡片存在（PDF 加页码）', grid.innerHTML.includes('pdf-page-numbers'));
ok('新工具卡片存在（单位换算）', grid.innerHTML.includes('unit-convert'));
ok('游戏卡片存在（五子棋）', grid.innerHTML.includes('game-gomoku'));
ok('游戏卡片存在（泡泡纸）', grid.innerHTML.includes('game-bubble'));

console.log('\n[2] 分类筛选');
chips[0].dataset.cat = 'pdf';
context.window.renderHome();
ok('PDF 分类 = 10 个', countCards() === 10, '实际 ' + countCards());
chips[0].dataset.cat = 'image';
context.window.renderHome();
ok('图片分类 = 8 个', countCards() === 8, '实际 ' + countCards());
chips[0].dataset.cat = 'convert';
context.window.renderHome();
ok('计算与转换分类 = 4 个', countCards() === 4, '实际 ' + countCards());
chips[0].dataset.cat = 'text';
context.window.renderHome();
ok('文本与编码分类 = 6 个', countCards() === 6, '实际 ' + countCards());
chips[0].dataset.cat = 'game';
context.window.renderHome();
ok('小游戏分类 = 8 个', countCards() === 8, '实际 ' + countCards());
chips[0].dataset.cat = 'all';
context.window.renderHome();

console.log('\n[3] 关键词搜索（"压缩"）');
els['search'].value = '压缩';
context.window.renderHome();
const hitHtml = els['grid'].innerHTML;
ok('命中图片压缩', hitHtml.includes('image-compress'));
ok('命中 PDF 压缩相关或未命中其他类', !hitHtml.includes('text-diff'), '不应命中文本对比');
els['search'].value = '';
context.window.renderHome();

console.log('\n[4] 相关工具互链');
const rel = els['related'];
const relCount = (rel.innerHTML.match(/class="card"/g) || []).length;
ok('渲染 3 个相关工具', relCount === 3, '实际 ' + relCount);

console.log('\n[5] 页码范围解析');
const pr = context.window.parseRanges;
ok('1-3,5 → [1,2,3,5]', JSON.stringify(pr('1-3,5', 10, false)) === '[1,2,3,5]', JSON.stringify(pr('1-3,5', 10, false)));
ok('5- 开放区间 → 5..10', JSON.stringify(pr('5-', 10, true)) === '[5,6,7,8,9,10]', JSON.stringify(pr('5-', 10, true)));
ok('越界页码被剔除', JSON.stringify(pr('99', 10, false)) === '[]', JSON.stringify(pr('99', 10, false)));
ok('中文逗号可用', JSON.stringify(pr('1，3', 10, false)) === '[1,3]', JSON.stringify(pr('1，3', 10, false)));
ok('倒序区间自动纠正', JSON.stringify(pr('5-2', 10, false)) === '[2,3,4,5]', JSON.stringify(pr('5-2', 10, false)));

console.log('\n[6] 体积格式化');
const fs2 = context.window.fmtSize;
ok('500 → 500 B', fs2(500) === '500 B', fs2(500));
ok('2048 → 2.0 KB', fs2(2048) === '2.0 KB', fs2(2048));
ok('3145728 → 3.00 MB', fs2(3145728) === '3.00 MB', fs2(3145728));

console.log('\n[7] 工具清单数据完整性');
const tools = context.window.TOOLS;
ok('每个工具都有 href/name/desc/cat', tools.every(t => t.href && t.name && t.desc && t.cat));
ok('href 无重复', new Set(tools.map(t => t.href)).size === tools.length);
const dirs = tools.map(t => t.href);
const missing = dirs.filter(h => !fs.existsSync(path.join(root, h)));
ok('每个 href 对应的页面文件都存在', missing.length === 0, '缺失: ' + missing.join(', '));
const cats = tools.map(t => t.cat);
ok('分类取值合法', cats.every(c => ['text', 'image', 'pdf', 'convert', 'game'].includes(c)), cats.join(','));

console.log('\n[8] 2048 滑动合并逻辑（提取页面真实代码执行）');
(function () {
  try {
    const html = fs.readFileSync(path.join(root, 'tools/game-2048/index.html'), 'utf8');
    const reS = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
    let mm, code = '';
    while ((mm = reS.exec(html))) code = mm[1];
    const marker = '  buildDom();\n  reset();\n})();';
    if (code.indexOf(marker) < 0) { ok('能定位到注入锚点', false, '页面结构已变'); return; }
    code = code.replace(marker, [
      '  globalThis.__exp = {',
      '    resetNow: function () { buildDom(); reset(); },',
      '    cells: function () { return $("board").children; },',
      '    setGrid: function (g) { grid = g; },',
      '    getGrid: function () { return grid; },',
      '    slide: function (dir) {',
      '      var gained = 0, moved = false;',
      '      for (var i = 0; i < N; i++) {',
      '        var r = slideLine(getLine(dir, i));',
      '        if (r.changed) moved = true;',
      '        gained += r.gained;',
      '        setLine(dir, i, r.out);',
      '      }',
      '      return { moved: moved, gained: gained };',
      '    }',
      '  };',
      '})();'
    ].join('\n'));

    function mkEl2(id) {
      return {
        id: id || '', children: [], innerHTML: '', textContent: '', value: '',
        style: {}, dataset: {}, onclick: null,
        classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
        appendChild(c) { this.children.push(c); }, addEventListener() {}, remove() {}
      };
    }
    const els2 = {};
    const ctx2 = { console, setTimeout, clearTimeout };
    ctx2.window = ctx2;
    ctx2.globalThis = ctx2;
    ctx2.document = {
      readyState: 'complete',
      getElementById(id) { if (!els2[id]) els2[id] = mkEl2(id); return els2[id]; },
      addEventListener() {}, querySelectorAll() { return []; },
      createElement() { return mkEl2(); }, body: mkEl2('body')
    };
    vm.createContext(ctx2);
    vm.runInContext(code, ctx2, { filename: 'game-2048.js' });

    const E = ctx2.__exp;
    const G = rows => rows.map(r => r.slice());
    const empty = () => G([[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]);
    const row0 = () => JSON.stringify(E.getGrid()[0]);
    let g;

    g = empty(); g[0] = [2,2,4,4]; E.setGrid(G(g)); E.slide('left');
    ok('左移 2,2,4,4 → 4,8（不连锁）', row0() === '[4,8,0,0]', row0());

    g = empty(); g[0] = [4,4,4,0]; E.setGrid(G(g)); E.slide('left');
    ok('左移 4,4,4,0 → 8,4', row0() === '[8,4,0,0]', row0());

    g = empty(); g[0] = [2,2,2,2]; E.setGrid(G(g)); E.slide('left');
    ok('左移 2,2,2,2 → 4,4', row0() === '[4,4,0,0]', row0());

    g = empty(); g[0] = [2,2,0,0]; E.setGrid(G(g)); E.slide('right');
    ok('右移 2,2 → 0,0,0,4', row0() === '[0,0,0,4]', row0());

    g = empty(); g[0][0] = 2; g[1][0] = 2; E.setGrid(G(g)); E.slide('up');
    ok('上移 列 2,2 → 顶部为 4', E.getGrid()[0][0] === 4 && E.getGrid()[1][0] === 0);

    g = empty(); g[0][0] = 2; g[1][0] = 2; E.setGrid(G(g)); E.slide('down');
    ok('下移 列 2,2 → 底部为 4', E.getGrid()[3][0] === 4 && E.getGrid()[2][0] === 0);

    g = empty(); g[0] = [8,8,8,8]; E.setGrid(G(g));
    const rr = E.slide('left');
    ok('四个 8 合并计 32 分', rr.gained === 32, String(rr.gained));

    g = empty(); g[0] = [2,4,8,16]; E.setGrid(G(g));
    ok('已左对齐时左移判定为无效', E.slide('left').moved === false);

    E.resetNow();
    const cells = E.cells();
    ok('棋盘渲染出 16 个格子', cells.length === 16, String(cells.length));
    const withNum = Array.prototype.filter.call(cells, c => String(c.textContent) !== '').length;
    ok('开局恰好 2 个格子带数字', withNum === 2, String(withNum));
    const visible = Array.prototype.filter.call(cells, c =>
      String(c.textContent) !== '' && c.style.color && c.style.color !== 'transparent').length;
    ok('带数字的格子颜色非透明（数字可见）', visible === 2, String(visible));
  } catch (e) {
    ok('2048 逻辑测试可执行', false, e.message);
  }
})();

console.log('\n结果：通过 ' + pass + ' 项，失败 ' + fail + ' 项');
process.exit(fail ? 1 : 0);
