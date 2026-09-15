window.CATEGORIES = [
  { id: 'text', name: '文本与编码', anchor: 'text' },
  { id: 'image', name: '图片处理', anchor: 'image' },
  { id: 'pdf', name: 'PDF 处理', anchor: 'pdf' },
  { id: 'convert', name: '计算与转换', anchor: 'convert' },
  { id: 'game', name: '小游戏 · 减压', anchor: 'game' }
];

window.TOOLS = [
  {
    id: 'json-format', cat: 'text', name: 'JSON 格式化 / 校验',
    desc: '格式化、压缩、校验 JSON，报错时给出具体位置与原因。',
    tags: 'json 格式化 美化 压缩 校验 验证 错误定位', badge: '纯前端',
    href: 'tools/json-format/index.html'
  },
  {
    id: 'text-diff', cat: 'text', name: '文本对比',
    desc: '逐行对比两段文本差异，增删行高亮显示，适合比对合同与清单。',
    tags: 'diff 对比 比较 差异 文本 compare', badge: '纯前端',
    href: 'tools/text-diff/index.html'
  },
  {
    id: 'base64', cat: 'text', name: 'Base64 编解码',
    desc: '文本与 Base64 互转，支持 URL 安全字符集与中文 UTF-8。',
    tags: 'base64 编码 解码 encode decode', badge: '纯前端',
    href: 'tools/base64/index.html'
  },
  {
    id: 'hash', cat: 'text', name: '哈希计算',
    desc: '计算 MD5、SHA-1、SHA-256、SHA-512，常用于校验文件是否被改动。',
    tags: 'md5 sha1 sha256 sha512 哈希 摘要 校验 hash', badge: '纯前端',
    href: 'tools/hash/index.html'
  },
  {
    id: 'qrcode', cat: 'text', name: '二维码生成',
    desc: '把网址、文本生成二维码，可调尺寸与容错级别，直接下载 PNG。',
    tags: '二维码 qr code 生成 扫码', badge: '纯前端',
    href: 'tools/qrcode/index.html'
  },
  {
    id: 'text-tools', cat: 'text', name: '文本批量处理',
    desc: '大小写转换、去重、去空行、排序、批量替换、统计字数与字符频率。',
    tags: '大小写 去重 去空行 排序 替换 字数统计 简繁', badge: '纯前端',
    href: 'tools/text-tools/index.html'
  },
  {
    id: 'image-compress', cat: 'image', name: '图片压缩',
    desc: '批量压缩 JPG、PNG、WebP，自选质量或目标体积，画质损失可控。',
    tags: '图片压缩 jpg png webp 瘦身 减小体积 compress', badge: '本地计算',
    href: 'tools/image-compress/index.html'
  },
  {
    id: 'image-convert', cat: 'image', name: '图片格式转换',
    desc: 'PNG、JPG、WebP 互相转换，支持批量处理与保留透明通道。',
    tags: '图片格式转换 png jpg webp 互转 convert', badge: '本地计算',
    href: 'tools/image-convert/index.html'
  },
  {
    id: 'image-resize', cat: 'image', name: '图片尺寸调整',
    desc: '按像素或百分比缩放图片，可锁定宽高比，支持批量输出。',
    tags: '图片 缩放 尺寸 分辨率 resize 修改大小', badge: '本地计算',
    href: 'tools/image-resize/index.html'
  },
  {
    id: 'image-watermark', cat: 'image', name: '图片加水印',
    desc: '给图片叠加文字水印，可设位置、字号、颜色、透明度与平铺密度。',
    tags: '水印 加字 图片 watermark 平铺', badge: '本地计算',
    href: 'tools/image-watermark/index.html'
  },
  {
    id: 'pdf-merge', cat: 'pdf', name: 'PDF 合并',
    desc: '把多个 PDF 按顺序合成一个文件，可拖拽调整次序。',
    tags: 'pdf 合并 拼接 合成 merge 多个pdf', badge: '本地计算',
    href: 'tools/pdf-merge/index.html'
  },
  {
    id: 'pdf-split', cat: 'pdf', name: 'PDF 拆分',
    desc: '按页码范围或按每 N 页拆分成多个 PDF，导出为 ZIP 打包下载。',
    tags: 'pdf 拆分 分割 提取页面 split 分页', badge: '本地计算',
    href: 'tools/pdf-split/index.html'
  },
  {
    id: 'pdf-rotate', cat: 'pdf', name: 'PDF 旋转',
    desc: '批量把 PDF 页面顺时针旋转 90°、180°、270°，修正扫描件方向。',
    tags: 'pdf 旋转 方向 倒转 rotate 扫描件', badge: '本地计算',
    href: 'tools/pdf-rotate/index.html'
  },
  {
    id: 'pdf-watermark', cat: 'pdf', name: 'PDF 加水印',
    desc: '给 PDF 每页叠加文字水印，支持斜向平铺、透明度与字号调节。',
    tags: 'pdf 水印 watermark 加字 密级', badge: '本地计算',
    href: 'tools/pdf-watermark/index.html'
  },
  {
    id: 'pdf-delete-pages', cat: 'pdf', name: 'PDF 删除页面',
    desc: '输入要删除的页码（支持 2-5 范围写法），生成新的 PDF。',
    tags: 'pdf 删除页面 移除 remove 页码', badge: '本地计算',
    href: 'tools/pdf-delete-pages/index.html'
  },
  {
    id: 'image-to-pdf', cat: 'pdf', name: '图片转 PDF',
    desc: '把多张图片合成一份 PDF，可选页面尺寸、方向与页边距。',
    tags: '图片转pdf jpg转pdf png转pdf img2pdf', badge: '本地计算',
    href: 'tools/image-to-pdf/index.html'
  },
  {
    id: 'pdf-page-numbers', cat: 'pdf', name: 'PDF 加页码',
    desc: '给 PDF 每页添加页码，起始页、位置、格式均可自定义。',
    tags: 'pdf 页码 页脚 编号 添加页码 page number', badge: '本地计算',
    href: 'tools/pdf-page-numbers/index.html'
  },
  {
    id: 'pdf-metadata', cat: 'pdf', name: 'PDF 元数据修改',
    desc: '修改或清除 PDF 的标题、作者、主题、关键词，外发前抹掉个人信息。',
    tags: 'pdf 元数据 属性 标题 作者 清除信息 metadata', badge: '本地计算',
    href: 'tools/pdf-metadata/index.html'
  },
  {
    id: 'pdf-organize', cat: 'pdf', name: 'PDF 页面重排',
    desc: '调整页面顺序、插入空白页、复制或剔除页面，生成新的 PDF。',
    tags: 'pdf 重排 排序 调整页序 插入空白页 organize', badge: '本地计算',
    href: 'tools/pdf-organize/index.html'
  },
  {
    id: 'pdf-extract-images', cat: 'pdf', name: 'PDF 提取图片',
    desc: '把 PDF 内嵌的图片原样导出，打包为 ZIP 下载。',
    tags: 'pdf 提取图片 导出图片 抽取 jpg png extract', badge: '本地计算',
    href: 'tools/pdf-extract-images/index.html'
  },
  {
    id: 'image-crop', cat: 'image', name: '图片裁剪',
    desc: '框选任意区域裁剪图片，支持 1:1、4:3、16:9 等常用比例锁定。',
    tags: '图片裁剪 剪切 截取 crop 比例', badge: '本地计算',
    href: 'tools/image-crop/index.html'
  },
  {
    id: 'image-flip', cat: 'image', name: '图片旋转与翻转',
    desc: '批量把图片旋转 90 / 180 / 270 度，或做水平、垂直镜像。',
    tags: '图片旋转 翻转 镜像 倒转 rotate flip', badge: '本地计算',
    href: 'tools/image-flip/index.html'
  },
  {
    id: 'image-stitch', cat: 'image', name: '图片拼接',
    desc: '多张图片横向接长图、纵向拼接或排成九宫格，可调间距与背景色。',
    tags: '图片拼接 长图 拼图 合并图片 stitch 九宫格', badge: '本地计算',
    href: 'tools/image-stitch/index.html'
  },
  {
    id: 'image-target-size', cat: 'image', name: '图片压缩到指定大小',
    desc: '输入目标体积（如 500KB），自动二分调整质量压到要求以内。',
    tags: '图片压缩 指定大小 500kb 限制体积 报名照 target size', badge: '本地计算',
    href: 'tools/image-target-size/index.html'
  },
  {
    id: 'unit-convert', cat: 'convert', name: '单位换算',
    desc: '长度、面积、体积、重量、温度、压力、速度等常用单位互转。',
    tags: '单位换算 米 厘米 平方米 亩 公斤 磅 摄氏度 华氏度 兆帕', badge: '纯前端',
    href: 'tools/unit-convert/index.html'
  },
  {
    id: 'timestamp', cat: 'convert', name: '时间戳转换',
    desc: 'Unix 时间戳与日期时间互转，支持秒、毫秒与多时区。',
    tags: '时间戳 unix timestamp 转换 毫秒 日期', badge: '纯前端',
    href: 'tools/timestamp/index.html'
  },
  {
    id: 'rmb-upper', cat: 'convert', name: '人民币金额大写',
    desc: '把数字金额转成中文大写，规范处理零、角、分与整。',
    tags: '金额大写 人民币 大写 财务 报销 合同 元角分', badge: '纯前端',
    href: 'tools/rmb-upper/index.html'
  },
  {
    id: 'csv-json', cat: 'convert', name: 'CSV / JSON / Markdown 互转',
    desc: '表格数据三种格式互转，支持自定义分隔符与表头。',
    tags: 'csv json markdown 表格 转换 互转 数据', badge: '纯前端',
    href: 'tools/csv-json/index.html'
  },
  {
    id: 'game-gomoku', cat: 'game', name: '五子棋（人机对战）',
    desc: '经典五子棋，自带 AI 对手，可选先手、支持悔棋与胜负提示。',
    tags: '五子棋 连珠 人机对战 棋类 小游戏 gomoku 双人', badge: '小游戏',
    href: 'tools/game-gomoku/index.html'
  },
  {
    id: 'game-2048', cat: 'game', name: '2048',
    desc: '滑动合并相同数字，目标是拼出 2048。支持键盘与触摸操作。',
    tags: '2048 数字 益智 解压 小游戏 方块', badge: '小游戏',
    href: 'tools/game-2048/index.html'
  },
  {
    id: 'game-minesweeper', cat: 'game', name: '扫雷',
    desc: '经典扫雷，三种难度，右键插旗，支持双击快速翻开周围。',
    tags: '扫雷 益智 经典 小游戏 minesweeper 逻辑', badge: '小游戏',
    href: 'tools/game-minesweeper/index.html'
  },
  {
    id: 'game-snake', cat: 'game', name: '贪吃蛇',
    desc: '经典贪吃蛇，方向键或滑动控制，越吃越长，撞墙即结束。',
    tags: '贪吃蛇 休闲 反应 小游戏 snake 经典', badge: '小游戏',
    href: 'tools/game-snake/index.html'
  },
  {
    id: 'game-slide', cat: 'game', name: '数字华容道',
    desc: '滑动数字方块把它们按顺序排好，3×3 到 5×5 可选，保证有解。',
    tags: '数字华容道 滑块 拼图 15puzzle 益智 小游戏', badge: '小游戏',
    href: 'tools/game-slide/index.html'
  },
  {
    id: 'game-memory', cat: 'game', name: '记忆翻牌',
    desc: '翻开卡片找出所有配对，考验短期记忆，可调难度并计时计步。',
    tags: '记忆翻牌 配对 记忆 益智 小游戏 memory', badge: '小游戏',
    href: 'tools/game-memory/index.html'
  },
  {
    id: 'game-whack', cat: 'game', name: '打地鼠',
    desc: '地鼠随机冒头，趁它缩回去之前敲中，30 秒计分比手速。',
    tags: '打地鼠 反应力 休闲 小游戏 whack 手速', badge: '小游戏',
    href: 'tools/game-whack/index.html'
  },
  {
    id: 'game-bubble', cat: 'game', name: '解压泡泡纸',
    desc: '一按一响的泡泡纸，纯粹的解压小玩意，按满了可以一键重来。',
    tags: '解压 泡泡纸 减压 放松 小游戏 bubble wrap', badge: '减压',
    href: 'tools/game-bubble/index.html'
  }
];
