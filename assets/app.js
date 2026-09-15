(function () {
  'use strict';

  var CAT_NAME = {};
  (window.CATEGORIES || []).forEach(function (c) { CAT_NAME[c.id] = c.name; });

  /* ---------- 通用工具函数 ---------- */

  window.fmtSize = function (n) {
    if (n < 1024) return n + ' B';
    if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
    if (n < 1073741824) return (n / 1048576).toFixed(2) + ' MB';
    return (n / 1073741824).toFixed(2) + ' GB';
  };

  window.toast = function (msg, type) {
    var el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.className = 'show' + (type ? ' ' + type : '');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.className = ''; }, 2600);
  };

  window.saveBlob = function (blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
  };

  window.copyText = function (text, okMsg) {
    var done = function () { toast(okMsg || '已复制到剪贴板'); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { toast('复制失败，请手动选中复制', 'err'); });
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); }
      catch (e) { toast('复制失败，请手动选中复制', 'err'); }
      ta.remove();
    }
  };

  /** 绑定拖拽 + 点击选择文件 */
  window.bindDrop = function (zone, input, onFiles) {
    ['dragenter', 'dragover'].forEach(function (ev) {
      zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add('over'); });
    });
    ['dragleave', 'drop'].forEach(function (ev) {
      zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.remove('over'); });
    });
    zone.addEventListener('drop', function (e) {
      var fs = e.dataTransfer && e.dataTransfer.files;
      if (fs && fs.length) onFiles(Array.prototype.slice.call(fs));
    });
    zone.addEventListener('click', function () { input.click(); });
    input.addEventListener('change', function () {
      if (input.files && input.files.length) onFiles(Array.prototype.slice.call(input.files));
      input.value = '';
    });
  };

  /** 读取文件为 ArrayBuffer */
  window.readAsArrayBuffer = function (file) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(r.result); };
      r.onerror = function () { rej(new Error('读取文件失败：' + file.name)); };
      r.readAsArrayBuffer(file);
    });
  };

  /** 读取文件为 DataURL */
  window.readAsDataURL = function (file) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(r.result); };
      r.onerror = function () { rej(new Error('读取文件失败：' + file.name)); };
      r.readAsDataURL(file);
    });
  };

  /** DataURL -> Image */
  window.loadImage = function (src) {
    return new Promise(function (res, rej) {
      var img = new Image();
      img.onload = function () { res(img); };
      img.onerror = function () { rej(new Error('图片解码失败，文件可能已损坏')); };
      img.src = src;
    });
  };

  /** 解析页码范围 "1-3,5,8-" -> [1,2,3,5,8,...] total 为总页数 */
  window.parseRanges = function (str, total, allowOpenEnd) {
    var out = [];
    String(str).split(/[,，\s]+/).forEach(function (part) {
      if (!part) return;
      var m = part.match(/^(\d+)\s*[-~]\s*(\d*)$/);
      if (m) {
        var a = parseInt(m[1], 10);
        var b = m[2] ? parseInt(m[2], 10) : (allowOpenEnd ? total : a);
        if (b < a) { var t = a; a = b; b = t; }
        for (var i = a; i <= b; i++) out.push(i);
      } else if (/^\d+$/.test(part)) {
        out.push(parseInt(part, 10));
      }
    });
    return out.filter(function (n, i) { return out.indexOf(n) === i; })
      .filter(function (n) { return n >= 1 && n <= total; })
      .sort(function (a, b) { return a - b; });
  };

  /** 渲染文件列表 */
  window.renderFileList = function (ulEl, files, onRemove) {
    ulEl.innerHTML = '';
    files.forEach(function (f, i) {
      var li = document.createElement('li');
      var nm = document.createElement('span');
      nm.className = 'nm';
      nm.textContent = f.name;
      var sz = document.createElement('span');
      sz.className = 'sz';
      sz.textContent = fmtSize(f.size);
      var del = document.createElement('button');
      del.className = 'del';
      del.type = 'button';
      del.title = '移除';
      del.textContent = '×';
      del.onclick = function () { onRemove(i); };
      li.appendChild(nm);
      li.appendChild(sz);
      li.appendChild(del);
      ulEl.appendChild(li);
    });
  };

  /** 设置出参区状态 */
  window.setStatus = function (el, msg, isErr) {
    if (!el) return;
    el.textContent = msg || '';
    el.className = isErr ? 'err-text' : 'ok-text';
  };

  /* ---------- 首页 ---------- */

  var PAGE_SIZE = 24;

  window.renderHome = function () {
    var grid = document.getElementById('grid');
    var chipBar = document.getElementById('chip-bar');
    // 必须同时具备工具网格与分类筛选条，才认定是首页。
    // 仅判断 #grid 是不够的：任何页面只要用了 id="grid" 做容器（如 2048 的棋盘）
    // 都会被误当成首页，从而被工具卡片覆盖。
    if (!grid || !chipBar) return;

    var qEl = document.getElementById('search');
    var q = (qEl && qEl.value ? qEl.value : '').trim().toLowerCase();
    var chip = document.querySelector('.chip.on');
    var cat = chip ? chip.dataset.cat : 'all';

    var list = (window.TOOLS || []).filter(function (t) {
      if (cat !== 'all' && t.cat !== cat) return false;
      if (!q) return true;
      return (t.name + t.desc + ' ' + (t.tags || '') + ' ' + (CAT_NAME[t.cat] || ''))
        .toLowerCase().indexOf(q) !== -1;
    });

    grid.innerHTML = list.map(function (t) {
      return '<a class="card" href="' + t.href + '">' +
        '<div class="card-top"><h3>' + t.name + '</h3>' +
        '<span class="badge">' + (t.badge || '纯前端') + '</span></div>' +
        '<p>' + t.desc + '</p></a>';
    }).join('');

    if (!list.length) {
      grid.innerHTML = '<p class="empty">没有匹配的工具，换个关键词试试</p>';
    }
    var cnt = document.getElementById('count');
    if (cnt) cnt.textContent = list.length;

    var ch = document.getElementById('chip-bar');
    if (ch) ch.style.display = list.length || q || cat !== 'all' ? '' : 'none';
  };

  function initHome() {
    var grid = document.getElementById('grid');
    var chipBar = document.getElementById('chip-bar');
    if (!grid || !chipBar) return;

    function selectCat(cat, scroll) {
      var target = null;
      document.querySelectorAll('.chip').forEach(function (x) {
        if (x.dataset.cat === cat) target = x;
      });
      if (!target) return false;
      document.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('on'); });
      target.classList.add('on');
      var qEl = document.getElementById('search');
      if (qEl) qEl.value = '';
      renderHome();
      if (scroll) {
        var anchor = document.querySelector('.count-line') || grid;
        if (anchor && anchor.scrollIntoView) {
          try { anchor.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
          catch (e) { anchor.scrollIntoView(); }
        }
      }
      return true;
    }

    document.querySelectorAll('.chip').forEach(function (c) {
      c.addEventListener('click', function () { selectCat(c.dataset.cat, false); });
    });

    var q = document.getElementById('search');
    if (q) q.addEventListener('input', renderHome);

    // 顶部导航的分类链接：等价于点下方对应的筛选按钮。
    // 首页里并没有 #text / #game 这类锚点元素，若不拦截点击，页面不会有任何反应。
    document.querySelectorAll('header nav a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var m = (a.getAttribute('href') || '').match(/#([A-Za-z0-9_-]+)$/);
        if (!m) return;
        if (selectCat(m[1], true)) {
          e.preventDefault();
          try { history.replaceState(null, '', '#' + m[1]); } catch (err) { location.hash = m[1]; }
        }
      });
    });

    // 从其他页面点导航跳回首页时会带上 #game 之类的 hash，这里直接应用对应分类
    var initCat = (location.hash || '').replace(/^#/, '');
    if (initCat) selectCat(initCat, true);

    renderHome();
  }

  /* ---------- 工具页公共：相关工具 ---------- */

  function initRelated() {
    var box = document.getElementById('related');
    if (!box) return;
    var id = box.dataset.current;
    var cat = box.dataset.cat;
    var pool = (window.TOOLS || []).filter(function (t) {
      return t.id !== id && (t.cat === cat || !cat);
    }).slice(0, 3);

    if (pool.length < 3) {
      (window.TOOLS || []).forEach(function (t) {
        if (pool.length >= 3) return;
        if (t.id !== id && pool.indexOf(t) === -1) pool.push(t);
      });
    }

    box.innerHTML = '<h2>相关工具</h2><div class="grid" style="padding:0">' +
      pool.map(function (t) {
        return '<a class="card" href="../../' + t.href + '">' +
          '<div class="card-top"><h3>' + t.name + '</h3></div>' +
          '<p>' + t.desc + '</p></a>';
      }).join('') + '</div>';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initHome(); initRelated(); });
  } else {
    initHome();
    initRelated();
  }
})();
