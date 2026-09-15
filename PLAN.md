# 即用工具箱 —— 纯前端在线文件处理工具集

> 定位：通用文件处理工具站，主打「文件不上传、浏览器本地处理」。
> 形态：纯静态站点，零服务器、零运维成本，可直接托管到 Cloudflare Pages / GitHub Pages。

---

## 一、当前已完成

**36 个工具，覆盖五大类。**

| 分类 | 工具 | 技术方案 |
|---|---|---|
| 文本与编码（6） | JSON 格式化/校验、文本对比、Base64 编解码、哈希计算、二维码生成、文本批量处理 | 零依赖，原生 API |
| 图片处理（8） | 图片压缩、格式转换、尺寸调整、加水印、裁剪、旋转翻转、拼接、压缩到指定大小 | Canvas 2D |
| PDF 处理（10） | 合并、拆分、旋转、加水印、删除页面、图片转 PDF、加页码、元数据修改、页面重排、提取图片 | pdf-lib |
| 计算与转换（4） | 单位换算、时间戳转换、人民币金额大写、CSV / JSON / Markdown 互转 | 零依赖，纯算法 |
| 小游戏 · 减压（8） | 五子棋（AI）、2048、扫雷、贪吃蛇、数字华容道、记忆翻牌、打地鼠、解压泡泡纸 | 零依赖，Canvas / DOM |

首页带搜索与分类筛选，每个工具有独立 URL 与独立的 title / description / 正文说明（SEO 必需）。

**扩展选型原则**：优先把已本地化库的能力吃干净（边际成本≈0），而不是急着引入新库。引新库的门槛见第七节。

**关于小游戏分类**：与文件工具不同，游戏的价值在停留时长与回访——它们是"让人有事可做"的内容，能显著提升站点的自然访问深度。实现上全部零依赖，不加载任何素材文件（泡泡纸的"啵"声由 Web Audio 实时合成）。

---

## 二、目录结构

```
前端工具/
├── index.html              首页（工具导航 + 搜索 + 分类）
├── PLAN.md                 本文件
├── _check.js               语法自检（逐个脚本块编译，共 38 块）
├── _test.js                逻辑自检（渲染/筛选/分类计数/算法断言，27 项）
├── assets/
│   ├── style.css           全站样式（浅色为主，自动适配暗色）
│   ├── tools-data.js       工具清单数据（新增工具在此登记）
│   └── app.js              公共函数（toast/saveBlob/bindDrop/parseRanges…）
├── vendor/                 第三方库（已本地化，不依赖外部 CDN）
│   ├── pdf-lib.min.js      525 KB  PDF 读写
│   ├── qrcode.min.js        20 KB  二维码
│   ├── spark-md5.min.js     10 KB  MD5
│   ├── fflate.js            33 KB  ZIP 打包
│   └── diff.min.js          17 KB  文本差异比对
└── tools/<工具名>/index.html   每个工具一个独立页面
```

---

## 三、技术约束（重要，决定了什么不能做）

纯静态部署 = 没有后端 = **以下能力做不了**，不要对用户承诺：

| 做不了 | 原因 |
|---|---|
| Word / Excel / PPT ↔ PDF 高保真互转 | 依赖 LibreOffice 类排版引擎，浏览器无法保证版式 |
| 扫描件 OCR（图片 → 可编辑文字） | 需 tesseract.js（约 15MB）或服务端；精度也不理想 |
| PDF 转 Word | 本质是上面两条的组合 |
| 超大文件（>500MB）处理 | 受浏览器内存限制 |
| 音视频转码 | ffmpeg.wasm 首次加载约 25MB，且需 COOP/COEP 响应头 |

**这恰好是本站的核心卖点**：只做能保证正确的事，做不到的明确说明，不糊弄用户。91aitool 那类站点把这些重活交给服务器，本站则彻底放弃——换来的是"文件真的不上传"这个可验证的承诺。

---

## 四、本地打开方式

### 方式一：直接双击（推荐，不需要任何服务）

双击 `index.html` 即可。整站不用 ES Module、不发起任何网络请求，`file://` 协议下可完整运行。

### 方式二：起本地服务（改动调试时用）

访问地址：
```bash
http://localhost:8756
```

