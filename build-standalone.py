#!/usr/bin/env python3
"""把 dist/ 构建产物打包成一个可双击打开的单文件 HTML。

原理：内联 CSS/JS、把图片转成 data URI、去掉 crossOrigin。
生成的 HTML 完全自包含（字体仍走 Google Fonts，联网时更精致，离线有回退字体）。
"""
from pathlib import Path
import base64
import re

ROOT = Path(__file__).parent
DIST = ROOT / 'dist'
OUT = ROOT / 'eeeZora-双击打开.html'

html = (DIST / 'index.html').read_text(encoding='utf-8')

# 图片转 data URI
def data_uri(rel):
    p = DIST / rel.lstrip('./')
    b64 = base64.b64encode(p.read_bytes()).decode('ascii')
    mime = 'image/webp' if p.suffix == '.webp' else 'image/png'
    return f'data:{mime};base64,{b64}'

def embed_paths(text):
    # Vite 在 CSS 里写成 ../assets/xxx.webp，JS 里写成 /assets/xxx.webp
    # 两个分支分别匹配 ../assets/ 与 /assets/，避免残留 ..
    return re.sub(r'\.\./assets/([a-zA-Z0-9_.-]+\.webp)|/assets/([a-zA-Z0-9_.-]+\.webp)',
                  lambda m: data_uri('assets/' + (m.group(1) or m.group(2))), text)

# 1) 内联 CSS（同时替换 CSS 里的背景图路径）
def inline_css(m):
    path = DIST / m.group(1).lstrip('./')
    css = embed_paths(path.read_text(encoding='utf-8'))
    return f'<style>\n{css}\n</style>'
html = re.sub(r'<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>', inline_css, html)

# 2) 内联 JS（替换 JS 里的图片路径）
def inline_js(m):
    path = DIST / m.group(1).lstrip('./')
    js = embed_paths(path.read_text(encoding='utf-8'))
    return f'<script type="module">\n{js}\n</script>'

html = re.sub(r'<script type="module"[^>]*src="([^"]+\.js)"[^>]*></script>', inline_js, html)

# 3) 内嵌字体：移除 Google Fonts 外链，改为 data URI @font-face（完全离线可用）
FONT_DIR = ROOT / '字体缓存'
font_specs = [
    ('UnifrakturMaguntia', 400, 'normal', 'unifrakturmaguntia-latin.woff2'),
    ('Cormorant Garamond', 400, 'normal', 'cormorant-garamond-400-normal.woff2'),
    ('Cormorant Garamond', 600, 'normal', 'cormorant-garamond-600-normal.woff2'),
    ('Cormorant Garamond', 400, 'italic', 'cormorant-garamond-400-italic.woff2'),
    ('DM Mono', 400, 'normal', 'dm-mono-400-normal.woff2'),
    ('DM Mono', 500, 'normal', 'dm-mono-500-normal.woff2'),
    ('Inter', 400, 'normal', 'inter-400-normal.woff2'),
    ('Inter', 500, 'normal', 'inter-500-normal.woff2'),
    ('Inter', 600, 'normal', 'inter-600-normal.woff2'),
]
faces = []
for fam, weight, style, fn in font_specs:
    p = FONT_DIR / fn
    if not p.exists():
        continue
    b64 = base64.b64encode(p.read_bytes()).decode('ascii')
    faces.append(
        f"@font-face{{font-family:'{fam}';font-style:{style};font-weight:{weight};"
        f"font-display:swap;src:url(data:font/woff2;base64,{b64}) format('woff2');}}"
    )
font_css = '<style>\n' + '\n'.join(faces) + '\n</style>'

# 移除 Google Fonts 的 link 标签
html = re.sub(r'<link rel="preconnect"[^>]*>\s*', '', html)
html = re.sub(r'<link href="https://fonts\.googleapis\.com[^>]*>\s*', '', html)
# 在 <head> 结束前插入内嵌字体
html = html.replace('</head>', font_css + '\n</head>')

# 4) 去掉残留的 crossorigin 属性（file:// 下会带来麻烦）
html = html.replace(' crossorigin', '')

OUT.write_text(html, encoding='utf-8')
size = OUT.stat().st_size
print(f'OK {OUT} ({size/1024/1024:.2f} MB)')
