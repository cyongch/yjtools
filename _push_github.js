/* 通过 GitHub Git Data API 上传整站文件（不依赖 github.com，仅用 api.github.com）
   用法：GH_TOKEN=xxx node _push_github.js <文件列表...> */
const fs = require('fs');

const TOKEN = process.env.GH_TOKEN;
const OWNER = 'cyongch';
const REPO = 'yjtools';
const API = 'https://api.github.com';
const BRANCH = 'main';

if (!TOKEN) { console.error('缺少 GH_TOKEN 环境变量'); process.exit(1); }

const files = process.argv.slice(2);
if (!files.length) { console.error('缺少文件列表参数'); process.exit(1); }

const COMMIT_MSG = [
  '即用工具箱 —— 36 个纯前端在线工具',
  '',
  '五大分类：',
  '- 文本与编码 6：JSON 格式化、文本对比、Base64、哈希、二维码、文本批量处理',
  '- 图片处理 8：压缩、格式转换、尺寸调整、加水印、裁剪、旋转翻转、拼接、压缩到指定大小',
  '- PDF 处理 10：合并、拆分、旋转、加水印、删除页面、图片转 PDF、加页码、元数据、页面重排、提取图片',
  '- 计算与转换 4：单位换算、时间戳、人民币大写、CSV/JSON/Markdown 互转',
  '- 小游戏·减压 8：五子棋、2048、扫雷、贪吃蛇、数字华容道、记忆翻牌、打地鼠、解压泡泡纸',
  '',
  '纯静态、零构建，所有处理均在浏览器本地完成，文件不上传。',
  '含自检脚本 _check.js（语法 38 块）与 _test.js（逻辑 38 项断言）。'
].join('\n');

async function api(method, url, body) {
  const res = await fetch(API + url, {
    method,
    headers: {
      'Authorization': 'token ' + TOKEN,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'yjtools-deploy'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = { raw: text.slice(0, 300) }; }
  if (!res.ok) throw new Error(method + ' ' + url + ' → ' + res.status + ' ' + JSON.stringify(data).slice(0, 300));
  return data;
}

(async () => {
  // 空仓库无法直接使用 Git Data API（返回 409），先用 Contents API 建一个初始提交
  let parents = [];
  try {
    const ref = await api('GET', `/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`);
    parents = [ref.object.sha];
    console.log('检测到已有分支，将在其上提交（parent ' + ref.object.sha.slice(0, 7) + '）');
  } catch (e) {
    console.log('仓库为空，先用 Contents API 创建初始提交…');
    await api('PUT', `/repos/${OWNER}/${REPO}/contents/README.md`, {
      message: '初始化仓库',
      content: Buffer.from('# 即用工具箱\n', 'utf8').toString('base64')
    });
    const ref = await api('GET', `/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`);
    parents = [ref.object.sha];
    console.log('初始提交已创建');
  }

  console.log('\n准备上传 ' + files.length + ' 个文件…\n');

  const tree = [];
  let done = 0;
  for (const f of files) {
    const buf = fs.readFileSync(f);
    const r = await api('POST', `/repos/${OWNER}/${REPO}/git/blobs`, {
      content: buf.toString('base64'),
      encoding: 'base64'
    });
    tree.push({ path: f.split('\\').join('/'), mode: '100644', type: 'blob', sha: r.sha });
    done++;
    if (done % 10 === 0 || done === files.length) console.log('  已上传 ' + done + '/' + files.length);
  }

  console.log('\n创建目录树…');
  const t = await api('POST', `/repos/${OWNER}/${REPO}/git/trees`, { tree });
  console.log('  tree: ' + t.sha);

  console.log('创建提交…');
  const c = await api('POST', `/repos/${OWNER}/${REPO}/git/commits`, {
    message: COMMIT_MSG,
    tree: t.sha,
    parents: parents
  });
  console.log('  commit: ' + c.sha);

  console.log('更新 ' + BRANCH + ' 分支…');
  try {
    const existing = await api('GET', `/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`);
    await api('PATCH', `/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`, { sha: c.sha, force: true });
    console.log('  已更新（原指向 ' + existing.object.sha.slice(0, 7) + '）');
  } catch (e) {
    await api('POST', `/repos/${OWNER}/${REPO}/git/refs`, { ref: 'refs/heads/' + BRANCH, sha: c.sha });
    console.log('  已创建分支 ' + BRANCH);
  }

  console.log('\n完成。仓库地址：https://github.com/' + OWNER + '/' + REPO);
})().catch(e => { console.error('\n失败：' + e.message); process.exit(1); });