> **务必注意**：本地服务进程在电脑重启或长时间闲置后会被回收，届时浏览器提示
> 「该网页无法正常运作」（实为 `ERR_EMPTY_RESPONSE`）。这不是站点故障，重新执行下面命令即可。
> 先自检：`curl -s -o /dev/null -w "%{http_code}" http://localhost:8756/` —— 返回 `000` 即服务已停。

重新启动：
```bash
"C:/Users/admin/.workbuddy/binaries/python/versions/3.13.12/python.exe" -m http.server 8756 --directory "D:/造价AI/前端工具"
```

改动后做语法自检：
```bash
"C:/Users/admin/.workbuddy/binaries/node/versions/22.22.2/node.exe" "D:/造价AI/前端工具/_check.js"
```

> 关于 `crypto.subtle`（SHA 系列哈希）：它要求安全上下文。`https`、`localhost`、`file://` 三者都满足，
> 因此上面三种打开方式都能正常计算哈希；万一在旧浏览器上不可用，哈希工具会给出明确提示，MD5 仍可计算。

---

## 五、部署

### 当前已上线地址

**① GitHub Pages —— 正式地址（推荐）**

```
https://cyongch.github.io/yjtools/
```

- 仓库：<https://github.com/cyongch/yjtools>（public）
- 永久地址、自带 HTTPS、可绑定自有域名、边缘缓存行为正常
- 更新方式见下方「用 API 推送更新」（本机 `git push` 走不通，原因见该节）

**② WorkBuddy 云端 —— 临时备用**

```
https://f967263b39374e239e759d9f08c36ad1.app.workbuddy.host
```

> 适合快速演示。**边缘缓存很顽固**（详见下文），长期用请走 GitHub Pages。
>
> 历史地址（已下线，勿再使用）：`25119ef1…`、`da59e1a4…`

### 页面 id 命名规则（重要）

**页面级的容器 id 不要用 `grid`。** 首页的工具网格用的是 `id="grid"`，而 `app.js` 靠它判断"当前是不是首页"。
2026-09-15 出过一次事故：2048 的棋盘容器也叫 `id="grid"`，于是 `app.js` 把该页误判为首页，**在棋盘初始化完成后又把 24 张工具卡片的 HTML 覆盖进棋盘容器**，表现为"2048 卡片不显示数字"。

现已双层加固：
1. `app.js` 改为**同时要求 `#grid` 与 `#chip-bar` 存在**才认定是首页（`#chip-bar` 是首页独有元素）；
2. 2048 的棋盘容器改名 `id="board"`。

新增页面的容器建议用 `board` / `list` / `stage` 等具体名字，避开 `grid`、`search`、`count` 这些首页专用 id。

### 顶部导航的点击行为（不是锚点跳转）

首页顶部的 `文本编码 / 图片处理 / PDF 处理 / 计算转换 / 小游戏` **不是锚点链接**——页面里根本没有 `#text`、`#game` 这类元素。
它们由 `app.js` 拦截点击，转成「选中对应分类 + 筛选 + 平滑滚动到工具区」。

- **首页点击**：拦截默认行为，直接切换筛选，并把 hash 写进地址栏（用 `history.replaceState` 而非跳转）。
- **工具页点击**（链接形如 `../../index.html#game`）：正常跳回首页，首页加载时读取 `location.hash` 自动应用该分类。

> 教训：最初把导航写成 `href="#game"` 却忘了放对应锚点元素，结果是**点击后页面毫无变化**。
> 教训是——写锚点链接时，必须确认目标元素真的存在；如果本意是"快捷筛选"，就用 JS 处理，别假装成锚点。

### 用 API 推送更新（本机唯一可行的方式）

**本机访问不了 `github.com`**（实测连接超时 15 秒无响应），所以 `git push` / `git clone` 都用不了。
但 `api.github.com` 是通的，因此更新走 GitHub 的 **Git Data API**：由 `_push_github.js` 把本地文件逐个上传为 blob，
再组装成一棵 tree 与一个 commit，最后移动 `main` 分支指针。**效果与一次正常 `git push` 等价**（单次干净提交，不是逐文件堆叠）。

更新流程：

```bash
cd "D:/造价AI/前端工具"
git add -A && git commit -m "你的改动说明"                    # 本地记录
GH_TOKEN=<你的 token> node _push_github.js $(git ls-files)    # 上传到 GitHub
```

推送后 GitHub Pages 会自动重建，约 1 分钟生效。

**注意事项**：
- 上传哪些文件由 `$(git ls-files)` 决定，所以**新增文件必须先 `git add`**，否则不会被上传。
- 脚本从环境变量读 token，**不落盘、不写入 `.git/config`**。token 需要 `repo` 权限。
- 空仓库首次推送时，脚本会先用 Contents API 建一个初始提交（Git Data API 不允许直接操作空仓库，会返回 409）。

### 自行部署到 Cloudflare Pages（免费且无需备案）

1. 把 `前端工具` 目录推到 GitHub 私有或公开仓库。
2. 登录 Cloudflare → Workers & Pages → Create → Pages → Connect to Git → 选该仓库。
3. 构建设置全部留空（这是纯静态站，不需要构建）：
   - Build command: **留空**
   - Build output directory: **`/`**（或仓库根目录）
4. Save and Deploy，几分钟后拿到形如 `你的项目名.pages.dev` 的域名（`xxx` 只是占位写法，真实域名由你的项目名决定）。
5. 绑自有域名：Pages → Custom domains → 添加域名 → 按提示在 DNS 加 CNAME。

### 静态资源缓存处理（重要，别踩这个坑）

站点的 CSS 与 JS 通过 `?v=20260915` 这样的版本号引用：

```html
<link rel="stylesheet" href="assets/style.css?v=20260915">
<script src="assets/tools-data.js?v=20260915"></script>
```

**为什么必须这么做**：CDN 会给 `assets/*.js`、`assets/*.css` 加较长的边缘缓存。如果只更新文件内容而不改 URL，就会出现「**页面是新的、数据是旧的**」这种不一致状态——典型症状是首页已经出现新分类按钮，但点进去显示"没有匹配的工具，换个关键词试试"。

2026-09-15 实际发生过一次：`tools-data.js` 的旧版本被边缘节点缓存住（返回 8371 字节的旧版而非 10727 字节的新版），导致「小游戏 · 减压」筛选结果为空。**这是缓存问题，不是代码问题。**

**维护规则**：每次修改 `assets/` 下的文件后，必须同步提升所有页面的版本号。一条命令搞定：

```bash
cd "D:/造价AI/前端工具"
V=20260916   # 改成新的版本号
find . -name "index.html" -print0 | xargs -0 sed -i \
  -e "s|assets/style.css?v=[0-9]*\"|assets/style.css?v=$V\"|g" \
  -e "s|assets/tools-data.js?v=[0-9]*\"|assets/tools-data.js?v=$V\"|g" \
  -e "s|assets/app.js?v=[0-9]*\"|assets/app.js?v=$V\"|g"
```

`vendor/` 下的第三方库基本不变，暂未加版本号；若将来替换了库文件，同样需要加。

**部署后校验**：不要只看 HTTP 200 —— 必须**比对线上与本地文件的字节数**，不一致就是还没刷新（可等 1 分钟重取）：

### HTML 文件的缓存更难缠

`?v=` 能解决 assets 的问题，但 **HTML 本身无法加版本号**（URL 是固定的）。2026-09-15 实测，边缘节点会把某个 HTML 缓存很久，且 `Eo-Cache-Status: HIT` 表示**完全不回源**，此时会陷入死循环：

- 用户拿到旧 HTML → 旧 HTML 引用的是**旧的 assets 路径**（没有 `?v=`）→ 新版 JS/CSS 永远加载不到；
- 强刷（Ctrl+F5）也无效，因为 CDN 那一层仍在返回缓存副本。

**判断依据**：`curl -sS -I <url> | grep -i eo-cache-status`，返回 `HIT` 就是在吃缓存。

**唯一立即见效的办法：`unpublish` 后重新 `deploy`** —— 这会重建 sandbox 并**换一个新地址**（本次即由 `25119ef1…` 变为 `f967263b…`），新地址没有任何历史缓存。代价是旧链接失效，需通知使用者。

**降低发生概率**：把改动尽量集中在 `assets/` 下（可加版本号），HTML 只在必要时才动。

**替代方案**：GitHub Pages（仓库 Settings → Pages → 选 main 分支 root 目录）。
两者都免费、都支持 HTTPS（这是 `crypto.subtle` 可用的前提）。

> 注：本目录下的 `_headers` 文件是为将来部署到 **Cloudflare Pages** 准备的（声明 `Cache-Control`），
> CloudStudio 的静态服务**不识别**它（实测响应头无变化），保留备用。

---

## 六、如何新增一个工具

1. 新建 `tools/<工具名>/index.html`，照抄任一现有工具的骨架（头部 → 面包屑 → 标题 → 面板 → 说明 → 相关工具）。
2. 脚本里用公共函数，不要重复造：`toast()` `saveBlob()` `bindDrop()` `readAsDataURL()` `loadImage()` `parseRanges()` `fmtSize()` `renderFileList()` `copyText()`。
3. 在 `assets/tools-data.js` 里登记这个工具（id / cat / name / desc / tags / href），`href` 必须写完整路径（`tools/⟨工具名⟩/index.html`），首页会自动出现卡片，"相关工具"也会自动互链。
4. 跑一次 `_check.js`（语法）与 `_test.js`（逻辑）确认无误。

**SEO 要点**（比代码本身更重要）：
- 每个工具的 `<title>` 要包含用户会搜的词，如"PDF 合并 - 在线把多个 PDF 合成一个"。
- `<meta name="description">` 写清功能与场景，这是搜索结果里显示的那两行字。
- 正文部分（`.prose`）要有真实可读的说明：参数怎么选、常见误区、适用场景。搜索引擎需要内容来判定页面质量。

---

## 七、后续可扩展方向

### 已完成：零新增依赖批次（12 个）

PDF 加页码、PDF 元数据修改、PDF 页面重排、PDF 提取图片、图片裁剪、图片旋转翻转、图片拼接、图片压缩到指定大小、单位换算、时间戳转换、人民币金额大写、CSV / JSON / Markdown 互转。

### 已完成：小游戏 · 减压批次（8 个）

五子棋（带启发式 AI，支持人机/双人）、2048、扫雷、贪吃蛇、数字华容道（逆向打乱保证有解）、记忆翻牌、打地鼠、解压泡泡纸（Web Audio 实时合成音效）。

实现要点：
- 五子棋 AI 用「棋形评分 + 对手威胁加权」，不做穷举搜索，因此在手机上也能秒出招。
- 扫雷采用"首点周围八格无雷"的布雷方式，并阻止双击展开时的误触引爆。
- 华容道用逆向打乱（从已解状态反向滑动），从根本上避免出现无解局面。
- 泡泡纸的音效由 `AudioContext` 合成（频率下滑的正弦波），不加载任何音频文件。

### 下一批候选

| 档位 | 工具 | 库与体积 | 备注 |
|---|---|---|---|
| 小库 | 条形码生成 | JsBarcode，约 50 KB | CODE128 / EAN13 |
| 小库 | 二维码识别（图片扫码） | jsQR，约 50 KB | 与现有二维码生成形成闭环 |
| 中库 | **PDF 转图片、PDF 拼长图、缩略图预览** | pdf.js，约 1 MB | **价值最高**，一次引入解锁多个工具 |
| 中库 | Excel ↔ CSV/JSON、多表合并 | SheetJS，约 900 KB | 需要处理 xlsx 时再加 |

### 暂不做的方向

- **扫描件 OCR**：tesseract.js 约 15 MB，中文精度差，首次加载体验极差。
- **音视频转码**：ffmpeg.wasm 约 25 MB，且需 COOP/COEP 响应头。
- **Word / Excel / PPT ↔ PDF 高保真互转**：依赖服务器端排版引擎，纯静态架构下不可能实现。

### 差异化方向（待定）

- **DXF 图纸解析**：工作区已有 `CAD表格提取` 的解析逻辑，可移植到浏览器，做「图纸在线提取表格」。通用工具站做不了这个，是本站最有差异化潜力的一条线。
- **造价垂直工具**：钢筋理论重量速算、材料价差调整、工期计算、综合单价拆分。竞争度低且口径可控，但与「通用站」定位不同，需先决定是否另开板块。

### 品牌

当前站名「即用工具箱」为占位，可更换；域名建议短、易记、含工具含义。

---

## 八、已知待办

- [ ] 域名与站名确定
- [ ] 补充 `robots.txt` 与 `sitemap.xml`（提交搜索引擎前必需）
- [ ] 真实设备测试：Chrome / Edge / Safari / 微信内置浏览器
- [ ] 大文件压力测试（100MB+ PDF、50 张图片批量）
